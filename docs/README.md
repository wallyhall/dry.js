## dry.js

Welcome to `dry.js` - the Don't Repeat Yourself JS library.

The motivation for this project came from a developer's love of existing tools (notably Twitter Bootstrap, jQuery and ReactJS) and an utter hatred of that repetative code which every project needs and nobody wants to write (it sometimes looks like this):

```
var btnLogin = $('#btnLogin');
btnLogin.onClickEvent = function(e) {
   // ...
}
btnLogin.click(btnLogin.onClickEvent);
```

It's repetative, it's boring, and it's messy.

`dry.js` merely seeks to remove that awfulness and make using these existing tools vastly more enjoyable.  If it doesn't make code cleaner and put a bigger smile on your face, it's failed at life.

