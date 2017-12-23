// Book Service 
const r = require('rethinkdb');

function BookService() {
  return {
    getAllBooks: function(req, res) {
      r.connect({db: 'books'}, function(err, conn){
        r.table('nonfiction').eqJoin('fictionId', r.db('books').table('fiction'), {index: 'nonFictionId', ordered: true})
          .without({left: 'fictionId', right: 'nonFictionId'})
            .concatMap(function(obj) {
              return [obj('left'), obj('right')]
            })
              .run(conn, function(err, cursor) {
                if (err) {
                  res.json({'error': err});
                }
                cursor.toArray(function(err, result) {
                  if (err) {
                    res.json({'error': err});
                  }
                  res.json(result);
                });
              });
      });
    },
    getBook: function(req, res) {
      var withoutStr = (req.body.type === 'nonfiction') ? 'fictionId' : 'nonFictionId';
      r.connect({db: 'books'}, function(err, conn){
        r.table(req.body.type).get(req.body.id).without(withoutStr).run(conn, function(err, response) {
          if (err) {
            res.json({'error': err});
          }
          conn.close();
          res.json({'book': response});
        });
      });
    },
    updateBook: function(req, res) {
      r.connect({db: 'books'}, function(err, conn) {
        r.table(req.body.type).get(req.body.id).update({bookName: req.body.bookName}).run(conn, function(err, response){
          if (err) {
            res.json({'error': err});
          }
          conn.close();
          res.json({'msg': 'Saved successfully'});
        });
      });
    }
  };
}

module.exports = BookService;
