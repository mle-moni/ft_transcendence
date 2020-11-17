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
  end

  # GET /rooms/new
  def new
    @room = Room.new
  end

  # GET /rooms/1/edit
  def edit
  end

  # POST /rooms
  # POST /rooms.json
  def create
    
    # client side validation to add
    filteredParams = params.require(:room).permit(:name, :owner_id, :privacy, :password)
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

    def connect_user
      unless user_signed_in?
        respond_to do |format|
          format.html { redirect_to "/", alert: "You need to be connected for this action" }
          format.json { render json: {alert: "You need to be connected for this action"}, status: :unprocessable_entity }
        end
      end
    end

end
