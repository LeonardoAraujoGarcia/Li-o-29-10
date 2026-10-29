const form = document.querySelector("#company-form");
const formPanel = document.querySelector("#form-panel");
const resultPanel = document.querySelector("#result-panel");
const backButton = document.querySelector("#back-button");

const normalizeCnpj = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

function calculateCheckDigit(characters) {
  const weights = [2, 3, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  for (let index = characters.length - 1, weightIndex = 0; index >= 0; index -= 1, weightIndex += 1)
    sum += (characters.charCodeAt(index) - 48) * weights[weightIndex % weights.length];
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function isValidCnpj(value) {
  const cnpj = normalizeCnpj(value);
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj) || /^([A-Z0-9])\1+$/.test(cnpj)) return false;
  const firstDigit = calculateCheckDigit(cnpj.slice(0, 12));
  const secondDigit = calculateCheckDigit(`${cnpj.slice(0, 12)}${firstDigit}`);
  return cnpj.endsWith(`${firstDigit}${secondDigit}`);
}

function showResult(approved, companyName) {
  formPanel.hidden = true;
  resultPanel.hidden = false;
  resultPanel.classList.toggle("is-approved", approved);
  document.querySelector("#result-symbol").textContent = approved ? "✓" : "!";
  document.querySelector("#result-eyebrow").textContent = approved ? "CADASTRO VALIDADO" : "CADASTRO NÃO CONCLUÍDO";
  document.querySelector("#result-title").textContent = approved ? "Cadastro aprovado" : "Não foi possível aprovar";
  document.querySelector("#result-copy").textContent = approved ? `O CNPJ da empresa ${companyName} é válido. Cadastro concluído.` : "O CNPJ informado é inválido. Confira os números ou letras e tente novamente.";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const formData = new FormData(form);
  showResult(isValidCnpj(formData.get("cnpj")), formData.get("companyName").trim());
});

backButton.addEventListener("click", () => {
  resultPanel.hidden = true;
  formPanel.hidden = false;
  document.querySelector("#cnpj").focus();
});