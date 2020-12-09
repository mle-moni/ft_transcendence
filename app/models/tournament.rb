class Tournament < ApplicationRecord
	after_create do
		ActionCable.server.broadcast "update_channel", action: "update", target: "tournaments"
	end
	after_destroy do
		ActionCable.server.broadcast "update_channel", action: "update", target: "tournaments"
	end

	has_many :users, class_name: 'User', foreign_key: "tournament_id"
	has_many :alive, -> { where eliminated: false }, class_name: 'User', foreign_key: "tournament_id"

	def start_it
		return false if started
		self.started = true
		self.matches_started = 0
		self.matches_ended = 0
		save
		ActionCable.server.broadcast "update_channel", action: "update", target: "tournaments"
		next_step
	end

	def next_step
		eliminate_users_not_ready
		if alive.length <= 1
			finish
			ActionCable.server.broadcast "update_channel", action: "update", target: "tournaments"
			return
		end
		start_matches
	end

	def start_matches
		pairs = mkpairs
		pairs.each do |pair|
			self.matches_started += 1
			save
			puts "game will start with #{pair.first.email} and #{pair.last.email}"
			Game.start(pair.first.email, pair.last.email, "tournament")
			# when match ends, if it is the last match, it will call next_step()
		end
	end

	def reset
		users.each do |u|
			u.eliminated = false
			u.save
		end
		self.started = false
		save
	end

	def end_match(winner, loser)
		self.matches_ended += 1
		save
		loser.eliminated = true
		puts "eliminated #{loser.email}"
		loser.save
		if self.matches_started == self.matches_ended
			sleep 0.5
			next_step
		end
	end

	def finish
		if alive.length == 1
			self.winner_id = alive.first.id
			save
			return true
		end
		self.winner_id = -1
		save
		return false
	end

	private

	def eliminate_users_not_ready
		alive.each do |usr|
			if !usr.online || usr.in_game
				usr.eliminated = true
				puts "eliminated #{usr.email}"
				usr.save
			end
		end
	end

	def mkpairs
		users = alive.shuffle
		pairs = []
		while users.length > 1
			pairs.push([users.shift, users.pop])
		end
		return pairs
	end

end
