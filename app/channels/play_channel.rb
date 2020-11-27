class PlayChannel < ApplicationCable::Channel
  def subscribed
    stream_from "play_channel_#{params[:game_room_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def take_turn(data)
    last = Redis.current.get("play_channel_#{data['room_id']}_#{data['player']}");
    return unless last.blank? || last == 'w' || data['input'] == 'quit'
    return if !last.blank? && last == 'quit'

    Redis.current.set("play_channel_#{data['room_id']}_#{data['player']}", data['input'])
  end

  def start_game(data)
    return unless Redis.current.get("#{data['room_id']}_has_start").blank?

    Redis.current.set("#{data['room_id']}_has_start", 'ok')
    Game.start_game("play_channel_#{data['room_id']}", data['is_ranked'])
  end
end
