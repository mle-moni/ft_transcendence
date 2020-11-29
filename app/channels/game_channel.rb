class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "player_#{ current_user }"
    Matchmaking.create(current_user, params[:is_ranked])
  end

  def unsubscribed
    if Redis.current.get('matches') == current_user
      Redis.current.set('matches', nil)
    end
    # Any cleanup needed when channel is unsubscribed
  end
end
