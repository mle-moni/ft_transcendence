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
