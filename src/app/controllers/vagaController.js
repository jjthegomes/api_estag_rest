import express from "express";
import authMiddleware from "../middlewares/auth";
import Vaga from "../models/vaga";
import Empresa from "../models/empresa";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ usuario: req.usuarioId });
    if (!empresa)
      return res.status(401).send({ error: 'Nenhuma empresa encontrada' })

    const vaga = await Vaga.create({ ...req.body, empresa });
    await vaga.save();

    await Empresa.findByIdAndUpdate(empresa._id, {
      vagas: [...empresa.vagas, vaga]
    }, { new: true });

    return res.send(vaga);
  } catch (err) {
    return res.status(400).send({ error: "Erro ao salvar vaga" });
  }
});

router.get("/", async (req, res) => {
  try {
    const vagas = await Vaga.find();
    return res.send({ vagas });
  } catch (err) {
    return res.status(400).send({ error: "Vagas não encontrada" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const vaga = await Vaga.findOne({ _id: req.params.id });
    return res.send(vaga);
  } catch (err) {
    return res.status(400).send({ error: "Vaga não encontrada" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ usuario: req.usuarioId });
    if (!empresa)
      return res.status(401).send({ error: 'Nenhuma empresa encontrada' })

    console.log(req.params)

    const vaga = await Vaga.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body
        }
      },
      { new: true }
    );
    return res.send({ vaga });
  } catch (err) {
    console.log(err)
    return res.status(400).send({ error: "Vaga não encontrada" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const vaga = await Vaga.findOneAndDelete({ _id: req.params.id });
    return res.send({ vaga });
  } catch (err) {
    return res.status(400).send({ error: "Vaga não encontrada" });
  }
});

module.exports = app => app.use("/api/vaga", router);
