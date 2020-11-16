class Room < ApplicationRecord
  
  validates   :name, uniqueness: true
  belongs_to  :owner, class_name: "User", required: true

  has_many :room_messages
  has_many :members, through: :room_messages, :source => :user
  
  # later, admins mutes bans etc
  has_many :admins, through: :room_messages, :source => :user
  has_many :muted, through: :room_messages, :source => :user

end
