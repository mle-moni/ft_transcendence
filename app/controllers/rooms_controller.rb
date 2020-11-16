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
    puts params
    
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
    respond_to do |format|
      if @room.update(room_params)
        format.html { redirect_to @room, notice: 'Room was successfully updated.' }
        format.json { render :show, status: :ok, location: @room }
      else
        format.html { render :edit }
        format.json { render json: @room.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rooms/1
  # DELETE /rooms/1.json
  def destroy
    @room.destroy
    respond_to do |format|
      format.html { redirect_to rooms_url, notice: 'Room was successfully destroyed.' }
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


end
