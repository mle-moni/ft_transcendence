require 'fileutils'

class ProfileController < ApplicationController
	before_action :connect_user

	def disable_otp
		current_user.otp_required_for_login = false
		current_user.save!
		
		respond_to do |format|
			format.html { redirect_to "/#profile", notice: 'Two factor auth disabled' }
			format.json { render json: {msg: "Two factor auth successfully disabled"}, status: :ok }
		end
	end
	def enable_otp
		if current_user.provider == "marvin" && !current_user.has_set_pwd
			update_error("You need to set a password first")
			return
		end
		current_user.otp_secret = User.generate_otp_secret
		current_user.otp_required_for_login = true
		current_user.save!
		uri = current_user.otp_provisioning_uri(current_user.email, issuer: "ft_transcendence")
		respond_to do |format|
			format.html { redirect_to "/#profile", notice: 'Two factor auth enabled' }
			format.json { render json: {msg: uri}, status: :ok }
		end
	end

	def change_password
		unless params[:id] && params[:password]
			update_error("Some fields are missing from your request")
		end
		_change_pwd(params[:password])
		respond_to do |format|
			format.html { redirect_to "/#profile", notice: 'Password updated' }
			format.json { render json: User.clean(current_user), status: :ok }
		end
	end

	def update
		if lack_parameter
			update_error("Some fields are missing in your request")
			return
		end
		@user = User.find(params[:id]) # get user by his unique ID
		
		# if the user connected is not the same as @user, the request is a forgery
		if !@user || current_user.id != @user.id
			update_error("UserIDs does not match")
			return
		end

		if save_image # error
			update_error("Could not update image (only .jpg and .png accepted)")
			return
		end
		
		save_user
	end

	private

	# TODO better HTTP codes: https://gist.github.com/mlanett/a31c340b132ddefa9cca
	def update_error(msg)
		respond_to do |format|
			format.html { redirect_to "/#profile", alert: "#{msg}" }
			format.json { render json: {alert: "#{msg}"}, status: :unprocessable_entity }
		end
	end

	def lack_parameter
		unless params[:email] && params[:id] && params[:nickname]
			return true
		end
		return false
	end

	def save_user
		@user.email = params[:email]
		@user.nickname = params[:nickname]
		if @user.save
			# redirect_to "/#profile", notice: 'Profile was successfully updated.'
			respond_to do |format|
				format.html { redirect_to "/#profile", notice: 'Profile was successfully updated.' }
				format.json { render json: User.clean(@user), status: :ok }
			end
		else
			update_error("Could not save profile")
		end
	end

	def save_image
		if (params[:image])
			file = params[:image]
			extname = File.extname(file.path)
			unless extname == ".jpg" || extname == ".png"
				return true
			end

			fileName = "image#{extname}"			
			newPath = "uploads/profile/#{@user.id}/"
			FileUtils.mkdir_p "public/#{newPath}"
			finalURL = "#{newPath}#{fileName}"
			File.open("public/#{finalURL}", 'wb') do |newImageFile|
				newImageFile.write file.read
			end
			@user.image = finalURL
		end
		return false
	end

	def _change_pwd(pwd)
		new_hashed_password = User.new(:password => pwd).encrypted_password
		current_user.encrypted_password = new_hashed_password
		current_user.has_set_pwd = true
		current_user.save!
	end

	def connect_user
		unless user_signed_in?
			respond_to do |format|
				format.html { redirect_to "/", alert: "You need to be connected for this action" }
				format.json { render json: {alert: "You need to be connected for this action"}, status: :unprocessable_entity }
			end
		end
	end
end
  