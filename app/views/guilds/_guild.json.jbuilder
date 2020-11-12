json.extract! guild, :id, :name, :anagram, :points, :created_at, :users, :requests, :owner, :officers
json.url guild_url(guild, format: :json)
