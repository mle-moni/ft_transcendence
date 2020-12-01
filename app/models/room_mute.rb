class RoomMute < ApplicationRecord
    validates	:endTime, presence: true
    belongs_to	:room
    belongs_to	:user
    belongs_to	:by, class_name: 'User'

end
