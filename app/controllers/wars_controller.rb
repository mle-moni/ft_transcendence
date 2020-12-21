class WarsController < ApplicationController
	before_action :connect_user
	before_action :guild_owner?, except: [:match_request]
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
		ActionCable.server.broadcast "player_#{@foe.owner.email}", action: "notif",
		content: "#{current_user.nickname} declared war against your guild", link: "#guilds/#{@foe.id}/war"
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
		@war.time_to_answer = @time_to_answer
		@war.max_refused_matches = @max_refused_matches
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
		wt = WarTime.find(params[:id]) rescue nil
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

	def match_request
		guild = current_user.guild
		return res_with_error("You need to be in a guild", :bad_request) unless guild
		war = guild.active_war
		return res_with_error("You need to be in war time", :bad_request) unless war && war.war_time?
		
		return res_with_error("There is already a match", :bad_request) if war.war_time_match
		if war.match_request_guild != 0
			return res_with_error("Only one match request at a time", :bad_request) if war.match_request_guild == guild.id
			return accept_match(war, guild)
		end
		
		war.match_request_usr = current_user.id
		war.match_request_guild = guild.id
		war.save
		
		g_to_notif = (war.guild1.id == guild.id) ? war.guild2 : war.guild1
		if g_to_notif
			g_to_notif.users.each do |usr|
				ActionCable.server.broadcast "player_#{usr.email}", action: "notif",
				content: "#{current_user.nickname} requested a war fight", link: "#guilds/#{g_to_notif.id}"
			end
		end

		Thread.new do
			war_id = war.id
			match_count = war.match_count
			sleep war.time_to_answer
			war = War.find(war_id) rescue nil
			if war && match_count == war.match_count
				guild = Guild.find(war.match_request_guild) rescue nil
				if guild
					war.add_points(guild, 2)
					war.match_request_usr = 0
					war.match_request_guild = 0
					war.save
					war.inc_refused_matches(war.get_enemy_guild_id(guild.id))
				end
			end
		end

		success("Coucou")
	end

	private

	def accept_match(war, guild)
		player1 = User.find(war.match_request_usr) rescue nil
		return res_with_error("User not found", :not_found) unless player1
		player2 = current_user
		war.match_request_usr = 0
		war.match_request_guild = 0
		war.war_time_match = true
		war.match_count += 1
		war.save
    	Game.start(player1.email, player2.email, "war_time_match")
		return success("Match accepted")
	end

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

	def parse_int_param(raw, min, param_name)
		parsed = Integer(raw) rescue nil
		if parsed == nil || parsed < min
			res_with_error("#{param_name} must be a number >= #{min}", :bad_request)
			return nil
		end
		return parsed
	end

	def all_params_are_present
		return false unless params[:prize] && params[:dateStart]
		return false unless params[:dateEnd] && params[:war_time_len]
		return false unless params[:max_refused_matches] && params[:time_to_answer]
		return true
	end

	def set_update_params
		unless all_params_are_present
			return res_with_error("Some fields are missing from your request", :bad_request)
		end
		@prize = parse_int_param(params[:prize], 1, "Prize")
		return false if @prize == nil
		@war_time_len = parse_int_param(params[:war_time_len], 2, "War time duration")
		return false if @war_time_len == nil
		@max_refused_matches = parse_int_param(params[:max_refused_matches], 1, "Max refused matches")
		return false if @max_refused_matches == nil
		@time_to_answer = parse_int_param(params[:time_to_answer], 5, "Time to answer matches")
		return false if @time_to_answer == nil
		
		@dateStart = DateTime.parse(params[:dateStart] + "+01:00") rescue nil
		@dateEnd = DateTime.parse(params[:dateEnd] + "+01:00") rescue nil
		check_ret = check_dates(@dateStart, @dateEnd)
		return res_with_error(check_ret, :bad_request) unless check_ret == ""
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
		@foe = Guild.find(params[:id]) rescue nil
		return res_with_error("Guild not found", :not_found) unless @foe
	end

end