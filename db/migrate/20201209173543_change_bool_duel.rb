class ChangeBoolDuel < ActiveRecord::Migration[6.0]
  def change
    rename_column :room_messages, :is_duel_request, :is_duel_request
    rename_column :direct_messages, :is_duel_request, :is_duel_request
  end
end
