async function pendingNode() {
  while (1 == 1) {
    try {
      const userToken = localStorage.getItem("token");
      const eredmeny = await fetch("https://node-receptek.onrender.com",{
    headers: {
      method: "GET",
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  }

      ).then(
        (response) => response.json(),
      );
      if (eredmeny.message == "Hello, World!") {
        return true;
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

