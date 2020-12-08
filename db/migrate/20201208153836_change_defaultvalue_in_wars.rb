class ChangeDefaultvalueInWars < ActiveRecord::Migration[6.0] 
  def change 
    change_column_default :wars, :time_to_answer, from: 5, to: 30 
  end
end