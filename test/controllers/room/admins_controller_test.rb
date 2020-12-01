require 'test_helper'

class Room::AdminsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @room_admin = room_admins(:one)
  end

  test "should get index" do
    get room_admins_url
    assert_response :success
  end

  test "should get new" do
    get new_room_admin_url
    assert_response :success
  end

  test "should create room_admin" do
    assert_difference('Room::Admin.count') do
      post room_admins_url, params: { room_admin: {  } }
    end

    assert_redirected_to room_admin_url(Room::Admin.last)
  end

  test "should show room_admin" do
    get room_admin_url(@room_admin)
    assert_response :success
  end

  test "should get edit" do
    get edit_room_admin_url(@room_admin)
    assert_response :success
  end

  test "should update room_admin" do
    patch room_admin_url(@room_admin), params: { room_admin: {  } }
    assert_redirected_to room_admin_url(@room_admin)
  end

  test "should destroy room_admin" do
    assert_difference('Room::Admin.count', -1) do
      delete room_admin_url(@room_admin)
    end

    assert_redirected_to room_admins_url
  end
end
