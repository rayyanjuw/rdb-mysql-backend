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
      { 
        id: user.id,
        role: user.role,
        name: user.name,
        departmentId: user.departmentId,
       },
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

// Generate JWT Token for Impersonation
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      role: user.role,
      name: user.name,
      departmentId: user.departmentId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
};

const impersonateUser = async (req, res) => {
  try {
    const {userId} = req.params;
    const { user } = req;

    const targetUser = await User.findOne({ where: { id: userId }});


    if (!targetUser) {
      return res.status(404).json({ message: 'User not found'});

    }
    if (user.departmentId !== targetUser.departmentId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Cannot impersonate user from a different department'});
    }

    const token = generateToken(targetUser);

    return res.status(200).json({ token, message: `you are now logged in as ${targetUser.name}`})
  } catch (err) {
    return res.status(500).json({ message: err.message})
  }
}


module.exports = {login, impersonateUser}
