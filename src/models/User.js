const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");
const config = require('../config');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: {type: String, required: true },
    lastName: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  });

  userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, username: this.username, role: this.role}, config.jwt.secret, {expiresIn: config.jwt.expiresIn});
    return token;
  }
  
  const User = mongoose.model('User', userSchema);

  module.exports = User;
  