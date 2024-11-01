const Task = require("../model/Task"); 

module.exports = {
  async get(req, res) {
    try {
      const tasks = await Task.get();
      return res.json({ tasks });
    } catch (error) {
      return res.status(500).json({ msg: "Error retrieving tasks" });
    }
  },
  async create(req, res) {
    const { name, cost, dueDate } = req.body;

    if (!name || !cost || !dueDate || req.file) {
      return res
        .status(400)
        .json({ msg: "Please fill in all the data to complete the registration" });
    }

    try {
      const task = {
        name,
        cost,
        dueDate,
        order: undefined, 
      };

      const existingTask = await Task.findByName(name);
      if (existingTask) {
        return res.status(409).json({
          error: true,
          message: "A task with this name already exists!",
        });
      }

      await Task.create(task);
      res.status(201).json({ msg: "Task registered successfully!" });
    } catch (error) {
      console.error("Error creating task:", error);
      return res
        .status(500)
        .json({ msg: "Error registering the task in the system!" });
    }
  },

  async delete(req, res) {
    const taskId = req.params.id;

    if (!taskId) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide a valid ID!" });
    }

    try {
      const task = await Task.findById(taskId);

      if (task.length === 0) {
        return res
          .status(404)
          .json({ error: true, message: "Task not found!" });
      }

      await Task.delete(taskId);
      return res.status(200).json({ msg: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      return res.status(500).json({ msg: "Error deleting the task" });
    }
  },

  async update(req, res) {
    const taskId = req.params.id;
    const { name, cost, dueDate } = req.body;

    if (!name) {
      return res.status(400).json({ error: true, message: "Please provide a valid name!" });
    }
    order = await Task.findById(taskId)
    console.log("await Task.findById(taskId.order) : ", order.order)
    orderUpdate = order.order
    const updatedTask = {
      name,
      cost,
      dueDate,
      orderUpdate, 
    };

    console.log("updatedTask: ", updatedTask)

    try {
      
      const taskWithSameName = await Task.findByName(name, taskId);
      if (taskWithSameName) {
        return res.status(409).json({ error: true, message: "A task with this name already exists!" });
      }

      
      await Task.update(updatedTask, taskId);
      return res.status(200).json({ msg: "Task updated successfully!" });
    } catch (error) {
      console.error("Error updating task:", error);
      return res.status(500).json({ msg: "Error updating the task" });
    }
  },


  async findById(req, res) {
    const taskID = req.params.id;
    if (taskID === "" || taskID == undefined) {
      return res.status(400).json({
        error: true,
        message: "Please provide a correct ID!",
      });
    }
    try {
      const task = await Task.findById(taskID);

      if (task.length == 0) {
        return res.status(400).json({
          error: true,
          message: "No task found!",
        });
      }

      if (task) {
        return res.status(200).json({
          error: false,
          task,
        });
      }
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "Error retrieving task!",
      });
    }
  },
  async updateOrder(req, res) {
    const { tasksOrder } = req.body;
  
    if (!Array.isArray(tasksOrder)) {
      return res.status(400).json({ msg: "Invalid data format" });
    }
  
    try {
      await Promise.all(
        tasksOrder.map(async ({ id, order_field }) => {
          await Task.updateOrderField(id, order_field); 
        })
      );
      return res.status(200).json({ msg: "Task order updated successfully!" });
    } catch (error) {
      console.error("Error updating task order:", error);
      return res.status(500).json({ msg: "Error updating task order" });
    }
  }
  
  
};
