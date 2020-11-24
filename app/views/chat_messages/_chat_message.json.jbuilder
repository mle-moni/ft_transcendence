json.extract! chat_message, :id, :from_id, :dmchat_id, :created_at, :updated_at, :message
json.url chat_message_url(chat_message, format: :json)