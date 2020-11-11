class AddGuildToUsers < ActiveRecord::Migration[6.0]
  def change
    add_reference :users, :guild, null: true, foreign_key: true
    add_column :users, :guild_owner, :boolean, default: false
    add_column :users, :guild_officer, :boolean, default: false
    add_column :users, :guild_validated, :boolean, default: false
  end
end
