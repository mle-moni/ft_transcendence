class TournamentsController < ApplicationController

	before_action :connect_user
	before_action :is_admin, only: [:create, :destroy]
	before_action :set_date, only: [:create]
	before_action :set_tournament, only: [:destroy, :show]
	
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

		puts "------------"
		puts params
		puts @dateStart
		puts "------------"
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

	private

	def set_tournament
		return ret_with_error("Missing parameter", :bad_request) unless params[:id]
		@tournament = Tournament.find(params[:id])
	end

	def set_date
		return ret_with_error("Missing parameter", :bad_request) unless params[:dateStart]
		Time.zone = "Europe/Paris"
		now = DateTime.parse(Time.current.to_s)
		@dateStart = DateTime.parse(params[:dateStart] + "+01:00") rescue nil
		if @dateStart == nil || @dateStart < now
			return ret_with_error("Date must be in the future", :bad_request)
		end
		return true
	end

end