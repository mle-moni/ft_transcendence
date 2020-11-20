class Room < ApplicationRecord
  
  validates   :name, uniqueness: true
  belongs_to  :owner, class_name: "User", required: true

  has_many :room_messages, dependent: :destroy
  
	has_many :room_link_members, dependent: :destroy
  has_many :members, :through => :room_link_members, :source => :user
  
  has_many :room_link_admins, dependent: :destroy
  has_many :admins, :through => :room_link_admins, :source => :user


  # NB 

  # -    create_table :room_link_members do |t|
  #   t.belongs_to :room, index: true
  #   t.belongs_to :user, index: true
  # end
  
  # S'il y avait eu le index: :false tel que create_table :room_link_members, index: :false do |t|
  # alors il n'y aurait pas eu d'ID sur chaque record de la table mais surtout,
  # il naurait pas été possible de call destroy sur les record car les callback (si dependent: destroy) de destroy se base sur cet id,
  # à l'inverse de delete_all qui ne call pas de callback
  
end
