dry.registerWidget('helloworld', [ "goodbye" ], function() {
    this.init = function(args) {
        this.dom.hide().fadeIn(2000);
    };
    
    this.goodbyeMsg = 'And farewell.';
});