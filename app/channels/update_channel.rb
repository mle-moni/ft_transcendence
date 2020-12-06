class UpdateChannel < ApplicationCable::Channel
	def subscribed
		stream_from "update_channel"
	end

	def unsubscribed

	end
end
