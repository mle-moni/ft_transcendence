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
    return false unless usr1.guild_validated && usr2.guild_validated
    return false unless g1 && g2
    return false unless g1.active_war
    return g1.active_war.confirmed? 
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
			winner: war.winner
    }
    return retwar
  end

end
