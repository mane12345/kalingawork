var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var multer = require('multer');
//auth
const router = express.Router();
const User = require('./authtab');

var app = express();
app.set('port', (process.env.PORT || 8000));

//app.use('/', express.static(__dirname + '/../../dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
var mongoose = require('mongoose');
mongoose.connect('webtechdevops.centralindia.cloudapp.azure.com:51003/none', ['jd']);
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// Models
var Cat = require('./cat.model.js');
var Ran = require('./ran.model.js');
var Job = require('./job.model.js');
var Can = require('./can.model.js');
var pro = require('./authtab.js');
var Extrafeed = require('./extrafeed.model.js');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');


    app.use(express.static(path.join(__dirname, 'uploads')));
    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function(req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function(req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
    });

    var upload = multer({ //multer settings
        storage: storage
    }).single('file');




    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req, res, function(err) {
            console.log(req.file);
            if (err) {
                res.json({ error_code: 1, err_desc: err });
                return;
            }
            res.json(req.file);
        });
    });


    // for dropdown in tech page 

    app.get('/drops', function(req, res) {
        var query = Cat.find({});
        query.distinct('job_description');
        query.exec(function(err, docs) {
            if (err) return console.error(err);
            res.json(docs);
        });
    });
    // for dynamic questions based on dropdown
    app.get('/quesD/:ques', function(req, res) {
        Cat.find({ 'job_description': req.params.ques }, function(err, obj) {
            if (err) return console.error(err);
            res.json(obj);
        })
    });
    //remove the candidate after completing interview

    // update 
    app.delete('/removecand/:id', function(req, res) {
        console.log('noooooooooooooooo', req.params.id);

        Can.findOneAndRemove({ _id: req.params.id }, function(err) {
            if (err) return console.error(err);
            res.sendStatus(200);
        });
    });

    // for job description
    // select all
    app.get('/cats', function(req, res) {
        Cat.find({}, function(err, docs) {
            if (err) return console.error(err);
            res.json(docs);
        });
    });

    // count all
    app.get('/cats/count', function(req, res) {
        Cat.count(function(err, count) {
            if (err) return console.error(err);
            res.json(count);
        });
    });

    // create
    app.post('/cat', function(req, res) {
        var obj = new Cat(req.body);
        obj.save(function(err, obj) {
            if (err) return console.error(err);
            res.status(200).json(obj);
        });
    });



    // find by id
    app.get('/cat/:id', function(req, res) {
        Cat.findOne({ _id: req.params.id }, function(err, obj) {
            if (err) return console.error(err);
            res.json(obj);
        })
    });

    // update by id
    app.put('/cat/:id', function(req, res) {
        Cat.findOneAndUpdate({ _id: req.params.id }, req.body, function(err) {
            if (err) return console.error(err);
            res.sendStatus(200);
        })
    });

    // delete by id
    app.delete('/cat/:id', function(req, res) {
        Cat.findOneAndRemove({ _id: req.params.id }, function(err) {
            if (err) return console.error(err);
            res.sendStatus(200);
        });
    });

    //for technical --------------------------------------------
    //create technical
    app.post('/ran', function(req, res) {
        var obj1 = new Ran(req.body);
        obj1.save(function(err, obj1) {
            if (err) return console.error(err);
            res.status(200).json(obj1);
        });
    });

    //create post job
    app.post('/postjob', function(req, res) {
        var obj2 = new Job(req.body);
        obj2.save(function(err, obj2) {
            if (err) return console.error(err);
            res.status(200).json(obj2);
        });
    });

    // for jobs-------------------------------------------------------

    // select all jobs
    app.get('/jobs', function(req, res) {
        Job.find({}, function(err, docs) {
            if (err) return console.error(err);
            res.json(docs);
        });
    });

    // find by id
    app.get('/job/:id', function(req, res) {
        Job.findOne({ _id: req.params.id }, function(err, obj) {
            if (err) return console.error(err);
            res.json(obj);
        })
    });

    // update by id
    app.put('/job/:id', function(req, res) {
        Job.findOneAndUpdate({ _id: req.params.id }, req.body, function(err) {
            if (err) return console.error(err);
            res.sendStatus(200);
        })
    });

    // delete by id
    app.delete('/job/:id', function(req, res) {
        Job.findOneAndRemove({ _id: req.params.id }, function(err) {
            if (err) return console.error(err);
            res.sendStatus(200);
        });
    });
    // for candidate data-----------------------------------------------
    // select all
    app.get('/cands/', function(req, res) {
        Can.find({}, function(err, docs) {
            if (err) return console.error(err);
            res.json(docs);
        });
    });

    app.get('/cands/:val', function(req, res) {
        Can.find({ 'interviewer_email': req.params.val }, function(err, obj) {
            if (err) return console.error(err);
            res.json(obj);
        })
    });

    // count all
    app.get('/cands/count', function(req, res) {
        Can.count(function(err, count) {
            if (err) return console.error(err);
            res.json(count);
        });
    });

    // create
    app.post('/cand', function(req, res) {
        var obj = new Can(req.body);
        obj.save(function(err, obj) {
            if (err) return console.error(err);
            res.status(200).json(obj);
        });
    });



    // find by id
    app.get('/cand/:id', function(req, res) {
        Can.findOne({ _id: req.params.id }, function(err, obj) {
            if (err) return console.error(err);
            res.json(obj);
        })
    });

    // update by id
    app.put('/cand/:id', function(req, res) {
        Can.findOneAndUpdate({ _id: req.params.id }, req.body, function(err) {
            if (err) return console.error(err);
            res.sendStatus(200);
        })
    });

    // delete by id
    app.delete('/cand/:id', function(req, res) {
        Can.findOneAndRemove({ _id: req.params.id }, function(err) {
            if (err) return console.error(err);
            res.sendStatus(200);
        });
    });
    //---------------------------
    //-----------------28-Mar-2017-------------------------


    //extrafeed get post
    app.post('/extrafeed', function(req, res) {
        var obj = new Extrafeed(req.body);
        obj.save(function(err, obj) {
            if (err) return console.error(err);
            res.status(200).json(obj);
        });
    });

    app.get('/extrafeed', function(req, res) {
        Extrafeed.find({}, function(err, docs) {
            if (err) return console.error(err);
            res.json(docs);
        });
    });


    //new user

    // app.post('/register', function(req, res) {
    //     var obj = new pro(req.body);
    //     obj.save(function(err, obj) {
    //         if (err) return console.error(err);
    //         res.status(200).json(obj);
    //     });
    // });

    //adds privaliges to user
    app.post('/register', (req, res, next) => {

        let newUser = new User({
            admin: req.body.admin,
            culture: req.body.culture,
            tech: req.body.tech
        });

        User.addUser(newUser, (err, response) => {
            if (err) {
                res.json({ success: false, msg: 'Failed to reg user' });
            } else {
                res.json({ success: true, msg: 'User regd' });
            }
        });
    });

    //check privilage

    app.post('/authenticate', (req, res, next) => {
        const username = req.body.username;
        let result = {
            "fadmin": false,
            "ftech": false,
            "fculture": false
        }
        User.getAdmin(username, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                console.log("user");
            } else {
                console.log('checkad');
                result.fadmin = true;

            }
        });


        User.getTech(username, (err, user) => {
            if (err) {
                throw err;
            }
            if (!user) {
                User.getCulture(username, (err, user) => {
                    if (err) {
                        throw err;
                    }

                    if (!user) {
                        res.send(result);
                    } else {
                        console.log('checkcu');
                        result.fculture = true;
                        res.send(result);
                    }
                });
            } else {
                User.getCulture(username, (err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (!user) {
                        result.ftech = true;
                        res.send(result);

                    } else {
                        console.log('checkcu');
                        result.ftech = true;
                        result.fculture = true;
                        res.send(result);
                    }
                });

            }
        });


        //     User.getTech(username, (err, user) => {
        //         if (err) {
        //             throw err;
        //         }
        //         if (!user) {

        //         } else {
        //             console.log('checkte');
        //             result.ftech = true;
        //         }
        //     });

        //     User.getCulture(username, (err, user) => {
        //         if (err) {
        //             throw err;
        //         }
        //         if (!user) {
        //             res.send(result);
        //         } else {
        //             console.log('checkcu');
        //             result.fculture = true;
        //             res.send(result);
        //         }
        //     });

    });


    //-----------------END OF PART 28-Mar-2017-------------------------


    //--------------------
    // all other routes are handled by Angular
    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, 'uploads'));
    });

    app.listen(app.get('port'), function() {
        console.log('Angular 2 Full Stack listening on port ' + app.get('port'));
    });
});

module.exports = app;
module.exports = router;