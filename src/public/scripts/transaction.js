//todo : add pop up ask user if want to commit approve

// todo redirect user after success
document.getElementById("approve-transaction").addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure?",
    text: `You will sell your listing for ${price}!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirm",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Processing request...");
      Swal.showLoading();
      fetch("/api/seller/complete/" + transaction._id)
        .then((res) => {
          console.log(res);
          if (res.ok && res.status === 200) {
            Swal.fire({
              title: "Sucess!",
              text: "Sold, you have complete the transaction, congrats.",
              icon: "success",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.replace("/seller");
              }
            });
          } else {
            Swal.fire({
              title: "Oops",
              text: "Something failed while processing your request.",
              icon: "error",
            });
          }
        })
        .catch((e) =>
          Swal.fire({
            title: "Oops",
            text: "Something failed while processing your request.",
            icon: "error",
          })
        );
    }
  });
});
