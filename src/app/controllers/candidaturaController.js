import express from "express";
import authMiddleware from "../middlewares/auth";
import Vaga from "../models/vaga";
import Usuario from "../models/usuario";
import Cliente from "../models/cliente";
import Candidatura from "../models/candidatura";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
  let shouldUpdate = true;
  let retorno = null;

  try {
    const user = await Usuario.findById(req.usuarioId);
    if (!user) return res.status(400).send({ error: "Usuário não existe!" });

    if (user.tipo == "empresa")
      return res.status(400).send({ error: "Não autorizado!" });

    const fetchedVaga = await Vaga.findById(req.body.vaga);

    if (!fetchedVaga)
      return res.status(400).send({ error: "Vaga não existe." });

    const cliente = await Cliente.findOne({ usuario: req.usuarioId }).populate(
      "candidaturas"
    );

    if (!cliente) return res.status(400).send({ error: "Cliente não existe." });

    cliente.candidaturas.map(candidatura => {
      if (candidatura.vaga == req.body.vaga) {
        shouldUpdate = false;
      }
    });

    if (shouldUpdate) {
      const candidatura = new Candidatura({
        cliente: cliente,
        vaga: fetchedVaga
      });

      await candidatura.save();

      await Cliente.findOneAndUpdate(
        { _id: cliente._id },
        { $addToSet: { candidaturas: candidatura } },
        { new: true }
      );

      return res.send({ candidatura });
    } else {
      retorno = await Candidatura.findOne({ vaga: req.body.vaga });
    }

    return res.send({ candidatura: retorno });
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

    if (!candidatura)
      return res.status(400).send({ error: "candidatura não existe." });

    return res.send({ candidatura });
  } catch (err) {
    return res.status(400).send({ error: "Candidatura não encontrada" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const candidatura = await Candidatura.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.send({ candidatura });
  } catch (err) {
    return res.status(400).send({ error: "Candidatura não encontrada" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const candidatura = await Candidatura.findById(req.params.id);

    if (!candidatura)
      return res.status(400).send({ error: "Candidatura não encontrada" });

    await Cliente.findOneAndUpdate(
      { _id: candidatura.cliente },
      { $pull: { candidaturas: candidatura._id } },
      { new: true }
    );

    await Candidatura.deleteOne({ _id: req.params.id });
    const vaga = await Vaga.findById(candidatura.vaga);
    return res.send({ vaga });
  } catch (err) {
    return res.status(400).send({ error: "Candidatura não encontrada" });
  }
});

module.exports = app => app.use("/api/candidatura", router);
