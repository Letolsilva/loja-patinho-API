const Product = require("../models/productsModel");
const User = require("../models/userModel");

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, quantityInStock } = req.body;
    if (!name || !description || !price || !imageUrl || !quantityInStock) {
      return res
        .status(400)
        .json({ error: "Por favor, forneça todos os campos obrigatórios" });
    }
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Já existe um produto com este nome" });
    }
    const newProduct = new Product(req.body);

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Produto adicionado com sucesso", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao adicionar produto", message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { name } = req.body;
    const product = await Product.findOne({ name: name }).exec();
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao obter detalhes do produto",
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { newProductData } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      newProductData,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res
      .status(200)
      .json({ message: "Produto atualizado com sucesso", product });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar produto", message: error.message });
  }
};

exports.buyProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { quantity, userId } = req.body;

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ error: "Por favor, forneça uma quantidade válida" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (product.quantityInStock < quantity) {
      return res.status(400).json({
        error: "Quantidade solicitada maior do que a disponível em estoque",
      });
    }

    const totalPrice = product.price * quantity;

    product.quantityInStock -= quantity;
    const user = await User.findById(userId);
    user.productHistory.push(product);
    await User.findByIdAndUpdate(userId, user);
    await product.save();

    res
      .status(200)
      .json({ message: "Compra realizada com sucesso", totalPrice });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao realizar compra", message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar produto", message: error.message });
  }
};
