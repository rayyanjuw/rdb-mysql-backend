const express = require('express');
// const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 8000;

const userRouter = require('../routes/userRoutes')
const authRouter = require('../routes/authRoute')
const publicationRouter = require('../routes/publicationRoute')
app.use(express.json()); // Middleware to parse JSON bodies

require('../Models/association')
// Import the sequelize instance to ensure the connection is established
require('../config/mysqlConnection'); // Ensure this line is present

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/publication', publicationRouter)




app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});




