const keresoNev = document.getElementById("kereso_nev");
const szuroKategoria = document.getElementById("szuro_kategoria");
const szuroAlapanyag = document.getElementById("szuro_alapanyag");
let receptekLista = document.getElementById("receptek_lista");

// Modal elemek
const modal = document.getElementById("receptModal");
const modalTitle = document.getElementById("modalTitle");
const modalTags = document.getElementById("modalTags");
const modalSource = document.getElementById("modalSource");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

let receptek = [];
let kategoriak = [];
let alapanyagok = [];

class CustomMultiSelect {
  constructor(elementId, options, onChangeCallback = null) {
    this.container = document.getElementById(elementId);
    this.trigger = this.container.querySelector('.multiselect-trigger');
    this.tagsContainer = this.container.querySelector('.selected-tags');
    this.searchInput = this.container.querySelector('.multiselect-search');
    this.optionsList = this.container.querySelector('.multiselect-options');
    this.placeholder = this.container.dataset.placeholder || 'Válassz...';

    this.options = options; // [{ value: '1', label: 'Levesek' }, ...]
    this.selectedValues = new Set();
    this.onChange = onChangeCallback;

    this.init();
  }

  init() {
    this.renderOptions(this.options);

    // Lenyitás / bezárás
    this.trigger.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag-remove')) return;
      this.toggleDropdown();
    });

    // Keresés
    this.searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = this.options.filter(opt =>
        opt.label.toLowerCase().includes(term)
      );
      this.renderOptions(filtered);
    });

    // Kívülre kattintásnál bezárás
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.container.classList.remove('open');
      }
    });
  }

  toggleDropdown() {
    // Másik nyitott multiselect bezárása
    document.querySelectorAll('.custom-multiselect.open').forEach(el => {
      if (el !== this.container) el.classList.remove('open');
    });

    this.container.classList.toggle('open');
    if (this.container.classList.contains('open')) {
      this.searchInput.focus();
    }
  }

  renderOptions(items) {
    this.optionsList.innerHTML = '';

    if (items.length === 0) {
      this.optionsList.innerHTML = '<li style="color:#9ca3af; cursor:default;">Nincs találat</li>';
      return;
    }

    items.forEach(opt => {
      const li = document.createElement('li');
      const isSelected = this.selectedValues.has(opt.value);
      if (isSelected) li.classList.add('selected');

      li.innerHTML = `
        <span class="checkbox-box"></span>
        <span>${opt.label}</span>
      `;

      li.addEventListener('click', () => this.toggleSelection(opt.value));
      this.optionsList.appendChild(li);
    });
  }

  toggleSelection(value) {
    if (this.selectedValues.has(value)) {
      this.selectedValues.delete(value);
    } else {
      this.selectedValues.add(value);
    }

    this.updateTags();
    this.renderOptions(
      this.options.filter(opt =>
        opt.label.toLowerCase().includes(this.searchInput.value.toLowerCase())
      )
    );

    if (this.onChange) {
      this.onChange(this.getValues());
    }
  }

  updateTags() {
    this.tagsContainer.innerHTML = '';

    if (this.selectedValues.size === 0) {
      this.tagsContainer.innerHTML = `<span class="placeholder">${this.placeholder}</span>`;
      return;
    }

    this.selectedValues.forEach(val => {
      const optionObj = this.options.find(o => o.value === val);
      if (!optionObj) return;

      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.innerHTML = `
        ${optionObj.label}
        <span class="tag-remove" data-value="${val}">&times;</span>
      `;

      tag.querySelector('.tag-remove').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSelection(val);
      });

      this.tagsContainer.appendChild(tag);
    });
  }

  // Kiválasztott értékek lekérdezése tömbként
  getValues() {
    return Array.from(this.selectedValues);
  }
}



async function loadKereso() {
  console.log("loadKereso() called");


  modalClose.addEventListener("click", () => modal.classList.remove("active"));

  // Eseményfigyelők a szűréshez
  keresoNev.addEventListener("input", filterRecipes);
  // szuroKategoria.addEventListener("change", filterRecipes);
  // szuroAlapanyag.addEventListener("change", filterRecipes);

  fetch("https://node-receptek.onrender.com/data/kategoriak")
    .then((response) => response.json())
    .then((data) => {
      const kategoriak_ = data.data;
      // Itt feltöltheted a kategória szűrőt a lekért adatokkal
      kategoriak_.forEach(function (elem, index) {
        kategoriak[index] = { 'value': elem.kod, 'label': elem.nev };

      });
    })
    .catch((error) => console.error("Hiba a kategóriák betöltésekor:", error));

  fetch("https://node-receptek.onrender.com/data/alapanyagok")
    .then((response) => response.json())
    .then((data) => {
      const alapanyagok_ = data.data;
      // Itt feltöltheted az alapanyag szűrőt a lekért adatokkal
      alapanyagok_.forEach(function (elem, index) {
        alapanyagok[index] = { 'value': elem.kod, 'label': elem.nev };
      });
    })
    .catch((error) =>
      console.error("Hiba az alapanyagok betöltésekor:", error),
    );
  // Példányosítás
  const kategoriaSelect = new CustomMultiSelect('ms_kategoria', kategoriak, (selected) => {
    console.log('Kiválasztott kategóriák:', selected);
    // Itt hívhatod meg a szűrő függvényedet!
  });

  const alapanyagSelect = new CustomMultiSelect('ms_alapanyag', alapanyagok, (selected) => {
    console.log('Kiválasztott alapanyagok:', selected);
    // Itt hívhatod meg a szűrő függvényedet!
  });
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
      renderRecipes(receptek); // Kezdeti renderelés
    })
    .catch((error) => console.error("Hiba a receptek betöltésekor:", error));
}

function openModal(recipeId) {
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
          <button class="btn-view" data-id="${recipe._id}">Recept megtekintése</button>
        </div>
      `;
    const btnView = card.querySelector(".btn-view");
    btnView.addEventListener("click", () => {
      openModal(recipe._id);
    });
    receptekLista.appendChild(card);
  });
}
window.openModal = openModal;
export { loadKereso, openModal };

