require 'test_helper'

class DirectChatsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @direct_chat = direct_chats(:one)
  end

  test "should get index" do
    get direct_chats_url
    assert_response :success
  end

  test "should get new" do
    get new_direct_chat_url
    assert_response :success
  end

  test "should create direct_chat" do
    assert_difference('DirectChat.count') do
      post direct_chats_url, params: { direct_chat: {  } }
    end

    assert_redirected_to direct_chat_url(DirectChat.last)
  end

  test "should show direct_chat" do
    get direct_chat_url(@direct_chat)
    assert_response :success
  end

  test "should get edit" do
    get edit_direct_chat_url(@direct_chat)
    assert_response :success
  end

  test "should update direct_chat" do
    patch direct_chat_url(@direct_chat), params: { direct_chat: {  } }
    assert_redirected_to direct_chat_url(@direct_chat)
  end

  test "should destroy direct_chat" do
    assert_difference('DirectChat.count', -1) do
      delete direct_chat_url(@direct_chat)
    end

    assert_redirected_to direct_chats_url
  end
end
