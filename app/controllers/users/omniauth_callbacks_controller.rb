class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
	def marvin
		@user = User.from_omniauth(request.env["omniauth.auth"])

		if @user.persisted?
			if @user.otp_required_for_login == true
				flash[:alert] = "2 factor auth is enabled"
				redirect_to "/"
			else
				sign_in_and_redirect @user, :event => :authentication
				set_flash_message(:notice, :success, :kind => "42") if is_navigational_format?
			end
		else
			session["devise.marvin_data"] = request.env["omniauth.auth"]
			redirect_to new_user_registration_url
		end
	end
end
