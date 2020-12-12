class AddMatchCountToWars < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :match_count, :integer, default: 0
    add_column :wars, :match_request_usr, :bigint, default: 0
    add_column :wars, :match_request_guild, :bigint, default: 0
    add_column :wars, :g1_refused_matches, :integer, default: 0
    add_column :wars, :g2_refused_matches, :integer, default: 0
    add_column :wars, :max_refused_matches, :integer, default: 100
  end
end
