const expertSearchError = document.getElementById("search-error");
document.getElementById("search-expert").addEventListener("click", function () {
  const name = filterXSS(document.getElementById("expert-name").value);
  if (!name || name.trim().length === 0) {
    expertSearchError.innerText = "Input cannot be empty";
    expertSearchError.hidden = false;
  } else {
    window.location.href = "/expert/search?name=" + name;
  }
});

if (experts)
  experts.forEach((expert) => {
    document.getElementById(expert._id).addEventListener("click", async () => {
      window.location.href = getCurrentRoute() + `/expert/${expert._id}`;
    });
  });
