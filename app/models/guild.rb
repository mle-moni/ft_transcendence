class Guild < ApplicationRecord
	has_many :users, -> { where(guild_validated: true) }, class_name: "User"
	has_many :requests, -> { where(guild_validated: false) }, class_name: "User"
	has_one :owner, -> { where(guild_owner: true) }, class_name: "User"
	has_many :officers, -> { where(guild_officer: true) }, class_name: "User"

	validates :name, uniqueness: true
	validates :anagram, uniqueness: true

	def self.clean(guild)
		newguild = {
			id: guild.id,
			name: guild.name,
			anagram: guild.anagram,
			points: guild.points,
			owner: User.strict_clean(guild.owner),
			users: guild.users.map { |usr| User.strict_clean(usr) },
			officers: guild.officers.map { |usr| User.strict_clean(usr) },
			requests: guild.requests.map { |usr| User.strict_clean(usr) }
		}
	end

end
