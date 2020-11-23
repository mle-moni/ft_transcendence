AppClasses.Views.Admin = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"click .clickToBanUser": "banUser",
			"click .clickToUnbanUser": "unbanUser",
			"click .clickToPromoteUser": "promoteUser",
			"click .clickToDemoteUser": "demoteUser"
		};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["admin/index"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change", this.updateRender);
		this.listenTo(App.collections.allUsers, "change reset add remove", this.updateRender);
	}
	adminAction(event, url, msgSuccess) {
		const userID = event.target.getElementsByClassName("nodisplay")[0].innerText;
		$("#userIDField")[0].value = userID;
		App.utils.formAjax(url, "#adminForm")
		.done(res => {
			App.toast.success(msgSuccess, { duration: 2000, style: App.toastStyle });
			App.collections.allUsers.myFetch();
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
	}
	banUser(e) {
		this.adminAction(e, "/api/admin/ban.json", "User banned");
	}
	unbanUser(e) {
		this.adminAction(e, "/api/admin/unban.json", "User unbanned");
	}
	promoteUser(e) {
		this.adminAction(e, "/api/admin/promote.json", "User promoted");
	}
	demoteUser(e) {
		this.adminAction(e, "/api/admin/demote.json", "User demoted");
	}
	updateRender(changes) {
		if (changes && App.utils.onlyThoseAttrsChanged(changes.changed, ["last_seen"])) {
			return (this);
		}
		this.$el.html(this.template({
			user: this.model.toJSON(),
			token: $('meta[name="csrf-token"]').attr('content'),
			allUsers: App.collections.allUsers.toJSON()
		}));
		return (this);
	}
	render() {
		this.model.update(this.model);
		App.collections.allUsers.myFetch();
		this.delegateEvents();
		return (this);
	}
}
