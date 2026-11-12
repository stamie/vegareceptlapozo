async function pendingNode() {

  try {
    const userToken = localStorage.getItem("token");
    console.log("User token:", userToken);
    if (!userToken) {
      let header = {
        method: "GET",
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      if (!userToken) {
        header = {
          method: "GET",
          "Content-Type": "application/json",
        };
      }
      const eredmeny = await fetch("https://node-receptek.onrender.com", {
        headers: header,
      }).then((response) => response.json());
      if (eredmeny.message == "Hello, World!") {
        return { ready: true };
      } else {
        return { ready: false };
      }
    }
  } catch (error) {
    console.log(error);
    return { ready: false };
  }
}
export default pendingNode;

