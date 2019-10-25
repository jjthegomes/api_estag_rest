import express from "express";
import authMiddleware from "../middlewares/auth";
import Cliente from "../models/cliente";
import Usuario from "../models/usuario";
import Vaga from "../models/vaga";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const existingUser = await Usuario.findById(req.usuarioId);

    if (!existingUser)
      return res.status(400).send({ error: "Usuário não existe." });

    const existingCliente = await Cliente.findOne({
      usuario: req.usuarioId
    });

    if (existingCliente)
      return res.status(400).send({ error: "Cliente já existe." });

    const cliente = await Cliente.create({
      ...req.body,
      usuario: req.usuarioId
    });
    await cliente.save();

    return res.send({ cliente });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao salvar cliente" });
  }
});

router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find().populate(["usuario"]);
    return res.send({ clientes });
  } catch (err) {
    console.log(err);

    return res.status(400).send({ error: "Lista de Clientes não encontrada" });
  }
});

router.get("/usuario", async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ usuario: req.usuarioId }).populate(
      "usuario"
    );
    if (!cliente)
      return res.status(401).send({ error: "Nenhum cliente encontrado" });

    return res.send(cliente);
  } catch (err) {
    return res.status(406).send({ error: "Cliente não encontrado" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ _id: req.params.id }).populate(
      "usuario"
    );
    return res.send({ cliente });
  } catch (err) {
    return res.status(400).send({ error: "Cliente não encontrado" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body
        }
      },
      { new: true }
    );
    return res.send({ cliente });
  } catch (err) {
    return res.status(400).send({ error: "Cliente não encontrado" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findOneAndDelete({ _id: req.params.id });
    return res.send({ cliente });
  } catch (err) {
    return res.status(400).send({ error: "Cliente não encontrado" });
  }
});

module.exports = app => app.use("/api/cliente", router);
