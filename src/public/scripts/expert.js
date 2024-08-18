function showImage(src) {
  document.getElementById("fullImage").src = src;
  document.getElementById("overlay").style.display = "flex";
}

function closeImage() {
  document.getElementById("overlay").style.display = "none";
}

function closeModal() {
  document.getElementById("overlay-2").style.display = "none";
  clearForm();
}

function clearForm() {
  const value = document.getElementById("estimateValue");
  const valueError = document.getElementById("estimateValueError");
  const summary = document.getElementById("reviewMessage");
  const summaryError = document.getElementById("reviewMessageError");
  const reviewNotes = document.getElementById("notes");
  const reviewNotesError = document.getElementById("notesError");
  value.value = 0;
  summary.value = "";
  reviewNotes.value = "";
  valueError.classList.add("d-none");
  summaryError.classList.add("d-none");
  reviewNotesError.classList.add("d-none");
  value.classList.remove("border-red");
  summary.classList.remove("border-red");
  reviewNotes.classList.remove("border-red");
}

document.addEventListener("DOMContentLoaded", () => {
  const expertHireButton = document.getElementById("expert-Hire-btn");
  const expertEditButton = document.getElementById("expert-edit-btn");
  const reviewRequests = document.getElementById("review-requets");
  const expertGallery = document.getElementById("expert-gallery");
  const reviewForm = document.getElementById("review-modal");
  const overlay = document.getElementById("overlay-2");
  let currentList = {};

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const condition = document.getElementById("condition");
    const value = document.getElementById("estimateValue");
    const valueError = document.getElementById("estimateValueError");
    const summary = document.getElementById("reviewMessage");
    const summaryError = document.getElementById("reviewMessageError");
    const reviewNotes = document.getElementById("notes");
    const reviewNotesError = document.getElementById("notesError");

    if (value.value <= 0 || value.value > 100000000) {
      value.classList.add("border-red");
      valueError.classList.remove("d-none");
      valid = false;
    }
    if (summary.value.trim().length <= 10 || summary.value.trim().length > 80) {
      summary.classList.add("border-red");
      summaryError.classList.remove("d-none");
      valid = false;
    }
    if (
      reviewNotes.value.trim().length <= 10 ||
      reviewNotes.value.trim().length > 500
    ) {
      reviewNotes.classList.add("border-red");
      reviewNotesError.classList.remove("d-none");
      valid = false;
    }
    if (valid) {
      const data = {
        expertId: expert._id,
        listingId: currentList._id,
        condition: filterXSS(condition.value.trim()),
        estimateValue: Number(filterXSS(value.value)),
        reviewMessage: filterXSS(summary.value.trim()),
        notes: filterXSS(reviewNotes.value.trim()),
      };
      fetch("/api/expert/addReview", {
        method: "POST",
        body: JSON.stringify(data),
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
              window.location.replace("/expert");
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
                window.location.replace("/expert");
              }
            });
          });
        }
      });
    }
  });

  const reviewedList = document.getElementById("completed-requests");
  if (expert.userId === user._id) {
    document.getElementById("review-counter").classList.remove("d-none");
    expertHireButton.classList.add("d-none");
    expertEditButton.classList.remove("d-none");
    expertGallery.classList.add("d-none");
    for (let list of expert.pendingReviews) {
      const review = document.createElement("li");
      review.classList.add("card");
      review.classList.add("p-2");
      review.innerHTML = `
          <div class='d-flex justify-content-between'>
          <p class='fs-5 m-0'>${list.title}</p><p class='m-1'>status: ${list.status}</p></div>
          <img src=${list.image} class='img-thumbnail'/>
          <button class='btn btn-info m-1'>Add Review</button>`;
      reviewRequests.appendChild(review);
      review.addEventListener("click", () => {
        currentList = list;
        document.getElementById(
          "estimate-value-label"
        ).innerHTML = `Estimated Value (listed for $${list.price})`;
        overlay.style.display = "block";
        // todo
        const condition = document.getElementById("condition");
        const value = document.getElementById("estimateValue");
        const valueError = document.getElementById("estimateValueError");
        const summary = document.getElementById("reviewMessage");
        const summaryError = document.getElementById("reviewMessageError");
        const reviewNotes = document.getElementById("notes");
        const reviewNotesError = document.getElementById("notesError");
        value.addEventListener("input", () => {
          value.classList.remove("border-red");
          valueError.classList.add("d-none");
        });
        summary.addEventListener("input", () => {
          summary.classList.remove("border-red");
          summaryError.classList.add("d-none");
        });
        reviewNotes.addEventListener("input", () => {
          reviewNotes.classList.remove("border-red");
          reviewNotesError.classList.add("d-none");
        });
      });
    }
  }
  for (let list of expert.pastReviews) {
    currentList = list;
    const review = document.createElement("li");
    review.classList.add("card");
    review.classList.add("p-2");
    review.setAttribute("role", "button");
    review.addEventListener("click", () => {
      window.location.href = `/listings/${list._id}`;
    });
    review.innerHTML = `
        <div class='d-flex justify-content-between'>
        <p class='fs-5 m-0'>${list.title}</p><p class='m-1'>status: ${list.status}</p></div>
        <img src=${list.image} class='img-thumbnail'/>`;
    reviewedList.appendChild(review);
  }
  expertHireButton.addEventListener("click", () => {
    document.location.href = `/expert/hire?id=${expert._id}`;
  });

  expertEditButton.addEventListener("click", () => {
    document.location.href = `/expert/edit/${expert._id}`;
  });
});
