var express = require('express');
var bookRouter = express.Router();
var sql = require('mssql');

var router = function (nav) {
    var books = [{
        title: 'War and Peace',
        genre: 'Historical Fiction',
        author: 'Lev Nikolayevich Tosltoy',
        read: false
    }, {
        title: 'Les Misérables',
        genre: 'Historical Fiction',
        author: 'Victor Hugo',
        read: true
    }, {
        title: 'The Time Machine',
        genre: 'Science Fiction',
        author: 'H. G. Wells',
        read: false
    }, {
        title: 'A Journey into the Center of the Earth',
        genre: 'Science Fiction',
        author: 'Jules Verne',
        read: false
    }];
    bookRouter.route('/')
        .get(function (req, res) {
            var request = new sql.Request();

            request.query('select * from dbo.Books',
                function (err, recordset) {
                    res.render('bookListView', {
                        title: 'Books',
                        nav: nav,
                        books: recordset
                    });
                });
        });

    bookRouter.route('/:id')
        .all(function (req, res, next) {
            var id = req.params.id;
            var ps = new sql.PreparedStatement();
            ps.input('id', sql.Int);
            ps.prepare('select * from books where id = @id', function (err) {
                ps.execute({
                    id: req.params.id
                }, function (err, recordset) {
                    if (recordset.length === 0) {
                        res.status(404).send('Not Found');
                    } else {
                        req.book = recordset[0];
                        next();
                    }
                });
            });
        })
        .get(function (req, res) {
            res.render('bookView', {
                title: 'Books',
                nav: nav,
                book: req.book
            });
        });

    return bookRouter;
};

module.exports = router;