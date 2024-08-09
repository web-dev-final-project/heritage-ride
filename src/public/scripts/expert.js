document.addEventListener("DOMContentLoaded", () => {
  const expertHireButton = document.getElementById("expert-Hire-btn");
  const expertEditButton = document.getElementById("expert-edit-btn");
  if (expert.userId === user._id) {
    expertHireButton.classList.add("d-none");
    expertEditButton.classList.remove("d-none");
  }
  expertHireButton.addEventListener("click", () => {
    window.location.href = `/expert/hire?id=${expert._id}`;
  });

  expertEditButton.addEventListener("click", () => {});
});
