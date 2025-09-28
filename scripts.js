const fileInput = document.getElementById("fileInput");
const emailInput = document.getElementById("emailInput");
const processBtn = document.getElementById("processBtn");
const resultDiv = document.getElementById("result");
const classificationSpan = document.getElementById("classification");
const responseSpan = document.getElementById("response");

// 📂 Ler arquivos (TXT e PDF) e jogar no textarea
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.type === "text/plain") {
    const text = await file.text();
    emailInput.value = text;
  } else if (file.type === "application/pdf") {
    const reader = new FileReader();
    reader.onload = async function () {
      const pdfData = new Uint8Array(this.result);
      const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n";
      }
      emailInput.value = text;
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert("Formato não suportado. Use .txt ou .pdf");
  }
});

// 🚀 Enviar texto para backend
processBtn.addEventListener("click", async () => {
  const text = emailInput.value.trim();
  if (!text) {
    alert("Por favor, cole ou carregue um email antes de processar.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/emails/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Erro ao processar o email");
    }

    const data = await response.json();
    classificationSpan.textContent = data.classification;
    responseSpan.textContent = data.response;
    resultDiv.classList.remove("hidden");

  } catch (error) {
    console.error("Erro:", error);
    alert("Ocorreu um erro ao conectar com o backend.");
  }
});
