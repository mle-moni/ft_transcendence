class TournamentsController < ApplicationController

	before_action :connect_user
	before_action :is_admin, only: [:create, :destroy, :start]
	before_action :set_date, only: [:create]
	before_action :set_tournament, only: [:destroy, :show, :register, :unregister, :start]
	
	def start
		Time.zone = "Europe/Paris"
		now = DateTime.parse(Time.current.to_s)
		if @tournament.start > now
			return res_with_error("You must wait the subscriptions te be closed", :bad_request)
		end
		if @tournament.started
			return res_with_error("Tournament already started", :bad_request)
		end
		@tournament.start
		success("Tournament started")
	end

	# GET /tournaments
	# GET /tournaments.json
	def index
		@tournaments = Tournament.all
		respond_to do |format|
			format.html { redirect_to "/", notice: ':)' }
			format.json { render json: @tournaments, status: :ok }
		end
	end

	# POST /tournaments
	# POST /tournaments.json
	def create
		t = Tournament.create({start: @dateStart})
		format.json { render json: t, status: :created }
	end

	# DELETE /tournaments/1
	# DELETE /tournaments/1.json
	def destroy
		@tournament.destroy
		format.json { head :no_content }
	end

	# GET /tournaments/1
	# GET /tournaments/1.json
	def show
		format.json { render json: @tournament, status: :ok }
	end

	def register
		err_msg = "You can play only 1 tournament at a time"
		return res_with_error(err_msg, :bad_request) if current_user.tournament
		Time.zone = "Europe/Paris"
		now = DateTime.parse(Time.current.to_s)
		if @tournament.start < now
			return res_with_error("Too late: subscriptions closed", :bad_request)
		end
		current_user.tournament = @tournament
		current_user.eliminated = false
		current_user.save
		success("Successfully registered")
	end

	def unregister
		current_user.tournament = nil
		current_user.eliminated = false
		current_user.save
		success("Successfully unregistered")
	end

	private

	def set_tournament
		return res_with_error("Missing parameter", :bad_request) unless params[:id]
		@tournament = Tournament.find(params[:id]) rescue nil
		return res_with_error("Tournament not found", :not_found) unless @tournament
	end

	def set_date
		return res_with_error("Missing parameter", :bad_request) unless params[:dateStart]
		Time.zone = "Europe/Paris"
		now = DateTime.parse(Time.current.to_s)
		@dateStart = DateTime.parse(params[:dateStart] + "+01:00") rescue nil
		if @dateStart == nil || @dateStart < now
			return res_with_error("Date must be in the future", :bad_request)
		end
		return true
	end

end