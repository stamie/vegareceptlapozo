async function loadAlapanyagok() {
  const ujAlapanyagGomb = document.getElementById("uj_alapanyag_gomb");
  if (ujAlapanyagGomb) {
    ujAlapanyagGomb.addEventListener("click", async (e) => {
      e.preventDefault(); // Megakadályozza az oldal újratöltődését

      const adat = {
        kod: document.getElementById("alapanyag_kereso").value.trim(),
        nev: document.getElementById("alapanyag_kereso").value.trim(),
      };
      const url = "https://node-receptek.onrender.com/data/alapanyagok";
      const alapanyagSelect = document.getElementById("alapanyagok_select");
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adat),
        });

        const eredmeny = await response.json();
        console.log("Szerver válasza:", eredmeny);/*
        if (eredmeny.message === "Data received successfully") {
          // Alapanyag sikeresen hozzáadva
          const ujOption = document.createElement("option");
          ujOption.value = adat.kod;
          ujOption.textContent = adat.nev;
          alapanyagSelect.appendChild(ujOption);
        }*/
      } catch (error) {
        //console.error("Hiba a küldés során:");
        console.log(error);
      }
    });
  }
}
export {loadAlapanyagok};