class PlayChannel < ApplicationCable::Channel
  def subscribed
    stream_from "play_channel_#{params[:game_room_id]}"
  end

  def unsubscribed
    if (params[:role] != "v")
      room_name = "play_channel_#{params[:game_room_id]}";
      # Any cleanup needed when channel is unsubscribed
      if (Redis.current.get("game_#{room_name}_end?") == "no") # if not already ended, end the game with actual player has loser (he left the game)
        Redis.current.set("game_#{room_name}_end?", "yes");

        if (params[:role] == 'r')
          current_user = User.find_by(email: Redis.current.get("#{room_name}_r"))
          other_user = User.find_by(email: Redis.current.get("#{room_name}_l"))
          current_score = $games[room_name][:right_score]
          other_score = $games[room_name][:left_score]
        else
          current_user = User.find_by(email: Redis.current.get("#{room_name}_l"))
          other_user = User.find_by(email: Redis.current.get("#{room_name}_r"))
          current_score = $games[room_name][:left_score]
          other_score = $games[room_name][:right_score]
        end

        if ($games[room_name][:is_ranked] == true)
          match = EloRating::Match.new

          match.add_player(rating: current_user.elo)
          match.add_player(rating: other_user.elo, winner: true)
          tmp = match.updated_ratings
          current_user.elo = tmp[0]
          other_user.elo = tmp[1]
          if other_user.guild
            other_user.guild.points += 1
            other_user.guild.save
          end
          current_user.save
          other_user.save
        end
        Match.create(winner: other_user, loser: current_user, winner_score: other_score, loser_score: current_score);
        ActionCable.server.broadcast room_name, {action: 'quit'}
      end
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
    if (Redis.current.get("game_#{data['room_name']}_end?") == "no") # if not already ended, end the game with the actual datas
      Redis.current.set("game_#{data['room_name']}_end?", "yes");

      if ($games[data['room_name']][:right_score] == 11)
        winner_user = User.find_by(email: Redis.current.get("#{data['room_name']}_r"))
        loser_user = User.find_by(email: Redis.current.get("#{data['room_name']}_l"))
        winner_score = $games[data['room_name']][:right_score]
        loser_score = $games[data['room_name']][:left_score]
      else
        winner_user = User.find_by(email: Redis.current.get("#{data['room_name']}_l"))
        loser_user = User.find_by(email: Redis.current.get("#{data['room_name']}_r"))
        winner_score = $games[data['room_name']][:left_score]
        loser_score = $games[data['room_name']][:right_score]
      end

      if ($games[data['room_name']][:is_ranked] == true)
        match = EloRating::Match.new

        match.add_player(rating: loser_user.elo)
        match.add_player(rating: winner_user.elo, winner: true)
        tmp = match.updated_ratings
        loser_user.elo = tmp[0]
        winner_user.elo = tmp[1]
        if winner_user.guild
          winner_user.guild.points += 1
          other_user.guild.save
        end
        loser_user.save
        winner_user.save
      end

      Match.create(winner: winner_user, loser: loser_user, winner_score: winner_score, loser_score: loser_score);
      ActionCable.server.broadcast data['room_name'], {action: 'quit'}
    end
  end
end