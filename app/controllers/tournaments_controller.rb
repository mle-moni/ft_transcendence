class TournamentsController < ApplicationController

	before_action :connect_user
	before_action :is_admin, only: [:create, :destroy]
	before_action :set_date, only: [:create]
	before_action :set_tournament, only: [:destroy, :show, :register, :unregister]

	# GET /tournaments
	# GET /tournaments.json
	def index
		Tournament.start_if_needed
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
		ActionCable.server.broadcast "update_channel", action: "update", target: "tournaments"
		respond_to do |format|
			start_when_time_comes(@dateStart, t.id)
			format.json { render json: t, status: :created }
		end
	end

	# DELETE /tournaments/1
	# DELETE /tournaments/1.json
	def destroy
		respond_to do |format|
			if @tournament.destroy
				ActionCable.server.broadcast "update_channel", action: "delete", target: "tournaments"
				format.json { render json: @tournament, status: :ok }
			else
				format.json { render json: @tournament.errors, status: :unprocessable_entity }
			end
		end
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
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
		success("Successfully registered")
	end

	def unregister
		current_user.tournament = nil
		current_user.eliminated = false
		current_user.save
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
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

	def start_when_time_comes(date, id)
		Time.zone = "Europe/Paris"
		now = DateTime.parse(Time.current.to_s)
		seconds_to_wait = ((date - now) * 24 * 60 * 60).to_i
		return false if seconds_to_wait < 0
		Thread.new do
			sleep seconds_to_wait + 1
			t = Tournament.find(id) rescue nil
			if t && t.started == false
				t.start_it
			end
		end
		return true
	end

end