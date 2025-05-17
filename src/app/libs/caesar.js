//src\app\libs\caesar.js
/* Implementação da Cifra de César */

// Função para criptografar uma mensagem usando a Cifra de César
export function encrypt(message, shift) {
  return message
    .split('')
    .map((char) => {
      // Lida apenas com letras (A-Z, a-z)
      if (/[a-zA-Z]/.test(char)) {
        const code = char.charCodeAt(0);
        const isUpperCase = code >= 65 && code <= 90;
        const base = isUpperCase ? 65 : 97;
        
        // Aplica deslocamento e mantém dentro do intervalo de letras
        return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
      }
      // Mantém caracteres não alfabéticos inalterados
      return char;
    })
    .join('');
}

// Função para descriptografar uma mensagem usando a Cifra de César
export function decrypt(encryptedMessage, shift) {
  // Para descriptografar, aplica o deslocamento inverso
  return encrypt(encryptedMessage, -shift);
}

// Função para gerar um hash único para criptografia
export function generateHash() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}