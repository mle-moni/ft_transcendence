class DirectMessage < ApplicationRecord
    belongs_to :direct_chat, required: true
    belongs_to :from, class_name: "User"
end
