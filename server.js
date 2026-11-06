require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const sequelize = require('./database/database');

const studentRouter = require('./routes/studentRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const invoiceRouter = require('./routes/invoiceRoutes');
const feeCategoryRouter = require('./routes/feeCategoryRoutes');

const app = express();

app.use(express.json());
app.use(studentRouter);
app.use(paymentRouter);
app.use(invoiceRouter);
app.use(feeCategoryRouter);

const dbConnect = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error.message);
    }
};

dbConnect();

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    
});