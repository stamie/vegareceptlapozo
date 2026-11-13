document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const response = await fetch(
          "https://node-receptek.onrender.com/api/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          // Sikeres bejelentkezés esetén elmentheted a tokent (pl. localStorage-ba)
          if (data.token) {
            localStorage.setItem("token", data.token);

            alert("Sikeres bejelentkezés!");
            window.location.href = "./index.html"; // Átirányítás a kereső oldalra[cite: 1]
          }
        } else {
          alert(data.message || "Hibás bejelentkezési adatok!");
        }
      } catch (error) {
        console.error("Hiba a bejelentkezés során:", error);
        alert("Hálózati hiba történt a bejelentkezés során.");
      }
    });
  }
});
