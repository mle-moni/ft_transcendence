require 'test_helper'

class GuildsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @guild = guilds(:one)
  end

  test "should get index" do
    get guilds_url
    assert_response :success
  end

  test "should get new" do
    get new_guild_url
    assert_response :success
  end

  test "should create guild" do
    assert_difference('Guild.count') do
      post guilds_url, params: { guild: { anagram: @guild.anagram, name: @guild.name } }
    end

    assert_redirected_to guild_url(Guild.last)
  end

  test "should show guild" do
    get guild_url(@guild)
    assert_response :success
  end

  test "should get edit" do
    get edit_guild_url(@guild)
    assert_response :success
  end

  test "should update guild" do
    patch guild_url(@guild), params: { guild: { anagram: @guild.anagram, name: @guild.name } }
    assert_redirected_to guild_url(@guild)
  end

  test "should destroy guild" do
    assert_difference('Guild.count', -1) do
      delete guild_url(@guild)
    end

    assert_redirected_to guilds_url
  end
end
