class CreateRoomLinks < ActiveRecord::Migration[6.0]
  def change
    create_table :room_link_members do |t|
			t.belongs_to :room, index: true
			t.belongs_to :user, index: true
		end

		create_table :room_link_admins do |t|
			t.belongs_to :room, index: true
			t.belongs_to :user, index: true
		end
  end
end
