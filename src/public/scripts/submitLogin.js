const clearInput = () => {
  document.getElementById("login-message").innerHTML = "";
  document.getElementById("password-login").innerHTML = "";
};

document
  .getElementById("login-submit")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = document.getElementById("username-login").value;
    const password = document.getElementById("password-login").value;
    let token;
    const res = await fetch(window.appData.loginUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    });
    if (!res.ok) {
      document.getElementById("login-message").innerHTML = (
        await res.json()
      ).content;
      clearInput();
    } else {
      token = (await res.json()).content;
      document.cookie = "token=" + token;
      const decodedToken = jwt_decode(token);
      console.log(decodedToken);
    }
  });
document.getElementById("username-login").addEventListener("click", () => {
  document.getElementById("login-message").innerHTML = "";
});
document.getElementById("username-login").addEventListener("click", () => {
  document.getElementById("password-login").innerHTML = "";
});
