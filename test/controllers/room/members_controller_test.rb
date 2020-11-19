require 'test_helper'

class Room::MembersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @room_member = room_members(:one)
  end

  test "should get index" do
    get room_members_url
    assert_response :success
  end

  test "should get new" do
    get new_room_member_url
    assert_response :success
  end

  test "should create room_member" do
    assert_difference('Room::Member.count') do
      post room_members_url, params: { room_member: {  } }
    end

    assert_redirected_to room_member_url(Room::Member.last)
  end

  test "should show room_member" do
    get room_member_url(@room_member)
    assert_response :success
  end

  test "should get edit" do
    get edit_room_member_url(@room_member)
    assert_response :success
  end

  test "should update room_member" do
    patch room_member_url(@room_member), params: { room_member: {  } }
    assert_redirected_to room_member_url(@room_member)
  end

  test "should destroy room_member" do
    assert_difference('Room::Member.count', -1) do
      delete room_member_url(@room_member)
    end

    assert_redirected_to room_members_url
  end
end
