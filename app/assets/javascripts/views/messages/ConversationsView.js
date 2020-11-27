AppClasses.Views.Conversations = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #sendRoomMessageForm": "submit",
			"submit .createDM": "createDM"
		}
		super(opts);
		this.user = App.models.user;
		this.chatID = opts.chatID;
		this.model = opts.model;
        this.allUsers = App.collections.allUsers;
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.allUsers.myFetch();
		this.model.fetch();
		this.tagName = "div";
        this.template = App.templates["messages/show"];
		this.updateRender();

	}

    createDM(e) {
		e.preventDefault();
		var selectorFormID = "";
		if (e.currentTarget) selectorFormID = "#" + e.currentTarget.id;
		App.utils.formAjax("/api/direct_chats.json", selectorFormID)
		.done(res => {
			App.toast.success("Room created !", { duration: 1500, style: App.toastStyle });
			location.hash = "#messages/" + res.id;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
    }
	
	submit(e)  {
		e.preventDefault();
		if (!e.currentTarget.message || (e.currentTarget.message && e.currentTarget.message.value == ""))
			return ;
		App.utils.formAjax("/api/chat_messages.json", "#sendRoomMessageForm")
		.done(res => {
			App.toast.success("Message sent", { duration: 1000, style: App.toastStyle });
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

    updateRender() {

		var currentDMRoom = this.model ? this.model.toJSON() : null;
		if (currentDMRoom) {
			currentDMRoom = _.filter(currentDMRoom, m => {
				return m.id === this.chatID;
			})[0] || null;
		}

		var currentUser = null;
		if (this.user) currentUser = this.user.attributes;
	
		var otherUser = null;
		var usersNonBlocked = null;
		if (currentDMRoom)
		{
			var directMessages = currentDMRoom.direct_messages;
			directMessages.reverse();
			var otherUserID = (this.user.id === currentDMRoom.user1_id) ? currentDMRoom.user2_id : currentDMRoom.user1_id;
			var allUsers = App.collections.allUsers.models;
			for (var count = 0; count < allUsers.length; count++)
			{
				if (allUsers[count].attributes.id == otherUserID)
					otherUser = allUsers[count].attributes;
				else if (allUsers[count].attributes.id == currentUser.id)
					currentUser = allUsers[count].attributes;
			}
			// Check if 
			if (currentUser) {
				// Assert that currentUser is one of the 2 user in the current DM room
				if (currentDMRoom.user1_id != currentUser.id && currentDMRoom.user2_id != currentUser.id) {
					location.hash = '#messages';
					return (false);
				}
				// Assert currentUser have not been blocked by the other user
				if (otherUser && otherUser.blocked) {
					otherUser.blocked.forEach(block => {
						if (block.toward_id == currentUser.id) {
							location.hash = '#messages';
							return (false);
						}
					});
				}
				var blocked = currentUser.blocked || null;
				if (blocked) {
					var blockedTabIDs = [];
					blocked.forEach(block => {
						blockedTabIDs.push(block.toward_id);
					});
					usersNonBlocked = this.allUsers.models.filter(user => {
						return (user.id != currentUser.id && !blockedTabIDs.includes(user.id))
					});
				}
			}
		}
		this.$el.html(this.template({
			dmRooms: this.model,
			allUsers: usersNonBlocked ? usersNonBlocked : this.allUsers.models,
			userID: this.user.id,
			//ADD
			chatID: this.chatID,
			currentUser: currentUser,
			otherUser: otherUser,
			currentDMRoom: currentDMRoom,
			directMessages: directMessages,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		this.delegateEvents();
		return (this);
    }
    
	render(chatID) {
		if (this.chatID != chatID) {
			this.chatID = chatID;
			this.updateRender();
		}
		this.model.fetch();
		this.delegateEvents();
		return (this);
    }

}
    
