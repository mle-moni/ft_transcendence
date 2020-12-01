AppClasses.Routers.AbstractRouter = class extends Backbone.Router {
	constructor(options) {
		super(options);
		this.views = App.views;
		this.models = App.models;
		this.collections = App.collections;
		this.mainDiv = $("#app");
	}
	basicView(viewName, viewClassName, viewOptions = {}) {
		if (!this.views[viewName]) {
			this.views[viewName] = new AppClasses.Views[viewClassName](viewOptions);
		}
		this.mainDiv.html(this.views[viewName].render().el);
	}
	viewWithRenderParam(viewName, viewClassName, renderParam, viewOptions = {}) {
		if (!this.views[viewName]) {
			this.views[viewName] = new AppClasses.Views[viewClassName](viewOptions);
		}
		this.mainDiv.html(this.views[viewName].render(renderParam).el);
	}

	specialViewWithRenderParam(viewName, viewClassName, renderParam, viewOptions = {}) {
        if (this.views[viewName]) {
            this.views[viewName].destroy();
            delete(this.views[viewName]);
        }
        this.views[viewName] = new AppClasses.Views[viewClassName](viewOptions);
        this.mainDiv.html(this.views[viewName].render(renderParam).el);
    }
}
