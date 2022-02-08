const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Define Application
const app = express();

// Define Port
const port = process.env.PORT || 3001;

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Define base routes
app.get("/", function (res) {
  res.send({ ping: "Cowin API - Diablo" });
});

require("./src/routes/centerRoutes")(app);
require("./src/routes/userRoutes")(app);
require("./src/routes/appointmentRoutes")(app);
require("./src/routes/cityRoutes")(app);
require("./src/routes/massRoutes")(app);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(port, () => console.log('Server Running at Port:',{port})))
  .catch((error) => console.log({error},'Connection error'));