// src/app/libs/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

async function connectToDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Schema para Hash (cifra de César)
const hashSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  shift: { type: Number, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const HashModel = mongoose.models.Hash || mongoose.model("Hash", hashSchema);

export async function saveHash(hash, shift) {
  try {
    await connectToDB();
    const newHash = new HashModel({ hash, shift });
    await newHash.save();
    return newHash.id;
  } catch (error) {
    console.error("Erro ao salvar hash:", error);
    return null;
  }
}

export async function getHashRecord(hash) {
  try {
    await connectToDB();
    return await HashModel.findOne({ hash });
  } catch (error) {
    console.error("Erro ao buscar hash:", error);
    return null;
  }
}

export async function markHashAsUsed(hash) {
  try {
    await connectToDB();
    const result = await HashModel.findOneAndUpdate(
      { hash },
      { used: true },
      { new: true }
    );
    return !!result;
  } catch (error) {
    console.error("Erro ao marcar hash como usado:", error);
    return false;
  }
}

export async function seedTestData() {
  await connectToDB();
  await HashModel.create({
    hash: "testhash123",
    shift: 3,
    used: false,
  });
}

// Schema para Usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // senha será armazenada como hash
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// Criar usuário com senha criptografada
export async function createUser(username, password) {
  try {
    await connectToDB();

    // Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    return newUser;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return null;
  }
}

// Buscar usuário só pelo username
export async function findUserByUsername(username) {
  try {
    await connectToDB();
    return await UserModel.findOne({ username });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }
}

// Verificar se a senha bate com o hash do banco
export async function verifyPassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    return false;
  }
}