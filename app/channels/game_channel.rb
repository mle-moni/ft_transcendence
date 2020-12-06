class GameChannel < ApplicationCable::Channel
  def subscribed
    stream_from "player_#{ current_user }"
    if (params[:is_matchmaking])
      type = params[:is_ranked] ? "ranked" : "unranked"
      Matchmaking.create(current_user, type)
    end
  end

  def unsubscribed
    if Redis.current.get('matches') == current_user
      Redis.current.set('matches', nil)
    end
    if Redis.current.get('matches_ranked') == current_user
      Redis.current.set('matches_ranked', nil)
    end
    # Any cleanup needed when channel is unsubscribed
  end
end
