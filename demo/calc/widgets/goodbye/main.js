dry.registerWidget('goodbye', [], function() {
    this.init = function(args) {
    console.log("hi", args);
        this.dom.html(args.msg + '<br>Init ran at ' + Date());
    };
});