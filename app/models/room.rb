class Room < ApplicationRecord
	validates :name, uniqueness: true

  belongs_to :owner, class_name: "User", required: true
end
