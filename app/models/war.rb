class War < ApplicationRecord
  belongs_to :guild1, class_name: 'Guild'
  belongs_to :guild2, class_name: 'Guild'

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
    id_sum = g1.id + g2.id
    return g1.active_war.validated == id_sum 
  end

end
