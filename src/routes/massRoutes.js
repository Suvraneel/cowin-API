const massController = require("../controllers/massController");

module.exports = (app) => {
  app.delete("/developer", massController.wipe);
  app.post("/developer", massController.fill);
};
