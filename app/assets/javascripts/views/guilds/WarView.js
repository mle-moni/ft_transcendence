AppClasses.Views.War = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"keyup #searchGuild": "inputChanged",
			"click .clickToCreateWar": "createWar",
			"click #cancelActiveWar": "cancelWar",
			"click #validateActiveWar": "validateWar"
		}
		super(opts);
		this.guild_id = App.models.user.get("guild_id");
		this.tagName = "div";
		this.guild = null;
		this.model.fetch().then(() => {
			this.guild = this.model.findWhere({id: this.guild_id});
			this.listenTo(this.guild, "change", this.updateRender);
			this.updateRender();
		});
	}
	inputChanged(e) {
		let regexp = new RegExp(_.escape($("#searchGuild")[0].value, "gi"));
		const elem = $("#userInputGuilds");
		let search = _.filter(App.collections.guilds.toJSON(), obj => {
			return (regexp.test(obj.name.toLowerCase()));
		});
		search.length = 4; // only display the 4 first matches
		elem.html(App.templates["guilds/warInputGuilds"]({guilds: search}));
	}

	createWar(e) {
		const guildID = e.target.getElementsByClassName("nodisplay")[0].innerText;
		$("#guildIDField")[0].value = guildID;
		this.formAction("#createWarForm", "/api/wars/create.json")
	}
	cancelWar() {
		this.formAction("#deleteWarForm", "/api/wars/delete.json")
	}
	validateWar() {
		this.formAction("#validateWarForm", "/api/wars/validate.json")
	}
	formAction(formQueryStr, url) {
		App.utils.formAjax(url, formQueryStr)
		.done(res => {
			App.toast.success(res.msg, { duration: 2000, style: App.toastStyle });
			this.model.fetch();
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
	}
	updateRender() {
		const guildJSON = this.guild ? this.guild.toJSON() : null;
		const user = App.models.user;
		if (!guildJSON) {
			this.$el.html("You need to have a guild in order to access this page")
			return (this);
		}
		if (!guildJSON.active_war) {
			this.$el.html(App.templates["guilds/CreateWar"]({
				guild: guildJSON,
				user,
				token: $('meta[name="csrf-token"]').attr('content')
			}));
		} else {
			this.$el.html(App.templates["guilds/EditWar"]({
				guild: guildJSON,
				war: guildJSON.active_war,
				user,
				token: $('meta[name="csrf-token"]').attr('content')
			}));
		}
		return (this);
	}
	render() {
		this.updateRender();
		this.model.fetch();
		this.delegateEvents();
		return (this);
	}
}
