
// Validation Functions
function validatePrice(price) {
    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw 'Price must be a valid positive number.';
    }
    return parsedPrice;
  }
  
  function validateImage(image) {
    if (typeof image !== 'string' || image.trim() === '' || !/^https?:\/\/.+/.test(image)) {
      throw 'Image URL must be a valid URL.';
    }
    return image;
  }
  
  function validateCarId(carId) {
    if (typeof carId !== 'string' || carId.trim() === '') {
      throw 'Car ID cannot be empty.';
    }
    return carId.trim();
  }
  
  document.getElementById("createListingForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const form = event.target; // Reference to the form
    const carIdInput = form.elements['carId'].value.trim();
    const priceInput = form.elements['price'].value.trim();
    const imageInput = form.elements['image'].value.trim();
    const itemTypeInput = form.elements['itemType'].value;
  
    // Validation
    try {
      const carId = validateCarId(carIdInput);
      const price = validatePrice(priceInput);
      const image = validateImage(imageInput);
  
      // Confirmation prompt
      Swal.fire({
        title: "Confirm Submission",
        text: `You are about to create a listing with the following details:\nCar ID: ${carId}\nPrice: $${price}\nImage URL: ${image}`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Submit",
        cancelButtonText: "Cancel"
      }).then(async (result) => {
        if (result.isConfirmed) {
          Swal.fire("Processing request...");
          Swal.showLoading();
  
          try {
            const response = await fetch(form.action, {
              method: form.method,
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                carId,
                price,
                image,
                itemType: itemTypeInput
              })
            });
  
            const result = await response.json();
  
            if (response.ok) {
              Swal.fire({
                title: "Success!",
                text: "Your listing has been created successfully.",
                icon: "success"
              }).then(() => {
                window.location.href = "/seller"; // Redirect to the seller page
              });
            } else {
              Swal.fire({
                title: "Oops!",
                text: result.content || "Something went wrong.",
                icon: "error"
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Oops!",
              text: "An unexpected error occurred.",
              icon: "error"
            });
          }
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Validation Error",
        text: error,
        icon: "error"
      });
    }
  });