document
  .getElementById("login-submit")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username-login").value;
    const password = document.getElementById("password-login").value;
    let token;
    const res = await fetch(window.appData.loginUrl, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      document.getElementById("login-message").innerHTML = (
        await res.json()
      ).content;
    } else {
      token = await res.json();
      console.log(token);
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
