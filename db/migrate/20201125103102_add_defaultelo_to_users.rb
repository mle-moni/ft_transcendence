class AddDefaulteloToUsers < ActiveRecord::Migration[6.0]
  def change
    change_column :users, :elo, :float, :default => 1000.0

    User.all.each do |usr|
      usr.elo = 1000.0 # make sure elo is reset at 1000
      usr.save
    end
  end
end
