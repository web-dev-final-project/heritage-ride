document
  .getElementById("show-all-experts")
  .addEventListener("click", function () {
    window.location.href = "/expert/all";
  });

document.getElementById("search-expert").addEventListener("click", function () {
  const name = document.getElementById("expert-name").value;
  window.location.href = "/expert/search?name=" + name;
});

experts.forEach((expert) => {
  console.log(expert);
  document.getElementById(expert._id).addEventListener("click", async () => {
    window.location.href = getCurrentRoute() + `/expert/${expert._id}`;
  });
});
