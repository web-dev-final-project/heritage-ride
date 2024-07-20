const userNameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");
const button = document.getElementById("login-submit-btn");
const loginMessage = document.getElementById("login-message");

const clearInput = () => {
  userNameLogin.value = "";
  passwordLogin.value = "";
};

const validateInput = (str) => {
  return !(!str || str.trim().length < 4);
};

document
  .getElementById("login-submit")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    let token;
    const res = await fetch(window.appData.loginUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userNameLogin.value,
        password: passwordLogin.value,
      }),
    });
    if (!res.ok) {
      const resp = await res.json();
      console.log(resp.content);
      loginMessage.innerHTML = resp.content;
      clearInput();
      button.disabled = true;
    } else {
      token = (await res.json()).content;
      document.cookie = "token=" + token + "; path=/";

      if (history.length === 1)
        document.location.replace(document.location.host);
      else history.back();
    }
  });
userNameLogin.addEventListener("click", () => {
  loginMessage.innerHTML = "";
});
userNameLogin.addEventListener("input", () => {
  console.log(
    validateInput(userNameLogin.value),
    validateInput(passwordLogin.value)
  );
  if (validateInput(userNameLogin.value) && validateInput(passwordLogin.value))
    button.disabled = false;
});
passwordLogin.addEventListener("input", () => {
  if (validateInput(userNameLogin.value) && validateInput(passwordLogin.value))
    button.disabled = false;
});
