const bcrypt = require('bcryptjs');

const testPassword = 'researcher';
const saltRounds = 10;

async function testPasswordHashing() {
    // Hash the password
    const hashedPassword = await bcrypt.hash(testPassword, saltRounds);
    console.log(`Hashed password: ${hashedPassword}`);

    // Verify the password
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log(`Password match: ${isMatch}`); // Should be true
}

testPasswordHashing();
