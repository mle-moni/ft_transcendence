AppClasses.Views.AdministrateRoom = class extends Backbone.View {
	constructor(opts) {
		opts.events = {}
        super(opts);
        this.room_id = opts.room_id;
		this.tagName = "div";
		this.template = App.templates["room/administrate"];
		
		this.listenTo(this.model, "change add", this.updateRender);
		this.listenTo(App.collections.allUsers, "add remove", this.updateRender);

		this.model.fetch();
		this.rooms = null;

		this.statusAdministrate = null;
		var status = window.location.href.substring(window.location.href.lastIndexOf('?') + 1);
		if (!_.isEmpty(status)) {
			status = atob(status);
			status = status.substring(status.lastIndexOf('=') + 1);
			if (status != "admin" && status != "owner") {
				App.utils.toastError("Nice try");
				location.hash = `#room`;
				return (false);
			}
		}
		this.statusAdministrate = status;
		// console.log(this.statusAdministrate);
		this.updateRender();

	}
	
	updateRender() {

		console.log(this.room_id);
		
		this.$el.html(this.template({
			status: this.statusAdministrate
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
