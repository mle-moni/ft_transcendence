class Room::AdminsController < ApplicationController
  before_action :set_room_admin, only: [:show, :edit, :update, :destroy]

  # GET /room/admins
  # GET /room/admins.json
  def index
    @room_admins = Room::Admin.all
  end

  # GET /room/admins/1
  # GET /room/admins/1.json
  def show
  end

  # GET /room/admins/new
  def new
    @room_admin = Room::Admin.new
  end

  # GET /room/admins/1/edit
  def edit
  end

  # POST /room/admins
  # POST /room/admins.json
  def create
    @room_admin = Room::Admin.new(room_admin_params)

    respond_to do |format|
      if @room_admin.save
        format.html { redirect_to @room_admin, notice: 'Admin was successfully created.' }
        format.json { render :show, status: :created, location: @room_admin }
      else
        format.html { render :new }
        format.json { render json: @room_admin.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /room/admins/1
  # PATCH/PUT /room/admins/1.json
  def update
    respond_to do |format|
      if @room_admin.update(room_admin_params)
        format.html { redirect_to @room_admin, notice: 'Admin was successfully updated.' }
        format.json { render :show, status: :ok, location: @room_admin }
      else
        format.html { render :edit }
        format.json { render json: @room_admin.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /room/admins/1
  # DELETE /room/admins/1.json
  def destroy
    @room_admin.destroy
    respond_to do |format|
      format.html { redirect_to room_admins_url, notice: 'Admin was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room_admin
      @room_admin = Room::Admin.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def room_admin_params
      params.fetch(:room_admin, {})
    end
end
