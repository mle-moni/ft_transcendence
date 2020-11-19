class Room < ApplicationRecord
  
  validates   :name, uniqueness: true
  belongs_to  :owner, class_name: "User", required: true

  has_many :room_messages, dependent: :destroy
  
  # TO DEL
  has_many :members, through: :room_messages, :source => :user
  # TO ADD
  # has_many :members, :through => :room_link_members, :source => :user
  
end
