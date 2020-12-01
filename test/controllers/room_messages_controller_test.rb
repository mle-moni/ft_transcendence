require 'test_helper'

class RoomMessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @room_message = room_messages(:one)
  end

  test "should get index" do
    get room_messages_url
    assert_response :success
  end

  test "should get new" do
    get new_room_message_url
    assert_response :success
  end

  test "should create room_message" do
    assert_difference('RoomMessage.count') do
      post room_messages_url, params: { room_message: { room_id: @room_message.room_id, user_id: @room_message.user_id } }
    end

    assert_redirected_to room_message_url(RoomMessage.last)
  end

  test "should show room_message" do
    get room_message_url(@room_message)
    assert_response :success
  end

  test "should get edit" do
    get edit_room_message_url(@room_message)
    assert_response :success
  end

  test "should update room_message" do
    patch room_message_url(@room_message), params: { room_message: { room_id: @room_message.room_id, user_id: @room_message.user_id } }
    assert_redirected_to room_message_url(@room_message)
  end

  test "should destroy room_message" do
    assert_difference('RoomMessage.count', -1) do
      delete room_message_url(@room_message)
    end

    assert_redirected_to room_messages_url
  end
end
