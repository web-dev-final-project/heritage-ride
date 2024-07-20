const firstName = document.getElementById("first-name-upload")
const lastName = document.getElementById("last-name-upload")
const userName = document.getElementById("username-upload")
const password = document.getElementById("password-upload")
const email = document.getElementById("email-upload")
const address = document.getElementById("address-upload")
const avatar = document.getElementById("avatar-upload")


document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const obj = {
    firstName: firstName.value,
    lastName: lastName.value,
    userName: userName.value,
    password: password.value,
    email: email.value,
    address: address.value,
    avatar: avatar.value,
  };
  const res = await fetch(window.appData.signupUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });
  if (!res.ok) {
    document.getElementById("signup-message").innerHTML = (
      await res.json()
    ).content;
    document.location.replace(document.location.host + "/user/login")

  } else {
    console.log(await res.json());
    document.getElementById("signup-button").disabled = true
  }
});

const validation = {
  firstName: false,
  lastName: false,
  userName: false,
  password: false,
  email: false
}

const handleInputChange = () => {
  if (validation.firstName && validation.lastName && validation.userName && validation.password && validation.email) {
    document.getElementById("signup-button").disabled = false
  }
}

firstName.addEventListener("change", () => {
  if (firstName.value.trim().length > 2) {
    firstName.style.backgroundColor = "green"
  }
  handleInputChange()
})
lastName.addEventListener("change", () => {
  if (lastName.value.trim().length > 2) {
    lastName.style.backgroundColor = "green"
  }
  handleInputChange()
})
userName.addEventListener("change", () => {
  if (userName.value.trim().length > 4) {
    userName.style.backgroundColor = "green"
  }
  handleInputChange()
})
password.addEventListener("change", () => {
  if (password.value.trim().length > 8) {
    password.style.backgroundColor = "green"
  }
  handleInputChange()
})
email.addEventListener("change", () => {
  if (email.value.trim().length > 8) {
    email.style.backgroundColor = "green"
  }
  handleInputChange()
})

firstName.addEventListener("focus", () => {
  firstName.style.backgroundColor = "red"
})
lastName.addEventListener("focus", () => {
  lastName.style.backgroundColor = "red"
})
userName.addEventListener("focus", () => {
  userName.style.backgroundColor = "red"
})
password.addEventListener("focus", () => {
  password.style.backgroundColor = "red"
})
email.addEventListener("focus", () => {
  email.style.backgroundColor = "red"
})
address.addEventListener("focus", () => {
 address.style.backgroundColor = "red"
})