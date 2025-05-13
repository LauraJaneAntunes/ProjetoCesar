import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI);

// Definição do Schema e Modelo
const hashSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  shift: { type: Number, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const HashModel = mongoose.model("Hash", hashSchema);

// Função para salvar um novo hash
export async function saveHash(hash, shift) {
  try {
    const newHash = new HashModel({ hash, shift });
    await newHash.save();
    return newHash.id;
  } catch (error) {
    console.error("Erro ao salvar hash:", error);
    return null;
  }
}

// Função para buscar um hash no banco
export async function getHashRecord(hash) {
  try {
    return await HashModel.findOne({ hash });
  } catch (error) {
    console.error("Erro ao buscar hash:", error);
    return null;
  }
}

// Função para marcar um hash como usado
export async function markHashAsUsed(hash) {
  try {
    const result = await HashModel.findOneAndUpdate(
      { hash },
      { used: true },
      { new: true }
    );
    return result ? true : false;
  } catch (error) {
    console.error("Erro ao marcar hash como usado:", error);
    return false;
  }
}

// Função para inserir dados iniciais (se necessário)
export async function seedTestData() {
  await HashModel.create({
    hash: "testhash123",
    shift: 3,
    used: false,
  });
}