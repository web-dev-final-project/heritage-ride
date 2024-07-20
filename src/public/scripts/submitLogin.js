const userName = document.getElementById("username-login");
const password = document.getElementById("password-login");
const button = document.getElementById("login-submit-btn");
const loginMessage = document.getElementById("login-message");

const clearInput = () => {
  userName.value = "";
  password.value = "";
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
        userName: userName.value,
        password: password.value,
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
userName.addEventListener("click", () => {
  loginMessage.innerHTML = "";
});
userName.addEventListener("input", () => {
  console.log(validateInput(userName.value), validateInput(password.value));
  if (validateInput(userName.value) && validateInput(password.value))
    button.disabled = false;
});
password.addEventListener("input", () => {
  if (validateInput(userName.value) && validateInput(password.value))
    button.disabled = false;
});
