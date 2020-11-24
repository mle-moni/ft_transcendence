class CreateDirectChats < ActiveRecord::Migration[6.0]
  def change
    create_table :direct_chats do |t|
        t.references :user1, references: :users
        t.references :user2, references: :users
        t.timestamps
    end
    create_table :direct_messages do |t|
      t.references :from, references: :users
      t.references :dmchat, references: :direct_chats, foreign_key: { to_table: :direct_chats}
      t.text :message
      t.timestamps
  end
  end
end
