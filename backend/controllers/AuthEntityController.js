const AuthEntityService = require("../services/AuthEntityService")

async function getUsers (req, res) {
    
        try {
            const users = await AuthEntityService.getUsers()
            if (!users) {
                res.status(400).json({
                    msg: 'Something went wrong!',
                })
            } 
            res.json(users)
        } catch (error) {
            res.status(500).json({ error: error })
        }
}

exports.getUsers = getUsers;