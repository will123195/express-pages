express-pages
=============

Automatic Routing for Express


Basic Usage
===========

index.js
```js
var express = require('express')
var pages = require('express-pages')

var app = express()

app.use('/', pages({
  dir: './api',
  ext: '.js',
  helpers: {
    send: function(body) {
      this.res.send(body)
    }
  }
})

```

./pages/about-us.js
```js
// uri: /about-us
module.exports = function() {
  this.send('<html><body><h1>About Us</h1></body></html>')
}
```

