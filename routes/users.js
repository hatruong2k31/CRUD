var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users ORDER BY id ASC',function(err, rows, fields) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				res.render('user/list', {
					title: '', 
					data: ''
				})
			} else {
				// render to views/user/list.ejs template file
				res.render('user/list', {
					title: '', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	// render to views/user/add.ejs
	res.render('user/add', {
		title: '',
		name: '',
		phone: '',
		email: '',
		cardId: '',
		balance: ''
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){
	req.assert('name', 'Name is required').notEmpty()       //Validate name
	req.assert('phone', 'Phone is required').notEmpty()   //Validate phone
    req.assert('email', 'A valid email is required').isEmail()  //Validate email
	req.assert('cardId', 'CardId is required').notEmpty()
	req.assert('cardId', 'CardId is unique')
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			cardId: req.sanitize('cardId').escape().trim(),
			balance: req.sanitize('balance').escape().trim(),
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO users SET ?', user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: '',
						name: user.name,
						phone: user.phone,
						email: user.email,
						cardId: user.cardId,
						balance: user.balance					
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					
					// render to views/user/add.ejs
					res.render('user/add', {
						title: '',
						name: '',
						phone: '',
						email: '',
						cardId: '',
						balance: ''			
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/add', { 
            title: '',
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
			cardId: req.body.cardId,
			balance: req.body.balance
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM users WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if user not found
			if (rows.length <= 0) {
				req.flash('error', 'User not found with id = ' + req.params.id)
				res.redirect('/users')
			}
			else { // if user found
				// render to views/user/edit.ejs template file
				res.render('user/edit', {
					title: '', 
					//data: rows[0],
					id: rows[0].id,
					name: rows[0].name,
					phone: rows[0].phone,
					email: rows[0].email,
					cardId: rows[0].cardId,
					balance: rows[0].balance,			
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()           //Validate all
	req.assert('phone', 'Phone is required').notEmpty()
    req.assert('email', 'A valid email is required').isEmail()
	req.assert('cardId', 'CardId is required').notEmpty()
	req.assert('balance', 'Balance is required').notEmpty()

    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
		
		/********************************************
		 * Express-validator module
		 
		req.body.comment = 'a <span>comment</span>';
		req.body.username = '   a user    ';

		req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
		req.sanitize('username').trim(); // returns 'a user'
		********************************************/
		var user = {
			name: req.sanitize('name').escape().trim(),
			phone: req.sanitize('phone').escape().trim(),
			email: req.sanitize('email').escape().trim(),
			cardId: req.sanitize('cardId').escape().trim(),
			balance: req.sanitize('balance').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE users SET ? WHERE id = ' + req.params.id, user, function(err, result) {
				//if(err) throw err
				if (err) {
					req.flash('error', err)
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						phone: req.body.phone,
						email: req.body.email,
						cardId: req.body.cardId,
						balance: req.body.balance
					})
				} else {
					req.flash('success', 'Data updated successfully!')
					
					// render to views/user/add.ejs
					res.render('user/edit', {
						title: 'Edit User',
						id: req.params.id,
						name: req.body.name,
						phone: req.body.phone,
						email: req.body.email,
						cardId: req.body.cardId,
						balance: req.body.balance
					})
				}
			})
		})
	}
	else {   //Display errors to user
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/**
		 * Using req.body.name 
		 * because req.param('name') is deprecated
		 */ 
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			phone: req.body.phone,
			email: req.body.email,
			cardId: req.body.cardId,
			balance: req.body.balance
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var user = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM users WHERE id = ' + req.params.id, user, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/users')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
