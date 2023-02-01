const bcrypt = require("bcrypt");
const { User } = require("../../models");
const { Conflict } = require("http-errors");
const gravatar = require("gravatar");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict(409, "Email in use");
    }
    const avatarUrl = gravatar.url(email);
    const newUser = new User({
      email,
      password: await bcrypt.hash(password, 10),
      avatarUrl,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

module.exports = signup;