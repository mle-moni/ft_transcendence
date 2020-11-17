class User < ApplicationRecord

  # "required: false" because the user may have a null guild_id
  belongs_to :guild, required: false

  # friends relation setup
  has_many :friendships
  has_many :confirmed_friendships, -> { where confirmed: true }, class_name: 'Friendship'
  has_many :friends, :through => :confirmed_friendships, class_name: 'User', :source => :friend
  has_many :invitations, -> { where confirmed: false }, class_name: 'Friendship', foreign_key: "friend_id"
  # get the users that sent me a friend request
  has_many :invites, :through => :invitations, class_name: 'User', :source => :user
  
  validates :nickname, uniqueness: true
  validates :email, uniqueness: true # as long as it's needed for game rooms

  devise :two_factor_authenticatable,
         :otp_secret_encryption_key => ENV['ENCRYPTION_KEY']

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:marvin]


  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      user.nickname = auth.info.nickname
      user.image = auth.info.image
    end
  end

  def self.clean(usr)
		new_user = {
      id: usr.id,
      nickname: usr.nickname,
      email: usr.email,
      image: usr.image,
      two_factor: usr.otp_required_for_login,
      guild_id: usr.guild_id,
      guild_owner: usr.guild_owner,
      guild_officer: usr.guild_officer,
      guild_validated: usr.guild_validated,
      friends: usr.friends,
      invites: usr.invites,
      last_seen: usr.last_seen
    }
  end
  
  def self.reset_guild(usr)
    usr.guild_id = nil
    usr.guild_officer = false
    usr.guild_owner = false
    usr.guild_validated = false
    usr.save
  end

  def self.has_officer_rights(usr)
    return (usr.guild_owner || usr.guild_officer)
  end
      
end
