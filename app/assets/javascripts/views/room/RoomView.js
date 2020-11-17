AppClasses.Views.Room = class extends Backbone.View {
	constructor(opts) {
		opts.events = {
			"submit .privateRoomAuthForm": "submit"
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

	submit(e) {
		e.preventDefault();
		const roomID = e.target.children[4].value
		const selectorFormID = "#privateRoomAuthForm-" + roomID
		App.utils.formAjax("/api/rooms/join.json", selectorFormID)
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

    
	updateRender() {

		const { attributes } = App.models.user;
		this.$el.html(this.template({
			rooms: this.model.toJSON(),
			user: attributes,
			method: "POST",
			titleText: "Join private room",
			submitText: "Open",
			formID: "privateRoomAuthForm",
			token: $('meta[name="csrf-token"]').attr('content')
		}));
		return (this);
    }
    
	render() {
		this.model.fetch();
		this.delegateEvents();
		return (this);
    }
    
}
