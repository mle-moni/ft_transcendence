class DirectChat < ApplicationRecord
    belongs_to :user1, class_name: "User", required: true
    belongs_to :user2, class_name: "User", required: true
    has_many :direct_messages, dependent: :destroy
end
