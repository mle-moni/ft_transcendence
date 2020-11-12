class GuildsController < ApplicationController
  before_action :set_guild, only: [:show, :edit, :update, :destroy, :join]
  before_action :connect_user, only: [:new, :edit, :update, :destroy, :join, :quit, :accept_request]
  before_action :has_guild, only: [:new, :join]

  # GET /guilds
  # GET /guilds.json
  def index
    @guilds = Guild.all
  end

  # GET /guilds/1
  # GET /guilds/1.json
  def show
  end

  # GET /guilds/new
  def new
    # needed to load default html.erb view, we can delete it later if we want
    # but it's not a big deal as it is not saved on the database
    @guild = Guild.new
  end

  # GET /guilds/1/edit
  def edit
  end

  # POST /guilds
  # POST /guilds.json
  def create

    g_params = guild_params()
    if (!g_params)
      return false
    end
    @guild = current_user.create_guild(g_params)
    current_user.guild_owner = true
    current_user.guild_validated = true
    current_user.save

    respond_to do |format|
      if @guild
        format.html { redirect_to @guild, notice: 'Guild was successfully created.' }
        format.json { render :show, status: :created, location: @guild }
      else
        format.html { render :new }
        format.json { render json: @guild.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /guilds/1
  # PATCH/PUT /guilds/1.json
  def update
    unless current_user.guild.owner == current_user
      res_with_error("You need to own the guild to edit it", :unauthorized)
      return false
    end

    g_params = guild_params()
    if (!g_params)
      return false
    end

    respond_to do |format|
      if @guild.update(g_params)
        format.html { redirect_to @guild, notice: 'Guild was successfully updated.' }
        format.json { render :show, status: :ok, location: @guild }
      else
        format.html { render :edit }
        format.json { render json: @guild.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /guilds/1
  # DELETE /guilds/1.json
  def destroy

    unless @guild.owner == current_user
      res_with_error("You can't destroy it if you don't own it!", :unauthorized)
      return
    end
    # remove all associations with this guild
    User.where("guild_id = #{@guild.id}").each do |user|
      User.reset_guild(user)
    end
    @guild.destroy
    respond_to do |format|
      format.html { redirect_to guilds_url, notice: 'Guild was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def quit
    if current_user.guild_owner
      @guild = current_user.guild
      destroy
      return true
    end
    User.reset_guild(current_user)
    respond_to do |format|
      format.html { redirect_to guilds_url, notice: 'You quitted your guild' }
      format.json { render json: User.clean(current_user), status: :ok }
    end
  end

  def join
    current_user.guild_id = @guild.id
    current_user.guild_officer = false
    current_user.guild_owner = false
    current_user.guild_validated = false
    current_user.save
    respond_to do |format|
      format.html { redirect_to guilds_url, notice: 'Joining request sent.' }
      format.json { render json: User.clean(current_user), status: :ok }
    end
  end

  def accept_request
    new_usr = User.find(params[:id])
    unless new_usr.guild_id == current_user.guild_id
      res_with_error("Bad request", :bad_request)
      return false
    end
    unless User.has_officer_rights(current_user)
      res_with_error("Action unauthorized", :unauthorized)
      return false
    end
    new_usr.guild_validated = true
    new_usr.save
    respond_to do |format|
      format.html { redirect_to guilds_url, notice: 'Joining request accepted.' }
      format.json { render json: {msg: "Joining request accepted"}, status: :ok }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_guild
      @guild = Guild.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    # and verify if they are well formatted xd
    def guild_params
      g_params = params.require(:guild).permit(:name, :anagram)
      if !g_params['name'] || check_len(g_params['name'], 3, 20)
        res_with_error("Name length must be >= 3 and <= 20", :bad_request)
        return false
      end
      if !g_params['anagram'] || check_len(g_params['anagram'], 2, 5)
        res_with_error("Anagram length must be >= 2 and <= 5", :bad_request)
        return false
      end
      return (g_params)
    end

    # TODO this is the same function as in profile_controller, DRY it later
    def connect_user
      unless user_signed_in?
        respond_to do |format|
          format.html { redirect_to "/", alert: "You need to be connected for this action" }
          format.json { render json: {alert: "You need to be connected for this action"}, status: :unprocessable_entity }
        end
      end
    end

    def res_with_error(msg, error)
      respond_to do |format|
        format.html { redirect_to "/", alert: "#{msg}" }
        format.json { render json: {alert: "#{msg}"}, status: error }
      end
    end

    def check_len(str, minlen, maxlen)
      if (str && str.length >= minlen && str.length <= maxlen)
        return false # no errors
      end
      return true # error
    end

    def has_guild
      if current_user.guild
        res_with_error("You already are in a guild", :bad_request)
        return false
      end
    end
end
