dry.registerWidget('helloworld', [ "goodbye" ], function() {
    this.init = function(args) {
        this.dom.hide().fadeIn(2000);
        this.$myButton.css('color', 'red');
    };
    
    this.buttonClicked = function(e) {
        alert('Button clicked');
    };
    
    this.goodbyeMsg = 'And farewell.';
});