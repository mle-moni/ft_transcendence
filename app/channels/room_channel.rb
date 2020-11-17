class RoomChannel < ApplicationCable::Channel
  def subscribed
    puts "Subscribed"
    stream_from "room_channel"
  end

  def unsubscribed
    puts "Unsubscribed"
  end
end
