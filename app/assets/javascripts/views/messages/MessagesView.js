AppClasses.Views.DirectMessages = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
            "submit .createDM": "createDM",
            "submit .joinDM": "joinDM",
		}
		super(opts);

		this.tagName = "div";
        this.template = App.templates["messages/index"];
        this.user = opts.user;
        this.model = opts.model;


		this.listenTo(App.collections.allUsers, "change reset add remove", this.updateRender);
        this.listenTo(this.model, "change reset add remove", this.updateRender);

        this.allUsers = App.collections.allUsers;
        this.allUsers.myFetch();
        this.model.fetch();
		this.updateRender();

    }

    createDM(e) {
		e.preventDefault();
        console.log(e)
		// Here publicRoomJoinForm-X must match the view's form ID
        const selectorFormID = "#" + e.currentTarget.id
        console.log(e.currentTarget.id);
        
        console.log("click")
        console.log(e)
        App.utils.formAjax("/api/direct_chats.json", selectorFormID)
		.done(res => {
			App.toast.success("Room created !", { duration: 1500, style: App.toastStyle });
			location.hash = `#messages`;
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

    joinDM(e) {
		e.preventDefault();
        console.log(e)
		// Here publicRoomJoinForm-X must match the view's form ID
        const selectorFormID = "#" + e.currentTarget.id;
        const dmRoomID = e.currentTarget.dmRoomID.value;

        console.log(e.currentTarget.id);

        console.log(e)
        App.utils.formAjax(`/api/direct_chats/${dmRoomID}.json`, selectorFormID)
		.done(res => {
			App.toast.success("Room join !", { duration: 1500, style: App.toastStyle });
			location.hash = "#messages/" + dmRoomID;
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

        //console.log(this.user)
		this.$el.html(this.template({
            allUsers: this.allUsers.models,
            userID: this.user.id,
            dmRooms: this.model,
            token: $('meta[name="csrf-token"]').attr('content'),
		}));
		return (this);
    }
    
	render() {
		this.model.fetch();
		this.delegateEvents();
		return (this);
    }

}
    
