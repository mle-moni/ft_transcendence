AppClasses.Views.ShowRoom = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #sendRoomMessageForm": "submit",
		}
        super(opts);
        this.room_id = opts.room_id;
		this.tagName = "div";
		this.template = App.templates["room/show"];
		this.listenTo(this.model, "change add", this.updateRender);
		this.listenTo(App.collections.allUsers, "add remove", this.updateRender);
		this.model.fetch();
		this.rooms = null;
		this.updateRender();
	}
	
	submit(e) {
		e.preventDefault();
		if (e.currentTarget.message.value == "") {
			// App.toast.message("You cannot send empty message", { duration: 2000, style: App.toastStyle });
			return ;
		}
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
    
	updateRender() {
		const { attributes } = App.models.user;
		this.rooms = this.model;
		var currentRoom = this.rooms ? this.rooms.toJSON() : null;
		currentRoom = _.filter(currentRoom, m => {
			return m.id === this.room_id;
		})[0] || null;

		if (currentRoom && !App.utils.assertRoomCurrentUserIsMember(attributes, currentRoom) && !App.utils.assertRoomCurrentUserIsAdminOrOwnerOrSuperAdmin(attributes, currentRoom) ) {
			location.hash = '#room';
			return (false);
		}

		if (currentRoom) {
			var roomMessages = currentRoom.room_messages;
			roomMessages.reverse();
			var members = [...currentRoom.members, ...currentRoom.admins];	
			currentRoom.bans.forEach(roomBanRecord => {
				if (roomBanRecord.user_id == attributes.id) {
					location.hash = '#room';
					return (false);
				}
			});

			// This snippet have to handle the case when an user has been kick so that he doesn't stay on the chat page
			var idTab = [];
			currentRoom.members.forEach(user => {
				idTab.push(user.id);
			})
			currentRoom.admins.forEach(user => {
				idTab.push(user.id);
			})
			if (!idTab.includes(attributes.id)) {
				location.hash = '#room';
			}

		}
		this.$el.html(this.template({
			currentRoom: currentRoom,
			roomMessages: roomMessages || null,
			currentUser: attributes,
			members: members || null,
			// Form data for message creation
			messageCreateForm: {
				method: "POST",
				titleText: "Send a message",
				submitText: "Send",
				formID: "sendRoomMessageForm",
				token: $('meta[name="csrf-token"]').attr('content')
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
