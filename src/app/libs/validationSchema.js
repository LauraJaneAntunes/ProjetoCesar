//src\app\libs\validationSchema.js

import * as Yup from "yup";

export const validationSchema = Yup.object({
  username: Yup.string()
    .required("Nome de usuário é obrigatório")
    .min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
    ),
});