document.addEventListener("DOMContentLoaded", () => {
 const headerContainer = document.getElementById("header-container");
 if (headerContainer) {
   fetch("./header-1.html")
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
