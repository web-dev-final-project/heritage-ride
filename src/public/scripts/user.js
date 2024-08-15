const badgeIcon = document.querySelector(".badge-icon");
if (user && user.role && user.role.includes("expert")) {
  badgeIcon.style.display = "block";
} else {
  badgeIcon.style.display = "none";
}
document.getElementById("edit-user").addEventListener("click", () => {
  window.location.href = "/user/edit";
});
const purchaseTab = document.getElementById("purchase-tab");
const profileTab = document.getElementById("profile-tab");
const purchasePage = document.getElementById("purchase-page");
const profilePage = document.getElementById("profile-page");
const orderedList = document.getElementById("ordered-list");
const historyList = document.getElementById("history-list");

const historyItems = listings.filter((li) => li.status === "sold");
const orderedItems = listings.filter((li) => li.status !== "sold");

for (let item of historyItems) {
  const el = document.createElement("li");
  el.innerHTML = `
    <p>
  `;
  historyList.appendChild(el);
}

profileTab.style.fontSize = "1.8rem";
purchaseTab.style.fontSize = "1.3rem";
purchasePage.style.display = "none";
profileTab.addEventListener("click", () => {
  profileTab.style.fontSize = "1.8rem";
  purchaseTab.style.fontSize = "1.3rem";
  profilePage.style.display = "block";
  purchasePage.style.display = "none";
});
purchaseTab.addEventListener("click", () => {
  purchaseTab.style.fontSize = "1.8rem";
  profileTab.style.fontSize = "1.3rem";
  profilePage.style.display = "none";
  purchasePage.style.display = "block";
});
