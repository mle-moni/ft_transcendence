json.extract! room, :id, :name, :privacy, :password, :owner_id, :created_at, :updated_at
json.url room_url(room, format: :json)
