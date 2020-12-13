class GamesController < ApplicationController

	before_action :set_params

	def is_connected
		respond_to do |format|
			format.json { render json: Redis.current.get("#{@room_id}_#{@user_id}"), status: :ok }
		end
		Redis.current.set("#{@room_id}_#{@user_id}", true);
	end

	def set_params 
		@room_id = params[:room_id]
		@user_id = params[:user_id]
	end

end