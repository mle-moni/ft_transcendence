AppClasses.Views.ShowGuild = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #quitGuildForm": "quit",
			"submit #joinGuildForm": "join",
			"click .acceptRequestGuild": "accept"
		}
		super(opts);
		this.guild_id = opts.guild_id;
		this.tagName = "div";
		this.template = App.templates["guilds/show"];
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.fetch();
		this.guild = null;
		this.updateRender();
	}
	accept(e) {
		e.preventDefault();
		const usrID = e.target.getElementsByClassName("nodisplay")[0].innerText;
		$("#acceptRequestIDField").attr("value", usrID);
		App.utils.formAjax("/api/guild/accept.json", "#acceptRequestForm")
		.done(res => {
			App.toast.success("Request accepted !", { duration: 2000, style: App.toastStyle });
			this.model.fetch();
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}
	quit(e) {
		e.preventDefault();
		App.utils.formAjax("/api/guild/quit.json", "#quitGuildForm")
		.done(res => {
			App.toast.success("You quitted your guild !", { duration: 2000, style: App.toastStyle });
			App.models.user.set("guild_id", null);
			App.models.user.set("guild_owner", false);
			App.models.user.set("guild_officer", false);
			App.models.user.set("guild_validated", false);
			location.hash = `#guilds`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}
	join(e) {
		e.preventDefault();
		App.utils.formAjax("/api/guild/join.json", "#joinGuildForm")
		.done(res => {
			App.toast.success("Request sent!", { duration: 2000, style: App.toastStyle });
			App.models.user.set("guild_id", this.guild_id);
			App.models.user.set("guild_owner", false);
			App.models.user.set("guild_officer", false);
			App.models.user.set("guild_validated", false);
			location.hash = `#guilds`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}
	getWars(guildJSON) {
		let wars = [];
		if (guildJSON) {
			wars = guildJSON.wars.map(war => {
				const warNotEnded = guildJSON.active_war && war.id === guildJSON.active_war.id;
				const enemyID = war.guild1_id == guildJSON.id ? war.guild2_id : war.guild1_id;
				const enemyGuild = this.model.findWhere({id: enemyID});
				const enemyJSON = enemyGuild ? enemyGuild.toJSON() : null;
				war.pending = warNotEnded && war.validated == war.guild1_id + war.guild2_id;
				war.planning = warNotEnded && !war.pending;
				war.won = war.winner == guildJSON.id;
				war.you = guildJSON.name;
				war.enemy = enemyJSON ? {name: enemyJSON.name, id: enemyID} : null;
				if (guildJSON.active_war && guildJSON.active_war.id === war.id) {
					guildJSON.active_war.pending = war.pending;
					guildJSON.active_war.planning = war.planning;
				}
				war.date = new Date(war.created_at);
				war.rawDate = war.date.valueOf();
				return war;
			});
		}
		return (wars);
	}
	updateRender() {
		this.guild = this.model.findWhere({id: this.guild_id});
		const guildJSON = this.guild ? this.guild.toJSON() : null;
		const user = App.models.user;
		let wars = this.getWars(guildJSON);
		wars = wars.sort((a, b) => {
			return (b.rawDate - a.rawDate);
		});
		this.$el.html(this.template({
			guild: guildJSON,
			owner: user.isOwner(this.guild),
			officerRights: user.isOwner(this.guild) || user.isOfficer(this.guild),
			isInGuild: user.isInGuild(this.guild),
			wars,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
	}
	render(guild_id) {
		if (this.guild_id != guild_id) {
			this.guild_id = guild_id;
			this.updateRender();
		}
		this.model.fetch();
		this.delegateEvents();
		return (this);
	}
}
