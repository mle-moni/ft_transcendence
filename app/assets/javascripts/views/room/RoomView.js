AppClasses.Views.Room = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit .privateRoomAuthForm": "submitPasswordPrivateRoom",
			"submit .publicRoomJoinForm": "submitJoinPublicRoom",
			"submit .roomQuitForm": "roomQuitForm"
		}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["room/index"];

		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.listenTo(App.collections.rooms, "change reset add remove", this.updateRender);

		this.model.fetch();
		this.rooms = null;
		this.updateRender();

	}

	submitPasswordPrivateRoom(e) {
		e.preventDefault();
		if (e.target.children.length < 4) return (false);
		const roomID = e.target.children[3].value;
		const selectorFormID = "#privateRoomAuthForm-" + roomID;
		App.utils.formAjax("/api/rooms/joinPrivate.json", selectorFormID)
		.done(res => {
			App.toast.success("Good Password", { duration: 2000, style: App.toastStyle });
			// location.hash = `#rooms/` + roomID;
			// location.reload();
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		$(".privateRoomAuthFormField").each(function() {
			$( this ).val("");
		})
		return (false);
	}

	submitJoinPublicRoom(e) {
		e.preventDefault();
		if (e.target.children.length < 2) return (false);
		const roomID = e.target.children[1].value
		// Here publicRoomJoinForm-X must match the view's form ID
		const selectorFormID = "#publicRoomJoinForm-" + roomID
		App.utils.formAjax("/api/rooms/joinPublic.json", selectorFormID)
		.done(res => {
			App.toast.success("Room Joined !", { duration: 1500, style: App.toastStyle });
			// location.hash = `#rooms/` + roomID;
			// location.reload();
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		// In case of some fields have been filed
		$(".privateRoomAuthFormField").each(function() {
			$( this ).val("");
		})
		return (false);
	}

	roomQuitForm(e) {
		e.preventDefault();
		if (e.target.children.length < 2) return (false);
		const roomID = e.target.children[1].value
		const selectorFormID = "#roomQuitForm-" + roomID;
		App.utils.formAjax("/api/rooms/quit.json", selectorFormID)
		.done(res => {
			App.toast.success("You have quit the room", { duration: 1500, style: App.toastStyle });
			location.hash = `#room`;
		}).fail((e) => {App.utils.toastError(e);});
		return (false);
	}
    
	updateRender() {

		const { attributes } = App.models.user;
		var userID = null;
		if (attributes) userID = attributes.id;
		var tabID = [];
		var roomJoinedAsOwner = [];
		var roomJoinedAsRoomAdmin = [];
		var roomJoinedAsMember = [];
		var data = this.model.toJSON();

		// Delete room from which current user is banned
		var currentUserBannedFromRoomsIDs = []; 
		if (attributes) {
			data.forEach(room => {
				if (room.bans.length > 0) {
					room.bans.forEach(ban => {
						if (ban.user_id == attributes.id) currentUserBannedFromRoomsIDs.push(ban.room_id);
					})
				}
			});
		}
		data = data.filter(room => !currentUserBannedFromRoomsIDs.includes(room.id));

		// Filter administred rooms
		data.forEach(room => {
			if (room.admins.length > 0) {
				room.admins.forEach(admin => {
					if (admin.id === userID) {
						tabID.push(room.id);
						roomJoinedAsRoomAdmin.push(room);
					}
				}
			)}
		});
		// Filter members rooms
		data.forEach(room => {
			if (room.members.length > 0) {
				room.members.forEach(member => {
					if (member.id === userID) {
						tabID.push(room.id);
						roomJoinedAsMember.push(room);
					}
				}
			)}
		});
		// Filter owned rooms
		data.forEach(room => {
			if (room.owner_id === userID) {
				tabID.push(room.id);
				roomJoinedAsOwner.push(room);
			}
		})

		// Delete duplicate between owned and administrate rooms
		tabID = [...new Set(tabID)];
		roomJoinedAsRoomAdmin = roomJoinedAsRoomAdmin.filter(roomAdministred => {
			return roomAdministred.owner_id != userID;
		})
		// The remain rooms are not joined, we filter them
		var notJoinedRooms = data.filter(function(room) {
			return !tabID.includes(room.id);
		});


		
		this.$el.html(this.template({
			roomJoinedAsOwner: roomJoinedAsOwner,
			roomJoinedAsRoomAdmin: roomJoinedAsRoomAdmin,
			roomJoinedAsMember: roomJoinedAsMember,
			notJoinedRooms: notJoinedRooms,
			user: attributes,
			privateForm: {
				method: "POST",
				titleText: "Join private room",
				submitText: "Join the room",
				formID: "privateRoomAuthForm",
				token: $('meta[name="csrf-token"]').attr('content'),
			},
			publicForm: {
				method: "POST",
				submitText: "Join the room",
				token: $('meta[name="csrf-token"]').attr('content'),
			},
			quitForm: {
				method: "POST",
				submitText: "Quit",
				token: $('meta[name="csrf-token"]').attr('content'),
				url: "/api/rooms/quit.json"
			},
			administrateStatusOwner: btoa("status=owner"),
			administrateStatusAdmin: btoa("status=admin"),
			administrateStatusSuperAdmin: btoa("status=superAdmin"),
			superAdmin: (attributes.admin == true)

		}));
		return (this);
    }
    
	render() {
		this.model.fetch();
		this.delegateEvents();
		return (this);
    }
    
}
