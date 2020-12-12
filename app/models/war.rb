class War < ApplicationRecord
  after_save do 
    ActionCable.server.broadcast "update_channel", action: "update", target: "guilds"
  end
  after_destroy do
		ActionCable.server.broadcast "update_channel", action: "update", target: "guilds"
	end

  belongs_to :guild1, class_name: 'Guild'
  belongs_to :guild2, class_name: 'Guild'

  has_many :war_times

  def confirmed?
    return validated == guild1_id + guild2_id
  end

  def running?
    return false unless confirmed?
    now = DateTime.parse(Time.current.to_s)
    return start < now && now < self.end
  end

  def end_war(winner_id)
    self.winner = winner_id
    save
    if guild1_id == winner_id
      self.guild1.points += prize
      self.guild2.points -= prize
    else
      self.guild2.points += prize
      self.guild1.points -= prize
    end
    self.guild1.save
    self.guild2.save
  end

  def end_if_needed
    return false unless confirmed?
    return false unless winner == 0
    now = DateTime.parse(Time.current.to_s)
    return false unless start < now && now > self.end
    if g1_score > g2_score
      end_war(guild1_id)
    elsif g2_score > g1_score
      end_war(guild2_id)
    else
      self.winner = -1
      save
    end
    return true
  end

  def war_time?
    return false unless running?
    now = DateTime.parse(Time.current.to_s)
    war_times.each do |wt|
      wt_end = wt.start + war_time_len.minutes
      if wt.start < now && now < wt_end
        return true
      end
    end
    return false
  end

  # ret values: 
  # 0 = success, 1 = already confirmed, 2 = wrong gid
  def confirm(gid)
    unless gid == guild1_id || gid == guild2_id
      return 2
    end
    if confirmed? || validated == gid
      return 1
    end
    self.validated = validated + gid
    save
    return 0
  end

  def self.create_war(g1, g2) # pass 2 guilds as parameters
    if (g1 == g2)
      return false # this would be wrong for obv reasons
    end
    if g1.active_war || g2.active_war
      return false # one of the guild is already at war, or planning a war
    end
    War.create({guild1: g1, guild2: g2})
    return true
  end

  def self.users_at_war?(usr1, usr2)
    g1 = usr1.guild
    g2 = usr2.guild
    return false if !g1 || !g2
    return false if g1.id == g2.id
    return false unless usr1.guild_validated && usr2.guild_validated
    return false unless g1 && g2
    war = g1.active_war
    return false unless war
    unless war.guild1_id == g2.id || war.guild2_id == g2.id
      return false
    end
    return war.running?
  end

  def get_enemy_guild_id(g_id)
    if guild1_id == g_id
      return guild2_id
    else
      return guild1_id
    end
  end

  def check_refused_matches
    if g1_refused_matches >= max_refused_matches
      end_war(guild2_id)
    elsif g2_refused_matches >= max_refused_matches
      end_war(guild1_id)
    end
  end

  def inc_refused_matches(g_id)
    if guild1_id == g_id
      self.g1_refused_matches += 1
    else
      self.g2_refused_matches += 1
    end
    save
    check_refused_matches
  end

  def add_points(guild, points)
    if guild1_id == guild.id
      self.g1_score += points
    else
      self.g2_score += points
    end
    save
  end

  def self.update_if_needed(game_type, winner, loser)
    return false unless War.users_at_war?(winner, loser)
    war = winner.guild.active_war
    case game_type
    when "ranked"
      if war.ladder
        war.add_points(winner.guild, 1)
      end
    when "duel_ranked"
      if war.duel
        war.add_points(winner.guild, 1)
      end
    when "tournament"
      if war.tournament
        war.add_points(winner.guild, 1)
      end
    when "war_time_match"
      war.add_points(winner.guild, 2)
      war.war_time_match = false
      war.save
    else
      return false
    end
    war.save
    return true
  end

  def self.clean(war)
    if !war
      return nil
    end
    retwar = {
			id: war.id,
			created_at: war.created_at,
			updated_at: war.updated_at,
			start: war.start,
			end: war.end,
			duel: war.duel,
			ladder: war.ladder,
			tournament: war.tournament,
			g1_score: war.g1_score,
			g2_score: war.g2_score,
			guild1_id: war.guild1_id,
			guild2_id: war.guild2_id,
			mods: war.mods,
			prize: war.prize,
			time_to_answer: war.time_to_answer,
			validated: war.validated,
			war_times: war.war_times,
			war_time_len: war.war_time_len,
			war_time_match: war.war_time_match,
      match_count: war.match_count,
      match_request_usr: war.match_request_usr,
      match_request_guild: war.match_request_guild,
      max_refused_matches: war.max_refused_matches,
      in_war_time: war.war_time?,
      running: war.running?,
      winner: war.winner
    }
    return retwar
  end

end
