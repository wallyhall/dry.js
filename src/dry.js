var dry = (new function() {
    "use strict";

    var self = this;

    // relative path to widgets on server-side
    var widgetPath = 'widgets';
    // widgets loaded
    var widgets = {};
    // promises (and the promise results) for widget loading
    var loadWidgetPromises = {};
    var loadWidgetPromiseResults = {};
    
    // recursively resolves an object property from a string, returning it
    var resolvePropertyPath = function(path, obj) {
        var propertyPath = path.split('.');
        var propertyRef = obj;
        for (var subPath of propertyPath) {
            propertyRef = propertyRef[subPath];
        }
        return propertyRef;
    };
    
    /**
     * Replaces widget tags with actual widget doms.
     * The parent argument is used to resolve parent references at runtime.
     */
    self.substituteWidgetTags = function(dom, parent) {
        // widget references, indexed by name, to be returned from this method
        var widgetRefsByName = {};
        
        // iterate all loaded widgets
        for (var widgetName in widgets) {
            // find any widget tags in the provided dom
            var widgetTags = dom.find(widgetName);
            widgetTags.each(function () {
                // resolve the widget args from the parent or as literal values
                var widgetArgs = {};
                $.each(this.attributes, function () {
                    // pass by reference a public property of the parent
                    if (this.value[0] == '$') {
                        widgetArgs[this.name] = resolvePropertyPath(this.value.substring(1), parent);
                    } else {
                        widgetArgs[this.name] = this.value;
                    }
                });
                
                // jQueryify the widget tag.
                var widgetTag = $(this);
                // factory generate a new widget object
                var widget = self.getWidget(widgetName, widgetArgs);
                
                // make the widget object accessible from the parent scope by its tag name
                // e.g. <helloworld name="abc"> becomes accessible to the parent as .abc
                var widgetTagName = widgetTag.attr('name');
                if (typeof widgetTagName != 'undefined') {
                    widgetRefsByName[widgetTagName] = widget;
                }
                
                // append the newly generated widget dom to the widget's tag
                widgetTag.append(widget.dom);
            });
        };
        // references to all widgets indexed by name as applicable
        return widgetRefsByName;
    };
    
    /**
     * Installs event handlers for all dom elements
     */
    self.installEventHandlers = function(dom, parent) {
        var events = [
            'blur', 'focus', 'focusin', 'focusout',
            'change', 'select',
            'click', 'dblclick', 'contextmenu',
            'error',
            'keydown', 'keypress', 'keyup',
            'ready', 'load', 'unload',
            'hover', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
            'resize', 'scroll',
            'submit'
        ];
        for (var event of events) {
            dom.find('[dry-' + event + ']').each(function () {
                var child = $(this);
                child[event](resolvePropertyPath(child.attr('dry-' + event), parent));
            });
        }
    };
    
    /**
     * Initialises an new widget object.
     */
    self.initialiseWidget = function(widget, args) {
        // initialise the dom from the widget template
        widget.dom = $(widgets[widget.name].template);
        // get all elements with a name attribute before substituting in subwidgets
        widget.dom.find('[name]').each(function () {
            var namedChild = $(this);
            widget['$' + namedChild.attr('name')] = namedChild;
        });
        
        // configure all event handlers
        self.installEventHandlers(widget.dom, widget);
        
        // substitute in sub-widgets
        widget.widgets = self.substituteWidgetTags(widget.dom, widget);
        
        // call the initialise function (assuming it exists)
        if (typeof widget.init != 'undefined') {
            widget.init(args);
        }
        return widget;
    };

    /**
     * Factory generate a new widget.
     */
    self.getUninitialisedWidget = function(widgetName) {
        var widget = new widgets[widgetName]();
        widget.name = widgetName;
        return widget;
    };

    /**
     * Factory generate and initialise a new widget.
     */
    self.getWidget = function(widgetName, args) {
        var widget = self.getUninitialisedWidget(widgetName);
        return self.initialiseWidget(widget, args);
    };

    /**
     * Register a new widget.
     * This is called indirectly by the loading of a widget.
     * Widget main.js scripts should call this method to register themselves.
     */
    self.registerWidget = function(widgetName, dependencies, widget) {
        // promises to load widget dependencies and template
        var loadPromises = [];
        
        // promise to load the widget's tempalte
        var promiseToLoadTemplate = $.get(widgetPath + '/' + widgetName + '/template.html').promise();
        promiseToLoadTemplate.fail(function () {
            console.error('dry.js', 'Widget failed to load template', widgetName);
        })
        .then(function (data) {
            widget.template = data;
            console.debug('dry.js', 'Widget template loaded', widgetName, data);
        });
        loadPromises.push(promiseToLoadTemplate);
    
        // promise to load the widget's dependencies
        dependencies.forEach(function(dependOnWidgetName) {
            if (typeof widgets[widgetName] === 'undefined') {
                loadPromises.push(self.loadWidget(dependOnWidgetName));
            }
        });
        
        // wait on all promises to load (widget dependencies and templates)
        Promise.all(loadPromises)
            .then(function() {
                widgets[widgetName] = widget;
                console.debug('dry.js', 'Widget registration complete (although dependencies may yet fail)', widgetName);
                loadWidgetPromiseResults[widgetName].resolve(widgets[widgetName]);
            })
            .catch(function() {
                loadWidgetPromiseResults[widgetName].fail('dry.js', 'Widget registration failed', widgetName);
            });
    };

    /**
     * Load a widget.
     * Invokes an AJAX call to load the widget's main.js script, which should indirectly
     * invoke registerWidget(...).
     */
    self.loadWidget = function(widgetName) {
        // load the widget
        // if the widget is valid, it will call dry.registerWidget()
        
        // only load widgets we haven't already started to load.
        // this works because Javascript behaves single-threadedly.
        if (typeof loadWidgetPromises[widgetName] === 'undefined') {
            loadWidgetPromises[widgetName] = new Promise(function(resolve, reject) {
                // track the promise resolution triggers for the indirect call to
                // registerWidget(...).
                loadWidgetPromiseResults[widgetName] = {
                    resolve: resolve,
                    reject: reject
                };
            
                // download the widget's main.js
                $.getScript(widgetPath + '/' + widgetName + '/main.js')
                    .fail(function () {
                        console.error('dry.js', 'Widget load failed', widgetName);
                        reject('Widget load failed - ' + widgetName);
                    })
                    .then(function () {
                        console.debug('dry.js', 'Widget load succeeded', widgetName);
                    });
            });
        }
        return loadWidgetPromises[widgetName];
    };
    
    /**
     * Bootstrap a dry.js app by bringing up the main app widget.
     */
    self.run = function(runWidgetName, args) {
        console.debug('dry.js', 'Starting to run...', runWidgetName, args);
        // bootstrap by loading the "run widget"
        self.loadWidget(runWidgetName).then(function() {
            console.debug('dry.js', 'Run widget loaded and registered... initialising', runWidgetName);
            var runWidget = self.getWidget(runWidgetName, args);
            console.debug(runWidget.dom);
            $('body').append(runWidget.dom);
        })
        .catch(function(error) {
            console.error('dry.js', 'Failed to run dry.js project', runWidgetName, error);
        });
    };
    
    return this;
});
