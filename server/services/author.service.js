const r = require('rethinkdb');

function AuthorService() {

	return {
		
		getAllAuthors: function(req, res) {
			r.connect({db: 'books'}, function(err, conn) {
				r.table('author').run(conn, function(err, cursor) {
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
		getAuthor: function(req, res) {
			r.connect({db: 'books'}, function(err, conn) {
				r.table('author').get(req.body.id).run(conn, function(err, response) {
					if (err) {
						res.json({'error': err});
					}
					conn.close();
					res.json({'author': response});
				});
			});
		},
		updateAuthor: function(req, res) {
			r.connect({db: 'books'}, function(err, conn) {
				r.table('author').get(req.body.id).update({name: req.body.name}).run(conn, function(err, response) {
					if(err) {
						res.json({'error': err});
					}
					conn.close();
					res.json({'msg': 'Save successful'});
				});
			});
		}
	};

}

module.exports = AuthorService;
