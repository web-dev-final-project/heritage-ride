document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("search-tab");
  const expert = document.getElementById("expert-tab");
  const seller = document.getElementById("seller-tab");
  search.classList.remove("nav-select");
  expert.classList.remove("nav-select");
  seller.classList.remove("nav-select");

  if (document.location.href.includes("search"))
    search.classList.add("nav-select");
  else if (document.location.href.includes("expert"))
    expert.classList.add("nav-select");
  else if (document.location.href.includes("seller"))
    seller.classList.add("nav-select");

  search.addEventListener("click", () => {
    window.location.href = "/listings/search";
  });
  expert.addEventListener("click", () => {
    window.location.href = "/expert/all";
  });
  seller.addEventListener("click", () => {
    window.location.href = "/seller";
  });

  document.getElementById("nav-name").addEventListener("click", () => {
    window.location.href = "/";
  });
  document.getElementById("nav-logo").addEventListener("click", () => {
    window.location.href = "/";
  });

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
