const connection = require('../lib/database').connection

module.exports = {
    createTask: function (req, res) {
        // access the data in the request body
        const requestData = req.body
        console.log(requestData)

        //if task message is not available then returning error
        if (!requestData.taskMessage) {
            return res.status(400).json({ code: "taskCreationFailed", message: "task message not available" })
        }

        const taskData = {
            taskMessage: requestData.taskMessage,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        connection.query("INSERT INTO tasklist SET ?", taskData, function (err, result, fields) {
            if (err) {
                console.log(err)
                return res.status(400).json({ code: "taskCreationFailed", message: "error occured while creating record" })
            }
            return res.status(200).json({ code: "taskCreated", message: "Task has been successfully Created" })
        })
    },

    getTask: function (req, res) {
        connection.query("SELECT * FROM tasklist", function (err, results, fields) {
            if (err) {
                console.log(err)
                return res.status(400).json({ code: "taskNotFound", message: "Error occured while sending result" })
            }
            return res.status(200).json({ code: "taskFound", data: results })
        })
    },

    getTaskbyId: function (req, res) {
        //accessing the task ID to find 
        const taskId = req.params.taskId
        connection.query("SELECT * FROM tasklist WHERE id = ?", [taskId], function (err, results, fields) {
            if (err) {
                console.log(err)
                return res.status(500).json({ code: "TaskNotFound", message: "Error occured while finding a task" })
            }
            if (results.length === 0) {
                return res.status(404).json({ code: "TaskNotFound", message: "Task with this ID does not exist" })
            }
            return res.status(200).json({ code: "TaskFound", data: results })
        })
    },

    updateTaskbyId: function (req, res) {
        //accessing the task by id
        const taskId = req.params.taskId
        //Request Data
        const requestData = req.body

        if (!requestData.taskMessage) {
            return res.status(400).json({ code: "taskUpdatedFailed", message: "Message not available in body" })
        }
        connection.query('SELECT * FROM tasklist WHERE id=?', [taskId], function (err, results, fields) {
            if (err) {
                return res.status(400).json({ code: "taskUpdatedFailed", message: "Error occured while accessing the database" })
            } if (results.length === 0) {
                return res.status(500).json({ code: "taskUpdatedFailed", message: "No record with this id exits" })
            }
            connection.query("UPDATE tasklist SET taskMessage =?,updatedAt=?,WHERE id=?", [requestData.taskMessage, new Date(), taskId], function (err, results, fields) {
                if (err) {
                    return res.status(500).json({ code: "taskUpdatedFailed", message: "Error occured while updating the task" })
                }
                return res.status(200).json({ code: "taskUpdated", message: "Task has been successfully updated" })
            })
        })
    },
    deleteTaskbyId: function (req, res) {
        //accessing the taskId
        const taskId = req.params.taskId
        connection.query('SELECT * FROM tasklist WHERE id=?', [taskId], function (err, results, fileds) {
            if (err) {
                console.log(err)
                return res.status(500).json({ code: "TaskDeleteFailed", message: "Error occured while finding the task from database" })
            }
            if (results.length === 0) {
                return res.status(500).json({ code: "TaskDeleteFailed", message: "No task exists with this Id" })
            }
            connection.query("DELETE FROM tasklist WHERE id=?", [taskId], function (err, results, fields) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ code: "TaskDeleteFailed", message: "Error occured while deleting the task from database" })
                }
                return res.status(200).json({ code: "TaskDeleted", message: "Task has been successfully deleted" })
            })
        })
    }
}