const clearInput = () => {
  document.getElementById("username-login").value = "";
  document.getElementById("password-login").value = "";
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
      const resp = await res.json();
      console.log(resp.content);
      document.getElementById("login-message").innerHTML = resp.content;
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
