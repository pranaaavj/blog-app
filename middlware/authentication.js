const { validateToken } = require('../services/authentication');

function checkAuthenication(cookieName) {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return next();
    }
    try {
      const payload = validateToken(token);
      req.user = payload;
    } catch (error) {}
    next();
  };
}

module.exports = {
  checkAuthenication,
};
