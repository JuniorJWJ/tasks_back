const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");


dotenv.config();


const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  ssl: true,  
});

module.exports = {
  
  async get() {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM tasks ORDER BY order_field
      `;
      const { rows } = await client.query(query);
      client.release();
      return rows;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  
  async create(newTask) {
    try {
      const client = await pool.connect();
  
      
      const result = await client.query(`SELECT COALESCE(MAX(order_field), 0) + 1 AS next_order FROM tasks`);
      const nextOrderField = result.rows[0].next_order;
  
      const query = `
        INSERT INTO tasks (id, name, cost, due_date, order_field)
        VALUES ($1, $2, $3, $4, $5)
      `;
      const values = [
        uuidv4(),
        newTask.name,
        newTask.cost,
        newTask.dueDate,
        nextOrderField,
      ];
  
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  
  async delete(id) {
    try {
      const client = await pool.connect();
      const query = `
        DELETE FROM tasks WHERE id = $1
      `;
      const values = [id];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  
  async update(updatedTask, taskId) {
    try {
      const client = await pool.connect();
      const query = `
        UPDATE tasks SET
          name = $1,
          cost = $2,
          due_date = $3,
          order_field = $4
        WHERE id = $5
      `;
      const values = [updatedTask.name, updatedTask.cost, updatedTask.dueDate, updatedTask.orderUpdate, taskId];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  
  async findByName(taskName, excludeId = null) {
    try {
      const client = await pool.connect();
      const query = excludeId
        ? `SELECT * FROM tasks WHERE name = $1 AND id <> $2`
        : `SELECT * FROM tasks WHERE name = $1`;
      const values = excludeId ? [taskName, excludeId] : [taskName];

      const { rows } = await client.query(query, values);
      client.release();

      if (rows.length === 0) {
        return null;
      }

      const task = rows[0];
      return {
        id: task.id,
        name: task.name,
        cost: task.cost,
        dueDate: task.due_date,
        order: task.order_field,
      };
    } catch (error) {
      console.error("Error fetching task by name:", error);
      throw error;
    }
  },

  async findById(taskId) {
    try {
      const client = await pool.connect();
      const query = `
        SELECT * FROM tasks WHERE id = $1
      `;
      const values = [taskId];
      const { rows } = await client.query(query, values);
      client.release();
      if (rows.length === 0) {
        return null;
      }
      const task = rows[0];
      return {
        id: task.id,
        name: task.name,
        cost: task.cost,
        dueDate: task.due_date,
        order: task.order_field,
      };
    } catch (error) {
      console.error("Error fetching task by id:", error);
      throw error;
    }
  },
  async updateOrderField(id, orderField) {
    try {
      const client = await pool.connect();
      const query = `UPDATE tasks SET order_field = $1 WHERE id = $2`;
      const values = [orderField, id];
      await client.query(query, values);
      client.release();
    } catch (error) {
      console.error("Error updating order field:", error);
      throw error;
    }
  }
};
