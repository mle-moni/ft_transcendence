class Match < ApplicationRecord
  after_save do
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
	end

  belongs_to :winner, class_name: 'User'
  belongs_to :loser, class_name: 'User'
end
