const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const { registerValidation, loginValidation } = require("../util/validation");
const { uploadFile } = require("../util/s3");

module.exports.register = async (req, res, next) => {
  try {
    const { error } = registerValidation(req.body);
    if (error)
      return res
        .status(500)
        .json({ msg: "credentials aren't correct", status: false });

    const userCheck = await User.findOne({ username: req.body.username });
    if (userCheck)
      return res
        .status(500)
        .json({ msg: "That username is already taken", status: false });

    const emailCheck = await User.findOne({ email: req.body.email });
    if (emailCheck)
      return res
        .status(500)
        .json({ msg: "That email is already taken", status: false });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    try {
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      return res.status(200).json({ user: savedUser, status: true });
    } catch (err) {
      return res
        .status(500)
        .json({ msg: "somthing went wrong saving user", status: false });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.login = async (req, res) => {
  const { error } = loginValidation(req.body);

  if (error)
    return res.status(500).json({
      msg: "something isn't right with your username or password",
      status: false,
    });

  const foundUser = await User.findOne({ username: req.body.username });

  if (!foundUser)
    return res
      .status(500)
      .json({ msg: "no user found with that username", status: false });

  const correctPassword = await bcrypt.compare(
    req.body.password,
    foundUser.password
  );

  if (!correctPassword)
    return res
      .status(500)
      .json({ msg: "Youre password is incorrect", status: false });

  return res.status(200).json({ user: foundUser, status: true });
};

module.exports.addAvatar = async (req, res) => {
  const file = req.file;
  const id = req.body.id;
  let location;

  try {
    location = await (await uploadFile(file)).Location;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: id },
      { avatar: location, isAvatarImageSet: true },
      { new: true }
    );

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err });
  }
};
