require "application_system_test_case"

class DirectChatsTest < ApplicationSystemTestCase
  setup do
    @direct_chat = direct_chats(:one)
  end

  test "visiting the index" do
    visit direct_chats_url
    assert_selector "h1", text: "Direct Chats"
  end

  test "creating a Direct chat" do
    visit direct_chats_url
    click_on "New Direct Chat"

    click_on "Create Direct chat"

    assert_text "Direct chat was successfully created"
    click_on "Back"
  end

  test "updating a Direct chat" do
    visit direct_chats_url
    click_on "Edit", match: :first

    click_on "Update Direct chat"

    assert_text "Direct chat was successfully updated"
    click_on "Back"
  end

  test "destroying a Direct chat" do
    visit direct_chats_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Direct chat was successfully destroyed"
  end
end
