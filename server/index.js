const express = require("express");
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const userRoute = require("./routes/userRoute");
const busesRoute = require("./routes/busesRoute");
const bookingsRoute = require('./routes/bookingsRoute');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/buses", busesRoute);
app.use('/api/bookings', bookingsRoute);

app.listen(port, () => console.log(`Listening at ${port}`));
