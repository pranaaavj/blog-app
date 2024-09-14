const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const UserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: '/images/default.png',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', function (next) {
  const user = this;

  //checking if user.password is modified
  if (!user.isModified('password')) return;

  //generating salt and hash password
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  //assigning hashed password
  this.password = hashedPassword;
  this.salt = salt;

  next();
});

UserSchema.static(
  'comparePasswordAndGenerateToken',
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error('User not found');

    //grabing the salt and password
    const salt = user.salt;
    const hashedUserPassword = user.password;

    //creating hash for user provided password
    const userProvidedHash = createHmac('sha256', salt)
      .update(password)
      .digest('hex');

    //checking both passwords
    if (hashedUserPassword !== userProvidedHash)
      throw new Error("Password Doesn't match");

    const token = createTokenForUser(user);
    return token;
  }
);

module.exports = model('User', UserSchema);
