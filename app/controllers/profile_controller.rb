require 'fileutils'

class ProfileController < ApplicationController

	def update
		if lack_parameter
			update_error
			return
		end
		@user = User.find(params[:id]) # get user by his unique ID
		
		# if the user connected is not the same as @user, the request is a forgery
		if !@user || !user_signed_in? || current_user.id != @user.id
			update_error
			return
		end

		if save_image # error
			update_error
			return
		end
		
		save_user
	end

	private

	def user_cleaned
		new_user = {id: @user.id, nickname: @user.nickname, email: @user.email, image: @user.image}
	end

	def update_error
		respond_to do |format|
			format.html { redirect_to "/#profile", alert: 'Could not update profile.' }
			format.json { render json: {alert: "Could not update profile"}, status: :unprocessable_entity }
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
				format.json { render json: user_cleaned, status: :ok }
			end
		else
			update_error
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

end
  