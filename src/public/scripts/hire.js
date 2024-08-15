document.getElementById("return-button").addEventListener("click", () => {
  document.location.href = `http://localhost:4000/expert/${expertId}`;
});

if (!user.role.includes("seller")) {
  document.getElementById("add-seller").classList.remove("d-none");
  document.getElementById("add-seller").addEventListener("click", () => {
    document.location.href = `listings/add`;
  });
} else if (listings.length === 0) {
  document.getElementById("add-car").classList.remove("d-none");
  document.getElementById("add-car").addEventListener("click", () => {
    document.location.href = `listings/add`;
  });
} else {
  const listContainer = document.getElementById("seller-listings");
  const cars = listings.filter(
    (list) =>
      list.itemType === "car" &&
      list.status !== "sold" &&
      list.mechanicReviews.length === 0
  );

  for (let item of cars) {
    let element = document.createElement("li");
    element.classList.add("card");
    element.classList.add("p-2");
    element.innerHTML = `
    <div class="d-flex justify-content-between">
    <div>
    <p class="fs-5 my-0">${item.title}</p>
    <p>current status: ${item.status}</p>
    </div>
    <img src=${
      item.image ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSReWLry0CkAtuYdDZGhY6iuy5I4gudfFxjdw&s"
    } class="img-thumbnail"/>
    `;
    listContainer.appendChild(element);
    element.addEventListener("click", () => {
      fetch("/api/expert/hire", {
        method: "POST",
        body: JSON.stringify({
          expertId: expertId,
          listingId: item._id,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          Swal.fire({
            title: "Sucess!",
            text: "Your request have been successfully sent.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.replace("/expert/" + expertId);
            }
          });
        } else {
          res.json().then((json) => {
            Swal.fire({
              title: "Sorry!",
              text: json.content,
              icon: "error",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.replace("/expert/" + expertId);
              }
            });
          });
        }
      });
    });
  }
}
