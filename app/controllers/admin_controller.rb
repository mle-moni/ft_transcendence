class AdminController < ApplicationController
	before_action :connect_user
	before_action :set_user_from_param, only: [:ban, :unban, :promote, :demote]
	before_action :is_admin

	after_action :update_front, only: [:ban, :unban, :promote, :demote]
	
	def ban
		return res_with_error("You can't ban the creator", :bad_request) if @user_from_param.creator
		@user_from_param.banned = true
		@user_from_param.save
		success("User banned")
	end

	def unban
		@user_from_param.banned = false
		@user_from_param.save
		success("User unbanned")
	end

	def promote
		@user_from_param.admin = true
		@user_from_param.save
		success("User promoted to admin")
	end

	def demote
		return res_with_error("You cannot demote the creator", :bad_request) if @user_from_param.creator
		@user_from_param.admin = false
		@user_from_param.save
		success("User demoted to normal user")
	end

	private

	def update_front
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
	end

	def set_user_from_param
		@user_from_param = User.find(params[:id]) rescue nil
		return res_with_error("User not found", :not_found) unless @user_from_param
		if current_user.id == @user_from_param.id
			return res_with_error("You can't change your settings", :bad_request)
		end
	end

end
