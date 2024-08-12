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

const generateList = (list, status) => {
  let lists = listings;
  if (list !== "all") {
    lists = listings.filter(
      (li) => li.itemType === list && li.status === status
    );
  }
  return lists;
};
const addList = (listContainer, lists) => {
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
};

if (sellerCentral) {
  const listContainer = document.getElementById("user-listings");
  const attentionList = document.getElementById("attention-list");
  const sellerListings = document.getElementById("seller-list-filter");
  const listingInfo = document.getElementById("seller-listing-info");

  let list = generateList(sellerListings.value, "open");
  addList(listContainer, list);
  sellerListings.addEventListener("change", () => {
    list = generateList(sellerListings.value, "open");
    addList(listContainer, list);
    if (list.length === 0) {
      listingInfo.innerHTML = `You have 0 ${sellerListings.value} listing.`;
      listingInfo.style.display = "block";
    } else listingInfo.style.display = "none";
  });

  const reservedlist = generateList("car", "reserved");
  addList(attentionList, reservedlist);
  document.getElementById("listing-attention-num").innerHTML =
    reservedlist.length;
}
