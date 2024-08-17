document.getElementById("search-expert").addEventListener("click", function () {
  const name = filterXSS(document.getElementById("expert-name").value);
  if (!name || name.trim().length === 0) {
    window.location.href = "/expert/all";
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
