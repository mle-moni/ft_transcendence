class WarsController < ApplicationController
	before_action :connect_user
	before_action :guild_owner?
	before_action :set_foe, only: [:create]
	before_action :set_war, only: [:delete, :update, :validate, :create_war_time, :delete_war_time]
	before_action :set_update_params, only: [:update]

	def create
		unless War.create_war(current_user.guild, @foe)
			if current_user.guild.id == @foe.id
				res_with_error("You are trying to start a war against your guild XD", :bad_request)
			else
				res_with_error("one of the 2 guilds is already at war, or planning a war", :bad_request)
			end
			return false
		end
		success("War against #{@foe.name} created")
	end

	def delete
		if @war.validated == @war.guild1_id + @war.guild2_id
			res_with_error("You cannot delete a validated war", :bad_request)
			return false
		end
		War.destroy(@war.id)
		success("War deleted")
	end

	def validate
		check_ret = check_dates(@war.start, @war.end)
		unless check_ret == ""
			res_with_error(check_ret, :bad_request)
			return false
		end
		ret = @war.confirm(current_user.guild.id)
		case ret
		when 0
			success("War confirmed")
		when 1
			res_with_error("War already confirmed", :bad_request)
		when 2
			res_with_error("Bad guild ID", :bad_request)
		end
	end

	def update
		@war.prize = @prize
		@war.start = @dateStart
		@war.end = @dateEnd
		@war.ladder = @ladderBool
		@war.tournament = @tournamentBool
		@war.duel = @duelBool
		@war.war_time_len = @war_time_len
		@war.validated = 0
		if @war.save
			success("War update")
			return true
		end
		res_with_error("Could not update war", :unprocessable_entity)
	end

	def create_war_time
		unless params[:new_wt]
			return res_with_error("Invalid param", :bad_request)
		end
		wt_date = DateTime.parse(params[:new_wt] + "+01:00") rescue nil
		unless wt_date
			return res_with_error("Invalid param", :bad_request)
		end
		WarTime.create({war: @war, start: wt_date})
		success("War time created")
	end

	def delete_war_time
		unless params[:id]
			return res_with_error("Missing param", :bad_request)
		end
		wt = WarTime.find(params[:id])
		unless wt
			return res_with_error("War time not found", :not_found)
		end
		unless wt.war.id == @war.id
			return res_with_error("You cannot edit this war time", :forbidden)
		end
		unless wt.destroy
			return res_with_error("Could not destroy war time", :unprocessable_entity)
		end
		success("War time destroyed")
	end

	private

	def set_war
		@war = current_user.guild.active_war
		unless @war
			res_with_error("Your guild has no active war", :bad_request)
			return false
		end
		if @war.confirmed?
			res_with_error("You cannot edit this war (already confirmed)", :bad_request)
		end
	end

	def set_update_params
		unless params[:prize] && params[:dateStart] && params[:dateEnd] && params[:war_time_len]
			res_with_error("Some fields are missing from your request", :bad_request)
			return false
		end
		@prize = Integer(params[:prize]) rescue nil
		if (!@prize || @prize < 0) 
			res_with_error("Prize must be a positive number", :bad_request)
			return false
		end
		@war_time_len = Integer(params[:war_time_len]) rescue nil
		if (!@war_time_len || @war_time_len < 2)
			res_with_error("War time duration must be a number >= 2", :bad_request)
			return false
		end
		@dateStart = DateTime.parse(params[:dateStart] + "+01:00") rescue nil
		@dateEnd = DateTime.parse(params[:dateEnd] + "+01:00") rescue nil
		check_ret = check_dates(@dateStart, @dateEnd)
		unless check_ret == ""
			res_with_error(check_ret, :bad_request)
			return false
		end
		set_game_modes()
	end

	def set_game_modes
		@duelBool = !!params[:duelBool]
		@tournamentBool = !!params[:tournamentBool]
		@ladderBool = !!params[:ladderBool]
	end

	def check_dates(dateStart, dateEnd)
		if (!dateStart || !dateEnd)
			return "Error while parsing dates"
		end
		Time.zone = "Europe/Paris"
		now = DateTime.parse(Time.current.to_s)
		if dateEnd <= dateStart || dateStart < now || dateEnd < now
			return "Dates are incoherent"
		end
		return ""
	end

	def set_foe
		unless params[:id]
			res_with_error("Some fields are missing from your request", :bad_request)
			return false
		end
		@foe = Guild.find(params[:id])
	end

	def guild_owner?
		owner = current_user.guild && current_user.guild_owner
		unless owner
			res_with_error("You need to own a guild for this action", :unauthorized)
			return false
		end
	end

	def connect_user
		unless user_signed_in?
			res_with_error("You need to be connected for this action", :unauthorized)
			return false
		end
		if user_signed_in? && current_user.banned
			res_with_error("You are banned", :unauthorized)
			return false
		end
	end

	def res_with_error(msg, error)
		respond_to do |format|
			format.html { redirect_to "/", alert: msg }
			format.json { render json: {alert: msg}, status: error }
		end
		return false
	end

	def success(msg)
		respond_to do |format|
			format.html { redirect_to "/", notice: msg }
			format.json { render json: {msg: msg}, status: :ok }
		end
	end

end