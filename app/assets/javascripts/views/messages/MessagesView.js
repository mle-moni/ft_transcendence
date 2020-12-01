AppClasses.Views.DirectMessages = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit .createDM": "createDM"
		}
		super(opts);
		this.tagName = "div";
        this.template = App.templates["messages/index"];
        this.user = opts.user;
        this.model = opts.model;
		this.listenTo(this.model, "change reset add remove", this.updateRender);
        this.listenTo(App.collections.allUsers, "change reset add remove", this.updateRender);
		this.allUsers = App.collections.allUsers;
        this.allUsers.myFetch();
        this.model.fetch();
		this.updateRender();
    }

    createDM(e) {
		e.preventDefault();
		var selectorFormID = "";
		if (e.currentTarget) selectorFormID = "#" + e.currentTarget.id;
		App.utils.formAjax("/api/direct_chats.json", selectorFormID)
		.done(res => {
			App.toast.success("Room created !", { duration: 1500, style: App.toastStyle });
			location.hash = "#messages/" + res.id;
		})
		.fail((e) => {
			App.utils.toastError(e);
		});
		return (false);
    }

    updateRender() {

		const { attributes } = App.models.user;
		var data = this.allUsers;

		if (data && attributes) {
			data = data.models;
			var currentUserBlock = data.find(user => {
				return user.id == attributes.id;
			})
			if (currentUserBlock) {
				currentUserBlock = currentUserBlock.attributes.blocked;
				var blockedTabIDs = [];
				currentUserBlock.forEach(block => {
						blockedTabIDs.push(block.toward_id);
				});
			}
			// Avoid current user to dm with himself and void allow to chat when blocked
			data = data.filter(user => {
				return (user.id != attributes.id && !blockedTabIDs.includes(user.id))
			});
		}
	
		this.$el.html(this.template({
            allUsers: data,
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
    
