const express = require('express')
const bodyParser = require('body-parser')
const Router = require('router')
const cron = require("node-cron")
const fs = require("fs")

const taskController = require('./app/task/taskController')
const connection = require('./app/lib/database').connection


const app = express()

// applying middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//Post a Task
app.post('/api/v1.0/task', taskController.createTask)

//Get all tasks
app.get('/api/v1.0/task', taskController.getTask)

//Get a task by ID
app.get('/api/v1.0/task/id/:taskId', taskController.getTaskbyId)

//Update Task by ID
app.put('/api/v1.0/task/id/:taskId', taskController.updateTaskbyId)

//Delete task by ID
app.delete('/api/v1.0/task/id/:taskId', taskController.deleteTaskbyId)

// schedule tasks to be run on the server   
cron.schedule("* * * * *", function () {
    connection.query("INSERT INTO taskhistory SELECT * FROM tasklist WHERE updatedAt >updatedAt+7", function (err, result, fields) {
        if (err) {
            throw err
        } else if (result.affectedRows == 0) {
            console.log('No record available in taskhistory')
        } else {
            connection.query("DELETE FROM tasklist WHERE updatedAt >updatedAt+7", function (err, result, fields) {
                if (err) {
                    throw err
                } else {
                    return result
                }
            })
        }
    })
})

app.listen(4000, () => {
    console.log('Server is listening at port 4000')
})