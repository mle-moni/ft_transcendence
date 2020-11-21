class AddEloToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :elo, :float
  end
end
