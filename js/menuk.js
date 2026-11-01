document.addEventListener("DOMContentLoaded", async () => {
  const menuForm = document.getElementById("menuForm");
  const url = "https://node-receptek.onrender.com/api/data/menuk";
  const receptekUrl = "https://node-receptek.onrender.com/api/data/receptek";
  let receptekSelector = {};
  const ujFogasGomb = document.getElementById("uj_fogas_gomb");
  const fogasKereso = document.getElementById("fogas_kereso");
  const fogasSelect = document.getElementById("fogas");
  const receptForm = document.getElementById("receptForm");
  const tbody = document.querySelector("#fogasok_lista");
  const fogasHozzaadasaGomb = document.getElementById("fogas_hozzaadasa");
  const receptMenteseGomb = document.getElementById("recept_mentese");
  const menuMenteseGomb = document.getElementById("menu_mentese");

  if (menuForm) {
    const response = await fetch(receptekUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        receptekSelector = data;
        if (Array.isArray(data)) {
          data.forEach((element) => {
            let option_ = document.createElement("option");
            option_.setAttribute("value", element["kod"]);
            option_.innerHTML = element["nev"];

            fogasSelect.appendChild(option_);
          });
        }
      });

    fogasHozzaadasaGomb.addEventListener("click", () => {
      const selectedOption = fogasSelect.selectedOptions[0];
      if (!selectedOption || !selectedOption.value) {
        return;
      }
      const mennyisegInput = document.getElementById("fogas_bevitel").querySelector("[name='mennyiseg']");
      const egysegSelect = document.getElementById("fogas_bevitel").querySelector("[name='egyseg']");
      const mennyiseg = parseFloat(mennyisegInput.value.trim()) || 0;
      const egyseg = egysegSelect.value.trim();
      if (!mennyiseg || !egyseg) {
        return;
      }

      const existingRow = Array.from(tbody.querySelectorAll("tr")).find(
        (row) => row.dataset.kod === selectedOption.value,
      );

      const newRow = document.createElement("tr");
      newRow.dataset.kod = selectedOption.value;
      newRow.innerHTML = `
        <td class="py-1">${selectedOption.textContent}</td>
        <td class="py-1">
          <input type="number" name="mennyiseg" min="0" step="0.1" value="${mennyiseg}" class="w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white" />
        </td>
        <td class="py-1">
          <select name="egyseg" id="fogas_egyseg" class="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white">
            <option value="g" ${egyseg === "g" ? "selected" : ""}>g</option>
            <option value="ml" ${egyseg === "ml" ? "selected" : ""}>ml</option>
          </select>
        </td>
        <td class="py-1">
          <button type="button" class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600" onclick="this.closest('tr').remove();">
            Törlés
          </button>
        </td>
      `;
      mennyisegInput.value = 0;
      tbody.appendChild(newRow);
    });
  }

  if (receptForm) {
    menuMenteseGomb.addEventListener("click", async (e) => {
      try {
        e.preventDefault();
        const formData = {};
        menuForm
          .querySelectorAll("input, select, textarea")
          .forEach((field) => {
            if (
              field.name !== "" &&
              field.name !== "mennyiseg" &&
              field.name !== "egyseg"
            ) {
              formData[field.name] = field.value;
            }
          });
        formData["receptek"] = [];
        const fogasokLista = document.querySelectorAll("#fogasok_lista tr");
        fogasokLista.forEach((row) => {
          const kod = row.dataset.kod;
          const mennyiseg =
            parseFloat(row.querySelector("[name='mennyiseg']")?.value) || 0;
          const egyseg = row.querySelector("[name='egyseg']")?.value || "";
          const nev = row.querySelector("td:first-child").innerHTML || "rossz";
          console.log(nev); alert("console");
          if (kod && mennyiseg && egyseg) {
            formData["receptek"].push({
              kod: kod,
              nev: nev,
              mennyiseg: mennyiseg,
              egyseg: egyseg,
            });
          }
        });
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert("Hiba van a bevitellel!");
      }
    });
  }
  if (ujFogasGomb && fogasKereso && fogasSelect) {
    ujFogasGomb.addEventListener("click", () => {
      const ujFogasNev = fogasKereso.value.trim();
      if (!ujFogasNev) {
        return;
      }
      receptForm.scrollIntoView({ behavior: "smooth", block: "start" });
      receptForm.querySelector("#nev").value = ujFogasNev;
    });
  }

  if (fogasKereso && fogasSelect) {
    fogasKereso.addEventListener("input", () => {
      const szuro = fogasKereso.value.toLowerCase();
      const opciok = fogasSelect.options;

      for (let i = 0; i < opciok.length; i++) {
        const opcio = opciok[i];
        opcio.style.display = opcio.text.toLowerCase().includes(szuro)
          ? "block"
          : "none";
      }
    });
  }
});
