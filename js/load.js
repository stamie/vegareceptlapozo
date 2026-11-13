async function pendingNode() {

  try {
    const userToken = localStorage.getItem("token");
    console.log("User token:", userToken);

    let header = {
      "Content-Type": "application/json",
    };
    if (userToken) {
      header["Authorization"] = `Bearer ${userToken}`;
    }
    const eredmeny = await fetch("https://node-receptek.onrender.com", {
      method: "GET",
      headers: header,
    }).then((response) => response.json());
    if (eredmeny.message == "Hello, World!") {
      let mainNav = document.querySelector(".main-nav");

      console.log(mainNav);
      let newBtn = document.querySelector(".btn-new-recipe");
      if (mainNav == undefined || mainNav == null || newBtn !== undefined || newBtn !== null)
        return { ready: true };
      
      if (eredmeny.user != null) {
        const newBtn = document.createElement('a');
        newBtn.href = "./feltoltes.html";
        newBtn.id = "btn-new-recipe";
        newBtn.className = "btn-new-recipe";
        newBtn.textContent = '+ Új Recept';
        mainNav.appendChild(newBtn);
      }
     
      return { ready: true };
    } else {
      return { ready: false };
    }

  } catch (error) {
    console.log(error);
    return { ready: false };
  }
}
export { pendingNode };

