AppClasses.Views.Room = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit .privateRoomAuthForm": "submitPasswordPrivateRoom",
			"submit .publicRoomJoinForm": "submitJoinPublicRoom"

		}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["room/index"];
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.fetch();
		this.rooms = null;
		this.updateRender();

	}

	// LOGS Usefull
	// console.log(e.target.children[2].value);
	// var formElements=document.getElementById("privateRoomAuthForm").elements;    
	// var postData={};
	// for (var i=0; i<formElements.length; i++)
	// 	if (formElements[i].type!="submit")//we dont want to include the submit-buttom
	// 		postData[formElements[i].name]=formElements[i].value;
	// console.log(postData);

	submitPasswordPrivateRoom(e) {
		e.preventDefault();
		const roomID = e.target.children[4].value
		const selectorFormID = "#privateRoomAuthForm-" + roomID
		App.utils.formAjax("/api/rooms/joinPrivate.json", selectorFormID)
		.done(res => {
			App.toast.success("Good Password", { duration: 2000, style: App.toastStyle });
			location.hash = `#rooms/` + res.roomID;
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
		console.log("submitJoinPublicRoom()");
		const roomID = e.target.children[1].value
		// Here publicRoomJoinForm-X must match the view's form ID
		const selectorFormID = "#publicRoomJoinForm-" + roomID
		App.utils.formAjax("/api/rooms/joinPublic.json", selectorFormID)
		.done(res => {
			App.toast.success("Room Joined !", { duration: 1500, style: App.toastStyle });
			location.hash = `#rooms/` + res.roomID;
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
    
	updateRender() {

		const { attributes } = App.models.user;
		const userID = attributes.id;
		
		// console.log(attributes);
		// console.log(this.model.toJSON());

		// roomsMember:  this.model.toJSON(),
		// roomsAdmins: this.model.toJSON(),
		
		var tabID = [];
		var roomJoinedAsOwner = {};
		var roomJoinedAsRoomAdmin = {};
		var roomJoinedAsMember = {};
		const data = this.model.toJSON();

		data.forEach(room => {
			if (room.admins.length > 0) {
				room.admins.forEach(admin => {
					if (admin.id === userID) {
						tabID.push(room.id);
						Object.assign(roomJoinedAsRoomAdmin, room);
					}
				}
			)}
		});
		data.forEach(room => {
			if (room.members.length > 0) {
				room.members.forEach(member => {
					if (member.id === userID) {
						tabID.push(room.id);
						Object.assign(roomJoinedAsMember, room);
					}
				}
			)}
		});
		data.forEach(room => {
			if (room.owner_id === userID) {
				tabID.push(room.id);
				Object.assign(roomJoinedAsOwner, room);
			}
		})

		tabID = [...new Set(tabID)];
		// console.log(data);
		// console.log(tabID);
		// console.log(notJoinedRooms);
		var notJoinedRooms = data.filter(function(room) {
			return !tabID.includes(room.id);
		});

		if (!_.isEmpty(roomJoinedAsOwner))
			roomJoinedAsOwner = [roomJoinedAsOwner];
		if (!_.isEmpty(roomJoinedAsRoomAdmin))
			roomJoinedAsRoomAdmin = [roomJoinedAsRoomAdmin];
		if (!_.isEmpty(roomJoinedAsMember))
			roomJoinedAsMember = [roomJoinedAsMember];

		this.$el.html(this.template({
			roomJoinedAsOwner: roomJoinedAsOwner,
			roomJoinedAsRoomAdmin: roomJoinedAsRoomAdmin,
			roomJoinedAsMember: roomJoinedAsMember,
			notJoinedRooms: notJoinedRooms,

			user: attributes,
			// Join Private Room Form
			privateForm: {
				method: "POST",
				titleText: "Join private room",
				submitText: "Open",
				formID: "privateRoomAuthForm",
				token: $('meta[name="csrf-token"]').attr('content'),
			},
			// Join Public Room Form
			publicForm: {
				method: "POST",
				submitText: "Join the room",
				token: $('meta[name="csrf-token"]').attr('content'),
			}


		}));
		return (this);
    }
    
	render() {
		this.model.fetch();
		this.delegateEvents();
		return (this);
    }
    
}
