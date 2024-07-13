document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const obj = {
    firstName: document.getElementById("first-name-upload").value,
    lastName: document.getElementById("last-name-upload").value,
    userName: document.getElementById("username-upload").value,
    password: document.getElementById("password-upload").value,
    email: document.getElementById("email-upload").value,
    address: document.getElementById("address-upload").value,
    avatar: document.getElementById("avatar-upload").value,
  };
  const res = await fetch(window.appData.signupUrl, {
    method: "POST",
    body: JSON.stringify(obj),
  });
  if (!res.ok) {
    document.getElementById("signup-message").innerHTML = (
      await res.json()
    ).content;
  } else {
    console.log(res.json());
  }
});
