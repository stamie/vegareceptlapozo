document.addEventListener("DOMContentLoaded", () => {
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

  modalClose.addEventListener("click", () => modal.classList.remove("active"));

  // Eseményfigyelők a szűréshez
  keresoNev.addEventListener("input", filterRecipes);
  szuroKategoria.addEventListener("change", filterRecipes);
  szuroAlapanyag.addEventListener("change", filterRecipes);
  let receptek = [];


  // Fetch a https://onrender.com/receptek url-ről, majd a JSON feldolgozása
  fetch("https://node-receptek.onrender.com/data/receptek")
    .then(response => response.json())
    .then(data => {
      receptek = data;
      renderRecipes(receptek); // Kezdeti renderelés
    })
    .catch(error => console.error("Hiba a receptek betöltésekor:", error));
  
  function filterRecipes() {
    const nevVal = keresoNev.value.toLowerCase();
    const katVal = szuroKategoria.value;
    const alapVal = szuroAlapanyag.value;
    // Itt szűrheted a lekért tömbödet
    // Render függvény meghívása a megszűrt adatokra...

    const filteredRecipes = receptek.filter(recipe => {
      const matchesNev = recipe.nev.toLowerCase().includes(nevVal);
      const matchesKategoria = katVal === "" || recipe.kategoriak.includes(katVal);
      const matchesAlapanyag = alapVal === "" || recipe.alapanyagok.includes(alapVal);

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

    recipes.forEach(recipe => {
      const card = document.createElement("div");
      
      card.className = "recipe-card";
      card.innerHTML = `
        <div class="recipe-body">
          <h3 class="recipe-title">${recipe.nev}</h3>
          <div class="tags">
            ${recipe.kategoriak.map(k => `<span class="tag tag-category">${k.nev}</span>`).join('')}
            ${recipe.alapanyagok.map(a => `<span class="tag">${a.nev}</span>`).join('')}
          </div>
          ${recipe.forras ? `<div class="recipe-source">Forrás: ${recipe.link ? `<a href="${recipe.link}" target="_blank">${recipe.forras}</a>` : recipe.forras}</div>` : ''}
          <button class="btn-view" onclick="openModal('${recipe._id}')">Recept megtekintése</button>
        </div>
      `;
      receptekLista.appendChild(card);
    });
  }
  openModal = (recipeId) => {
    const recipe = receptek.find(r => r._id === recipeId);
    if (recipe) {
      modalTitle.textContent = recipe.nev;
      modalTags.innerHTML = `
        ${recipe.kategoriak.map(k => `<span class="tag tag-category">${k.nev}</span>`).join('')}
        ${recipe.alapanyagok.map(a => `<span class="tag">${a.nev}</span>`).join('')}
      `;
      modalSource.innerHTML = recipe.forras ? `Forrás: ${recipe.link ? `<a href="${recipe.link}" target="_blank">${recipe.forras}</a>` : recipe.forras}` : '';
      modalDescription.textContent = recipe.recept || "Nincs leírás.";
      modal.classList.add("active");
    }
  };
});