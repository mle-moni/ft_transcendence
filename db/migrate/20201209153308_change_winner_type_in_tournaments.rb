class ChangeWinnerTypeInTournaments < ActiveRecord::Migration[6.0]
  def change
    remove_column :tournaments, :winner, :string
    add_column :tournaments, :winner_id, :bigint, default: 0
    add_column :tournaments, :matches_started, :integer, default: 0
    add_column :tournaments, :matches_ended, :integer, default: 0
    add_column :tournaments, :started, :boolean, default: false
  end
end
