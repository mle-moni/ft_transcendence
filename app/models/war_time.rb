class WarTime < ApplicationRecord
  after_save do
		ActionCable.server.broadcast "update_channel", action: "update", target: "guilds"
  end
  after_destroy do
		ActionCable.server.broadcast "update_channel", action: "update", target: "guilds"
	end

  belongs_to :war
end
