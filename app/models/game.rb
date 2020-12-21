class Game < ApplicationRecord
	def self.start(player1, player2, game_type)
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

			room_name = "play_channel_#{current_match_id}"

			game = {
				room_name: room_name,
				game_type: game_type,
				ball_pos_x: 0.0,
				ball_pos_y: 0.0,
				left_pos: 0.0,
				right_pos: 0.0,
				right_score: 0,
				left_score: 0,
				ball_speed: 0.0,
				ball_dir_x: 0.0,
				ball_dir_y: 0.0,
				left_action: "w",
				right_action: "w",
				player_left_connected: false,
				player_right_connected: false,
				left_user: left,
				right_user: right
			}
			$games[room_name] = game
	
			Redis.current.set("game_#{room_name}_end?", "no");

			ActionCable.server.broadcast "player_#{right}", { action: 'game_start', msg: 'r', match_room_id: current_match_id, adv: left }
			ActionCable.server.broadcast "player_#{left}", { action: 'game_start', msg: 'l', match_room_id: current_match_id, adv: right }
		end
	end

	def self.end_the_game(room_name, role_quit) # role_quit is 'r' or 'l' when someone gave up else 'n'
		if (Redis.current.get("game_#{room_name}_end?") == "no" && $games[room_name] != nil) # if not already ended, end the game with actual player has loser (he left the game)
			Redis.current.set("game_#{room_name}_end?", "yes");

			if (role_quit != 'n')
				if (role_quit == 'r')
					loser_user = User.find_by(email: Redis.current.get("#{room_name}_r"))
					winner_user = User.find_by(email: Redis.current.get("#{room_name}_l"))
					loser_score = $games[room_name][:right_score]
					winner_score = $games[room_name][:left_score]
				else
					loser_user = User.find_by(email: Redis.current.get("#{room_name}_l"))
					winner_user = User.find_by(email: Redis.current.get("#{room_name}_r"))
					loser_score = $games[room_name][:left_score]
					winner_score = $games[room_name][:right_score]
				end
			else
				if ($games[room_name][:right_score] == 11)
					winner_user = User.find_by(email: Redis.current.get("#{room_name}_r"))
					loser_user = User.find_by(email: Redis.current.get("#{room_name}_l"))
					winner_score = $games[room_name][:right_score]
					loser_score = $games[room_name][:left_score]
				else
					winner_user = User.find_by(email: Redis.current.get("#{room_name}_l"))
					loser_user = User.find_by(email: Redis.current.get("#{room_name}_r"))
					winner_score = $games[room_name][:left_score]
					loser_score = $games[room_name][:right_score]
				end
			end

			War.update_if_needed($games[room_name][:game_type], winner_user, loser_user)

			if winner_user.guild
				winner_user.guild.points += 1
				winner_user.guild.save
			end

			if ($games[room_name][:game_type] == "ranked" || $games[room_name][:game_type] == "duel_ranked")
				match = EloRating::Match.new
				match.add_player(rating: loser_user.elo)
				match.add_player(rating: winner_user.elo, winner: true)
				tmp = match.updated_ratings
				loser_user.elo = tmp[0]
				winner_user.elo = tmp[1]
				loser_user.save
				winner_user.save
			end

			if ($games[room_name][:game_type] == "tournament")
				if winner_user.tournament
					Thread.new do
						sleep 3
						winner_user.tournament.end_match(winner_user, loser_user)
					end
				end
			end

			Match.create(winner: winner_user, loser: loser_user, winner_score: winner_score, loser_score: loser_score);
			ActionCable.server.broadcast room_name, {action: 'quit'}
			$games[room_name] = nil;
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