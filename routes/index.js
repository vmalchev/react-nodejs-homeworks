'use strict';

const express = require('express');
const router = express.Router();
const db = require('../db')

// const util = require('util');
// const indicative = require('indicative');

router.get('/', function (req, res) {
  console.log('Hello');
});

router.get('/posts', function (req, res) {
    db.query('SELECT * FROM post', function (err, rows) {
      if (err) throw err;

      res.json(rows.map((post) => {
        return post;
      }));
    })
});

router.get('/posts/:postId', function (req, res) {
    const params = req.params;
    db.query('SELECT * FROM post WHERE id=?', [params.postId], function (err, rows) {
        if (err) throw err;

        var post = rows[0];

        if (post === null) {
          var message = `Post with Id=${params.postId} not found.`;
            res.status(404);
            res.json({
              'error': [{
                message,
                error: {}
              }]
            });
        } else {
            res.json(post);
        }
  })
});

router.post('/posts', function (req, res) {
    const post = req.body;
    db.query('INSERT INTO post SET ?', post, function (err, result) {
        if (err) throw err;

        console.log('Inserting post:'+JSON.stringify(post));
        if (result.affectedRows == 1) {
            const uri = req.url + '/' + result.insertId;
            console.log('Created Post: ', uri);
            res.location(uri).status(201).json(post);
        } else {
          var message = `Error creating new post: ${post}`;
            res.status(400);
            res.json({
              'error': [{
                message,
                error: {}
              }]
            });
        }
    }).catch((err) => {
        var message = `Server error: ${err}`;
        res.status(500);
        res.json({
          'error': [{
            message,
            error: {}
          }]
        });
    })
  });

router.put('/posts/:postId', function (req, res) {
    const post = req.body;

    if (post.id !== req.params.postId) {
        var message = `Invalid user data - id in url doesn't match: ${post}`;
        res.status(400);
        res.json({
          'error': [{
            message,
            error: {}
          }]
        });

        return;
    }

//     db.query('UPDATE post SET ? WHERE id= :postId', post, function (err, result) {
//         if (err) throw err;
//
//         console.log('Updating post:', post);
//
//         if (result.modifiedCount === 1) {
//             res.json(result);
//         } else {
//           var message = `Data was NOT modified in database: ${JSON.stringify(post)}`;
//             res.status(400);
//             res.json({
//               'error': [{
//                 message,
//                 error: {}
//               }]
//             });
//         }
//     }).catch((err) => {
//         var message = `Server error: ${err}`;
//         res.status(500);
//         res.json({
//           'error': [{
//             message,
//             error: {}
//           }]
//         });
//     })
// });
//
// router.delete('/posts/:postId', function (req, res) {
//     const db = req.app.locals.db;
//     const params = req.params;
//     indicative.validate(params, { userId: 'required|regex:^[0-9a-f]{24}$' })
//         .then(() => {
//             db.collection('users', function (err, users_collection) {
//                 if (err) throw err;
//                 users_collection.findOneAndDelete({ _id: new mongodb.ObjectID(params.userId) },
//                     (err, result) => {
//                         if (err) throw err;
//                         if (result.ok) {
//                             replaceId(result.value);
//                             res.json(result.value);
//                         } else {
//                             error(req, res, 404, `User with Id=${params.userId} not found.`, err);
//                         }
//                     });
//             });
//         }).catch(errors => {
//             error(req, res, 400, 'Invalid user ID: ' + util.inspect(errors))
//         });
// });

module.exports = router;
