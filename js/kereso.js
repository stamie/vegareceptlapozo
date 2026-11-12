const keresoNev = document.getElementById("kereso_nev");
const szuroKategoria = document.getElementById("szuro_kategoria");
const szuroAlapanyag = document.getElementById("szuro_alapanyag");
const receptekLista = document.getElementById("receptek_lista");

// Modal elemek
const modal = document.getElementById("receptModal");
const modalTitle = document.getElementById("modalTitle");
const modalTags = document.getElementById("modalTags");
const modalSource = document.getElementById("modalSource");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");
async function loadKereso() {
  console.log("loadKereso() called");


  modalClose.addEventListener("click", () => modal.classList.remove("active"));

  // Eseményfigyelők a szűréshez
  keresoNev.addEventListener("input", filterRecipes);
  szuroKategoria.addEventListener("change", filterRecipes);
  szuroAlapanyag.addEventListener("change", filterRecipes);
  let receptek = [];
  let kategoriak = [];
  let alapanyagok = [];
  fetch("https://node-receptek.onrender.com/data/kategoriak")
    .then((response) => response.json())
    .then((data) => {
      kategoriak = data.data;
      // Itt feltöltheted a kategória szűrőt a lekért adatokkal
      szuroKategoria.innerHTML =
        `<option value="">Összes kategória</option>` +
        kategoriak
          .map((k) => `<option value="${k.kod}">${k.nev}</option>`)
          .join("");
    })
    .catch((error) => console.error("Hiba a kategóriák betöltésekor:", error));

  fetch("https://node-receptek.onrender.com/data/alapanyagok")
    .then((response) => response.json())
    .then((data) => {
      alapanyagok = data.data;
      // Itt feltöltheted az alapanyag szűrőt a lekért adatokkal
      szuroAlapanyag.innerHTML =
        `<option value="">Összes alapanyag</option>` +
        alapanyagok
          .map((a) => `<option value="${a.kod}">${a.nev}</option>`)
          .join("");
    })
    .catch((error) =>
      console.error("Hiba az alapanyagok betöltésekor:", error),
    );

  let userToken = localStorage.getItem("token");
  let header = {
    "Content-Type": "application/json",
  };
  if (userToken) {
    header["Authorization"] = `Bearer ${userToken}`;
  }
  // Fetch a https://onrender.com/receptek url-ről, majd a JSON feldolgozása
  fetch("https://node-receptek.onrender.com/data/receptek", {
    method: "GET",
    headers: header,
  })
    .then((response) => response.json())
    .then((data) => {
      receptek = data.data;
      const user = data.user;

      if (user) {
        document.getElementsByClassName("main-nav")[0].innerHTML += '<a href="./feltoltes.html" id="btn-new-recipe" class="btn-new-recipe">+ Új Recept</a>';
      }
      renderRecipes(receptek); // Kezdeti renderelés
    })
    .catch((error) => console.error("Hiba a receptek betöltésekor:", error));


  let openModal = (recipeId) => {
    const recipe = receptek.find((r) => r._id === recipeId);
    if (recipe) {
      modalTitle.textContent = recipe.nev;
      modalTags.innerHTML = `
        ${recipe.kategoriak.map((k) => `<span class="tag tag-category">${k.nev}</span>`).join("")}
        ${recipe.alapanyagok.map((a) => `<span class="tag">${a.nev}</span>`).join("")}
      `;
      modalSource.innerHTML = recipe.forrasa
        ? `Forrás: ${recipe.link ? `<a href="${recipe.link}" target="_blank">${recipe.forrasa}</a>` : recipe.forras}`
        : "";
      modalDescription.textContent = recipe.recept || "Nincs leírás.";
      modal.classList.add("active");
    }
  };
}
function filterRecipes() {
  const nevVal = keresoNev.value.toLowerCase();
  const katVal = szuroKategoria.value;
  const alapVal = szuroAlapanyag.value;
  // Itt szűrheted a lekért tömbödet
  // Render függvény meghívása a megszűrt adatokra...

  const filteredRecipes = receptek.filter((recipe) => {
    const matchesNev = recipe.nev.toLowerCase().includes(nevVal);
    const matchesKategoria =
      katVal === "" || recipe.kategoriak.some((k) => k.kod === katVal);
    const matchesAlapanyag =
      alapVal === "" || recipe.alapanyagok.some((a) => a.kod === alapVal);

    return matchesNev && matchesKategoria && matchesAlapanyag;
  });

  renderRecipes(filteredRecipes);
}

// Kártya megjelenítő függvény (példa)
function renderRecipes(recipes) {
  receptekLista.innerHTML = "";

  if (recipes.length === 0) {
    receptekLista.innerHTML = `<div class="no-results">Nincs a keresésnek megfelelő recept.</div>`;
    return;
  }

  recipes.forEach((recipe) => {
    const card = document.createElement("div");

    card.className = "recipe-card";
    card.innerHTML = `
        <div class="recipe-body">
          <h3 class="recipe-title">${recipe.nev}</h3>
          <div class="tags">
            ${recipe.kategoriak.map((k) => `<span class="tag tag-category">${k.nev}</span>`).join("")}
            ${recipe.alapanyagok.map((a) => `<span class="tag">${a.nev}</span>`).join("")}
          </div>
          ${recipe.forras ? `<div class="recipe-source">Forrás: ${recipe.link ? `<a href="${recipe.link}" target="_blank">${recipe.forras}</a>` : recipe.forras}</div>` : ""}
          <button class="btn-view" onclick="openModal('${recipe._id}')">Recept megtekintése</button>
        </div>
      `;
    receptekLista.appendChild(card);
  });
}
export { loadKereso };
