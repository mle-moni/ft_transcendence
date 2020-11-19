class RoomsController < ApplicationController
  before_action :set_room, only: [:show, :edit, :update, :destroy]
  before_action :connect_user, only: [:new, :edit, :update, :destroy, :join, :quit, :accept_request]

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

  def join

    # https://coderwall.com/p/sjegjq/use-bcrypt-for-passwords
    room = Room.find(params["room"]["room_id"])
   
   
    # roomPass = BCrypt::Password.new(room.password)
    # if roomPass != params["room"]["password"]
    #   res_with_error("Wrong password", :bad_request)
    #   return false
    # else # todo admin etc
    #   unless room.members.include?(current_user)
    #     room.members << current_user
    #   end
    # end

    respond_to do |format|
      format.html { redirect_to rooms_url, notice: 'Room Joined !' }
      format.json { render json: {roomID: room.id}, status: :ok }
    end
  end

  def quit
    puts params
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
        puts roomPassword
      end
    end
  
    @room = Room.create(filteredParams)
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

    filteredParams = params.require(:room).permit(:name, :privacy, :password)
    respond_to do |format|
      if @room.update(filteredParams)
        format.html { redirect_to :index, notice: 'Room was successfully updated.' }
        format.json { render :index, status: :ok, location: @room }
      else
        format.html { render :edit }
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rooms/1
  # DELETE /rooms/1.json
  def destroy
    if @room.room_messages # Deleting all messages from the room
      @room.room_messages.each do |message|
        message.destroy
      end
    end
    @room.destroy # Deleting room
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

    def connect_user
      unless user_signed_in?
        respond_to do |format|
          format.html { redirect_to "/", alert: "You need to be connected for this action" }
          format.json { render json: {alert: "You need to be connected for this action"}, status: :unprocessable_entity }
        end
      end
    end

end
