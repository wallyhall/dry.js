## dry.js

Welcome to `dry.js` - the Don't Repeat Yourself JS library.

If standing on the shoulders of giants is your choice of analogy - then this library is pretty high up and well supported from beneath.

The motivation for this project came from a developer's love of existing tools (notably Twitter Bootstrap, jQuery and RxJS) and an utter hatred of that repetative code which every project needs and nobody wants to write (it sometimes looks like this):

```
var btnLogin = $('#btnLogin');
btnLogin.onClickEvent = function(e) {
   // ...
}
btnLogin.click(btnLogin.onClickEvent);
```

It's repetative, it's boring, and it's messy.

`dry.js` merely seeks to remove that awfulness and make using these existing tools vastly more enjoyable.  If it doesn't make code cleaner and put a bigger smile on your face, it's failed at life.

### Not another framework

Let this be categorically stated: `dry.js` is *not* another framework aiming in the already crowded (and very mature) space occupied by superb options like Angular and React.

The target is "zero learning curve" (`dry.js` should feel natural - and not force you to do anything you're not already doing, only allow you to optimise your time and write less verbose code).  It should feel like sipping an ice cold soft-drink on a hot summers day.

You might find `dry.js` fits well if you're prototyping rapidly, or if you've a small application which doesn't require super-reliable legacy browser support - *and you're already comfortable with jQuery*.

### Learn it in 3 minutes!

Grab your typical HTML boilerplate, import jQuery and import `dry.js`.  You'll also need to invoke (via `jQuery.ready()` of course!) `dry.js` with at least one "widget":

#### `index.html`

```
<html>
    <body>
        <myApp></myApp>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
        <script src="dry.js"></script>
        
        <script>        
            $(function () {
                dry.run('myApp', {});
            });
        </script>
    </body>
</html>
```

By default `dry.js` will assume your modules reside in `/modules/*` (as a relative path) and will attempt to auto-load them for you from there.

If anything goes sideways, debug should be written to the browser's console for you.

So alongside your HTML boilerplate, add `widgets` and create in there a directory called `myApp` (as referenced in the example above).

Finally, in there, create your first widget:

#### `widgets/myApp/main.js`

```
dry.registerWidget('myApp', [], function() {
    "use strict";
    var self = this;

    self.init = function(args) {
        console.log('Init time!');
        self.$myButton.style('background-color', 'red');
    };
    
    self.buttonClicked = function(e) {
        alert('Button clicked');
    };
});
```

#### `widgets/myApp/template.html`

```
<div><button name="myButton" dry-click="buttonClicked">Click me</button></div>
```

Refresh - and if all works first time - you'll be looking at a page with a red coloured button which pops up an alert when clicked!

Congrats.  You rock.

The widget's `main.js` was loaded at run-time via AJAX, along with the `template.html` which was then injected into the page's DOM for you by `dry.js`.

Next, if present, the widget's `init` function is called - allowing you to setup any initial state before unpredictable events start firing.

jQuery's `click()` event registration was also handled for you by `dry.js` - softly - and at run-time - via the `dry-click="..."` attribute in the template.

You'll also see that the `name` attribute was immediately made available in the local scope as `this.$myButton`.

For further examples, take a look at the included demos.  More docs coming - well - at some point!

