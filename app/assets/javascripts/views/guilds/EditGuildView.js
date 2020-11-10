AppClasses.Views.EditGuild = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #editGuildForm": "submit",
			"click #viewDelForm": "viewDelForm",
			"submit #guildDeleteForm": "delete"
		}
		super(opts);
		this.guild_id = opts.guild_id;
		this.tagName = "div";
		this.template = App.templates["guilds/form"];
		this.model.fetch().done(() => {
			this.updateRender();
		});
	}
	viewDelForm() {
		$("#guildDeleteForm").show()
	}
	delete(e) {
		e.preventDefault();
		const guild = this.model.findWhere({id: this.guild_id});
		if (!guild) {
			App.toast.message("This guild does not exist", { duration: 2000, style: App.toastStyle });
			return ;
		}
		if (guild.get("name") != $("#confirmGuildName")[0].value) {
			App.toast.message("Guilds names don't match", { duration: 2000, style: App.toastStyle });
			return ;
		}
		App.utils.formAjax(`/api/guilds/${this.guild_id}.json`, "#guildDeleteForm")
		.done(res => {
			App.toast.success("Guild successfully deleted", { duration: 2000, style: App.toastStyle });
			App.models.user.set("guild_id", null);
			location.hash = `#guilds`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}
	submit(e) {
		e.preventDefault();
		const guildAttributes = {
			name: $("#guildName")[0].value,
			anagram: $("#guildAnagram")[0].value
		};
		App.utils.formAjax(`/api/guilds/${this.guild_id}.json`, "#editGuildForm")
		.done(res => {
			App.toast.success("Guild successfully updated !", { duration: 2000, style: App.toastStyle });
			location.hash = `#guilds/${this.guild_id}`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}
	updateRender() {
		const guild = this.model.findWhere({id: this.guild_id});
		const guildJSON = guild ? guild.toJSON() : {};
		this.$el.html(this.template({
			guild: guildJSON,
			method: "PATCH",
			titleText: "Edit guild infos",
			submitText: "Edit guild",
			formID: "editGuildForm",
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		this.delegateEvents();
		return (this);
	}
	render() {
		this.updateRender();
		return (this);
	}
}
