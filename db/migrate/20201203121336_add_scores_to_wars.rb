class AddScoresToWars < ActiveRecord::Migration[6.0]
  def change
    add_column :wars, :g1_score, :integer, default: 0
    add_column :wars, :g2_score, :integer, default: 0
  end
end
