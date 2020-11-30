AppClasses.Views.Friends = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"keyup #addFriend": "inputChanged",
			"click .clickToAddFriend": "addFriend",
			"click .clickToAcceptFriend": "acceptFriend",
			"click .clickToRejectFriend": "rejectFriend",
			"click .clickToDeleteFriend": "deleteFriend"
		};
		super(opts);
		this.tagName = "div";
		this.template = App.templates["friends/index"];
		this.updateRender(); // render the template only one time, unless model changed
		this.listenTo(this.model, "change", this.updateRender);
		this.listenTo(App.models.last_seen, "change", this.updateOnlineInfos);
		this.listenTo(App.collections.allUsers, "change reset add remove", this.updateRender);
	}
	friendAction(event, url, msgSuccess) {
		const userID = event.target.getElementsByClassName("nodisplay")[0].innerText;
		$("#friendIDField")[0].value = userID;
		App.utils.formAjax(url, "#friendsForm")
		.done(res => {
			App.toast.success(msgSuccess, { duration: 2000, style: App.toastStyle });
			this.model.update(this.model);
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
	}
	deleteFriend(e) {
		this.friendAction(e, "/api/friends/destroy.json", "Friend deleted");
	}
	rejectFriend(e) {
		this.friendAction(e, "/api/friends/reject.json", "Friend request rejected");
	}
	acceptFriend(e) {
		this.friendAction(e, "/api/friends/accept.json", "Friend request accepted");
	}
	addFriend(e) {
		this.friendAction(e, "/api/friends/add.json", "Request sent");
	}
	inputChanged(e) {
		let regexp = new RegExp(_.escape($("#addFriend")[0].value, "gi"));
		const elem = $("#userInputFriends");
		let search = _.filter(App.collections.allUsers.toJSON(), obj => {
			return (regexp.test(obj.nickname.toLowerCase()));
		});
		search.length = 4; // only display the 4 first matches
		elem.html(App.templates["friends/inputFriends"]({friends: search}));
	}
	updateRender() {
		this.$el.html(this.template({
			user: this.model.toJSON(),
			token: $('meta[name="csrf-token"]').attr('content'),
			allUsers: App.collections.allUsers.toJSON()
		}));
		this.updateOnlineInfos()
		return (this);
	}
	updateOnlineInfos() {
		this.$el.find("#onlineInfos").html(App.templates["friends/onlineInfos"]({
			user: App.models.last_seen.toJSON()
		}));
	}
	render() {
		this.model.update(this.model);
		App.collections.allUsers.myFetch();
		this.delegateEvents();
		return (this);
	}
}
