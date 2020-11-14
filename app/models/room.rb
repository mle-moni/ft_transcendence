class Room < ApplicationRecord
  
  validates   :name, uniqueness: true
  belongs_to  :owner, class_name: "User", required: true
	has_many    :members, class_name: "User"
	has_many    :admins, class_name: "User"

end
