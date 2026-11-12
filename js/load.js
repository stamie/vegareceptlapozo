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
        return { ready: true };
      } else {
        return { ready: false };
      }
    
  } catch (error) {
    console.log(error);
    return { ready: false };
  }
}
export default pendingNode;

