function showImage(src) {
  document.getElementById("fullImage").src = src;
  document.getElementById("overlay").style.display = "flex";
}

function closeImage() {
  document.getElementById("overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  const expertHireButton = document.getElementById("expert-Hire-btn");
  const expertEditButton = document.getElementById("expert-edit-btn");
  if (expert.userId === user._id) {
    expertHireButton.classList.add("d-none");
    expertEditButton.classList.remove("d-none");
  }
  expertHireButton.addEventListener("click", () => {
    document.location.href = `/expert/hire?id=${expert._id}`;
  });

  expertEditButton.addEventListener("click", () => {
    document.location.href = `/expert/edit/${expert._id}`;
  });
});
