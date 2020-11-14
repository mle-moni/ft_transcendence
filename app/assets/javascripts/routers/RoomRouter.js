AppClasses.Routers.RoomRouter = class extends AppClasses.Routers.AbstractRouter {
	constructor(options) {
		super(options);
		this.route("room", "index");
		this.route("room/new", "newRoom");

		// Get ALL Rooms
		this.models.user = new AppClasses.Models.User(App.data.user);

	}
    
	index() {
		this.basicView("room", "Room", {model: this.models.user});
	}

	newRoom() {
		this.basicView("newRoom", "NewRoom", {model: this.models.user});
	}

	
}
