document.addEventListener("DOMContentLoaded", () => {
  const receptForm = document.getElementById("receptForm");
  const ujKategoriaGomb = document.getElementById("uj_kategoria_gomb");
  const ujAlapanyagGomb = document.getElementById("uj_alapanyag_gomb");
  const alapanyagHozzadasa = document.getElementById("alapanyag_hozzadasa");
  const alapanyagKereso = document.getElementById("alapanyag_kereso");
  const alapanyagSelect = document.getElementById("alapanyagok_select");
  const tbody = document.querySelector("#alapanyagok tbody");
  const url = "https://node-receptek.onrender.com/api/data/receptek";
  const alapanyagokUrl = "https://node-receptek.onrender.com/api/data/alapanyag";
  const fogasSelect = document.getElementById("fogas");
  const menuMenteseGomb = document.getElementById("menu_mentese");
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
  if (ujAlapanyagGomb && alapanyagKereso && alapanyagSelect) {
    ujAlapanyagGomb.addEventListener("click", () => {
      const ujAlapanyagNev = alapanyagKereso.value.trim();
      if (!ujAlapanyagNev) {
        return;
      }

      const ujOption = document.createElement("option");
      ujOption.value = ujAlapanyagNev
        .toLowerCase()
        .trim()
        .slice(0, 4)
        .trim()
        .replace(/\s+/g, "_");
      ujOption.textContent = ujAlapanyagNev;
      ujOption.selected = true;
      alapanyagSelect.appendChild(ujOption);

      Array.from(alapanyagSelect.options).forEach((opcio) => {
        opcio.style.display = "block";
      });
    });

    if (alapanyagHozzadasa && alapanyagSelect && tbody) {
      alapanyagHozzadasa.addEventListener("click", () => {
        const selectedOption = alapanyagSelect.selectedOptions[0];
        if (!selectedOption || !selectedOption.value) {
          return;
        }

        const existingRow = Array.from(tbody.querySelectorAll("tr")).find(
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

        tr.appendChild(nevCell);
        tr.appendChild(mennyisegCell);
        tr.appendChild(egysegCell);
        tbody.appendChild(tr);
      });
    }

    if (receptForm) {
      receptMenteseGomb.addEventListener("click", async (e) => {
        e.preventDefault();

        const adat = {
          nev: document.getElementById("nev")?.value || "",
          alapanyagok: Array.from(tbody?.querySelectorAll("tr") || []).map(
            (row) => ({
              kod: row.dataset.kod || "",
              nev:
                row.dataset.nev ||
                row.querySelector("td")?.textContent?.trim() ||
                "",
              mennyiseg: parseFloat(row.querySelector("input")?.value) || 0,
              egyseg: row.querySelector("select")?.value || "",
            }),
          ),
          megjegyzes: document.getElementById("megjegyzes")?.value || "",
          hany_gramm: parseFloat(document.getElementById("hany_gramm")) || 0,
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
            const ujFogasNev = receptForm.querySelector("#nev")?.value || "";
            const ujFogasKod = ujFogasNev
              .toLowerCase()
              .trim()
              .slice(0, 4)
              .trim()
              .replace(/\s+/g, "_");
            const ujOption = document.createElement("option");
            ujOption.value = ujFogasKod;
            ujOption.textContent = ujFogasNev;
            ujOption.selected = true;
            if (fogasSelect) {
              fogasSelect.appendChild(ujOption);
            }
            receptForm
              .querySelectorAll("input[type='text']")
              .forEach((input) => {
                input.value = "";
              });
            receptForm.querySelector("textarea").value = "";
            receptForm
              .querySelectorAll("input[type='number']")
              .forEach((input) => {
                input.value = 0;
              });
            tbody.innerHTML = "";
            if (menuForm) {
              menuForm.scrollIntoView({ behavior: "smooth", block: "start" });
            }      
          }
        } catch (error) {
          console.error("Hiba a küldés során:", error);
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
