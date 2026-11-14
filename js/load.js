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

      
      if (mainNav == undefined || mainNav == null )
        return { ready: true };
      
      let newBtn = document.getElementById("btn-new-recipe");
      if (newBtn != undefined && newBtn != null )
        return { ready: true };
      
      if (eredmeny.user != null) {
        newBtn = document.createElement('a');
        newBtn.href = "./feltoltes.html";
        newBtn.id = "btn-new-recipe";
        newBtn.className = "btn-new-recipe";
        newBtn.textContent = '+ Új Recept';
        mainNav.appendChild(newBtn);

        newBtn = document.createElement('button');
        newBtn.onclick = () => {
            localStorage.removeItem('token');
        };
        newBtn.id = "btn-logout";
        newBtn.className = "btn-logout";
        newBtn.textContent = 'Kilépés';
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

