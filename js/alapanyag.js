document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("alapanyagForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Megakadályozza az oldal újratöltődését

    const adat = {
      kod: document.getElementById("kod").value,
      nev: document.getElementById("nev").value,
     
    };
    const url = "https://node-naplo.onrender.com/data/alapanyagok";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adat),
      });

      const eredmeny = await response.json();
      console.log("Szerver válasza:", eredmeny);
    } catch (error) {
      console.error("Hiba a küldés során:", error);
    }
  });
});
