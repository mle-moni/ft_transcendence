require "application_system_test_case"

class Room::MembersTest < ApplicationSystemTestCase
  setup do
    @room_member = room_members(:one)
  end

  test "visiting the index" do
    visit room_members_url
    assert_selector "h1", text: "Room/Members"
  end

  test "creating a Member" do
    visit room_members_url
    click_on "New Room/Member"

    click_on "Create Member"

    assert_text "Member was successfully created"
    click_on "Back"
  end

  test "updating a Member" do
    visit room_members_url
    click_on "Edit", match: :first

    click_on "Update Member"

    assert_text "Member was successfully updated"
    click_on "Back"
  end

  test "destroying a Member" do
    visit room_members_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Member was successfully destroyed"
  end
end
