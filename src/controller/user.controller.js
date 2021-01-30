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
      return res.status(400).json("invalid credentials");
    }

    const _matchPass = await bcrypt.compare(req.body.password, user.password);
    if (!_matchPass) {
      return res.status(400).json("invalid credentials");
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
  const {
    username,
    email,
    password,
    phone,
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

    let api_key = genApiKey.create();
    api_key = api_key.apiKey;

    user = new User({
      username,
      email,
      phone,
      totalfollowing,
      totalfollowers,
      password,
      api_key,
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
  try {
    User.deleteOne({ _id: req.user.id }, (err, response) => {
      if (err) throw err;

      if (response.n > 0) {
        res.status(200).json({ msg: "deleted" });
      } else {
        res.status(400).json({ msg: "user not found" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("internal server error");
  }
};
