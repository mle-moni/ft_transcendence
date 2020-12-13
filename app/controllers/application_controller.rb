class ApplicationController < ActionController::Base

	before_action :configure_permitted_parameters, if: :devise_controller?

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
		return false
	end

	def success(msg)
		respond_to do |format|
			format.html { redirect_to "/", notice: msg }
			format.json { render json: {msg: msg}, status: :ok }
		end
		return true
	end

	def guild_owner?
		owner = current_user.guild && current_user.guild_owner
		err_msg = "You need to own a guild for this action"
		return res_with_error(err_msg, :unauthorized) unless owner
		return true
	end

	def is_admin
		err_msg = "You need to be admin"
		return res_with_error(err_msg, :forbidden) unless current_user.admin || current_user.creator
		return true
	end

	def page_not_found
		respond_to do |format|
			format.html {redirect_to "/404"}
			format.json  { render json: {
				content: "Sorry, we could not find find this page",
				 status: 404
			}, status: 404 }
		end
	end

	protected

	def configure_permitted_parameters
		devise_parameter_sanitizer.permit(:sign_in, keys: [:otp_attempt])
	end

end
