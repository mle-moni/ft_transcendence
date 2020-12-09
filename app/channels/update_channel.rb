class UpdateChannel < ApplicationCable::Channel
	def subscribed
		stream_from "update_channel"
	end

	def unsubscribed

	end

	def receive(data)
		case data["action"]
		when "alive"
			alive
		when "bye"
			bye
		else
			puts data
		end
	end

	def alive
		user.update(last_seen: DateTime.now)
	end

	def bye
		user.last_seen -= 2.seconds
		user.save
		ActionCable.server.broadcast "update_channel", action: "update", target: "last_seen"
	end
end
