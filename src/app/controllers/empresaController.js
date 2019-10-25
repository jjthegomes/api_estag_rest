import express from "express";
import authMiddleware from "../middlewares/auth";
import Empresa from "../models/empresa";
import Usuario from "../models/usuario";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const existingUser = await Usuario.findById(req.usuarioId);

    if (!existingUser)
      return res.status(400).send({ error: "Usuário não existe." });

    const existingEmpresa = await Empresa.findOne({
      cnpj: req.body.cnpj,
      usuario: req.usuarioId
    });

    if (existingEmpresa)
      return res.status(400).send({ error: "Empresa já existe." });

    const empresa = await Empresa.create({
      ...req.body,
      usuario: req.usuarioId
    });
    await empresa.save();
    return res.send({ empresa });
  } catch (err) {
    console.log(err);

    return res.status(400).send({ error: "Erro ao salvar empresa" });
  }
});

router.get("/", async (req, res) => {
  try {
    const empresas = await Empresa.find();
    return res.send({ empresas });
  } catch (err) {
    return res.status(400).send({ error: "Empresas não encontrada" });
  }
});

router.get("/usuario", async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ usuario: req.usuarioId });
    if (!empresa)
      return res.status(404).send({ error: "Nenhuma empresa encontrada" });

    return res.send(empresa);
  } catch (err) {
    return res.status(406).send({ error: "Empresa não encontrada" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ _id: req.params.id });
    if (!empresa)
      return res.status(404).send({ error: "Nenhuma empresa encontrada" });

    return res.send({ empresa });
  } catch (err) {
    return res.status(400).send({ error: "Empresa não encontrada" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body
        }
      },
      { new: true }
    );
    return res.send({ empresa });
  } catch (err) {
    return res.status(400).send({ error: "Empresa não encontrada" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findOneAndDelete({ _id: req.params.id });
    return res.send({ empresa });
  } catch (err) {
    return res.status(400).send({ error: "Empresa não encontrada" });
  }
});

module.exports = app => app.use("/api/empresa", router);
