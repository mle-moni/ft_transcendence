class PlayChannel < ApplicationCable::Channel
  def subscribed
    stream_from "play_channel_#{params[:game_room_id]}"
    if (params[:role] == "r")
      tmp = User.find_by(email: Redis.current.get("play_channel_#{params[:game_room_id]}_r"))
      tmp.in_game = true
      tmp.roomid = params[:game_room_id]
      tmp.save
			ActionCable.server.broadcast "update_channel", action: "update", target: "users"
    elsif (params[:role] == "l")
      tmp = User.find_by(email: Redis.current.get("play_channel_#{params[:game_room_id]}_l"))
      tmp.in_game = true
      tmp.roomid = params[:game_room_id]
      tmp.save
			ActionCable.server.broadcast "update_channel", action: "update", target: "users"
    end
  end

  def unsubscribed
    if (params[:role] != "v")
      Game.end_the_game("play_channel_#{params[:game_room_id]}", params[:role])
      if (params[:role] == "r")
        tmp = User.find_by(email: Redis.current.get("play_channel_#{params[:game_room_id]}_r"))
        tmp.in_game = false
        tmp.save
      elsif (params[:role] == "l")
        tmp = User.find_by(email: Redis.current.get("play_channel_#{params[:game_room_id]}_l"))
        tmp.in_game = false
        tmp.save
      end
    end
  end

  def take_turn(data)
    game = $games[data['rmn']];
    if (data['player'] == 'l')
      return if game[:ra] == 'quit'; # ingore input after leaving (can occure when a user spam an input while is leaving)
      game[:la] = data['input'];
    elsif (data['player'] == 'r')
      return if game[:ra] == 'quit';
      game[:ra] = data['input']; 
    end
  end

  def new_state(data)
    game = $games[data['rmn']]

    game[:bpx] = data['ball_x']
    game[:bpy] = data['ball_y']
    game[:rp] = data['rp']
    game[:rsc] = data['rsc']
    game[:lsc] = data['lsc']
    game[:bdx] = data['bdx']
    game[:bdy] = data['bdy']
    game[:lp] = data['lp']
    game[:bs] = data['bs']
  end

  def connect_to_game(data)
    game = $games[data['rmn']]
    if (data['player'] == 'l')
      game[:plc] = true;
    elsif (data['player'] == 'r')
      game[:prc] = true; 
    end
  end

  def check_users_connection(data)
    game = $games[data['rmn']]

    if (game[:plc] == false)
      Game.end_the_game(data['rmn'], 'l')
    elsif (game[:prc] == false)
      Game.end_the_game(data['rmn'], 'r')
    end
  end

  def get_user_infos(data)
    ActionCable.server.broadcast data['rmn'], {action: "users_infos", lu: $games[data['rmn']][:lu], ru: $games[data['rmn']][:ru]}
  end

  def get_datas(data)
    ActionCable.server.broadcast data['rmn'], $games[data['rmn']];
  end

  def quit(data)
    ActionCable.server.broadcast data['rmn'], {action: 'quit'}
  end

  def end_the_game(data)
    Game.end_the_game(data["rmn"], 'n')
  end
end