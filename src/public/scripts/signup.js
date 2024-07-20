const firstName = document.getElementById("first-name-upload")
const lastName = document.getElementById("last-name-upload")
const userName = document.getElementById("username-upload")
const password = document.getElementById("password-upload")
const passwordReenter = document.getElementById("password-upload-2")
const email = document.getElementById("email-upload")
const address = document.getElementById("address-upload")
const avatar = document.getElementById("avatar-upload")
const signup = document.getElementById("signup-button")

document.addEventListener("DOMContentLoaded", () => {

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

  } else {
    console.log(await res.json());
    document.getElementById("signup-button").disabled = true
    document.location.replace(document.location.host + "/user/login")
  }
});

const validation = {
  [firstName.id]: false,
  [lastName.id]: false,
  [userName.id]: false,
  [password.id]: false,
  [passwordReenter.id]: false,
  [email.id]: false
}

const handleInputChange = () => {
  console.log(validation[firstName.id], validation[lastName.id], validation[userName.id], validation[password.id], validation[passwordReenter.id], validation[email.id])
  if (validation[firstName.id] && validation[lastName.id] && validation[userName.id] && validation[password.id] && validation[passwordReenter.id] && validation[email.id]) {
    document.getElementById("signup-button").disabled = false
  }
  else
    signup.disabled = true
}

const handleInputValidation = (element, condition) => {
  element.addEventListener("input", () => {
    element.style.borderColor = "rgb(108, 107, 107)"
    if (condition()) {
      element.style.outlineColor = "rgb(81, 225, 49)"
      validation[element.id] = true
    }
    else {
      element.style.outlineColor = "rgb(237, 229, 66)"
    }
    handleInputChange()
  })
}
handleInputValidation(firstName, () => firstName.value.trim().length > 2)
handleInputValidation(lastName, ()=> lastName.value.trim().length > 2)
handleInputValidation(userName,()=> userName.value.trim().length > 4)
handleInputValidation(password, ()=>password.value.length > 8)
handleInputValidation(passwordReenter, ()=> (passwordReenter.value.length > 8 && passwordReenter.value === password.value))
handleInputValidation(email, ()=> (email.value.length > 5 && email.value.includes("@")))


firstName.addEventListener("blur", () => {
  if (firstName.value.trim().length < 3)
    firstName.style.borderColor = "red"
})

lastName.addEventListener("blur", () => {
  if (lastName.value.trim().length < 3)
    lastName.style.borderColor = "red"
})
userName.addEventListener("blur", () => {
  if (userName.value.trim().length < 5)
    userName.style.borderColor = "red"
})
password.addEventListener("blur", () => {
  if (password.value.trim().length < 9)
    password.style.borderColor = "red"
})
passwordReenter.addEventListener("blur", () => {
  if (passwordReenter.value.trim().length < 9 && passwordReenter.value !== password.value)
    email.style.borderColor = "red"
})
email.addEventListener("blur", () => {
  if (email.value.trim().length < 6 && email.value.includes("@"))
    email.style.borderColor = "red"
})
// address.addEventListener("blur", () => {
//  address.style.borderColor = "red"
// })

// firstName.addEventListener("focus", () => {
//   firstName.style.borderColor = "red"
// })
// firstName.addEventListener("blur", () => {
//   firstName.style.borderColor = "black"
// })
// lastName.addEventListener("blur", () => {
//   lastName.style.borderColor = "black"
// })
// userName.addEventListener("blur", () => {
//   userName.style.borderColor = "black"
// })
// password.addEventListener("blur", () => {
//   password.style.borderColor = "black"
// })
// email.addEventListener("blur", () => {
//   email.style.borderColor = "black"
// })
// address.addEventListener("blur", () => {
//  address.style.borderColor = "black"
// })

})