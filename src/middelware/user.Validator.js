const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
let User = require("../models/user.model");

/**
 * For validate the token
 * @body {Object} username - validate username
 * @body {Object} email - validate email address
 * @body {Object} phone - validate phone number
 * @body {Object} password - validate password
 *
 */
exports.validateUser = [
  check("username", "Please Enter a Valid Username").not().isEmpty(),
  check("email", "Please enter a valid email").isEmail(),
  check("phone", "Please enter a valid phone number,").isLength({
    max: 11,
  }),
  check("password", "Please enter a valid password").isLength({
    min: 8,
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

/**
 * For validate the token
 * @param {Object} req - caching the  from the request URL
 * @param {Object} res - sending response back to to the client
 * @param {Object} next - pass controll to next middleware
 *
 */
exports.auth = async (req, res, next) => {
  const apiKey = req.header("Apikey");
  const token = req.header("Authorization");
  if (apiKey) {
    const getUser = await User.findOne({ apikey: apiKey });
    if (!getUser)
      return res.status(401).json({ message: "Unauthorized Accesss" });

    req.user = getUser;
    next();
  } else {
    if (!token)
      return res.status(401).json({ message: "Unauthorized Accesss" });
    try {
      jwt.verify(token, process.env.secrate, (err, decoded) => {
        if (err) return res.status(401).json({ message: "session expire" });
        req.user = decoded.user;
        next();
      });
    } catch (e) {
      res.status(500).send({ message: "Token Invalid" });
    }
  }
};
