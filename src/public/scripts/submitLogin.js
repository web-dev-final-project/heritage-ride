const userNameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");
const button = document.getElementById("login-submit-btn");
const loginMessage = document.getElementById("login-message");
const signupLink = document.getElementById("signup-link");

signupLink.href = getCurrentRoute() + "/user/signup";

const clearInput = () => {
  userNameLogin.value = "";
  passwordLogin.value = "";
};

const validateUsername = (str) => {
  return !(!str || str.trim().length < 5 || str.trim().length > 20);
};
const validatePassword = (str) => {
  return !(!str || str.trim().length < 10 || str.trim().length > 30);
};

document
  .getElementById("login-submit")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    let token;
    const res = await fetch(getCurrentRoute() + "/api/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: filterXSS(userNameLogin.value),
        password: filterXSS(passwordLogin.value),
      }),
    });
    if (!res.ok) {
      const resp = await res.json();
      loginMessage.innerHTML = resp.content;
      clearInput();
      button.disabled = true;
    } else {
      const url = (await res.json()).content;
      document.location.replace(url);
    }
  });
userNameLogin.addEventListener("click", () => {
  loginMessage.innerHTML = "";
});
userNameLogin.addEventListener("input", () => {
  if (
    validateUsername(userNameLogin.value) &&
    validatePassword(passwordLogin.value)
  )
    button.disabled = false;
  else button.disabled = true;
});
passwordLogin.addEventListener("input", () => {
  if (
    validateUsername(userNameLogin.value) &&
    validatePassword(passwordLogin.value)
  )
    button.disabled = false;
  else button.disabled = true;
});
