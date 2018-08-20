var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs'); 

//User database schema
var UserSchema = new Schema({
    name:           {type: String,  required: true},
    email:          {type: String, required:true, unique:true},
    username:       {type: String, required: true, unique: true, required: true},
    password:       {type: String, required:true},
    subject:        {type: Number, required: true}

});


//configuration for bcrypt
UserSchema.pre('save', function(next){
    var user = this;
    bcrypt.hash(user.password, null, null, function(err,hash){
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password); 
};

module.exports = mongoose.model('User', UserSchema);