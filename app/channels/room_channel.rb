class RoomChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "room_channel_#{params[:room_id]}"
    stream_from "room_channel"
  end

  def unsubscribed
  end

end

# NB : stream_for works similarly as stream_from with the difference that stream_for
#      accepts an ActiveRecord and will automatically name the Channel based on the record’s grid param id
# https://stackoverflow.com/questions/39002150/what-is-the-difference-between-stream-from-and-stream-for-in-actioncable