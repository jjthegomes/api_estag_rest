import mongoose from "../../database";

const EmpresaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },
    cnpj: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    telefone: {
      type: String,
      required: false
    },
    vagas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vaga"
      }
    ],
    sobre: {
      type: String,
      required: false
    },
    setor: {
      type: String,
      required: false
    },
    porte: {
      type: String,
      enum: ["micro", "pequena", "media", "grande"],
      required: false
    },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'usuario' }
  },
  { timestamps: true }
);

const Empresa = mongoose.model("Empresa", EmpresaSchema, "empresas");

module.exports = Empresa;
