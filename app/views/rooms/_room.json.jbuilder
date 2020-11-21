json.extract! room, :id, :name, :privacy, :password, :owner_id, :room_messages, :members, :admins, :bans, :mutes, :created_at, :updated_at
json.url room_url(room, format: :json)
