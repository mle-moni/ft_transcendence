class CreateRoomLinks < ActiveRecord::Migration[6.0]
  def change
    create_table :room_link_members, id: false do |t|
			t.belongs_to :room, index: true
			t.belongs_to :user, index: true
		end

		create_table :room_link_admins, id: false do |t|
			t.belongs_to :room, index: true
			t.belongs_to :user, index: true
		end
  end
end
