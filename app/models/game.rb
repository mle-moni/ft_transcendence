class Game < ApplicationRecord
	def self.start(player1, player2, match_id)
		left, right = [player1, player2]

		ActionCable.server.broadcast "player_#{right}", { action: 'game_start', msg: 'r', match_room_id: match_id }
		ActionCable.server.broadcast "player_#{left}", { action: 'game_start', msg: 'l', match_room_id: match_id }
	end

	def self.start_game(room_name, is_ranked)
		# create the game model holder
		game = {
			room_name: room_name,
			is_ranked: is_ranked,
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
			right_action: "w"
		}
		$games[room_name] = game

		Redis.current.set("game_#{room_name}_end?", "no");

		puts "Game started with data :"
		puts room_name, is_ranked
	end
end