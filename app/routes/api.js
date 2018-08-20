var User        = require('../models/user');
var jwt         = require('jsonwebtoken');
var secret      = 'harrypotter';

//USER REGISTRATION PAGE
module.exports = function(router) {
    // http://localhost:8080/api/users
    router.post('/users', function (req, res){
                var user        = new User();
                user.name       = req.body.name;
                user.email      = req.body.email;
                user.username   = req.body.username;
                user.password   = req.body.password;
                user.subject    = req.body.subject;
                if (req.body.name == null || req.body.name == '' || req.body.email == null || req.body.email == '' || req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.subject == null || req.body.subject == '')
                {
                    res.json({ success: false, message: 'E021 : Ensure all the feilds are provided' });
                } 
                else 
                {
                    user.save(function(err)
                    {
                        if (err)
                            {
                            res.json({ success: false, message: 'E022 : Username/E-Mail already registered.' });
                            }
                        else
                             {
                                res.json({ success: true, message: 'User Created' });
                             }
                    });
                 }
    });


    //USER LOGIN ROUTE
    router.post('/authenticate', function(req, res)
    {
            User.findOne({ username: req.body.username }).select('email username password active').exec(function(err, user) 
            {
                if(err) throw err;
                if (!user) 
                {
                    res.json({success:false, message : 'Couldnot authenticate the user'});
                } 
                else if (user)
                {
                    if(req.body.password) 
                    {
                         var validPassword = user.comparePassword(req.body.password);
                    }
                    else 
                    {
                            res.end({success:false, message : 'No password provided!'});
                    }
                }
                {
                if(!validPassword)
                {
                         res.json({success:false, message : 'Couldnot authenticate the user'});
                }
                else
                {
                         var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '1h'});
                         res.json({success:true, message : 'User Authenticated!', token: token});
                    }
                }
            });

    });

    //USER TOKEN ROUTE
    router.use(function(req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];
    if (token) {
            // Function to verify token
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
                } 
                else 
                {
                    req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
                    next(); // Required to leave middleware
                }
            });
        } 
        else 
        {
            res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
        }
    });


    router.post('/me', function(req, res){
    res.send(req.decoded);
    });
    return router;
};



