require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const sequelize = require('./database/database');

const studentRoutes = require('./routes/studentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const feeCategoryRoutes = require('./routes/feeCategoryRoutes');

const app = express();

app.use(express.json());
app.use("/students", studentRoutes);
app.use("/payments", paymentRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/fee-categories", feeCategoryRoutes);

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