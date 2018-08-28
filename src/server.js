  var api = require('./utils/api');

  api = api.Api;
  
  var express = require('express');
  var app = express();
  var path = require('path')
  var bodyParser = require('body-parser')
  app.use(bodyParser.json())
  var todos = []
  var public = path.join(__dirname, '/')
  app.use('/',express.static(public))

  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
  });

  const defaultTodo = [
    {id:1,subject:'Eating'},
    {id:2,subject:'Loving'},
    {id:3,subject:'Preying'},
  ]
  function rs(){
    todos = defaultTodo
  }
  function indexById(id){
    for (var i = 0; i < todos.length; i++) {
      if (id ==todos[i].id)return i
    }
    return -1
  }
  rs()
  app.delete('/api/todo/:id', function (req, res) {
    var userkey = +req.params.id
    todos.splice(indexById(userkey),1)
    res.end( JSON.stringify(todos));
    rs()
  })
  app.get('/api/todos', function (req, res) {
    const headers = req.headers;
    console.log(headers);
    console.log('++++++++++++++++++++++++++++');
    console.log(req);
    res.end( JSON.stringify(todos));
  })
  app.post('/api/todo', function (req, res) {
    todos.push(req.body)
    res.end(JSON.stringify(todos))
    rs()
  })

  app.post('/api/auth', (req, res) => {
    const headers = req.headers;
    console.log('/api/auth', req.query);
    const code = req.query.code;

    console.log('code', code);

    api.auth(code, headers).then((response) => {
      console.log('res', response.data)
      res.end(JSON.stringify(response.data));
    });
  });

  app.get('/api/user', (req, res) => {
    const headers = req.headers;
    console.log(headers);
    api.getAuthenticatedUser(headers).then((response) => {
      console.log('res', response.data);

      res.end(JSON.stringify(response.data));
    });
  });

  app.get('/api/stars', (req, res) => {
    const headers = req.headers;

    const page = req.query.page;
    console.log(headers);

    api.starred(page, headers).then((response) => {
      res.end(JSON.stringify(response.data));
    });
  });

  var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("listening at http://%s:%s", host, port)
  })