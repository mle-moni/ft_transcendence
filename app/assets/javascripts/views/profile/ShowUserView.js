AppClasses.Views.ShowUser = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"click .sendGuildInvite": "sendInvite",
			"click .acceptGuildInvite": "acceptInvite",
			"click .rejectGuildInvite": "rejectInvite",
			"click .addFriend": "addFriend",
		}
		super(opts);
		this.user_id = opts.user_id;
		this.tagName = "div";
		this.guilds = App.collections.guilds;
		this.template = App.templates["profile/showProfile"];
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.listenTo(this.guilds, "change reset add remove", this.updateRender);
		this.model.myFetch();
		this.guilds.fetch();
		this.updateRender();
	}
	sendInvite(e) {
		const usrID = e.target.getElementsByClassName("nodisplay")[0].innerText;
		$("#userIDField")[0].value = usrID;
		this.formAction("#sendInviteForm", "/api/guild/invite_user.json")
	}
	acceptInvite() {
		this.formAction("#acceptRejectInviteForm", "/api/guild/accept_invite.json")
	}
	rejectInvite() {
		this.formAction("#acceptRejectInviteForm", "/api/guild/refuse_invite.json")
	}
	addFriend(e) {
		const usrID = e.target.getElementsByClassName("nodisplay")[0].innerText;
		$("#addFriendIDField")[0].value = usrID;
		this.formAction("#addFriendsForm", "/api/friends/add.json")
	}
	formAction(formQueryStr, url) {
		App.utils.formAjax(url, formQueryStr)
		.done(res => {
			App.toast.success(res.msg, { duration: 2000, style: App.toastStyle });
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
	}
	updateRender() {
		const user = this.model.findWhere({id: this.user_id});
		const userJSON = user ? user.toJSON() : null;
		let guild = null;
		let guildJSON = null;
		let matches = [];
		if (userJSON) {
			userJSON.you = false;
			if (App.models.user.toJSON().id == userJSON.id) {
				userJSON.you = true;
			}
			if (userJSON.guild_validated) {
				guild = this.guilds.findWhere({id: userJSON.guild_id});
			}
			if (guild) {
				guildJSON = guild.toJSON();
			}
			matches = userJSON.matches.map(match => {
				match.date = new Date(match.created_at);
				match.rawDate = match.date.valueOf();
				match.dateStr = match.date.toLocaleTimeString();
				match.won = match.winner_id == userJSON.id;
				match.enemy = this.model.findWhere({id: match.won ? match.loser_id : match.winner_id});
				if (match.enemy) {
					match.enemy = match.enemy.toJSON();
				}
				match.you = userJSON.nickname;
				return (match);
			});
			matches = matches.sort((a, b) => {
				return (b.rawDate - a.rawDate);
			});
		}
		if (userJSON && userJSON.g_invitation) {
			const rawInvUser = App.collections.allUsers.findWhere({id: userJSON.g_invitation});
			userJSON.invUser = rawInvUser ? rawInvUser.toJSON() : null;
			if (userJSON.invUser) {
				const warG = App.collections.guilds.findWhere({id: userJSON.invUser.guild_id});
				userJSON.invUserGuild = warG ? warG.toJSON() : null;
			}
		}
		const youraw = App.models.user;
		const you = youraw.toJSON();
		const yourGuild = App.collections.guilds.findWhere({id: you.guild_id});
		you.canInvite = you.guild_validated && (youraw.isOwner(yourGuild) || youraw.isOfficer(yourGuild));
		this.$el.html(this.template({
			user: userJSON,
			guild: guildJSON,
			matches,
			you,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
	}
	render(user_id) {
		this.delegateEvents();
		if (this.user_id != user_id) {
			this.user_id = user_id;
			this.updateRender();
		}
		this.guilds.fetch();
		this.model.myFetch();
		return (this);
	}
}
