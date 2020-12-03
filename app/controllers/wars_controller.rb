class WarsController < ApplicationController
	before_action :connect_user
	before_action :guild_owner?
	before_action :set_foe, only: [:create_war]

	def create_war
		unless War.create_war(current_user.guild, @foe)
			if current_user.guild.id == @foe.id
				res_with_error("You are trying to start a war against your guild XD", :bad_request)
			else
				res_with_error("one of the guild is already at war, or planning a war", :bad_request)
			end
			return false
		end
		success("War against #{@foe.name} created")
	end

	def delete_war
		war = current_user.guild.active_war
		unless war
			res_with_error("Your guild has no active war", :bad_request)
			return false
		end
		if war.validated == war.guild1_id + war.guild2_id
			res_with_error("You cannot delete a validated war", :bad_request)
			return false
		end
		War.delete(war.id)
		success("War deleted")
	end

	def validate_war
		war = current_user.guild.active_war
		ret = war.confirm(current_user.guild.id)
		case ret
		when 0
			success("War confirmed")
		when 1
			res_with_error("War already confirmed", :bad_request)
		when 2
			res_with_error("Bad guild ID", :bad_request)
		end
	end

	private

	def set_foe
		unless params[:id]
			res_with_error("Some fields are missing from your request", :bad_request)
			return false
		end
		@foe = Guild.find(params[:id])
	end

	def guild_owner?
		owner = current_user.guild && current_user.guild_owner
		unless owner
			res_with_error("You need to own a guild for this action", :unauthorized)
			return false
		end
	end

	def connect_user
		unless user_signed_in?
			res_with_error("You need to be connected for this action", :unauthorized)
			return false
		end
		if user_signed_in? && current_user.banned
			res_with_error("You are banned", :unauthorized)
			return false
		end
	end

	def res_with_error(msg, error)
		respond_to do |format|
			format.html { redirect_to "/", alert: msg }
			format.json { render json: {alert: msg}, status: error }
		end
	end

	def success(msg)
		respond_to do |format|
			format.html { redirect_to "/", notice: msg }
			format.json { render json: {msg: msg}, status: :ok }
		end
	end

end