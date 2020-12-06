class Friendship < ApplicationRecord
	after_save do
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
	end
	after_destroy do
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
	end

	belongs_to :user
	belongs_to :friend, class_name: "User"
end
