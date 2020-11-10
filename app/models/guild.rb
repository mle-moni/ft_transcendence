class Guild < ApplicationRecord
	has_many :users
	has_one :owner, -> { where(guild_owner: true) }, class_name: "User"
	has_many :officers, -> { where(guild_officer: true) }, class_name: "User"
end
