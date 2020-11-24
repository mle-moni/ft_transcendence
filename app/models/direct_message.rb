class DirectMessage < ApplicationRecord
    belongs_to :dmchat, class_name: "DirectChat", required: true
    belongs_to :from, class_name: "User", required: true
end
