document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const errorContainer = document.getElementById("errorContainer");
  const carPreview = document.getElementById("car-preview");
  const carSelect = document.getElementById("car");
  const price = document.getElementById("price");
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const imageUpload = document.getElementById("image-upload");
  if (listing) {
    carSelect.value = listing.itemId;
    price.value = listing.price;
    title.value = listing.title;
    description.value = listing.description;
    imageUpload.value = listing.image;
  }

  const cancelButton = document.getElementById("cancel");
  const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");
  cancelButton.addEventListener("click", () => {
    if (lastVisitedUrl) document.location.href = lastVisitedUrl;
    else document.location.href = "/";
  });

  const car = cars.find((c) => c._id === carSelect.value);
  carPreview.innerHTML = `
    <div>
      <h3>${car.year} ${car.make} ${car.model}</h3>
      <img class='w-100' src=${car.image || "/images/no-image.jpeg"}/>
    </div>
  `;
  carSelect.addEventListener("change", () => {
    const car = cars.find((c) => c._id === carSelect.value);
    carPreview.innerHTML = `
      <div>
        <h3>${car.year} ${car.make} ${car.model}</h3>
        <img class='w-100' src=${car.image || "/images/no-image.jpeg"}/>
      </div>
    `;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const carId = formData.get("carId");
    const price = formData.get("price");
    const title = formData.get("title");
    const image = formData.get("image-upload");
    const description = formData.get("description");

    const urlParams = new URLSearchParams(window.location.search);
    const itemType = urlParams.get("itemtype");

    try {
      if (!carId) {
        throw new Error("Car ID cannot be empty.");
      }
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new Error("Price must be a valid positive number.");
      }
      if (
        typeof image !== "string" ||
        image.trim() === "" ||
        !/^https?:\/\/.+/.test(image)
      ) {
        throw new Error("Image URL must be a valid URL.");
      }
      if (title.trim().length < 5 || title.trim().length > 30)
        throw new Error("Description must be between 5 to 30 characters.");
      if (description.trim().length < 20 || description.trim().length > 500)
        throw new Error("Description must be between 20 to 500 characters.");

      if (listing) {
        const list = {
          listingId: filterXSS(listing._id),
          carId: filterXSS(carId),
          price: filterXSS(parsedPrice),
          image: filterXSS(image),
          title: filterXSS(title),
          itemType: filterXSS(listing.itemType),
          description: filterXSS(description),
        };
        console.log(list);
        const response = await fetch("/api/listings/edit", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(list),
        });

        if (response.ok) {
          Swal.fire({
            title: "Sucess!",
            text: "Modify listing successful!.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              document.location.replace(`/listings/${listing._id}`);
            }
          });
        } else {
          const json = await response.json();
          throw new Error(json.content || "An error occurred");
        }
      } else {
        const response = await fetch("/api/listings/create", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            carId: filterXSS(carId),
            price: filterXSS(parsedPrice),
            image: filterXSS(image),
            itemType: filterXSS(itemType),
            title: filterXSS(title),
            description: filterXSS(description),
          }),
        });

        if (response.ok) {
          Swal.fire({
            title: "Sucess!",
            text: "Congrats, you have created a new listing successfully!.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              document.location.replace("/seller");
            }
          });
        } else {
          const json = await response.json();
          throw new Error(json.content || "An error occurred");
        }
      }
    } catch (e) {
      errorContainer.innerHTML = e.message;
      errorContainer.style.display = "block";
    }
  });
});
