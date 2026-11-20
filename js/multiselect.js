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

// Példányosítás
const kategoriaSelect = new CustomMultiSelect('ms_kategoria', kategoriak, (selected) => {
  console.log('Kiválasztott kategóriák:', selected);
  // Itt hívhatod meg a szűrő függvényedet!
});

const alapanyagSelect = new CustomMultiSelect('ms_alapanyag', alapanyagok, (selected) => {
  console.log('Kiválasztott alapanyagok:', selected);
  // Itt hívhatod meg a szűrő függvényedet!
});