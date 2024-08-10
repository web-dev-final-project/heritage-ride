document.getElementById("add-listing").addEventListener("click", () => {
  document.getElementById("seller-central-page").classList.add("d-none");
  document.getElementById("seller-add-page").classList.remove("d-none");
  document
    .getElementById("add-listing-cancel")
    .addEventListener("click", () => {
      document.getElementById("seller-central-page").classList.remove("d-none");
      document.getElementById("seller-add-page").classList.add("d-none");
    });
});
