const sellerCentral = document.getElementById("seller-central-page");

document.getElementById("add-listing").addEventListener("click", () => {
  sellerCentral.classList.add("d-none");
  document.getElementById("seller-add-page").classList.remove("d-none");
  document
    .getElementById("add-listing-cancel")
    .addEventListener("click", () => {
      sellerCentral.classList.remove("d-none");
      document.getElementById("seller-add-page").classList.add("d-none");
    });
});

const generateList = (listContainer, list) => {
  const lists = listings.filter((li) => li.itemType === list);
  listContainer.innerHTML = "";
  for (let item of lists) {
    let element = document.createElement("li");
    element.classList.add("card");
    element.classList.add("p-2");
    element.innerHTML = `
    <p class="fs-5 my-0">${item.title}</p>
    <p>current status: ${item.status}</p>
    <img src=${
      item.image ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSReWLry0CkAtuYdDZGhY6iuy5I4gudfFxjdw&s"
    } class="img-thumbnail"/>`;
    listContainer.appendChild(element);
  }
  return lists;
};

if (sellerCentral) {
  const listContainer = document.getElementById("user-listings");
  generateList(listContainer, "car");
}
