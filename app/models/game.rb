class Game < ApplicationRecord
	def self.start(player1, player2, gmt)
		left, right = [player1, player2].shuffle
		if (left != right)
			current_match_id = 0
			if Redis.current.get('match_id').blank? || Redis.current.get('match_id').to_i >= 999_999
				Redis.current.set('match_id', 0)
			else
				Redis.current.set('match_id', Redis.current.get('match_id').to_i + 1)
				current_match_id = Redis.current.get('match_id')
			end
	
			Redis.current.set("play_channel_#{current_match_id}_l", "#{left}")
			Redis.current.set("play_channel_#{current_match_id}_r", "#{right}")
	
			clean_players_duel_requests(player1, player2)

			rmn = "play_channel_#{current_match_id}"

			game = {
				rmn: rmn,
				gmt: gmt,
				bpx: 0.0,
				bpy: 0.0,
				lp: 0.0,
				rp: 0.0,
				rsc: 0,
				lsc: 0,
				bs: 0.0,
				bdx: 0.0,
				bdy: 0.0,
				la: "w",
				ra: "w",
				plc: false,
				prc: false,
				lu: left,
				ru: right
			}
			$games[rmn] = game
	
			Redis.current.set("game_#{rmn}_end?", "no");

			ActionCable.server.broadcast "player_#{right}", { action: 'game_start', msg: 'r', match_room_id: current_match_id, adv: left }
			ActionCable.server.broadcast "player_#{left}", { action: 'game_start', msg: 'l', match_room_id: current_match_id, adv: right }
		end
	end

	def self.end_the_game(rmn, role_quit) # role_quit is 'r' or 'l' when someone gave up else 'n'
		if (Redis.current.get("game_#{rmn}_end?") == "no" && $games[rmn] != nil) # if not already ended, end the game with actual player has loser (he left the game)
			Redis.current.set("game_#{rmn}_end?", "yes");

			if (role_quit != 'n')
				if (role_quit == 'r')
					loser_user = User.find_by(email: Redis.current.get("#{rmn}_r"))
					winner_user = User.find_by(email: Redis.current.get("#{rmn}_l"))
					loser_score = $games[rmn][:rsc]
					winner_score = $games[rmn][:lsc]
				else
					loser_user = User.find_by(email: Redis.current.get("#{rmn}_l"))
					winner_user = User.find_by(email: Redis.current.get("#{rmn}_r"))
					loser_score = $games[rmn][:lsc]
					winner_score = $games[rmn][:rsc]
				end
			else
				if ($games[rmn][:rsc] == 11)
					winner_user = User.find_by(email: Redis.current.get("#{rmn}_r"))
					loser_user = User.find_by(email: Redis.current.get("#{rmn}_l"))
					winner_score = $games[rmn][:rsc]
					loser_score = $games[rmn][:lsc]
				else
					winner_user = User.find_by(email: Redis.current.get("#{rmn}_l"))
					loser_user = User.find_by(email: Redis.current.get("#{rmn}_r"))
					winner_score = $games[rmn][:lsc]
					loser_score = $games[rmn][:rsc]
				end
			end

			War.update_if_needed($games[rmn][:gmt], winner_user, loser_user)

			if winner_user.guild
				winner_user.guild.points += 1
				winner_user.guild.save
			end

			if ($games[rmn][:gmt] == "ranked" || $games[rmn][:gmt] == "duel_ranked")
				match = EloRating::Match.new
				match.add_player(rating: loser_user.elo)
				match.add_player(rating: winner_user.elo, winner: true)
				tmp = match.updated_ratings
				loser_user.elo = tmp[0]
				winner_user.elo = tmp[1]
				loser_user.save
				winner_user.save
			end

			if ($games[rmn][:gmt] == "tournament")
				if winner_user.tournament
					Thread.new do
						sleep 3
						winner_user.tournament.end_match(winner_user, loser_user)
					end
				end
			end

			Match.create(winner: winner_user, loser: loser_user, winner_score: winner_score, loser_score: loser_score);
			ActionCable.server.broadcast rmn, {action: 'quit'}
			$games[rmn] = nil;
		end
	end

	def self.clean_players_duel_requests(player1, player2)

		player1_id = User.where(email: player1).first.id
		player2_id = User.where(email: player2).first.id

		if player1_id && player2_id
			RoomMessage.where(user_id: player1_id).where(is_duel_request: true).delete_all
			DirectMessage.where(from_id: player1_id).where(is_duel_request: true).delete_all
			RoomMessage.where(user_id: player2_id).where(is_duel_request: true).delete_all
			DirectMessage.where(from_id: player2_id).where(is_duel_request: true).delete_all

			ActionCable.server.broadcast "chat_channel", type: "duel_request", description: "delete-request"
			ActionCable.server.broadcast "room_channel", type: "duel_request", description: "delete-request"
		end
	end
end