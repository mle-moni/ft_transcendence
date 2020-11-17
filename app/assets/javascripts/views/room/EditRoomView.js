AppClasses.Views.EditRoom = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #editRoomForm": "submit",
			"click #displayDeleteForm": "displayDeleteForm",
			"submit #deleteRoomForm": "delete"
		}
		super(opts);

		this.room_id = opts.room_id;
		this.user = opts.user;
		this.tagName = "div";
		this.template = App.templates["room/edit"];

		this.updateRender();
		this.listenTo(this.model, "change reset add remove", this.updateRender);
		this.model.fetch();

	}

	displayDeleteForm() {
		$("#deleteRoomForm").show()
	}
	
	submit(e) {
		e.preventDefault();
		App.utils.formAjax(`/api/rooms/${this.room_id}.json`, "#editRoomForm")
		.done(res => {
			App.toast.success("Room successfully created !", { duration: 2000, style: App.toastStyle });
			location.hash = `#room`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

	delete(e) {
		e.preventDefault();
		const room = this.model.findWhere({id: this.room_id});

		// if (this.user.id != room.owner_id) {
		// 	App.toast.message("Your are not the owner of the room", { duration: 2000, style: App.toastStyle });
		// 	return ;
		// }

		if (room.get("name") != $("#confirmRoomName")[0].value) {
			App.toast.message("Rooms names don't match", { duration: 2000, style: App.toastStyle });
			return ;
		}
		App.utils.formAjax(`/api/rooms/${this.room_id}.json`, "#deleteRoomForm")
		.done(res => {
			App.toast.success("Room successfully deleted", { duration: 2000, style: App.toastStyle });
			location.hash = `#room`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
	}

	updateRender() {
        const u = App.models.user;

		/* Give Data to the room form template */
		this.$el.html(this.template({ 
			user: this.user,
			titleText: "Edit a chat room",
			EditText: "Edit the room",
			editID: "editRoomForm",
			DeleteButton: "displayDeleteForm",
			DeleteText: "Delete the room",
			deleteID: "deleteRoomForm",
            room_id: this.room_id,
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		/* Tell BB to remove after submit */
		this.delegateEvents();
		return (this);
	}
	render() {
		this.updateRender();
		return (this);
	}
}
