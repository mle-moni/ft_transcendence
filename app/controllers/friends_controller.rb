class FriendsController < ApplicationController

	before_action :connect_user
	before_action :set_id, only: [:destroy, :add, :accept, :reject]
	before_action :check_in_friendlist, only: [:add, :accept]

	def get_all
		@users = User.all.map do |usr|
			User.strict_clean(usr)
		end
		respond_to do |format|
			format.html { redirect_to "/", notice: '^^' }
			format.json { render json: @users, status: :ok }
		end
	end

	def last_seen
		respond_to do |format|
			format.html { redirect_to "/#profile", notice: 'Profile infos updated' }
			format.json { render json: User.clean(current_user, true), status: :ok }
		end
	end

	def destroy
		destroy_success = false
		other_friendship = Friendship.where(user_id: @friend_id, friend_id: current_user.id).first
		if other_friendship
			other_friendship.destroy
			destroy_success = true
		end
		user_friendship = Friendship.where(user_id: current_user.id, friend_id: @friend_id).first
		if user_friendship
			user_friendship.destroy
			destroy_success = true
		end
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
		ActionCable.server.broadcast "update_channel", action: "update", target: "last_seen"
		if destroy_success
			success("Friendship successfully destroyed")
		else
			res_with_error("Friend not found", :not_found)
		end
	end

	def add
		other_friendship = Friendship.where(user_id: @friend_id, friend_id: current_user.id).first
		if other_friendship
			current_user.friendships.create({friend_id: @friend_id, confirmed: true})
			other_friendship.confirmed = true
			other_friendship.save
		else
			current_user.friendships.create({friend_id: @friend_id})
			usr = User.find(@friend_id) rescue nil
			if usr
				ActionCable.server.broadcast "player_#{usr.email}", action: "notif",
				content: "#{current_user.nickname} sent a friend request", link: "#friends"
			end
		end
		ActionCable.server.broadcast "update_channel", action: "update", target: "last_seen"
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
		success("Friend request sent")
	end

	def accept
		# get other user friendship and confirm it
		user_friendship = Friendship.where(user_id: @friend_id, friend_id: current_user.id).first
		if !user_friendship
			res_with_error("Bad request", :bad_request)
			return false
		end
		user_friendship.confirmed = true
		user_friendship.save
		current_user.friendships.create({friend_id: @friend_id, confirmed: true})
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
		ActionCable.server.broadcast "update_channel", action: "update", target: "last_seen"
		success("Friend request accepted")
	end

	def reject
		other_friendship = Friendship.where(user_id: @friend_id, friend_id: current_user.id).first
		if !other_friendship
			res_with_error("Bad request", :bad_request)
			return false
		end
		other_friendship.destroy
		ActionCable.server.broadcast "update_channel", action: "update", target: "users"
		success("Friend request rejected")
	end

	private

	def set_id
		@friend_id = params[:id]
		if @friend_id == current_user.id.to_s
			res_with_error("You can't be friend with yourself", :bad_request)
			return (false)
		end
		usr = User.find(@friend_id) rescue nil
		return res_with_error("User not found", :not_found) unless usr
	end

	def check_in_friendlist
		if current_user.friendships.where(friend_id: @friend_id).exists?
			res_with_error("User already in your list", :bad_request)
			return false
		end
		return (true)
	end

end
