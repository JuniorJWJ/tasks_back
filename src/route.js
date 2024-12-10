const express = require("express");
const userController = require("./controllers/taskController");

const route = express.Router();

// Task
route.get("/task", userController.get);
route.get("/task/:id", userController.findById);
route.post("/task/create", userController.create);
route.put("/task/update/:id", userController.update);
route.delete("/task/delete/:id", userController.delete);
route.put("/task/update-order", userController.updateOrder);

module.exports = route;
