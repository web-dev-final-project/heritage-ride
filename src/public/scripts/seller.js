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

const sellerCentral = document.getElementById("seller-central-page");
const activePage = document.getElementById("active-page");
const reviewPage = document.getElementById("review-page");
const selectList = document.getElementById("seller-list-filter");
const soldPage = document.getElementById("sold-page");

activePage.classList.add("border");
reviewPage.classList.add("fw-light");
soldPage.classList.add("fw-light");

const generateList = (list, status) => {
  let lists = listings;
  if (list !== "all") {
    lists = listings.filter(
      (li) => li.itemType === list && li.status === status
    );
  }
  return lists;
};
function addList(listContainer, lists, status) {
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
    } class="img-thumbnail"/>
    ${
      status === "reserved"
        ? `<a href='/seller/transaction/${item._id}'><button class='btn btn-info mt-1 text-white w-100'>View</button></a>`
        : ""
    }
    `;
    listContainer.appendChild(element);
    document
      .getElementById("item-" + item._id)
      .addEventListener("click", () => {
        document.location.href = `/listings/eidt/${item._id}`;
      });
  }
}

if (sellerCentral) {
  const listContainer = document.getElementById("user-listings");
  const attentionList = document.getElementById("attention-list");
  const sellerListings = document.getElementById("seller-list-filter");
  const listingInfo = document.getElementById("seller-listing-info");

  let list = generateList(sellerListings.value, "open");
  addList(listContainer, list, "open");
  sellerListings.addEventListener("change", () => {
    list = generateList(sellerListings.value, "open");
    addList(listContainer, list, "open");
    if (list.length === 0) {
      listingInfo.innerHTML = `You have 0 ${sellerListings.value} listing.`;
      listingInfo.style.display = "block";
    } else listingInfo.style.display = "none";
  });

  activePage.addEventListener("click", () => {
    if (!activePage.classList.contains("border")) {
      activePage.classList.add("border");
    }
    if (!reviewPage.classList.contains("fw-light")) {
      reviewPage.classList.add("fw-light");
    }
    if (!soldPage.classList.contains("fw-light")) {
      soldPage.classList.add("fw-light");
    }
    activePage.classList.remove("fw-light");
    reviewPage.classList.remove("border");
    soldPage.classList.remove("border");
    selectList.style.display = "block";
    addList(listContainer, list, "open");
  });

  reviewPage.addEventListener("click", () => {
    if (!reviewPage.classList.contains("border")) {
      reviewPage.classList.add("border");
    }
    if (!activePage.classList.contains("fw-light")) {
      activePage.classList.add("fw-light");
    }
    if (!soldPage.classList.contains("fw-light")) {
      soldPage.classList.add("fw-light");
    }
    selectList.style.display = "none";
    reviewPage.classList.remove("fw-light");
    activePage.classList.remove("border");
    soldPage.classList.remove("border");
    const filteredList = list.filter(
      (li) =>
        li.mechanicReviews.length > 0 &&
        li.sellerId === user._id &&
        li.mechanicReviews[0].review === null
    );
    addList(listContainer, filteredList, "open");
  });

  soldPage.addEventListener("click", () => {
    if (!soldPage.classList.contains("border")) {
      soldPage.classList.add("border");
    }
    if (!activePage.classList.contains("fw-light")) {
      activePage.classList.add("fw-light");
    }
    if (!reviewPage.classList.contains("fw-light")) {
      reviewPage.classList.add("fw-light");
    }
    selectList.style.display = "none";
    soldPage.classList.remove("fw-light");
    activePage.classList.remove("border");
    reviewPage.classList.remove("border");
    const filteredList = list.filter((li) => li.status === "sold");
    addList(listContainer, filteredList, "open");
    if (filteredList.length === 0) {
      const message = document.createElement("p");
      message.classList.add("fs-4");
      message.innerHTML = "You have not sold any thing yet.";
      listContainer.appendChild(message);
    }
  });

  const reservedlist = generateList("car", "reserved");
  addList(attentionList, reservedlist, "reserved");
  document.getElementById("listing-attention-num").innerHTML =
    reservedlist.length;
}
