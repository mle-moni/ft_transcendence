class RoomsController < ApplicationController
  # before_action :set_room, only: [:show, :edit, :update, :destroy]
  before_action :connect_user, only: [:new, :edit, :update, :destroy, :joinPublic, :joinPrivate, :quit, :accept_request]

  # GET /rooms
  # GET /rooms.json
  def index
    @rooms = Room.all
  end

  # GET /rooms/1
  # GET /rooms/1.json
  def show
    puts params
  end

  # GET /rooms/new
  def new
    @room = Room.new
  end

  def joinPublic

    @room = Room.find(params["room"]["room_id"])
    if !@room
      res_with_error("Unknow Room", :bad_request)
      return (false)
    end

    # The 'if' shouldn't be needed since the "Join" action is offer only 1 time, but by prevention we keep it
    # Owner is admin with the differences vs other admin that he match the room owner_id

    if !current_user.rooms_as_member.include?(@room) && current_user.id != @room.owner_id
      @rlm = RoomLinkMember.new(room: @room, user: current_user)
      @rlm.save
    end

    respond_to do |format|
      format.html { redirect_to rooms_url, notice: 'Room Joined !' }
      format.json { render json: {roomID: @room.id}, status: :ok }
    end
  end

  def joinPrivate

    @room = Room.find(params["room"]["room_id"])
    if !@room
      res_with_error("Unknow Room", :bad_request)
      return (false)
    end
    # https://coderwall.com/p/sjegjq/use-bcrypt-for-passwords
    roomPass = BCrypt::Password.new(@room.password)
    if roomPass != params["room"]["password"]
      res_with_error("Wrong password !", :bad_request)
      return false
    end

    # The 'if' shouldn't be needed since the "Join" action is offer only 1 time, but by prevention we keep it
    if !current_user.rooms_as_member.include?(@room) && current_user.id != @room.owner_id
      @rlm = RoomLinkMember.new(room: @room, user: current_user)
      @rlm.save
    end

    respond_to do |format|
      format.html { redirect_to rooms_url, notice: 'Room Joined !' }
      format.json { render json: {room: @room}, status: :ok }
    end
    
  end 

  def quit
    filteredParams = params.require(:room).permit(:room_id, :owner_id, :userRoomGrade)
    grade = filteredParams["userRoomGrade"]
    owner = User.find(filteredParams["owner_id"])
    @room = Room.find(filteredParams["room_id"])

    if grade == "Owner" || grade == "Admin"
      RoomLinkAdmin.where(user: current_user, room: @room).destroy_all
    elsif grade == "Member"
      RoomLinkMember.where(user: current_user, room: @room).destroy_all
    else
      res_with_error("Unexpected Grade - Error", :bad_request)
      return false
    end 
    
    if grade == "Owner"
      @room.members.destroy_all
      @room.admins.destroy_all
      @room.room_messages.destroy_all
      @room.destroy
    end 
    respond_to do |format|
      format.html { redirect_to rooms_url, notice: 'You have leave the room'}
      format.json { head :no_content }
    end

  end 

  # GET /rooms/1/edit
  def edit
  end

  # POST /rooms
  # POST /rooms.json
  def create
    
    # client side validation to add
    filteredParams = params.require(:room).permit(:name, :owner_id, :privacy, :password)


    if !["", "public", "private"].include?(filteredParams["privacy"])
      res_with_error("Privacy field must be either empty, public or private", :bad_request)
      return (false)
    end

    if filteredParams["privacy"] == "private"
      if filteredParams["password"].empty?
        res_with_error("None empty password required if the room is private", :bad_request)
        return (false)
      else
        roomPassword = BCrypt::Password.create filteredParams["password"]
        filteredParams["password"] = roomPassword
      end
    end

    @room = Room.create(filteredParams)

    if !current_user.rooms_as_admin.include?(@room)
      @rla = RoomLinkAdmin.new(room: @room, user: current_user)
      @rla.save
    end
  
    respond_to do |format|
      if @room.save
        format.html { redirect_to @room, notice: 'Room was successfully created.' }
        format.json { render :show, status: :created, location: @room }
      else
        format.html { render :new }
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /rooms/1
  # PATCH/PUT /rooms/1.json
  def update

    filteredParams = params.require(:room).permit(:name, :privacy, :password, :id)

    @room = Room.find(filteredParams["id"])

    if !["", "public", "private"].include?(filteredParams["privacy"])
      res_with_error("Privacy field must be either empty, public or private", :bad_request)
      return (false)
    end

    if filteredParams["privacy"] == "private"
      if filteredParams["password"].empty?
        res_with_error("None empty password required if the room is private", :bad_request)
        return (false)
      else
        roomPassword = BCrypt::Password.create filteredParams["password"]
        filteredParams["password"] = roomPassword
      end
    end

    if filteredParams["privacy"] == "public"
      filteredParams["password"] = ""
    end

    filteredParams.each do |key, value|
      if (value == "" && (filteredParams["privacy"] != "public" && key != "password"))
        filteredParams.delete(key)
      end
    end
    
    respond_to do |format|
      if @room.update(filteredParams)
        format.html { redirect_to :index, notice: 'Room was successfully updated.' }
        format.json { render :index, status: :ok, location: @room }
      else
        format.html { render :edit }
        format.json { render json: @room, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rooms/1
  # DELETE /rooms/1.json
  def destroy
    @room = Room.find(params["id"])
    @room.members.destroy_all
    @room.admins.destroy_all
    @room.room_messages.destroy_all
    @room.destroy
    respond_to do |format|
      format.html { redirect_to :index, notice: 'Room was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room
      @room = Room.find(params[:id])
    end

    def res_with_error(msg, error)
      respond_to do |format|
        format.html { redirect_to "/", alert: "#{msg}" }
        format.json { render json: {alert: "#{msg}"}, status: error }
      end
    end

    def res_with_info(msg)
      respond_to do |format|
        format.html { redirect_to "/", notice: "#{msg}" }
        format.json { render json: {msg: "#{msg}"}} #status: :ok
      end
    end

    def connect_user
      unless user_signed_in?
        respond_to do |format|
          format.html { redirect_to "/", alert: "You need to be connected for this action" }
          format.json { render json: {alert: "You need to be connected for this action"}, status: :unprocessable_entity }
        end
      end
    end

end
