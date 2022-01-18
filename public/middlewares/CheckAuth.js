module.exports = (req, res, next) => {
  if (req.session.isloggedin === true) next();
  else res.render("main");
};
