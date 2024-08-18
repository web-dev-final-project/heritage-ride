const searchGrid = document.getElementById("search-grid");

const filteredListings = (() =>
  listings.filter(
    (li) =>
      li.status === "open" &&
      (currentSearch.value === "search-parts"
        ? li.itemType === "part"
        : li.itemType === "car")
  ))();

if (filteredListings.length === 0) {
  const searchNotFound = document.getElementById("search-not-found");
  searchNotFound.style.display = "block";
  searchGrid.style.display = "none";
}

for (let item of filteredListings) {
  const list = document.createElement("div");
  if (currentSearch.value === "search-cars") {
    list.innerHTML = `
      <a href="/listings/${item._id}" class="text-decoration-none text-dark">
      <li class="card shadow p-2">
        <div class="d-flex justify-content-between">
          <div>
            <h2 class="fs-5">${item.car?.make || "Unknown"} ${
      item.car?.model || "Unknown"
    }</h2>
            <h3 class="fs-6 text-secondary">${item.car?.year || "Unknown"} ${
      item.car?.color || "Unknown"
    }</h3>
          </div>
          <h4 class="text-success">${currency(item.price)}</h4>
        </div>

        <div class='gallery-image'><img src=${
          item.image
        } alt="" class="img-thumbnail h-100" /></div>
      </li>
    </a>
  `;
  } else if (currentSearch.value === "search-parts") {
    let cars = "";
    for (let car of item.car) {
      cars += `<a src='/listings/search?type=cars&make=${car.make}&model=${car.model}&category='>${car.make} ${car.model} ${car.year}</a>`;
    }
    list.innerHTML = `
    <li class="card shadow p-2">
      <div class="d-flex justify-content-between">
        <div>
          <h2 class="fs-5">${item.part.name}</h2>
          <p>Compatible</p>
          <div>${cars.length > 0 ? cars : "<p>Not apply</p>"}</div></h3>
        </div>
        <h4 class="text-success">${currency(item.price)}</h4>
      </div>

      <div class='gallery-image'><img src=${
        item.image
      } alt="" class="img-thumbnail h-100" /></div>
    </li>
  </a>
`;
    list.addEventListener(
      "click",
      () => (window.location.href = `/listings/part/${item._id}`)
    );
  }
  searchGrid.appendChild(list);
}
