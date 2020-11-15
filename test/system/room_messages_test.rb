require "application_system_test_case"

class RoomMessagesTest < ApplicationSystemTestCase
  setup do
    @room_message = room_messages(:one)
  end

  test "visiting the index" do
    visit room_messages_url
    assert_selector "h1", text: "Room Messages"
  end

  test "creating a Room message" do
    visit room_messages_url
    click_on "New Room Message"

    fill_in "Room", with: @room_message.room_id
    fill_in "User", with: @room_message.user_id
    click_on "Create Room message"

    assert_text "Room message was successfully created"
    click_on "Back"
  end

  test "updating a Room message" do
    visit room_messages_url
    click_on "Edit", match: :first

    fill_in "Room", with: @room_message.room_id
    fill_in "User", with: @room_message.user_id
    click_on "Update Room message"

    assert_text "Room message was successfully updated"
    click_on "Back"
  end

  test "destroying a Room message" do
    visit room_messages_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Room message was successfully destroyed"
  end
end
