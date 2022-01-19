module.exports = (req, res, next) => {
  if (req.session.isloggedin === true && req.session.isVerified === true)
    next();
  else if (req.session.isloggedin === true && !req.session.isVerified)
    res.render("notVerified");
  else res.render("main");
};
