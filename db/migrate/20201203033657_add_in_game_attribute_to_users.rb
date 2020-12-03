class AddInGameAttributeToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :in_game, :boolean, default: false
  end
end
