class AdminController < ApplicationController
	before_action :connect_user
	before_action :set_user_from_param, only: [:ban, :unban, :promote, :demote]
	before_action :is_admin
	
	def ban
		@user_from_param.banned = true
		@user_from_param.save
		respond_to do |format|
			format.html { redirect_to "/", notice: 'User banned' }
			format.json { render json: {msg: "User banned"}, status: :ok }
		end
	end

	def unban
		@user_from_param.banned = false
		@user_from_param.save
		respond_to do |format|
			format.html { redirect_to "/", notice: 'User unbanned' }
			format.json { render json: {msg: "User unbanned"}, status: :ok }
		end
	end

	def promote
		@user_from_param.admin = true
		@user_from_param.save
		respond_to do |format|
			format.html { redirect_to "/", notice: 'User promoted to admin' }
			format.json { render json: {msg: "User promoted to admin"}, status: :ok }
		end
	end

	def demote
		@user_from_param.admin = false
		@user_from_param.save
		respond_to do |format|
			format.html { redirect_to "/", notice: 'User demoted to normal user' }
			format.json { render json: {msg: "User demoted to normal user"}, status: :ok }
		end
	end

	private

	def res_with_error(msg, error)
		respond_to do |format|
			format.html { redirect_to "/", alert: "#{msg}" }
			format.json { render json: {alert: "#{msg}"}, status: error }
		end
	end

	def set_user_from_param
		@user_from_param = User.find(params[:id])
		if current_user.id == @user_from_param.id
			res_with_error("You can't change your settings", :bad_request)
			return (false)
		end
	end

	def is_admin
		unless current_user.admin
			res_with_error("You need to be admin", :forbidden)
		end
	end

	def connect_user
		unless user_signed_in?
			res_with_error("You need to be connected for this action", :unauthorized)
		end
		if user_signed_in? && current_user.banned
			res_with_error("You are banned", :unauthorized)
		end
	end
end