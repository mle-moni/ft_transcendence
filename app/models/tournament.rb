class Tournament < ApplicationRecord
	after_save do 
		ActionCable.server.broadcast "update_channel", action: "update", target: "tournaments"
	end
	after_destroy do
		ActionCable.server.broadcast "update_channel", action: "update", target: "tournaments"
	end

	has_many :users, class_name: 'User', foreign_key: "tournament_id"
	has_many :alive, -> { where eliminated: false }, class_name: 'User', foreign_key: "tournament_id"

end
