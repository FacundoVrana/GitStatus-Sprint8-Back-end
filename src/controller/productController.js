/*const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");

const Products = db.Product;
const Images = db.Image;
const Brands = db.Brand;


let productController = {
    cart: (req, res) => {
        res.render('cart');
    },
    create: (req, res) => {
        res.render('createProd')
    },
    readAll: async (req, res) => {
        try{
            let products = await Products.findAll({
                include: ["Brand", "Image"]
            });
            res.render('/', { products });
        }catch(error){
            console.log(error);
            return res.status(500);
        }

    },

    readProduct: async (req, res) => {
        try {
            const product = await Products.findByPk(req.params.id, {include: ["Brand", "Image"]});
                console.log(product)

            
            if (product) {
                res.render('productDesc', { product});
            } else {
                res.render('error404');
            }
        } catch (error) {
            console.log(error);
            return res.status(500);
        }



        // const categoryProducts = productModel.findAllByField("categoria", product.categoria);
/*      Filtraría los productos pero se rompe cuando solamente existe uno de una categoría.
        const filteredProducts = productModel.findAllByField("categoria", product.categoria);
        let categoryProducts = [];
        for (let i = 0; i < 4; i++) {
            categoryProducts.push(filteredProducts[i]);
        }  

    },

    createProduct: async (req, res) => {
        try {
            let brands = await Brands.findAll();

            res.render('createProd', {brands});
        } catch (error) {
            console.log(error);
            return res.status(500); 
        }

    },

    recieveForm: async (req, res) => {
        try {
            const product = req.body;

            product.image = req.file ? req.file.filename : '';

            let productoCreado = await Products.create(product);
            console.log("se creo el producto");
    
            let productImage = await Images.create({
                name: product.image, 
                products_id: productoCreado.id
            });
            res.redirect('/')
        } catch (error) {
            console.log(error);
            return res.status(500);
        }

    },

    modifyProduct: async (req, res) => {
        try {
            const product = await Products.findOne({
                where: {id : req.params.id}, 
                include: ["Brand", "Image"]
            });
            const productBrands = await Brands.findAll();
            const productImages = await Images.findOne({where: {productId: product.id}});
            res.render('productDesc', { 
                product, 
                productBrands, 
                productImages
             });
        } catch (error) {
            console.log(error);
            return res.status(500);
        }
    },

    modifyForm: async (req, res) => {
        try {
            let product = req.body;
            product.image = req.file ? req.file.filename : req.body.oldImagen;
            if (req.body.image === undefined) {
                product.image = product.oldImagen
            };
            delete product.oldImagen;
            let updatedProduct = await Products.update({ 
                name: product.name,
                price: product.price,
                stock_min: product.stock_min,
                stock_max: product.stock_max,
                discount: product.discount,
                description: product.description,
                brands_id: product.brands_id,
                categories_id: product.categories_id
            },
                {where: { id: req.params.id }});

            let productImage = await Images.update({
                name: product.image
            },
                {where: {productId: req.params.id}});

            res.redirect('/productDesc' + req.params.id);
        } catch (error) {
            console.log(error);
            return res.status(500);
        }
    },

    deleteProduct: async (req, res) => {

        let deletedProduct = await Products.destroy({where: {id : req.params.id}});
      
        res.redirect('/')
    }


   
    }

module.exports = productController;*/

const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const {Category,  Image, Product, Users} = require('../database/models');
const {	validationResult } = require('express-validator');
const imageController = require('./imageController');


let productController = {
    list: (req, res) => {
        db.Product.findAll(
            {include:['category', 'user', 'images']}
            
        )
        .then(productos => {
            return res.render('/', {productos})})
           /*console.log(propertys);
            let respuesta = {
                meta: {
                    status:200,
                    total: propertys.length
                },
                data: propertys

          
            
            
            //res.json(respuesta);
        });*/
       
       },
    cart: (req, res) => {
        res.render('cart');
    },
    create: (req, res) => {
        res.render('createProd')
    },
    store: async (req, res) => {
        const validations = validationResult(req);
        if (validations.errors.length > 0) {
             return res.render ('createProd',{
                errors: validations.mapped(),
                oldData: req.body,
            });
        }

        // console.log(req.body);
        // console.log('------------------------------');

        let newProduct = await Product.create({
      
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            description: req.body.description,
            brand: req.body.brand,
            categories_id: req.body.category
        });


        let imagesFiles = [];
        let nameImage = '';
        for (let i = 0; i < 1; i++) {
            if (i==0) nameImage = req.files.image[0] ? req.files.image[0].filename : '.jpg';
            imagesFiles.push({
                name: nameImage
            })
        }

        let images = imageController.bulkCreate(newProduct.id, imagesFiles);
        
        let user = req.session.userLogged;
        let producto = await Product.findByPk(newProduct.id, 
            {include:['images', 'category']});
        res.render('productDesc', {producto});
   
    },     
    detalleCrud: async (req, res) => {
        let producto = await Product.findByPk(req.params.id, 
            {include:['images', 'category']});

        let user = req.session.userLogged;
        
        if (producto) {
            res.render('productDesc', {producto});
        } else {
            res.render('error404');
        }
    },
    edit: async (req, res) => {
        let productId = req.params.id;
        let product = await Product.findByPk(productId, {include: ['images']});


        if ( product ) {
            res.render('editProd', {product});
        }

    },
    update: async (req,res) => {
        let productId = req.params.id;

        console.log('--------------------------------------------');
        console.log(req.body);
        console.log('--------------------------------------------');

        let productUpdated = await Product.update({
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            description: req.body.description,
            brand: req.body.brand,
            categories_id: req.body.category
        },{
            where: {id: productId}
        });

        //Edición de las imágenes
        let imagesFiles = [];
        // console.log(req.files);
        // console.log("--------------------Antes de leer files---------------------------")
        if (req.files.image) imagesFiles.push({name: req.files.image[0].filename, image_num:1})
        //if (req.files.image) imagesFiles.push({image_name: req.files.image[0].filename, image_num:2})
        //if (req.files.image) imagesFiles.push({image_name: req.files.image[0].filename, image_num:3})
        // console.log(imagesFiles);
        // console.log("--------------------Voy a bulkEdit--------------------------------")
        // console.log(await imageController.bulkEdit(propertyId, imagesFiles));
        let imagesNew = await imageController.bulkEdit(productId, imagesFiles);

        let user = req.session.userLogged;
        let producto = await Product.findByPk(productId, 
            {include:['images']});
        if (producto) {
          res.render('productDesc', {producto});  
        }
        
        
    },

    delete: (req,res) => {
        let productId = req.params.id;
        Product.findByPk(productId)
        .then(product => {
        return res.render(path.resolve(__dirname, '..', 'views',  'deleteProd'), {product})})
        .catch(error => res.send(error))
    },

    destroy: async function (req, res) { 
         let productId = req.params.id;
        Product.findByPk(productId,
            {
                include : ['images']
            });
        await Image.destroy({ where: { product_id: productId }, force: true });
        await Product.destroy({ where: { id: productId }, force: true });
        return res.redirect('/')
        .catch(error => res.send(error)) 
    },


    
}


module.exports = productController;