class Match < ApplicationRecord
  belongs_to :winner, class_name: 'User'
  belongs_to :loser, class_name: 'User'
end
