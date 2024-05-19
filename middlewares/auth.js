const { getUser } = require("../service/auth");

async function checkForAuthenticatoin(req, res, next) {
  const tokenCookie = req.cookies?.token;

  if (!tokenCookie) {
    res.end("Not authenticated");
    return next();
  }

  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  next();
}

module.exports = { checkForAuthenticatoin };
