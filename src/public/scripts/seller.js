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
  let lists = listings;
  if (list !== "all") {
    lists = listings.filter((li) => li.itemType === list);
  }
  listContainer.innerHTML = "";
  for (let item of lists) {
    let element = document.createElement("li");
    element.classList.add("card");
    element.classList.add("p-2");
    element.innerHTML = `
    <div class="d-flex justify-content-between">
    <div>
    <p class="fs-5 my-0">${item.title}</p>
    <p>current status: ${item.status}</p>
    </div>
    <div><button id="item-${
      item._id
    }" class="btn btn-warning">Edit</button></div>
    </div>
    <img src=${
      item.image ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSReWLry0CkAtuYdDZGhY6iuy5I4gudfFxjdw&s"
    } class="img-thumbnail"/>`;
    listContainer.appendChild(element);
    document
      .getElementById("item-" + item._id)
      .addEventListener("click", () => {
        document.location.href = `/listings/eidt/${item._id}`;
      });
  }
  return lists;
};

if (sellerCentral) {
  const listContainer = document.getElementById("user-listings");
  const sellerListings = document.getElementById("seller-list-filter");
  generateList(listContainer, sellerListings.value);

  sellerListings.addEventListener("change", () => {
    generateList(listContainer, sellerListings.value);
  });
}
