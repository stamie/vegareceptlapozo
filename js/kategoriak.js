async function loadKategoriak() {

  const ujKategoriaGomb = document.getElementById("uj_kategoria_gomb");
  if (ujKategoriaGomb) {
    ujKategoriaGomb.addEventListener("click", async (e) => {
      e.preventDefault(); // Megakadályozza az oldal újratöltődését

      const adat = {
        kod: document.getElementById("kategoria_kereso").value.trim(),
        nev: document.getElementById("kategoria_kereso").value.trim(),
      };
      const url = "https://node-receptek.onrender.com/data/kategoriak";
      const kategoriaSelect = document.getElementById("kategoriak_select");
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
        /*
        if (eredmeny.message === "Data received successfully") {
          // Kategória sikeresen hozzáadva
          const ujOption = document.createElement("option");
          ujOption.value = adat.kod;
          ujOption.textContent = adat.nev;
          kategoriaSelect.appendChild(ujOption);
        } */
      } catch (error) {
        console.error("Hiba a küldés során:", error);
      }
    });
  }
}
export default loadKategoriak;
loadKategoriak();
