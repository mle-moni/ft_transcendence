AppClasses.Routers.RoomRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		this.route("room", "index");
		this.route("room/new", "newRoom");
		this.route("rooms/:room_id", "showRoom");
		this.route("room/edit/:room_id", "editRoom");
		this.route("room/administrate/:room_id", "administrateRoom");

		this.collections.rooms = new AppClasses.Collections.Room();

	}
    
	index() {
		const user = this.models.user;
		this.viewWithRenderParam("room", "Room", user, {
			model: this.collections.rooms,
			user
		});
	}

	newRoom() {
		this.basicView("newRoom", "NewRoom", {model: this.models.user});
	}

	showRoom(room_id) {
		const r_id = parseInt(room_id);
		const user = this.models.user;
		this.viewWithRenderParam("showRoom", "ShowRoom", r_id, {
			model: this.collections.rooms,
			room_id: r_id,
			user
		});
	}

	editRoom(room_id) {
		const r_id = parseInt(room_id);
		this.viewWithRenderParam("editRoom", "EditRoom", r_id, {
			model: this.collections.rooms,
			user: this.models.user,
			room_id: r_id
		});
	}

	administrateRoom(room_id) {
		const r_id = parseInt(room_id);
		this.viewWithRenderParam("administrateRoom", "AdministrateRoom", r_id, {
			model: this.collections.rooms,
			user: this.models.user,
			room_id: r_id
		});
	}
	
}
