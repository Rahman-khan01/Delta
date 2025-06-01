const User = require("../models/user");
module,exports.renderSignupForm = (req, res) => {
res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email already registered");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    await User.register(newUser, password);
    console.log('newUser', newUser);

    req.login(newUser, (err) => {
      if (err) return next(err);

      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });

  } catch (err) {
    console.log('Error during signup', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect(res.locals.redirecturl || "/listings");
};
  
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};