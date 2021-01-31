let User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let genApiKey = require("uuid-apikey");

/**
 * For authenticate the user
 * @param {Object} req - caching the email and password from the request URL
 * @param {Object} res - sending response back to to the client
 */
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json("invalid username or password");
    }

    const _matchPass = await bcrypt.compare(req.body.password, user.password);
    if (!_matchPass) {
      return res.status(400).json("invalid username or password");
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.secrate,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          user: user,
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(400).send("invalid credentials");
  }
};

/**
 * For register the user
 * @param {Object} req - caching the username, email and password from the request URL
 * @param {Object} res - sending response back to to the client
 * It will generate Api key, append it with user and save it to database
 */
exports.register = async (req, res) => {
  let {
    username,
    email,
    password,
    phone,
    role,
    totalfollowing,
    totalfollowers,
  } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        msg: "User Already Exists",
      });
    }
    if (role == null || role === "") {
      role = "client";
    }

    let apikey = genApiKey.create();
    apikey = apikey.apiKey;

    user = new User({
      username,
      email,
      phone,
      role,
      totalfollowing,
      totalfollowers,
      password,
      apikey,
    });

    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.secrate,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) throw err;

        res.status(200).json({
          token: token,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
};

/**
 * For authenticate the user
 * @param {Object} req - caching the  from the request URL
 * @param {Object} res - sending response back to to the client
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
};

/**
 * For authenticate the user
 * @param {Object} req - caching the  from the request URL
 * @param {Object} res - sending response back to to the client
 */
exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
};

/**
 * For update the user
 * @param {Object} req - caching the  from the request URL
 * @param {Object} res - sending response back to to the client
 */
exports.updateUser = async (req, res) => {
  try {
    let updateObject = req.body;
    let id = req.user.id;

    if (updateObject.password) {
      let salt = await bcrypt.genSalt(10);
      updateObject.password = await bcrypt.hash(updateObject.password, salt);
    }

    const payload = {
      user: {
        id: id,
      },
    };

    let _token;
    jwt.sign(
      payload,
      process.env.secrate,
      {
        expiresIn: "1d",
      },
      (err, token) => {
        if (err) throw err;
        _token = token;
      }
    );

    User.updateOne({ _id: id }, { $set: updateObject }, (err, response) => {
      if (err) throw err;

      if (response.n < 1) {
        res.status(400).json({ msg: "Updation Failed" });
        return;
      }
      res.status(200).json({ user: response, token: _token });
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Problem in Updating User" });
  }
};

/**
 * For delete the user
 * @param {Object} req - caching the  from the request URL
 * @param {Object} res - sending response back to to the client
 */
exports.deleteUser = (req, res) => {
  if (req.user.role === "admin") {
    try {
      User.deleteOne({ _id: req.body.id }, (err, response) => {
        if (err) throw err;
        if (response.n > 0) {
          res.status(200).json({ msg: "user deleted" });
        } else {
          res.status(400).json({ msg: "user not found" });
        }
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("internal server error");
    }
  } else {
    res.status(401).json({ message: "Unauthorized Access" });
  }
};
