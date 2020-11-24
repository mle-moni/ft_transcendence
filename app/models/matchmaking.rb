class Matchmaking < ApplicationRecord
	def self.create(player_mail)
	  if !Redis.current.get('matches').blank? && Redis.current.get('matches') != player_mail
			@current_match_id = 0
			opponent = Redis.current.get('matches')
			if Redis.current.get('match_id').blank? || Redis.current.get('match_id').to_i >= 999_999
				Redis.current.set('match_id', 0)
			else
				Redis.current.set('match_id', Redis.current.get('match_id').to_i + 1)
				@current_match_id = Redis.current.get('match_id')
			end

			Redis.current.set("play_channel_#{@current_match_id}_l", "#{player_mail}")
			Redis.current.set("play_channel_#{@current_match_id}_r", "#{opponent}")

			Redis.current.set('matches', nil)
			Game.start(player_mail, opponent, @current_match_id)

	  else
			Redis.current.set('matches', player_mail)
	  end
	end
end
