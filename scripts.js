document.getElementById("processBtn").addEventListener("click", async () => {
  const text = document.getElementById("emailText").value;

  if (!text.trim()) {
    alert("Por favor, cole ou digite o conteúdo do email.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/emails/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Erro ao processar o email");
    }

    const data = await response.json();

    document.getElementById("category").textContent = data.classification;
    document.getElementById("confidence").textContent = "86%"; // mock, ajuste depois se quiser
    document.getElementById("resultCard").style.display = "block";

  } catch (error) {
    console.error(error);
    alert("Erro ao conectar com a API.");
  }
});
