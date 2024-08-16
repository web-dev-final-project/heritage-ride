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
const orderedNumber = document.getElementById("ordered-number");
const historyNumber = document.getElementById("history-number");

const historyItems = listings.filter((li) => li.status === "sold");
const orderedItems = listings.filter((li) => li.status !== "sold");
orderedNumber.innerHTML = `Ordered Items (${orderedItems.length} Total)`;
historyNumber.innerHTML = `Purchased Items (${historyItems.length} Total)`;

const showList = (collection, container) => {
  for (let item of collection) {
    const el = document.createElement("li");
    el.classList.add("card");
    el.classList.add("history-card");
    el.addEventListener("click", () => {
      window.location.href = `/listings/${item._id}`;
    });
    el.innerHTML = `
    <div class="d-flex justify-content-between">
      <p class="fs-5 my-0">${item.title}</p>
      <p>current status: ${item.status}</p>
    </div>
    <div class="d-flex justify-content-between">
      <p>Price: ${item.transaction.amount}</p>
      <p>Date purchased: ${item.transaction.updatedAt}</p>
    </div>
  `;
    container.appendChild(el);
  }
};

showList(historyItems, historyList);
showList(orderedItems, orderedList);

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
