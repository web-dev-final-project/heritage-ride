document.addEventListener("DOMContentLoaded", () => {
  const navUser = document.getElementById("nav-user");
  const navDropdown = document.getElementById("nav-menu");
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", (e) => {
    window.location.href = getCurrentRoute() + "/user/login";
  });

  if (navUser) {
    const navUserDetail = document.getElementById("nav-user-detail");
    const navUserSeller = document.getElementById("nav-user-seller");
    const navUserExpert = document.getElementById("nav-user-expert");
    const navUserEdit = document.getElementById("nav-user-edit");
    const navLogout = document.getElementById("nav-logout");

    navUserDetail.href = getCurrentRoute() + "/user";
    navUserSeller.href = getCurrentRoute() + "/seller";
    navUserExpert.href = getCurrentRoute() + "/expert";
    navUserEdit.href = getCurrentRoute() + "/user/edit";
    navLogout.href = getCurrentRoute() + "/user/logout";

    document.addEventListener("click", (event) => {
      const isClickInsideNav = navDropdown.contains(event.target);
      const isClickInsideDropdown = navUser.contains(event.target);

      if (!isClickInsideNav && !isClickInsideDropdown) {
        navDropdown.hidden = true;
      }
    });
    navUser.addEventListener("click", () => {
      navDropdown.hidden = !navDropdown.hidden;
    });
  }
});
