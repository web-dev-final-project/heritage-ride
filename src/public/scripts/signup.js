const firstName = document.getElementById("first-name-upload");
const lastName = document.getElementById("last-name-upload");
const userName = document.getElementById("username-upload");
const password = document.getElementById("password-upload");
const passwordReenter = document.getElementById("password-upload-2");
const email = document.getElementById("email-upload");
const address = document.getElementById("address-upload");
const avatar = document.getElementById("avatar-upload");
const signup = document.getElementById("signup-button");
const signupCancel = document.getElementById("signup-cancel-button");

const validation = {
  [firstName.id]: false,
  [lastName.id]: false,
  [userName.id]: false,
  [password.id]: false,
  [passwordReenter.id]: false,
  [email.id]: false,
};

if (window.location.pathname === "/user/edit" && user) {
  firstName.value = user.firstName;
  lastName.value = user.lastName;
  userName.value = user.userName;
  email.value = user.email.toLowerCase();
  address.value = user.address;
  avatar.value = user.avatar;
  validation[firstName.id] = true;
  validation[lastName.id] = true;
  validation[userName.id] = true;
  validation[email.id] = true;
  document.getElementById("signup-title").innerHTML = "Edit Profile";
} else document.getElementById("signup-title").innerHTML = "Sign Up";

document.addEventListener("DOMContentLoaded", () => {
  const isEditing = window.location.pathname === "/user/edit";
  document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const obj = {
        firstName: firstName.value,
        lastName: lastName.value,
        userName: userName.value,
        password: password.value,
        email: email.value.toLowerCase(),
        address: address.value,
        avatar:
          avatar.value.trim() ||
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png",
      };
      const url = isEditing ? `/api/user/${user._id}` : "/api/user/signup";
      const res = await fetch(getCurrentRoute() + url, {
        method: isEditing ? "PUT" : "POST",
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
        document.getElementById("signup-button").disabled = true;
        document.location.href = "/user";
      }
    });

  const handleInputChange = () => {
    if (
      validation[firstName.id] &&
      validation[lastName.id] &&
      validation[userName.id] &&
      validation[password.id] &&
      validation[passwordReenter.id] &&
      validation[email.id]
    ) {
      document.getElementById("signup-button").disabled = false;
    } else signup.disabled = true;
  };

  const handleInputValidation = (element, condition) => {
    element.addEventListener("input", () => {
      element.style.borderColor = "rgb(108, 107, 107)";
      if (condition()) {
        element.style.outlineColor = "rgb(81, 225, 49)";
        validation[element.id] = true;
      } else {
        element.style.outlineColor = "rgb(237, 229, 66)";
        validation[element.id] = false;
      }
      handleInputChange();
    });
  };
  handleInputValidation(firstName, () => firstName.value.trim().length > 2);
  handleInputValidation(lastName, () => lastName.value.trim().length > 2);
  handleInputValidation(userName, () => userName.value.trim().length > 4);
  handleInputValidation(password, () => password.value.length > 8);
  handleInputValidation(
    passwordReenter,
    () =>
      passwordReenter.value.length > 8 &&
      passwordReenter.value === password.value
  );
  handleInputValidation(
    email,
    () => email.value.length > 5 && email.value.includes("@")
  );

  firstName.addEventListener("blur", () => {
    if (firstName.value.trim().length < 3) firstName.style.borderColor = "red";
  });

  lastName.addEventListener("blur", () => {
    if (lastName.value.trim().length < 3) lastName.style.borderColor = "red";
  });
  userName.addEventListener("blur", () => {
    if (userName.value.trim().length < 5) userName.style.borderColor = "red";
  });
  password.addEventListener("blur", () => {
    if (password.value.trim().length < 9) password.style.borderColor = "red";
  });
  passwordReenter.addEventListener("blur", () => {
    if (
      passwordReenter.value.trim().length < 9 &&
      passwordReenter.value !== password.value
    )
      email.style.borderColor = "red";
  });
  email.addEventListener("blur", () => {
    if (email.value.trim().length < 6 && email.value.includes("@"))
      email.style.borderColor = "red";
  });
  signupCancel.addEventListener("click", () => {
    window.location.href = getCurrentRoute();
  });
});
