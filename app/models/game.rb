def collision?(pos_x, pos_y, paddle_l, paddle_r)
	# paddle pos_x are 0.9 and -0.9
	if pos_x > 1
		5
	elsif pos_x < -1
		4
	elsif pos_y >= 1
		3
	elsif pos_y <= -1
		2
	elsif pos_x >= 0.83 && pos_x <= 0.89 && pos_y >= paddle_r - 0.250 && pos_y <= paddle_r + 0.250
		1
	elsif pos_x <= -0.83 && pos_x >= -0.89 && pos_y >= paddle_l - 0.250 && pos_y <= paddle_l + 0.250
		0
	else
		-1
	end
end

class Game < ApplicationRecord
	def self.start(player1, player2, match_id)
		left, right = [player1, player2].shuffle

		ActionCable.server.broadcast "player_#{right}", { action: 'game_start', msg: 'r', match_room_id: match_id }
		ActionCable.server.broadcast "player_#{left}", { action: 'game_start', msg: 'l', match_room_id: match_id }

		Redis.current.set("opponent_for:#{left}", right)
		Redis.current.set("opponent_for:#{right}", left)

		logger.debug left
		logger.debug right
	end

	def self.start_game(room_name, is_ranked)
		# dont forget to check if the game was already started
		ActionCable.server.broadcast room_name, { msg: 'game start' }
		game_loop(room_name, is_ranked)
	end

	def self.game_loop(room_name, is_ranked)
		Thread.new do
			Rails.application.executor.wrap do
				left_mail = Redis.current.get("#{room_name}_l")
				right_mail = Redis.current.get("#{room_name}_r")
				match = EloRating::Match.new

				left_user = User.find_by(email: left_mail)
				right_user = User.find_by(email: right_mail)

				l_score = 0
				r_score = 0
				pos_l = 0
				pos_r = 0
				speed = 0.15
				ball_speed = 0.03
				ball_x = 0
				ball_y = 0
				dir = [-1, 1].shuffle
				# paddle take 1 / 4 of the screen
				loop do
					if r_score == 11
						sleep(2)
						puts "aaaaaaaaaaaaaaaaaaaaaaaaaaaa"
						puts "aaaaaaaaaaaaaaaaaaaaaaaaaaaa"
						ActionCable.server.broadcast room_name, { s: 'end' }
						if is_ranked == true
							match.add_player(rating: left_user.elo)
							match.add_player(rating: right_user.elo, winner: true)
							tmp = match.updated_ratings
							left_user.elo = tmp[0]
							left_user.save
							right_user.elo = tmp[1]
							right_user.save
							puts right_user.elo
							puts left_user.elo
						end
						break
					elsif l_score == 11
						sleep(2)
						puts "aaaaaaaaaaaaaaaaaaaaaaaaaaaa"
						puts "aaaaaaaaaaaaaaaaaaaaaaaaaaaa"
						ActionCable.server.broadcast room_name, { s: 'end' }
						if is_ranked == true
							match.add_player(rating: right_user.elo)
							match.add_player(rating: left_user.elo, winner: true)
							tmp = match.updated_ratings
							left_user.elo = tmp[1]
							left_user.save
							right_user.elo = tmp[0]
							right_user.save
							puts right_user.elo
							puts left_user.elo
						end
						break
					end
					start_lp = Time.now
					cur_act_l = Redis.current.get(room_name + '_l')
					case cur_act_l
					when 'd'
						pos_l = [pos_l + 1 * speed, 0.750].min
					when 'u'
						pos_l = [pos_l - 1 * speed, -0.750].max
					when 'quit'
						ActionCable.server.broadcast room_name, { s: 'end', lv: 'l' }
						break;
					end
					cur_act_r = Redis.current.get(room_name + '_r')
					case cur_act_r
					when 'd'
						pos_r = [pos_r + 1 * speed, 0.750].min
					when 'u'
						pos_r = [pos_r - 1 * speed, -0.750].max
					when 'quit'
						ActionCable.server.broadcast room_name, { s: 'end', lv: 'r' }
						break
					end
			
					ball_x += dir[0] * ball_speed
					ball_y += dir[1] * ball_speed
					act = collision? ball_x, ball_y, pos_l, pos_r
					case act
					when 5
						l_score += 1
						ball_speed = 0.03
					when 4
						r_score += 1
						ball_speed = 0.03
					end
					case act
					when 4..5
						ball_x = 0
						ball_y = 0
						dir = [[-1, -1], [-1, -0.5], [-1, 0], [-1, 0.5], [-1, 1], [1, -1], [1, -0.5], [1, 0], [1, 0.5], [1, 1]].shuffle()[0]
					when 3
						ball_y = 0.90
						dir[1] = -1 * dir[1]
					when 2
						ball_y = -0.90
						dir[1] = -1 * dir[1]
					when 1
						dir = [[-1, -1], [-1, -0.5], [-1, 0], [-1, 0.5], [-1, 1]].shuffle()[0]
						ball_speed *= 1.1
					when 0
						dir = [[1, -1], [1, -0.5], [1, 0], [1, 0.5], [1, 1]].shuffle()[0]
						ball_speed *= 1.1
					end
					ball_speed = [ball_speed, 0.09].min
					ActionCable.server.broadcast room_name, { s: 'g', l: pos_l, r: pos_r, bl: [ball_x, ball_y],
																sl: l_score, sr: r_score }
					Redis.current.set(room_name + '_l', nil);
					Redis.current.set(room_name + '_r', nil);
					sleep(0.075 - [(Time.now - start_lp).to_f, 0.075].min)
				end
				puts 'end game'
			end
		puts 'end thread'
		end
	end
end