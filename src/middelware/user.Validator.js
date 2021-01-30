const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, process.env.secrate);
    req.user = decoded.user;
    next();
  } catch (e) {
    res.status(500).send({ message: "Invalid Token" });
  }
};
