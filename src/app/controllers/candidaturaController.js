import express from "express";
import authMiddleware from "../middlewares/auth";
import Vaga from "../models/vaga";
import Empresa from "../models/empresa";
import Candidatura from "../models/candidatura";
const router = express.Router();

//router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const vaga = await Vaga.findById(req.body.vaga);
    if (!vaga) res.status(400).send({ error: "Vaga não existe." });

    const candidatura = await Candidatura.create({
      vaga: req.body.vaga,
      usuario: req.body.usuario
    });
    await candidatura.save();
    return res.send({ candidatura });
  } catch (err) {
    return res.status(400).send({ error: "Erro ao salvar candidatura" });
  }
});

router.get("/", async (req, res) => {
  try {
    const candidaturas = await Candidatura.find();
    return res.send({ candidaturas });
  } catch (err) {
    return res.status(400).send({ error: "Candidaturas não encontrada" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const candidatura = await Candidatura.findOne({ _id: req.params.id });
    return res.send({ candidatura });
  } catch (err) {
    return res.status(400).send({ error: "candidatura não encontrada" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const candidatura = await Candidatura.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body
        }
      },
      { new: true }
    );
    return res.send({ candidatura });
  } catch (err) {
    return res.status(400).send({ error: "candidatura não encontrada" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const candidatura = await Candidatura.findOneAndDelete({
      _id: req.params.id
    });
    return res.send({ candidatura });
  } catch (err) {
    return res.status(400).send({ error: "candidatura não encontrada" });
  }
});

module.exports = app => app.use("/api/candidatura", router);
