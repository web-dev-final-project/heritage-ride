const searchGrid = document.getElementById("search-grid");

const filteredListings = listings.filter((li) => li.status === "open");

for (let item of filteredListings) {
  const list = document.createElement("div");
  list.innerHTML = `
      <a href="/listings/${item._id}" class="text-decoration-none text-dark">
      <li class="card shadow p-2">
        <div class="d-flex justify-content-between">
          <div>
            <h2 class="fs-5">${item.car.make} ${item.car.model}</h2>
            <h3 class="fs-6 text-secondary">${item.car.year} ${
    item.car.color
  }</h3>
          </div>
          <h4 class="text-success">${currency(item.price)}</h4>
        </div>

        <img src=${item.image} alt="" class="img-thumbnail" />
      </li>
    </a>
  `;
  searchGrid.appendChild(list);
}
