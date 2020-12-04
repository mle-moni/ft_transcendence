AppClasses.Views.ShowRoom = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #sendRoomMessageForm": "submit",
			"submit #sendDualRequest": "sendDualRequest",
			"submit #AcceptDualRequest": "AcceptDualRequest",
		}
        super(opts);
		this.room_id = opts.room_id;
		this.user = opts.user;
		this.tagName = "div";
		this.template = App.templates["room/show"];
		this.listenTo(this.model, "change add", this.updateRender);
		this.model.fetch();
		this.rooms = null;
		// For fetching blocked tables linked to user model
		App.models.user.update(App.models.user);
		this.updateRender();
	}
	
	submit(e) {
		e.preventDefault();
		if (!this.verif_infos(e)) return (false);
		if (!e.currentTarget.message || (e.currentTarget.message && e.currentTarget.message.value == ""))
			return ;
		App.utils.formAjax("/api/room_messages.json", "#sendRoomMessageForm")
		.done(res => {
			App.toast.success("Message sent", { duration: 1000, style: App.toastStyle });
			this.model.fetch();
			location.hash = `#rooms/` + this.room_id;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

	verif_infos(e)
	{
		if (e.currentTarget && e.currentTarget[1])
		{
			if (e.currentTarget[1].value != this.user.id)
			{
				App.utils.toastError(e);
				return (false);
			}
		}
		if (e.currentTarget && e.currentTarget[2])
		{
			if (e.currentTarget[2].value != this.room_id)
			{
				App.utils.toastError(e);
				return (false);
			}
		}
		return (true);
	}

	AcceptDualRequest(e)
	{
		e.preventDefault();
		App.utils.formAjax("/api/rooms/acceptDualRequest.json", "#AcceptDualRequest")
		.done(res => {
			App.toast.success("Dual request accepted !", { duration: 1500, style: App.toastStyle });
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

	sendDualRequest(e)
	{
		e.preventDefault();
		console.log("SEND DUAL REQUEST ROOM");
		App.utils.formAjax("/api/rooms/createDualRequest.json", "#sendDualRequest")
		.done(res => {
			App.toast.success("Dual request sent !", { duration: 1500, style: App.toastStyle });
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}
    
	updateRender() {
		const { attributes } = App.models.user;
		this.rooms = this.model;
		var currentRoom = this.rooms ? this.rooms.toJSON() : null;
		currentRoom = _.filter(currentRoom, m => {
			return m.id === this.room_id;
		})[0] || null;

		// Uri Protection : assert current user is member, or admin owner superAdmin
		if (attributes && currentRoom && !App.utils.assertRoomCurrentUserIsMember(attributes, currentRoom)) {
			location.hash = '#room';
			return (false);
		}

		// Don't display blocked users messages to currentUser
		var tabBlockedUsersIDs = [];
		if (attributes.blocked) {
			attributes.blocked.forEach(block => {
				tabBlockedUsersIDs.push(block.toward_id);
			})
		}

		if (currentRoom) {
			var roomMessages = currentRoom.room_messages;

			// Filter bans
			var members = [...currentRoom.members, ...currentRoom.admins];	
			currentRoom.bans.forEach(roomBanRecord => {
				if (roomBanRecord.user_id == attributes.id) {
					location.hash = '#room';
					return (false);
				}
			});

			// Filter block user message
			roomMessages = roomMessages.filter(message => {
				return !tabBlockedUsersIDs.includes(message.user_id);
			})


			// This snippet have to handle the case when an user has been kick so that he doesn't stay on the chat page
			var idTab = [];
			currentRoom.members.forEach(user => {
				idTab.push(user.id);
			})
			currentRoom.admins.forEach(user => {
				idTab.push(user.id);
			})
			if (attributes && !attributes.admin && !idTab.includes(attributes.id)) {
				location.hash = '#room';
				return false;
			}

		}
		this.$el.html(this.template({
			currentRoom: currentRoom,
			roomMessages: roomMessages || null,
			currentUser: attributes,
			members: members || null,
			roomID: this.room_id,
			token: $('meta[name="csrf-token"]').attr('content'),
			// Form data for message creation
			messageCreateForm: {
				method: "POST",
				titleText: "Send a message",
				submitText: "Send",
				formID: "sendRoomMessageForm",
			}
		
		}));
		this.delegateEvents();
		return (this);
    }
    
	render(room_id) {
		if (this.room_id != room_id) {
			this.room_id = room_id;
			this.updateRender();
		}
		this.model.fetch();
		this.delegateEvents();
		return (this);
    }
    
}
