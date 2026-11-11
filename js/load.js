async function pendingNode() {
  while (1 == 1) {
    try {
      const eredmeny = await fetch("https://node-receptek.onrender.com").then(
        (response) => response.json(),
      );
      if (eredmeny.message == "Hello, World!") {
        return;
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
      return;
    }
  }
}
pendingNode();
