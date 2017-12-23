const r = require('rethinkdb');
var uuidv5 = require('uuid/v5');

function UserService() {

	return {
		post: function(req, res) {
			req.body.id = uuidv5(req.body.username, uuidv5.DNS);
			r.connect({db: 'books'}, function(err, conn) {
		    r.table('users').insert(req.body).run(conn, function(err, response) {
		    	if (response.errors >= 1) {
						conn.close();
						res.json({error: 'Username already exists'});
						return;
					}
		      conn.close();
		      res.json({server: req.body, db: response });
		    });
		  });
		},
		getUserById: function(req, res) {
			r.connect({db: 'books'}, function(err, conn) {
				r.table('users').get(req.id).run(conn, function(err, response) {
					if (err) {
						res.json({error: err});
					}
					conn.close();
					res.json({user: response});
				});
			});
		},
		getByUsername: function(req, cb) {
			r.connect({db: 'books'}, function(err, conn) {
				r.table('users').getAll(req.body.username, {index: 'username'}).run(conn)
				.then(function(cursor) {
					return cursor.next();
				})
				.then(function(result) {
					conn.close();
					cb(err, result);
				})
				.error(function(err){
					conn.close();
					cb(err, null);
				});
	    });
		}
	};

}

module.exports = UserService;
