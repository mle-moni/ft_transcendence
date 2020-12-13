require 'fileutils'

class ProfileController < ApplicationController
	before_action :connect_user

	def first_time
		current_user.first_time = false
		current_user.save
		respond_to do |format|
			format.html { redirect_to "/", notice: '' }
			format.json { head :no_content }
		end
	end

	def get
		respond_to do |format|
			format.html { redirect_to "/#profile", notice: 'Profile infos updated' }
			format.json { render json: User.clean(current_user), status: :ok }
		end
	end

	def disable_otp
		current_user.otp_required_for_login = false
		current_user.save
		success("Two factor auth successfully disabled")
	end
	def enable_otp
		if current_user.provider == "marvin" && !current_user.has_set_pwd
			res_with_error("You need to set a password first", :bad_request)
			return
		end
		current_user.otp_secret = User.generate_otp_secret
		current_user.otp_required_for_login = true
		current_user.save
		uri = current_user.otp_provisioning_uri(current_user.email, issuer: "ft_transcendence")
		success(uri)
	end

	def change_password
		unless params[:id] && params[:password]
			res_with_error("Some fields are missing from your request", :bad_request)
		end
		_change_pwd(params[:password])
		respond_to do |format|
			format.html { redirect_to "/#profile", notice: 'Password updated' }
			format.json { render json: User.clean(current_user), status: :ok }
		end
	end

	def update
		if lack_parameter
			res_with_error("Some fields are missing from your request", :bad_request)
			return
		end
		@user = User.find(params[:id]) rescue nil # get user by his unique ID
		
		# if the user connected is not the same as @user, the request is a forgery
		if !@user || current_user.id != @user.id
			res_with_error("UserIDs does not match", :bad_request)
			return
		end

		if save_image # error
			res_with_error("Could not update image (only .jpg and .png accepted)", :bad_request)
			return
		end
		
		save_user
	end

	def handleBlock
		filteredParams = params.permit(:targetUserID, :typeAction)
		targetUser = User.find(filteredParams["targetUserID"]) rescue nil
		return res_with_error("Unknow User", :bad_request) unless targetUser
		if filteredParams["typeAction"] == "block" && !Block.where(user: current_user, toward: targetUser).exists?
				@newBlock = Block.create(user: current_user, toward: targetUser)
		elsif filteredParams["typeAction"] == "unblock" && Block.where(user: current_user, toward: targetUser).exists?
				Block.where(user: current_user, toward: targetUser).destroy_all
		else
			res_with_error("Action not saved", :bad_request)
			return false
		end
		respond_to do |format|
			format.html { redirect_to "/#profiles", notice: 'Done' }
			format.json { head :no_content }
		end
	end 

	private

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
			respond_to do |format|
				format.html { redirect_to "/#profile", notice: 'Profile was successfully updated.' }
				format.json { render json: User.clean(@user), status: :ok }
			end
			ActionCable.server.broadcast "update_channel", action: "update", target: "users"
			ActionCable.server.broadcast "update_channel", action: "update", target: "guilds"
		else
			res_with_error("Could not save profile", :unprocessable_entity)
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
		current_user.save
	end

end
