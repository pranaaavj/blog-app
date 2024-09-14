const jwt = require('jsonwebtoken');

const secret = 'VerySecretKey';

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    fullname: user.fullname,
    profileImgURL: user.profileImgURL,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  validateToken,
  createTokenForUser,
};
