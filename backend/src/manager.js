const bcrypt = require('bcryptjs');

const testPassword = async () => {
  const storedHash = '$2b$10$yr9TMZxg2A.K03jc8hee9etVXCEYB6HjmWVN5nABL5nR1.lrwKz46'; // Example
  const enteredPassword = 'manager2'; // Password entered by the user

  const isMatch = await bcrypt.compare(enteredPassword, storedHash);
  console.log('Password match:', isMatch);
};

testPassword();
