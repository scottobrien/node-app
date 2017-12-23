// server.js
var express = require('express');
var app = express();
var async = require('async');
var bodyParser = require('body-parser');

var cors = require('cors');

const r = require('rethinkdb');

var bcrypt = require('bcrypt');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

var uuidv5 = require('uuid/v5');

var userService = require('./services/user.service');
var authorService = require('./services/author.service');
var bookService = require('./services/book.service');

var faker = require('faker');

// Cors issues..
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressJWT({secret: 'test 9 test'}).unless({path: ['/', '/user/', '/auth/']}));
app.use(function (err, req, res, next) {
  console.log('Token Error: ', err)
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({error: 'Unauthorized'});
  }
});



var arr = []; // faker stuff.
var mutatedObj = {};
const nameSpace = '90122e2c-7534-533a-bc25-76fcb9f2f73d';

const port = process.env.PORT || 4000;

// Build fake data...
// for (var i = 0; i < 50; i++) {
//   r.connect({db: 'books'}, function(err, conn) {
//     r.table('fiction').insert(returnObj()).run(conn, function(err, response) {
//       if (response.errors >= 1) {
//         conn.close();
//         console.log({'error': 'Username already exists'});
//         return;
//       }
//       conn.close();
//       console.log({ 'server': response });
//     });
//   });
// }

// var int = 0;
// function returnObj() {
//   int++;
//   var genName = faker.name.firstName() + ' ' + faker.name.lastName();
//   return mutatedObj = {
//     bookName: faker.company.bs(),
//     authorName: genName,
//     image: faker.image.abstract(),
//     type: 'fiction',
//     nonFictionId: int,
//     id: uuidv5(genName, nameSpace)
//   }
// }
// console.log(arr);




app.get('/', function(req, res) {
  res.json({'title': 'Sign Up'});
});

// User/Sign up
app.route('/user/')
  .post(function(req, res) {
    console.log('REQ: ', req.body);
    bcrypt.hash(req.body.password, 5, function(err, hash) {
      console.log('Bcrypt ', hash, req.body);
      req.body.password = hash;
      userService().post(req, res);
    });
});

// Authentication
app.post('/auth/', function(req, res) {
  userService().getByUsername(req, function(err, result) {
    if (err) {
      res.json({ isAuth: false, msg: 'Username does not exist.' });
      console.log('ERROR ', err);
      return;
    }
    bcrypt.compare(req.body.password, result.password, function(err, doesMatch) {
      console.log('Match ', doesMatch);
      if (err) {
        res.json({ isAuth: false, error: err });
      }
      if (doesMatch) {
          delete result.password;
          var token = jwt.sign({
            data: {user: result}
          }, 'test 9 test', {expiresIn: '12h'});
          result.tokenExp = jwt.decode(token).exp;
          console.log('RESULTING ', jwt.decode(token), result);
          res.status(200).json({isAuth: true, user: result, token: token});
      } else {
        console.log('RESULT ', result);
        res.json({ isAuth: false, msg: 'Incorrect password' });
      }
    });
  });
});

// Author
app.route('/author/')
.get(function(req, res) {
  console.log('GET Authors ', req.body)
  authorService().getAllAuthors(req, res);
})
.post(function(req, res) {
  console.log('POST Author ', req.body);
  if(req.body.edit) {
    authorService().updateAuthor(req, res); 
  } else {
    authorService().getAuthor(req, res);
  }
});

// Books
app.route('/books/')
  .get(function(req, res) {
    console.log('GET Books ', req.body);
    bookService().getAllBooks(req, res);
  })
  .post(function(req, res) {
    console.log('POST Books ', req.body);
    if (req.body.edit) {
      bookService().updateBook(req, res);
    } else {
      bookService().getBook(req, res);
    }
});

app.listen(port, function() {
  console.log('Running on port:', port);
});
