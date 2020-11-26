unless User.exists?(1)
	[
		{email: "b@b.b", encrypted_password: "$2a$12$t1iRZYw0P5B7bS1SyTl8i.wLBu7//85X1hL12Y2NbpDgI/nwHnPbq", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2020-11-06 17:23:22", updated_at: "2020-11-06 17:25:40", nickname: "Bambou", provider: nil, uid: nil, image: "https://www.jardiner-malin.fr/wp-content/uploads/2019/03/bambou.jpg", elo: 800},
		{email: "a@a.a", encrypted_password: "$2a$12$L.qczAT9kFkalXPqyE6z.OrbKCiOP1yApRhH9Pwlo/OBT6mjSqbAm", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2020-11-06 17:21:30", updated_at: "2020-11-06 17:26:34", nickname: "Abricot", provider: nil, uid: nil, image: "https://www.atelierdeschefs.com/media/ingredient-e5-l-abricot.jpg", admin: true, elo: 1000},
		{email: "c@c.c", encrypted_password: "$2a$12$edfxBRAeDtsJJWj/oOwKseKwReIUArZ9vQstK1KbvgG2KsEAPnOHC", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2020-11-06 17:27:29", updated_at: "2020-11-06 17:27:57", nickname: "Chocolat", provider: nil, uid: nil, image: "https://static.passeportsante.net/680x357/i89783-.jpeg", elo: 1200}
	].each do |user_attributes|
		user = User.new(user_attributes)
		user.save!(validate: false)
	end
end



# ---------- CHAT Seed

# Recreate users each time dedicated to chat feature
# Recreate rooms each time too
# Encrypted Passwords : bob - jo - kim

[
	{email: "bob@bob.bob", encrypted_password: "$2b$10$hTWyjJ2M0cXVfbWZVDafZeA4Y3Q5BgmE3y8jhlaLEIe5kOH0Mrh0y", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2020-11-06 17:27:29", updated_at: "2020-11-06 17:27:57", nickname: "Bob", provider: nil, uid: nil, image: "https://images-na.ssl-images-amazon.com/images/I/51vy0hxKhtL._AC_SX425_.jpg"},
	{email: "jo@jo.jo", encrypted_password: "$2b$10$cTBNkgVpymjQUnmzcIOp..7LV89qUcA8oncTqPgm8Mhz7SU6.9SA2", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2020-11-06 17:27:29", updated_at: "2020-11-06 17:27:57", nickname: "Jo", provider: nil, uid: nil, image: "https://images-na.ssl-images-amazon.com/images/I/81dIf1bhapL._AC_SY355_.jpg"},
	{email: "kim@kim.kim", encrypted_password: "$2b$10$vlVG7aTb89HFydKlSMocCO1FHF.aut2CHeDT1VTRVk8BZyyyF8knO", reset_password_token: nil, reset_password_sent_at: nil, remember_created_at: nil, created_at: "2020-11-06 17:27:29", updated_at: "2020-11-06 17:27:57", nickname: "Kim", provider: nil, uid: nil, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTk5GO2sPjD47vukDnUIpPI0ewHkBbpy2Qc6g&usqp=CAU"}

].each do |record|
	newUser = User.new(record)
	newUser.save!(validate: false)
end

# [
# 	{name: "ChatRoom1", owner_id: User.find_by(email: "bob@bob.bob").id, privacy: "Public"},
# 	{name: "ChatRoom2", owner_id: User.find_by(email: "bob@bob.bob").id, privacy: "Public"},
# 	{name: "ChatRoom3", owner_id: User.find_by(email: "jo@jo.jo").id, privacy: "Public"}

# ].each do |r|
# 	room = Room.new(r)
# 	room.save()
	
# end

# ["Hello 1", "Hello 2"]. each do |content| 
# 	newMessage = RoomMessage.new(message: content)
# 	newMessage.user_id = User.find_by(email: "bob@bob.bob").id
# 	newMessage.room_id = Room.find_by(name: "ChatRoom1").id
# 	newMessage.save()
# end 


# ["Hello 3", "Hello 4"]. each do |content| 
# 	newMessage = RoomMessage.new(message: content)
# 	newMessage.user_id = User.find_by(email: "kim@kim.kim").id
# 	newMessage.room_id = Room.find_by(name: "ChatRoom1").id
# 	newMessage.save()
# end 


# RoomLinkMember.new(room: Room.first, user: User.first)
# User.first.rooms_as_member