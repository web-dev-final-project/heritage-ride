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

const firstNameError = document.getElementById("first-name-upload-error");
const lastNameError = document.getElementById("last-name-upload-error");
const userNameError = document.getElementById("username-upload-error");
const passwordError = document.getElementById("password-upload-error");
const passwordReenterError = document.getElementById("password-upload-2-error");
const emailError = document.getElementById("email-upload-error");
const addressError = document.getElementById("address-upload-error");
const avatarError = document.getElementById("avatar-upload-error");

const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");
signupCancel.addEventListener("click", () => {
  if (!lastVisitedUrl) {
    document.location.href = "/";
  } else window.history.back();
});

const validation = {
  [firstName.id]: false,
  [lastName.id]: false,
  [userName.id]: false,
  [password.id]: false,
  [passwordReenter.id]: false,
  [email.id]: false,
  [address.id]: false,
};

if (window.location.pathname === "/user/edit" && user) {
  firstName.value = user.firstName;
  lastName.value = user.lastName;
  userName.value = user.userName;
  email.value = user.email.toLowerCase();
  email.setAttribute("disabled", "true");
  address.value = user.address;
  avatar.value = user.avatar;
  validation[firstName.id] = true;
  validation[lastName.id] = true;
  validation[userName.id] = true;
  validation[email.id] = true;
  validation[address.id] = true;
  document.getElementById("signup-title").innerHTML = "Edit Profile";
} else document.getElementById("signup-title").innerHTML = "Sign Up";

const validatePass = (password) => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/;
  return regex.test(password);
};

document.addEventListener("DOMContentLoaded", () => {
  const isEditing = window.location.pathname === "/user/edit";
  document
    .getElementById("signup-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const obj = {
        firstName: filterXSS(firstName.value.toLowerCase().trim()),
        lastName: filterXSS(lastName.value.toLowerCase().trim()),
        userName: filterXSS(userName.value.toLowerCase().trim()),
        password: filterXSS(password.value.trim()),
        email: filterXSS(email.value.toLowerCase().trim()),
        address: filterXSS(address.value.trim()),
        avatar:
          filterXSS(avatar.value.trim()) ||
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
        Swal.fire({
          title: "Sucess!",
          text: "Your have successfully registered, please login.",
          icon: "success",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.replace("/user/login");
          }
        });
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
        element.nextElementSibling.style.display = "none";
      } else {
        element.style.outlineColor = "rgb(237, 229, 66)";
        validation[element.id] = false;
      }
      handleInputChange();
    });
  };
  function checkname(str) {
    return /^[A-Za-z]+$/.test(str);
  }
  handleInputValidation(
    firstName,
    () =>
      firstName.value.trim().length >= 2 &&
      firstName.value.trim().length <= 20 &&
      checkname(firstName.value.trim())
  );
  handleInputValidation(
    lastName,
    () =>
      lastName.value.trim().length >= 2 &&
      lastName.value.trim().length <= 20 &&
      checkname(lastName.value.trim())
  );
  handleInputValidation(
    userName,
    () =>
      !userName.value.trim().includes(" ") &&
      userName.value.trim().length >= 5 &&
      userName.value.trim().length <= 20
  );
  handleInputValidation(
    password,
    () =>
      !password.value.trim().includes(" ") &&
      password.value.length >= 10 &&
      password.value.trim().length <= 30 &&
      validatePass(password.value.trim())
  );
  handleInputValidation(
    passwordReenter,
    () => passwordReenter.value === password.value
  );
  handleInputValidation(
    email,
    () =>
      !email.value.trim().includes(" ") &&
      email.value.length > 5 &&
      email.value.trim().length <= 40 &&
      email.value.includes("@")
  );
  handleInputValidation(address, () => address.value.length <= 50);

  firstName.addEventListener("blur", () => {
    if (
      firstName.value.trim().length < 2 ||
      firstName.value.trim().length > 20 ||
      !checkname(firstName.value.trim())
    ) {
      firstName.style.borderColor = "red";
      firstNameError.style.display = "block";
    }
  });

  lastName.addEventListener("blur", () => {
    if (
      lastName.value.trim().length < 2 ||
      lastName.value.trim().length > 20 ||
      !checkname(lastName.value.trim())
    ) {
      lastName.style.borderColor = "red";
      lastNameError.style.display = "block";
    }
  });
  userName.addEventListener("blur", () => {
    if (
      userName.value.trim().length < 5 ||
      userName.value.trim().length > 20 ||
      userName.value.trim().includes(" ")
    ) {
      userName.style.borderColor = "red";
      userNameError.style.display = "block";
    }
  });
  password.addEventListener("blur", () => {
    if (
      password.value.trim().length < 10 ||
      password.value.trim().length > 30 ||
      password.value.trim().includes(" ") ||
      !validatePass(password.value.trim())
    ) {
      password.style.borderColor = "red";
      passwordError.style.display = "block";
    }
  });
  passwordReenter.addEventListener("blur", () => {
    if (passwordReenter.value !== password.value) {
      passwordReenter.style.borderColor = "red";
      passwordReenterError.style.display = "block";
    }
  });
  email.addEventListener("blur", () => {
    if (
      (email.value.trim().length < 5 ||
        email.value.trim().length > 40 ||
        email.value.trim().includes(" ")) &&
      !email.value.includes("@")
    ) {
      email.style.borderColor = "red";
      emailError.style.display = "block";
    }
  });
  address.addEventListener("blur", () => {
    if (address.value.trim().length > 50) {
      address.style.borderColor = "red";
      addressError.style.display = "block";
    }
  });
});
