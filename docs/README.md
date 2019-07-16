## dry.js

Welcome to `dry.js` - the Don't Repeat Yourself JS library.

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

### Usage in 30 seconds

Grab your typical HTML boilerplate, import jQuery and import `dry.js`:

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

By default, `dry.js` modules are expected to reside in `/modules/*` relative to the `dry.js` script.

So in that location, create a directory called `myApp` and in that two files:

#### `widgets/myApp/main.js`

```
dry.registerWidget('myApp', [], function() {
    this.init = function(args) {
        console.log('Init time!');
        this.$myButton.style('color', 'red');
    };
    
    this.buttonClicked = function(e) {
        alert('Button clicked');
    };
});
```

#### `widgets/myApp/template.html`

```
<div><button name="myButton" dry-click="buttonClicked">Click me</button></div>
```

