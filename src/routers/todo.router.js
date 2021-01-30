const express = require('express');
const todoRoutes = express.Router();
const todoController = require('../controller/todo.controller')
const userController = require('../controller/user.controller')

todoRoutes.route('/todos')
.get(todoController.list_all_todos)
.post(todoController.cerate_todo)

todoRoutes.route('/todos/:id')
.get(todoController.find_a_todo)
.post(todoController.todo_update)
.delete(todoController.todo_delete)

module.exports = todoRoutes;