class Room::MembersController < ApplicationController
  before_action :set_room_member, only: [:show, :edit, :update, :destroy]

  # GET /room/members
  # GET /room/members.json
  def index
    @room_members = Room::Member.all
  end

  # GET /room/members/1
  # GET /room/members/1.json
  def show
  end

  # GET /room/members/new
  def new
    @room_member = Room::Member.new
  end

  # GET /room/members/1/edit
  def edit
  end

  # POST /room/members
  # POST /room/members.json
  def create
    @room_member = Room::Member.new(room_member_params)

    respond_to do |format|
      if @room_member.save
        format.html { redirect_to @room_member, notice: 'Member was successfully created.' }
        format.json { render :show, status: :created, location: @room_member }
      else
        format.html { render :new }
        format.json { render json: @room_member.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /room/members/1
  # PATCH/PUT /room/members/1.json
  def update
    respond_to do |format|
      if @room_member.update(room_member_params)
        format.html { redirect_to @room_member, notice: 'Member was successfully updated.' }
        format.json { render :show, status: :ok, location: @room_member }
      else
        format.html { render :edit }
        format.json { render json: @room_member.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /room/members/1
  # DELETE /room/members/1.json
  def destroy
    @room_member.destroy
    respond_to do |format|
      format.html { redirect_to room_members_url, notice: 'Member was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_room_member
      @room_member = Room::Member.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def room_member_params
      params.fetch(:room_member, {})
    end
end
