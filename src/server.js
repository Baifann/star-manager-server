let api = require('./utils/api');
const tagController = require('./db/tag-controller');
const repoController = require('./db/repo-controller');
const {BaseResult} = require('./result/base-result');
const {ErrorResult} = require('./result/error-result');

api = api.Api;

let express = require('express');
let app = express();
let path = require('path');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
let todos = [];
let publicDir = path.join(__dirname, '/');
app.use('/', express.static(publicDir));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With, userId');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('Content-Type', 'text/html;charset=utf-8');
  if (req.method === 'OPTIONS') res.send(200); /* 让options请求快速返回*/
  else next();
});

const defaultTodo = [{
  id: 1,
  subject: 'Eating'
},
{
  id: 2,
  subject: 'Loving'
},
{
  id: 3,
  subject: 'Preying'
}
];

function rs() {
  todos = defaultTodo;
}

function indexById(id) {
  for (let i = 0; i < todos.length; i++) {
    if (id === todos[i].id) return i;
  }
  return -1;
}
rs();
app.delete('/api/todo/:id', function(req, res) {
  let userkey = +req.params.id;
  todos.splice(indexById(userkey), 1);
  res.end(JSON.stringify(todos));
  rs();
});
app.get('/api/todos', function(req, res) {
  const headers = req.headers;
  console.log(headers);
  console.log('++++++++++++++++++++++++++++');
  console.log(req);
  res.end(JSON.stringify(todos));
});
app.post('/api/todo', function(req, res) {
  todos.push(req.body);
  res.end(JSON.stringify(todos));
  rs();
});

app.post('/api/auth', (req, res) => {
  const headers = req.headers;
  const code = req.query.code;

  console.log('code', code);

  api.auth(code, headers).then((response) => {
    res.end(JSON.stringify(response.data));
  });
});

app.get('/api/user', (req, res) => {
  const headers = req.headers;
  api.getAuthenticatedUser(headers).then((response) => {

    res.end(JSON.stringify(response.data));
  });
});

app.get('/api/stars', (req, res) => {
  const headers = req.headers;
  const userId = headers.userid;

  const page = req.query.page;

  api.starred(page, headers).then((response) => {

    (async() => {
      const repos = response.data;
      const repoTags = await repoController.queryReposByUserId(userId);

      for (const repo of repos) {
        const tags = getTagsByRepoId(repoTags, repo.id);
        repo.tags = tags;
      }

      res.end(JSON.stringify(repos));
    })();
  });
});

/**
 * 通过repoId获取tags
 */
function getTagsByRepoId(tagRepos, repoId) {
  const repoTag = tagRepos.find(tagRepo => {
    return tagRepo.repoId === repoId + '';
  });
  if (repoTag) {
    return repoTag.tags;
  } else {
    return [];
  }
}

app.post('/api/tags', (req, res) => {
  const headers = req.headers;
  const userId = headers.userid;
  const body = req.body;
  const time = new Date().getTime();

  const data = Object.assign(body, {
    userId,
    starsCount: 0,
    createdAt: time,
    updatedAt: time
  });

  tagController.insertTag(data).then(() => {
    res.end(JSON.stringify(new BaseResult()));
  }).catch(() => {
    res.end(JSON.stringify(new ErrorResult()));
  });
});

app.get('/api/tags', (req, res) => {
  const headers = req.headers;
  const userId = headers.userid;

  tagController.queryRepoTagsByUserId(userId).then((data) => {
    const result = new BaseResult();
    result.data = data;
    res.end(JSON.stringify(result));
  }).catch(() => {
    const errorResult = new ErrorResult();
    res.end(JSON.stringify(errorResult));
  });
});

app.put('/api/tags/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body;
  tagController.updateRepoTagById(id, data.name).then(()=> {
    res.end(JSON.stringify(new BaseResult()));
  }).catch(() => {
    res.end(JSON.stringify(new ErrorResult()));
  });
});

app.delete('/api/tags/:id', (req, res) => {
  const id = req.params.id;
  tagController.deleteRepoTagById(id).then(()=> {
    res.end(JSON.stringify(new BaseResult()));
  }).catch(() => {
    res.end(JSON.stringify(new ErrorResult()));
  });
});

app.post('/api/repo/tag/:id', (req, res) => {
  // repoId
  const id = req.params.id;
  const body = req.body;
  const tags = body.tags;
  const headers = req.headers;
  const userId = headers.userid;
  const data = {
    repoId: id,
    tags,
    userId
  };

  repoController.insertRepoTags(data).then(() => {
    res.end(JSON.stringify(new BaseResult()));
  }).catch(() => {
    res.end(JSON.stringify(new ErrorResult()));
  });
});

app.put('/api/repo/tag/:id', (req, res) => {
  // repoId
  const id = req.params.id;
  const body = req.body;
  const tags = body.tags;
  const headers = req.headers;
  const userId = headers.userid;

  repoController.updateRepoTags(tags, id, userId).then(() => {
    res.end(JSON.stringify(new BaseResult()));
  }).catch(() => {
    res.end(JSON.stringify(new ErrorResult()));
  });
});

const server = app.listen(8081, function() {
  let host = server.address().address;
  let port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});