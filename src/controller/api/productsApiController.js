const { response } = require('express');
const db = require('../../src/database/models');
const sequelize = db.sequelize;

const Products = db.Product;
const Images = db.Image;
const Categories = db.Category;

let productsAPIController = {
    // Lista todos los productos
    list: async (req, res) => {
        try {
            // Busco todos los productos en db
            let products = await Products.findAll({
                include: ["category", "image"]
            });
            // declaro contadores
            let peliculas = 0;
            let comics = 0;
            let videojuegos = 0;

            // itero el array de productos e incremento cada contador si cumple
            for (let i = 0; i < products.length; i++) {
                switch (products[i].dataValues.categoryId) {
                    case 1:
                        peliculas ++;
                        break;
                    case 2:
                        comics ++;
                        break;
                    case 3:
                        videojuegos ++;
                        break;               
                    default:
                        break;
                }
                delete products[i].dataValues.categoryId;
                delete products[i].dataValues.createdAt;
                delete products[i].dataValues.updatedAt;
                delete products[i].dataValues.brandId;

                products[i].dataValues.detail = `api/products/${products[i].dataValues.id}`
            }

            // Armo respuesta en formato JSON
            let respuesta = {
                meta: {
                    status : 200,
                    count: products.length,
                    countByCategory: {
                        peliculas: peliculas,
                        comics: comics,
                        videojuegos: videojuegos,
                    },
                    url: 'api/products'
                },
                data: products
            }


            res.json(respuesta);
        } catch (error) {
            console.log(error);
            return res.status(500);
        }
    }
}

module.exports = productsApiController;
