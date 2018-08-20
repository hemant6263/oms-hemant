var express = require('express');
var app = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 9090;
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var docStorage = require('./app/models/docStorage.model');
var path = require('path');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');


//Use of Morgan Testing Framework
app.use(morgan('dev'));

//for parsing application/json
app.use(bodyParser.json());

//for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Redirect to root public view page
app.use(express.static(__dirname + '/public'));

//User Routes
app.use('/api', appRoutes);


//Mongoose Connection to the Database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/online', function(err) {
    if (err) {
        console.log('There is an error in connecting the database ' + err);
    } else {
        console.log('You are connected to the database');
    }
});
var conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);
var ObjectID = mongoose.Types.ObjectId;


//Port Testing
app.listen(port, function() {
    console.log('Running on the server ' + port);
});


// exports.init = function(app) {
//     //connection to the mongo database
//     var uri = "mongodb://localhost:27017/file";
//     mongoose.connect(uri, { server: { auto_reconnect: true } });

//     conn.once('open', function() {
//         console.log('connection open and the mongo db URI is' + uri);
//     });
// };

var storage = GridFsStorage({
    gfs: gfs,
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        console.log("file : ", file);
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    },
    /** With gridfs we can store aditional meta-data along with the file */
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'docStorage' //root name for collection to store files into
});

var upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        res.json({ error_code: 0, err_desc: null });
    });
});

app.get('/file', function(req, res) {
    gfs.collection('docStorage');
    gfs.files.find()
        .toArray(function(err, data) {
            if (err) {
                res.status(500);
                res.send("Internal Server error");
            } else {
                res.status(200);
                res.json(data);
            }
        });
});

app.get('/file/:filename', function(req, res) {
    gfs.collection('docStorage'); //set collection name to lookup into

    /** First check if file exists */
    gfs.files.find({ filename: req.params.filename }).toArray(function(err, files) {
        if (!files || files.length === 0) {
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        /** create read stream */
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "docStorage"
        });
        /** set the proper content type */
        res.set('Content-Type', files[0].contentType)
        res.setHeader('Content-type', 'Content-disposition', 'inline; filename=' + files[0].filename);
        /** return response */
        return readstream.pipe(res);
    });
});
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});
