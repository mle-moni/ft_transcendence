class PlayChannel < ApplicationCable::Channel
  def subscribed
    stream_from "play_channel_#{params[:game_room_id]}"
  end

  def unsubscribed
    if (params[:role] != "v")
      Game.end_the_game("play_channel_#{params[:game_room_id]}", params[:role])
    end
  end

  def take_turn(data)
    game = $games[data['room_name']];
    if (data['player'] == 'l')
      return if game[:right_action] == 'quit'; # ingore input after leaving (can occure when a user spam an input while is leaving)
      game[:left_action] = data['input'];
    elsif (data['player'] == 'r')
      return if game[:right_action] == 'quit';
      game[:right_action] = data['input']; 
    end
  end

  def new_state(data)
    game = $games[data['room_name']]

    game[:ball_pos_x] = data['ball_x']
    game[:ball_pos_y] = data['ball_y']
    game[:right_pos] = data['right_pos']
    game[:right_score] = data['right_score']
    game[:left_score] = data['left_score']
    game[:ball_dir_x] = data['ball_dir_x']
    game[:ball_dir_y] = data['ball_dir_y']
    game[:left_pos] = data['left_pos']
    game[:ball_speed] = data['ball_speed']
  end

  def start_game(data)
    Game.start_game("#{data['room_name']}", data['is_ranked'])
  end

  def get_datas(data)
    ActionCable.server.broadcast data['room_name'], $games[data['room_name']];
  end

  def quit(data)
    ActionCable.server.broadcast data['room_name'], {action: 'quit'}
  end

  def end_the_game(data)
    Game.end_the_game(data["room_name"], 'n')
  end
end