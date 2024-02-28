const express = require("express");
const routerProducts = express.Router();
const productController = require("../controllers/productsControllers");

//Cria patinho
routerProducts.post("/product/register", productController.createProduct);
// Lista de patinhos
routerProducts.get("/products/all", productController.getAllProducts);
//Detalhes de um patinho
routerProducts.get("/product", productController.getProduct);
//Altera patinhos
routerProducts.patch(`/product/:productId`, productController.updateProduct);
//Compra patinho
routerProducts.post("/product/:productId/buy", productController.buyProduct);
//deleta patinho
routerProducts.delete(`/product/:productId`, productController.deleteProduct);

module.exports = routerProducts;
