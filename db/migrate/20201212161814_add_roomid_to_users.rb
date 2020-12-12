class AddRoomidToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :roomid, :integer
  end
end
