class CreateRoomBanMutes < ActiveRecord::Migration[6.0]
  def change

    create_table :room_bans do |t|
      t.references :user
      t.references :room
			t.datetime :endTime
      t.references :by, references: :users,
                        foreign_key: { to_table: :users}
			t.timestamps
		end
		create_table :room_mutes do |t|
			t.references :user
      t.references :room
			t.datetime :endTime
      t.references :by, references: :users, 
                        foreign_key: { to_table: :users}
			t.timestamps
    end
    
  end
end
