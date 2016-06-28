var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

var bookController = function (bookService, nav) {
    var url = 'mongodb://localhost:27017/libraryApp';

    var middleware = function (req, res, next) {
        if (!req.user) {
            res.redirect('/');
        } else {
            next();
        }
    };

    var getIndex = function (req, res) {
        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.find({}).toArray(function (err, results) {
                res.render('bookListView', {
                    title: 'Books',
                    nav: nav,
                    books: results
                });
            });
        });
    };

    var getById = function (req, res) {
        var id = new ObjectId(req.params.id);

        mongodb.connect(url, function (err, db) {
            var collection = db.collection('books');
            collection.findOne({
                _id: id
            }, function (err, results) {
                if (results.bookId) {
                    bookService.getBookById(results.bookId, function (err, book) {
                        results.book = book;
                        res.render('bookView', {
                            title: 'Books',
                            nav: nav,
                            book: results
                        });
                    });
                } else {
                    results.book = {};
                    res.render('bookView', {
                        title: 'Books',
                        nav: nav,
                        book: results
                    });
                }
            });
        });
    };

    return {
        middleware: middleware,
        getIndex: getIndex,
        getById: getById
    };
};

module.exports = bookController;