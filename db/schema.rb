# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_12_12_161814) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "blocks", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "toward_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["toward_id"], name: "index_blocks_on_toward_id"
    t.index ["user_id"], name: "index_blocks_on_user_id"
  end

  create_table "direct_chats", force: :cascade do |t|
    t.bigint "user1_id"
    t.bigint "user2_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user1_id"], name: "index_direct_chats_on_user1_id"
    t.index ["user2_id"], name: "index_direct_chats_on_user2_id"
  end

  create_table "direct_messages", force: :cascade do |t|
    t.bigint "from_id"
    t.bigint "direct_chat_id", null: false
    t.text "message"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_duel_request", default: false
    t.boolean "is_ranked", default: false
    t.index ["direct_chat_id"], name: "index_direct_messages_on_direct_chat_id"
    t.index ["from_id"], name: "index_direct_messages_on_from_id"
  end

  create_table "friendships", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "friend_id", null: false
    t.boolean "confirmed", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["friend_id"], name: "index_friendships_on_friend_id"
    t.index ["user_id"], name: "index_friendships_on_user_id"
  end

  create_table "games", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "guilds", force: :cascade do |t|
    t.string "name"
    t.string "anagram"
    t.integer "points", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "matches", force: :cascade do |t|
    t.integer "winner_score"
    t.integer "loser_score"
    t.bigint "winner_id", null: false
    t.bigint "loser_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["loser_id"], name: "index_matches_on_loser_id"
    t.index ["winner_id"], name: "index_matches_on_winner_id"
  end

  create_table "matchmakings", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "room_bans", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "room_id"
    t.datetime "endTime"
    t.bigint "by_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["by_id"], name: "index_room_bans_on_by_id"
    t.index ["room_id"], name: "index_room_bans_on_room_id"
    t.index ["user_id"], name: "index_room_bans_on_user_id"
  end

  create_table "room_link_admins", force: :cascade do |t|
    t.bigint "room_id"
    t.bigint "user_id"
    t.index ["room_id"], name: "index_room_link_admins_on_room_id"
    t.index ["user_id"], name: "index_room_link_admins_on_user_id"
  end

  create_table "room_link_members", force: :cascade do |t|
    t.bigint "room_id"
    t.bigint "user_id"
    t.index ["room_id"], name: "index_room_link_members_on_room_id"
    t.index ["user_id"], name: "index_room_link_members_on_user_id"
  end

  create_table "room_messages", force: :cascade do |t|
    t.text "message"
    t.bigint "user_id", null: false
    t.bigint "room_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_duel_request", default: false
    t.boolean "is_ranked", default: false
    t.index ["room_id"], name: "index_room_messages_on_room_id"
    t.index ["user_id"], name: "index_room_messages_on_user_id"
  end

  create_table "room_mutes", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "room_id"
    t.datetime "endTime"
    t.bigint "by_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["by_id"], name: "index_room_mutes_on_by_id"
    t.index ["room_id"], name: "index_room_mutes_on_room_id"
    t.index ["user_id"], name: "index_room_mutes_on_user_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.string "name"
    t.string "privacy"
    t.string "password"
    t.bigint "owner_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["owner_id"], name: "index_rooms_on_owner_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.datetime "start"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "winner_id", default: 0
    t.integer "matches_started", default: 0
    t.integer "matches_ended", default: 0
    t.boolean "started", default: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "nickname"
    t.string "provider"
    t.string "uid"
    t.string "image"
    t.string "encrypted_otp_secret"
    t.string "encrypted_otp_secret_iv"
    t.string "encrypted_otp_secret_salt"
    t.integer "consumed_timestep"
    t.boolean "otp_required_for_login", default: false
    t.boolean "has_set_pwd", default: false
    t.bigint "guild_id"
    t.boolean "guild_owner", default: false
    t.boolean "guild_officer", default: false
    t.boolean "guild_validated", default: false
    t.datetime "last_seen"
    t.boolean "admin", default: false
    t.boolean "banned", default: false
    t.float "elo", default: 1000.0
    t.boolean "in_game", default: false
    t.boolean "eliminated", default: false
    t.bigint "tournament_id"
    t.integer "roomid"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["guild_id"], name: "index_users_on_guild_id"
    t.index ["provider"], name: "index_users_on_provider"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["tournament_id"], name: "index_users_on_tournament_id"
    t.index ["uid"], name: "index_users_on_uid"
  end

  create_table "war_times", force: :cascade do |t|
    t.datetime "start"
    t.bigint "war_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["war_id"], name: "index_war_times_on_war_id"
  end

  create_table "wars", force: :cascade do |t|
    t.datetime "start"
    t.datetime "end"
    t.integer "prize", default: 0
    t.boolean "mods", default: false
    t.integer "time_to_answer", default: 30
    t.boolean "ladder", default: false
    t.boolean "tournament", default: false
    t.boolean "duel", default: false
    t.bigint "winner", default: 0
    t.bigint "validated", default: 0
    t.bigint "guild1_id", null: false
    t.bigint "guild2_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "g1_score", default: 0
    t.integer "g2_score", default: 0
    t.integer "war_time_len", default: 5
    t.boolean "war_time_match", default: false
    t.integer "match_count", default: 0
    t.bigint "match_request_usr", default: 0
    t.bigint "match_request_guild", default: 0
    t.integer "g1_refused_matches", default: 0
    t.integer "g2_refused_matches", default: 0
    t.integer "max_refused_matches", default: 100
    t.index ["guild1_id"], name: "index_wars_on_guild1_id"
    t.index ["guild2_id"], name: "index_wars_on_guild2_id"
  end

  add_foreign_key "blocks", "users", column: "toward_id"
  add_foreign_key "direct_messages", "direct_chats"
  add_foreign_key "friendships", "users"
  add_foreign_key "friendships", "users", column: "friend_id"
  add_foreign_key "matches", "users", column: "loser_id"
  add_foreign_key "matches", "users", column: "winner_id"
  add_foreign_key "room_bans", "users", column: "by_id"
  add_foreign_key "room_messages", "rooms"
  add_foreign_key "room_messages", "users"
  add_foreign_key "room_mutes", "users", column: "by_id"
  add_foreign_key "rooms", "users", column: "owner_id"
  add_foreign_key "users", "guilds"
  add_foreign_key "users", "tournaments"
  add_foreign_key "war_times", "wars"
  add_foreign_key "wars", "guilds", column: "guild1_id"
  add_foreign_key "wars", "guilds", column: "guild2_id"
end
