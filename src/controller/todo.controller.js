let Todo = require('../models/todo.model');

exports.list_all_todos = (req,res) => {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
}

exports.cerate_todo = (req, res) => {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json('todo added successfully');
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
}

exports.find_a_todo = (req, res) => {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
}

exports.todo_update = (req, res) => {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;
            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
}

exports.todo_delete = (req, res) => {
    Todo.remove({_id : req.params.id}, (err, result) => {
        if(err)
        {
            console.log(err)
            res.status(404).send("Something went wrong!")
        }
        else{
            res.json(result)
        }
    })
}