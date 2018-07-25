var mongooe = require('mongoose');
var Schema = mongooe.Schema;

var bcrypt = require('bcrypt');


// define schema for user
var schema = new Schema({
    email: { type: String, require: true },
    username: { type: String, require: true },
    password: { type: String, require: true },
    creationDate: { type: Date, require: true },
    loginAttempts: { type:Number, require: false, default: 0},
    isLocked: {type: Boolean, require : false, default: false}
});

// hash the passwrod with salt
schema.statics.hashPassword = function (password) {
    return bcrypt.hashSync(password, 16);
}

schema.methods.isValidPassword = function (hashedPassword) {
    return bcrypt.compareSync(hashedPassword, this.password);
}

module.exports = mongooe.model('User', schema);