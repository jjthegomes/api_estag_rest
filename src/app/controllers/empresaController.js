import express from "express";
import authMiddleware from "../middlewares/auth";
import Empresa from "../models/empresa";
import Vaga from "../models/vaga";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const existingEmpresa = await Empresa.findOne({
      email: req.body.email
    });

    if (existingEmpresa)
      res.status(400).send({ error: "Empresa already exists." });

    const empresa = await Empresa.create(req.body);
    empresa.save();
    return res.send({ empresa });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao salvar empresa" });
  }
});

router.get("/", async (req, res) => {
  try {
    const empresas = await Empresa.find();
    console.log(empresas)
    return res.send({ empresas });
  } catch (err) {
    return res.status(400).send({ error: "Empresas não encontrada" });
  }
});

router.get("/usuario", async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ usuario: req.usuarioId });
    if (!empresa)
      return res.status(401).send({ error: 'Nenhuma empresa encontrada' })

    return res.send(empresa);
  } catch (err) {
    return res.status(406).send({ error: "Empresa não encontrada" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ _id: req.params.id });
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
