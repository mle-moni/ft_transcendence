AppClasses.Views.AdministrateRoom = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			// TODO : convertir un 1 fonction et if/else sur le nom d'event
			// Mute
			"submit .roomMuteMemberForm": "roomMuteBanHandler",
			"submit .roomUnMuteMemberForm": "roomMuteBanHandler",
			// Ban
			"submit .roomBanMemberForm": "roomMuteBanHandler",
			"submit .roomUnBanMemberForm": "roomMuteBanHandler"

		}

        super(opts);
        this.room_id = opts.room_id;
		this.tagName = "div";
		this.template = App.templates["room/administrate"];
		
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.listenTo(App.collections.rooms, "change reset add remove", this.updateRender);
		// this.listenTo(App.collections.allUsers, "change reset add remove", this.updateRender);

		this.model.fetch();
		this.rooms = null;
		this.superAdmin = false;

		/* Here we decode base64 encoded URL to retrieve the status (Owner or Admin) passed through URL
		(there might be easier way to pass that info ...) */

		this.encodedStatusAdministrate = null;
		this.statusAdministrate = null;
		var status = window.location.href.substring(window.location.href.lastIndexOf('?') + 1);
		if (!_.isEmpty(status)) {
			this.encodedStatusAdministrate = status;
			status = atob(status);
			status = status.substring(status.lastIndexOf('=') + 1);
			if (status != "admin" && status != "owner") { // admin ou Admin ?
				App.utils.toastError("Nice try");
				location.hash = `#room`;
				return (false);
			}
		} else {
			App.utils.toastError("Nice try");
			location.hash = `#room`;
			return (false);
		}
		this.statusAdministrate = status;
		this.updateRender();
	}

	roomMuteBanHandler(e) {

		e.preventDefault();
		const roomID = e.target.children[1].value
		const targetMemberID = e.target.children[2].value
		
		var urlAPI = null;
		var selectorFormID = null;

		switch (e.target.className) {
			case "roomMuteMemberForm":
				urlAPI = "/api/rooms/mute.json"
				selectorFormID =  "#roomMuteMemberForm-" + targetMemberID
				break;
			case "roomUnMuteMemberForm":
				urlAPI = "/api/rooms/unmute.json"
				selectorFormID =  "#roomUnMuteMemberForm-" + targetMemberID
				break;
			case "roomBanMemberForm":
				urlAPI = "/api/rooms/ban.json"
				selectorFormID =  "#roomBanMemberForm-" + targetMemberID
				break;
			case "roomUnBanMemberForm":
				urlAPI = "/api/rooms/unban.json"
				selectorFormID =  "#roomUnBanMemberForm-" + targetMemberID
				break;
			default:
				return (false);
				break;
		}
		App.utils.formAjax(urlAPI, selectorFormID)
		.done(res => {
			App.toast.success("Done", { duration: 2000, style: App.toastStyle });
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

		var members = null;
		var admins = null;
		var mutesTabIDs = []
		var bansTabIDs = [];

		if (currentRoom) {
			members		= currentRoom.members;
			admins		= currentRoom.admins;
			// Here, record is the table RoomMute / RoomBan, not users
			currentRoom.mutes.forEach(record => {
				mutesTabIDs.push(record.user_id);
			});
			currentRoom.bans.forEach(record => {
				bansTabIDs.push(record.user_id);
			});
		}

		if (attributes.admin == true)
			this.statusAdministrate = "superAdmin";
		// console.log(currentRoom);
		// console.log(mutesTabIDs);
		// console.log(bansTabIDs);
	
		this.$el.html(this.template({
			token: $('meta[name="csrf-token"]').attr('content'),
			room: currentRoom,
			currentUser: attributes,
			status: this.statusAdministrate,
			superAdmin: this.superAdmin, // TODO
			members: members,
			admins: admins,
			currentTime: App.utils.getHoursMinutes(),
			mutesTabIDs: mutesTabIDs,
			bansTabIDs: bansTabIDs,
			formMute: {
				method: "POST",
				url: "/api/rooms/mute.json"
			},
			formUnmute: {
				method: "POST",
				url: "/api/rooms/unmute.json"
			},
			formBan: {
				method: "POST",
				url: "/api/rooms/ban.json"
			},
			formUnBan: {
				method: "POST",
				url: "/api/rooms/unban.json"
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
