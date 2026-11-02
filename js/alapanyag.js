document.addEventListener("DOMContentLoaded", () => {
  const ujAlapanyagGomb = document.getElementById("uj_alapanyag_gomb");
  if (ujAlapanyagGomb) {
    ujAlapanyagGomb.addEventListener("click", async (e) => {
      e.preventDefault(); // Megakadályozza az oldal újratöltődését

      const adat = {
        kod: document.getElementById("alapanyag_kereso").value.trim(),
        nev: document.getElementById("alapanyag_kereso").value.trim(),
      };
      const url = "https://node-receptek.onrender.com/data/alapanyagok";
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
  }
});
