AppClasses.Views.NewRoom = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #createRoomForm": "submit"
		}
		super(opts);
		this.tagName = "div";
		this.template = App.templates["room/form"];
		this.updateRender();

	}
	
	submit(e) {
		/* Cancels the event if it is cancelable*/
		e.preventDefault();
		App.utils.formAjax("/api/rooms.json", "#createRoomForm")
		.done(res => {
			App.toast.success("Room successfully created !", { duration: 2000, style: App.toastStyle });
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
			user: u,
			method: "POST",
			titleText: "Create a chat room",
			submitText: "Create the room",
			formID: "createRoomForm",
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
