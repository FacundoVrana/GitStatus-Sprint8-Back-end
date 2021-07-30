const db = require('../../src/database/models');
const sequelize = db.sequelize;

const Users = db.User;

let usersAPIController = {
// List busca todos los usuarios
    list: async (req, res) => {
        try {
            let userList = await Users.findAll();
            // Armo respuesta con resultado de findAll
            let respuesta = {
                meta: {
                    status : 200,
                    count: userList.length,
                    url: 'api/users'
                },
                data: userList
            }
            // Almaceno array data en arrayUsers
            let arrayUsers = respuesta.data;

            // Elimino password de cada objeto del array
            let newArray = arrayUsers.map((user) => { 
                delete user.dataValues.password
                user.dataValues.detail = `api/users/${user.dataValues.id}`
                return user;});
            // Envio respuesta en formato JSON
            res.json(respuesta);
        } catch (error) {
            console.log(error);
            return res.status(500);
        }
    },
    detail: async (req, res) => {
        try {
            // Busco user en DB
            let user = await Users.findOne(
                {where: {id : req.params.id}, 
            })
            let respuesta = {
                meta: {
                    status : 200,
                    url: `api/users/${user.id}`
                },
                data: user
            }
            delete respuesta.data.dataValues.password;
            delete respuesta.data.dataValues.createdAt;
            delete respuesta.data.dataValues.updatedAt;

            res.json(user);
        } catch (error) {
            console.log(error);
            return res.status(500);
        }
    }
}

module.exports = userApiController;