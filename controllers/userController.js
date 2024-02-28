const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.authenticator = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Acesso não autorizado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.userId = decoded.userId;
    next();
  });
};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName }).exec();
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Senha incorreta" });
    }
    const token = jwt.sign({ userName: user.userName }, process.env.JWT_SECRET);

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login bem-sucedido" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao entrar" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    if (await User.findOne({ userName: newUser.userName }).exec()) {
      return res.status(400).json({ erro: "Nome de usuário indisponível" });
    }
    if (await User.findOne({ email: newUser.email }).exec()) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }
    await newUser.save();
    res.status(201).json({ mensagem: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName: userName }).exec();
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao encontrar usuario" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao obter usuários" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { newUserData } = req.body;
    const user = await User.findByIdAndUpdate(req.params.userId, newUserData, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ erro: "Erro ao editar usuário" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { adminId, newUserRoleData } = req.body;
    const admin = await User.findOne({ _id: adminId }).exec();
    if (admin.role != "admin")
      return res.status(401).json({ error: "Acesso não autorizado" });

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      newUserRoleData,
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const updateFields = Object.keys(newUserRoleData);
    const allowedFields = ["role"];
    const isAllowed = updateFields.every((field) =>
      allowedFields.includes(field)
    );
    if (!isAllowed) {
      return res
        .status(403)
        .json({ error: "Não autorizado para alterar outras propriedades" });
    }

    user.role = newUserRoleData.role;
    await user.save();

    res.status(200).json({ message: "Propriedade atualizada com sucesso" });
  } catch (error) {
    res
      .status(400)
      .json({ erro: "Erro ao editar permissionamento do usuário" });
  }
};

exports.getUserProductHistory = async (req, res) => {
  try {
    const productHistory = await User.findById(req.params.userId).productHistory;
    if(!productHistory){
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.status(200).json(productHistory);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao obter usuários" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
