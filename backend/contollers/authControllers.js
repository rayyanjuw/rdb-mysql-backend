const bcrypt = require("bcryptjs");
const User = require("../Models/userModels");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // console.log(`Stored hash:`, user.password);
    // console.log(`Password to compare:`, password);
    // console.log('User found:', user);

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparedPassword(password);

    console.log(`Password match:`, isMatch); // Should log true if passwords match
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password matches. Generating token...");
    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = login;
