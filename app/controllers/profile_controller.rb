class ProfileController < ApplicationController
	def update
		puts "---------------------"
		puts params
		@user = User.find(params[:id])

		requestIsLegit = false
		if @user && user_signed_in? && current_user.id == @user.id
			requestIsLegit = true
		end
		unless requestIsLegit
			error_update
			return
		end
		puts @user.inspect
		puts "----------------------"
		@user.email = params[:email]
		@user.nickname = params[:nickname]
		if @user.save
			# redirect_to "/#profile", notice: 'Profile was successfully updated.'
			respond_to do |format|
				format.html { redirect_to "/#profile", notice: 'Profile was successfully updated.' }
				format.json { render json: user_cleaned, status: :ok }
			end
		else
			error_update
		end
	end

	private

	def user_cleaned
		new_user = {id: @user.id, nickname: @user.nickname, email: @user.email, image: @user.image}
	end

	def error_update
		respond_to do |format|
			format.html { redirect_to "/#profile", alert: 'Could not update profile.' }
			format.json { render json: {alert: "Could not update profile"}, status: :unprocessable_entity }
		end
	end

end
  