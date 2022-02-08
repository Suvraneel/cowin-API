const devController = require("../controllers/massController");

module.exports = (app) => {
  app.delete("/developer", devController.wipe);
  app.post("/developer", devController.fill);
};
