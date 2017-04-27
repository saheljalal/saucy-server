const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  // non-get requests just send back the same data sent
  if (['POST', 'DELETE', 'PUT', 'PATCH'].includes(req.method)) {
    res.jsonp(req.body)
  } else {
    next()
  }
})

router.render = (req, res) => {
  var result = res.locals.data
  var keyPath = req.originalUrl.split('=')[1]
  if (keyPath === 'keyPath') {
    result = {}
    result[keyPath] = res.locals.data
  }
  res.jsonp(result)
}

server.use(jsonServer.rewriter({
  '/api/': '/'
}))

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
