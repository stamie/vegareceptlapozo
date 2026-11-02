document.addEventListener("DOMContentLoaded", () => {
  const receptForm = document.getElementById("receptForm");
  const ujKategoriaGomb = document.getElementById("uj_kategoria_gomb");
  const ujAlapanyagGomb = document.getElementById("uj_alapanyag_gomb");
  const alapanyagHozzadasa = document.getElementById("alapanyag_hozzadasa");
  const kategoriaHozzadasa = document.getElementById("kategoria_hozzadasa");
  const alapanyagKereso = document.getElementById("alapanyag_kereso");
  const alapanyagSelect = document.getElementById("alapanyagok_select");
  const kategoriaKereso = document.getElementById("kategoria_kereso");
  const kategoriaSelect = document.getElementById("kategoriak_select");
  const alapanyagTbody = document.querySelector("#alapanyagok tbody");
  const kategoriaTbody = document.querySelector("#kategoriak tbody");
  const url = "https://node-receptek.onrender.com/data/receptek";
  const alapanyagokUrl = "https://node-receptek.onrender.com/data/alapanyagok";
  const kategoriakUrl = "https://node-receptek.onrender.com/data/kategoriak";
  const receptMenteseGomb = document.getElementById("recept_mentese");
  const menuForm = document.getElementById("menuForm");

  if (alapanyagSelect) {
    fetch(alapanyagokUrl)
      .then((response) => response.json())
      .then((alapanyagok) => {
        if (Array.isArray(alapanyagok)) {
          alapanyagok.forEach((alapanyag) => {
            const option = document.createElement("option");
            option.value = alapanyag.kod;
            option.textContent = alapanyag.nev;
            alapanyagSelect.appendChild(option);
          });
        }
      })
      .catch((error) => {
        console.error("Hiba az alapanyagok lekérésekor:", error);
      });
  }
    if (kategoriaSelect) {
    fetch(kategoriakUrl)
      .then((response) => response.json())
      .then((kategoriak) => {
        if (Array.isArray(kategoriak)) {
          kategoriak.forEach((kategoria) => {
            const option = document.createElement("option");
            option.value = kategoria.kod;
            option.textContent = kategoria.nev;
            kategoriaSelect.appendChild(option);
          });
        }
      })
      .catch((error) => {
        console.error("Hiba az kategoriák lekérésekor:", error);
      });
  }
  if (ujAlapanyagGomb && alapanyagKereso && alapanyagSelect && ujKategoriaGomb && kategoriaKereso && kategoriaSelect) {
    ujKategoriaGomb.addEventListener("click", () => {
      const ujKategoriaNev = kategoriaKereso.value.trim();
      if (!ujKategoriaNev) {
        return;
      }

      const ujOption = document.createElement("option");
      ujOption.value = ujKategoriaNev
        .toLowerCase()
        .trim()
        .slice(0, 4)
        .trim()
        .replace(/\s+/g, "_");
      ujOption.textContent = ujKategoriaNev;
      ujOption.selected = true;
      kategoriaSelect.appendChild(ujOption);

      Array.from(kategoriaSelect.options).forEach((opcio) => {
        opcio.style.display = "block";
      });
    });

    if (kategoriaHozzadasa && kategoriaSelect && kategoriaTbody) {
      kategoriaHozzadasa.addEventListener("click", () => {
        const selectedOption = kategoriaSelect.selectedOptions[0];
        if (!selectedOption || !selectedOption.value) {
          return;
        }

        const existingRow = Array.from(kategoriaTbody.querySelectorAll("tr")).find(
          (row) => row.dataset.kod === selectedOption.value,
        );

        if (existingRow) {
          return;
        }

        const tr = document.createElement("tr");
        tr.dataset.kod = selectedOption.value;
        tr.dataset.nev = selectedOption.textContent.trim();

        const nevCell = document.createElement("td");
        nevCell.textContent = selectedOption.textContent.trim();

        tr.appendChild(nevCell);
        kategoriaTbody.appendChild(tr);
      });
      ujKategoriaGomb.addEventListener("click", () => {
      const ujKategoriaNev = kategoriaKereso.value.trim();
      if (!ujKategoriaNev) {
        return;
      }

      const ujOption = document.createElement("option");
      ujOption.value = ujKategoriaNev
        .toLowerCase()
        .trim()
        .slice(0, 4)
        .trim()
        .replace(/\s+/g, "_");
      ujOption.textContent = ujKategoriaNev;
      ujOption.selected = true;
      kategoriaSelect.appendChild(ujOption);

      Array.from(kategoriaSelect.options).forEach((opcio) => {
        opcio.style.display = "block";
      });
    });

    if (alapanyagHozzadasa && alapanyagSelect && alapanyagTbody) {
      alapanyagHozzadasa.addEventListener("click", () => {
        const selectedOption = alapanyagSelect.selectedOptions[0];
        if (!selectedOption || !selectedOption.value) {
          return;
        }

        const existingRow = Array.from(alapanyagTbody.querySelectorAll("tr")).find(
          (row) => row.dataset.kod === selectedOption.value,
        );

        if (existingRow) {
          return;
        }

        const tr = document.createElement("tr");
        tr.dataset.kod = selectedOption.value;
        tr.dataset.nev = selectedOption.textContent.trim();

        const nevCell = document.createElement("td");
        nevCell.textContent = selectedOption.textContent.trim();

        /*
        const mennyisegCell = document.createElement("td");
        const mennyisegInput = document.createElement("input");
        mennyisegInput.type = "number";
        mennyisegInput.min = "0";
        mennyisegInput.step = "0.1";
        mennyisegInput.value = "1";
        mennyisegInput.setAttribute("aria-label", "mennyiseg");
        mennyisegCell.appendChild(mennyisegInput);

        const egysegCell = document.createElement("td");
        const egysegInput = document.createElement("select");
        egysegInput.type = "text";
        egysegInput.placeholder = "db";
        egysegInput.setAttribute("aria-label", "egyseg");
        const egysegOptions = ["db", "g", "kg", "l", "ml"];
        egysegOptions.forEach((egyseg) => {
          const option = document.createElement("option");
          option.value = egyseg;
          option.textContent = egyseg;
          egysegInput.appendChild(option);
        });
        egysegCell.appendChild(egysegInput);
        */

        tr.appendChild(nevCell);
        // tr.appendChild(mennyisegCell);
        // tr.appendChild(egysegCell);
        alapanyagTbody.appendChild(tr);
      });
    }
    }

    if (receptForm) {
      receptMenteseGomb.addEventListener("click", async (e) => {
        e.preventDefault();
        let kategoriak_ = {};
        kategoriak_ = Array.from(kategoriaTbody?.querySelectorAll("tr") || []).map(
            (row) => ({
              kod: row.dataset.kod || "",
              nev:
                row.dataset.nev ||
                row.querySelector("td")?.textContent?.trim() ||
                "",
            }));
        const adat = {
          nev: document.getElementById("nev")?.value || "",
          kategoriak: kategoriak_,
        
          alapanyagok: Array.from(alapanyagTbody?.querySelectorAll("tr") || []).map(
            (row) => ({
              kod: row.dataset.kod || "",
              nev:
                row.dataset.nev ||
                row.querySelector("td")?.textContent?.trim() ||
                "",
            }),
          ),
          recept: document.getElementById("recept")?.value || "",
          forrasa: document.getElementById("recept_forrasa")?.value || "",
          link: document.getElementById("recept_link")?.value || "",
          
        };
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
          if (eredmeny.message == "Data received successfully") {
            alert("Sikeres mentés!");
          } else {
            alert("Sikertelen mentés!");
          }
          alert("Sikertelen mentés!");
        } catch (error) {
          console.error("Hiba a küldés során:", error);
          alert("Hiba történt a mentés során. Kérlek próbáld újra!");
        }
      });
    }

    if (alapanyagKereso && alapanyagSelect) {
      alapanyagKereso.addEventListener("input", () => {
        const szuro = alapanyagKereso.value.toLowerCase();
        const opciok = alapanyagSelect.options;

        for (let i = 0; i < opciok.length; i++) {
          const opcio = opciok[i];
          opcio.style.display = opcio.text.toLowerCase().includes(szuro)
            ? "block"
            : "none";
        }
      });
    }
  }
});
