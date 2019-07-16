dry.registerWidget('calc', [], function() {
    "use strict";
    var self = this;
    
    var ans = 0;
    var inputBuffer = 0;
    var operation = null;
    var clearing = false;

    this.init = function(args) {
        self.$display.html("0");
    };
    
    this.calcBtnPress = function(e) {
        var input = $(event.target).data('val');
        if (typeof input == "number") {
            if (clearing) {
                clearing = false;
                console.log("Clearing");
                inputBuffer = 0;
                operation = null;
            }
            inputBuffer *= 10;
            inputBuffer += input;
            self.$display.html(inputBuffer);
            
        } else if (input == "c") {
            ans = 0;
            inputBuffer = 0;
            operation = null;
            clearing = false;
            self.$display.html("0");
            
        } else {
            if (operation === null) {
                ans = inputBuffer;
            } else if (!clearing || input == "=") {
                switch (operation) {
                    case "+":
                        ans = ans + inputBuffer;
                        break;
                    case "-":
                        ans = ans - inputBuffer;
                        break;
                    case "/":
                        ans = ans / inputBuffer;
                        break;
                    case "*":
                        ans = ans * inputBuffer;
                        break;
                }
            }
            
            if (input == "=") {
                clearing = true;
            } else {
                clearing = false;
                operation = input;
                inputBuffer = 0;
            }
            
            self.$display.html(ans);
        }
    };
});