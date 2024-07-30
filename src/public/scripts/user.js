const profileTab = document.getElementById("user-profile-tab");
const listingTab = document.getElementById("user-listing-tab");

const listings = {{{json listing}}}

const list = document.createElement("ul")

for (let data of listings) {
    let item = document.createElement("li")
    item.classList.add("listing-list-item")
    
}



document.addEventListener("DOMContentLoaded", () => {
  profileTab.classList.add("select-tab");

  profileTab.addEventListener("click", () => {
    profileTab.classList.add("select-tab");
    listingTab.classList.remove("select-tab");
  });
  listingTab.addEventListener("click", () => {
    listingTab.classList.add("select-tab");
    profileTab.classList.remove("select-tab");
  });
});
