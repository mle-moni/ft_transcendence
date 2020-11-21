class ApplicationController < ActionController::Base

	before_action :configure_permitted_parameters, if: :devise_controller?
	before_action :reset_temporary_restrictions

	protected

	def configure_permitted_parameters
		devise_parameter_sanitizer.permit(:sign_in, keys: [:otp_attempt])
	end

	# Before every action, we check if restrictions have timed out
	# Stupid PostGre : couldn't fin a way to force PGSQL to make queries with France's timezone 
	# OLD : RoomBan.where('"endTime" < ?', DateTime.now.in_time_zone("Europe/Paris")).destroy_all
	def reset_temporary_restrictions
		RoomMute.where('"endTime" < ?', DateTime.now).destroy_all
		RoomBan.where('"endTime" < ?', DateTime.now).destroy_all
	end

end
