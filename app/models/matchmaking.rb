class Matchmaking < ApplicationRecord
	def self.create(player_mail, is_ranked)
		puts player_mail
		puts "is searching for a match"
		puts is_ranked

		if is_ranked
			if !Redis.current.get('matches_ranked').blank? && Redis.current.get('matches_ranked') != player_mail
				opponent = Redis.current.get('matches_ranked')
				Game.start(player_mail, opponent, is_ranked)
				Redis.current.set('matches_ranked', nil)
			else
				Redis.current.set('matches_ranked', player_mail)
			end
		else
			if !Redis.current.get('matches').blank? && Redis.current.get('matches') != player_mail
				opponent = Redis.current.get('matches')
				Game.start(player_mail, opponent, is_ranked)
				Redis.current.set('matches', nil)
			else
				Redis.current.set('matches', player_mail)
			end
		end
	end
end
