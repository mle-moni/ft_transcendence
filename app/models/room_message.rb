class RoomMessage < ApplicationRecord
  belongs_to :user, required: true
  belongs_to :room, required: true
end
