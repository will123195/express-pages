# express-pages

Automatic routing for express

## Install

```
npm install express
npm install express-pages
```

## Usage

#### index.js
```js
var express = require('express')
var pages = require('express-pages')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.use('/v1', pages({
  dir: './api',
  ext: '.js',
  homepage: '/home',
  helpers: {
    beep: function () {
      return 'boop'
    }
  }
})

app.listen(app.get('port'), function() {
  console.log([
    'Running: http://localhost:' + app.get('port'),
    'NODE_ENV: ' + process.env.NODE_ENV,
  ].join('\n'))
})
```

#### ./api/beep.js
```js
//
// /v1/beep
//
module.exports = function () {
  this.send({
    beep: this.beep()
  })
}
```

