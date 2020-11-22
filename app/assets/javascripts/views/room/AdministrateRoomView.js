AppClasses.Views.AdministrateRoom = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit #promoteAdminForm": "promote",
			"submit #demoteAdminForm": "demote"
		}
        super(opts);
        this.room_id = opts.room_id;
		this.tagName = "div";
		this.template = App.templates["room/administrate"];
		
		this.listenTo(this.model, "change add", this.updateRender);
		this.listenTo(App.collections.allUsers, "add remove", this.updateRender);
		this.listenTo(App.collections.rooms, "change reset add remove", this.updateRender);

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

	promote(e) {
		e.preventDefault();

		App.utils.formAjax(`/api/rooms/promoteAdmin.json`, "#promoteAdminForm")
		.done(res => {
			App.toast.success("Admin successfully promoted !", { duration: 2000, style: App.toastStyle });
			location.hash = `#room`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
	}

	demote(e) {
		e.preventDefault();

		App.utils.formAjax(`/api/rooms/demoteAdmin.json`, "#demoteAdminForm")
		.done(res => {
			App.toast.success("Admin successfully promoted !", { duration: 2000, style: App.toastStyle });
			location.hash = `#room`;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
	}
	
	updateRender() {

		const room = this.model.findWhere({id: this.room_id});
		// var memberArray = room.attributes.members
		// var adminArray = room.attributes.admins

		var sortedMember = room.attributes.members.sort(function (a, b) {
			return b.nickname < a.nickname ?  1 
				 : b.nickname > a.nickname ? -1 
				 : 0;                  
		});

		var sortedAdmin = room.attributes.admins.sort(function (a, b) {
			return b.nickname < a.nickname ?  1 
				 : b.nickname > a.nickname ? -1 
				 : 0;                 
		});

		this.$el.html(this.template({
			status: this.statusAdministrate,
			roomMembers: sortedMember,
			roomAdmins: sortedAdmin,
			room_id: this.room_id,
			token: $('meta[name="csrf-token"]').attr('content')
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
