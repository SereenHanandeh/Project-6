const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  try {
    // Check if the 'Authorization' header is present
    if (!req.headers.authorization) {
      return res.status(403).json({ message: "Token must be provided" });
    }

    const token = req.headers.authorization.split(" ").pop();

    // Verify token
    jwt.verify(token, process.env.SECRET, (err, result) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "The token is invalid or expired",
        });
      } else {
        // console.log(result);

        req.token = result;
        next();
      }
    });
  } catch (error) {
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = authentication;
