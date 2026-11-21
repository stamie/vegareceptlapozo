document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    let url = "./header.html";
    if (localStorage.getItem('token') !== null)
      url = "./header-1.html";
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        console.log("Fejléc betöltve:", html);
        headerContainer.innerHTML = html;
      })
      .catch((error) => {
        console.error("Hiba a fejléc betöltésekor:", error);
      });
  }
});
