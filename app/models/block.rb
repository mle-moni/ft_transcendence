class Block < ApplicationRecord
    belongs_to :user
    belongs_to :toward, class_name: "User"
end
