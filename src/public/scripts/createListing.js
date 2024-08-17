document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Select the form element
    const errorContainer = document.getElementById('errorContainer'); // Container for error messages
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission
      
      // Collect form data
      const formData = new FormData(form);
  
      // Extract individual fields
      const carId = formData.get('carId');
      const price = formData.get('price');
      const image = formData.get('image');
  
      try {
        // Field validation
        if (!carId) {
          throw new Error('Car ID cannot be empty.');
        }
        
        const parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          throw new Error('Price must be a valid positive number.');
        }
  
        if (typeof image !== 'string' || image.trim() === '' || !/^https?:\/\/.+/.test(image)) {
            throw new Error('Image URL must be a valid URL.');
        }
  
        // Send form data using fetch
        const response = await fetch('/api/listings/create', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              carId: carId,
              price: parsedPrice,
              image: image
            })
          });
  
        if (response.ok) {
          // If the response is successful, redirect to the seller page
          document.location.replace('/seller');
        } else {
          // Handle errors from the server
          const json = await response.json();
          throw new Error(json.content || 'An error occurred');
        }
      } catch (e) {
        // Display the error message
        errorContainer.innerHTML = e.message;
        errorContainer.style.display = 'block';
      }
    });
  });


// const car = document.getElementById("car");
// const image = document.getElementById("image");
// const price = document.getElementById("price");

// expertForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
  
//     try {
//         const parsedPrice = Number(price);
//         if (isNaN(parsedPrice) || parsedPrice <= 0) {
//           throw new Error('Price must be a valid positive number.');
//         }
//         if (typeof image !== 'string' || image.trim() === '' || !/^https?:\/\/.+/.test(image)) {
//             throw new Error('Image URL must be a valid URL.');
//         }
//         // if (typeof carId !== 'string' || carId.trim() === '') {
//         //     throw 'Car ID cannot be empty.';
//         // }
//         const res = await fetch("/api/listings/create", {
//             method: "POST",
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(listing),
//           });
//           if (res.ok) {
//             document.location.replace("/seller");
//           } else {
//             const json = await res.json();
//             throw new Error(json.content || "An error occurred");
//           }
        
//     } catch (e) {
//         expertSignUpError.innerHTML = e.message;
//         expertSignUpError.style.display = "block";
//     }
// }
  
//       if (isEdit) {
//         const res = await fetch("/api/expert", {
//           method: "PUT",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(expert),
//         });
//         if (res.ok) {
//           document.location.replace("/expert");
//         } else {
//           const json = await res.json();
//           throw new Error(json.content || "An error occurred");
//         }
//       } else {
//         const res = await fetch("/api/expert", {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(expert),
//         });
//         if (res.ok) {
//           document.location.replace("/expert");
//         } else {
//           const json = await res.json();
//           throw new Error(json.content || "An error occurred");
//         }
//       }
//     } catch (e) {
//       expertSignUpError.innerHTML = e.message;
//       expertSignUpError.style.display = "block";
//     }
//   });

// Validation Functions
// function validatePrice(price) {
//     const parsedPrice = Number(price);
//     if (isNaN(parsedPrice) || parsedPrice <= 0) {
//       throw 'Price must be a valid positive number.';
//     }
//     return parsedPrice;
//   }
  
//   function validateImage(image) {
//     if (typeof image !== 'string' || image.trim() === '' || !/^https?:\/\/.+/.test(image)) {
//       throw 'Image URL must be a valid URL.';
//     }
//     return image;
//   }
  
//   function validateCarId(carId) {
//     if (typeof carId !== 'string' || carId.trim() === '') {
//       throw 'Car ID cannot be empty.';
//     }
//     return carId.trim();
//   }
  
//   document.getElementById("createListingForm").addEventListener("submit", async function(event) {
//     event.preventDefault(); // Prevent the default form submission
    
//     const form = event.target; // Reference to the form
//     const carIdInput = form.elements['carId'].value.trim();
//     const priceInput = form.elements['price'].value.trim();
//     const imageInput = form.elements['image'].value.trim();
//     const itemTypeInput = form.elements['itemType'].value;
  
//     // Validation
//     try {
//       const carId = validateCarId(carIdInput);
//       const price = validatePrice(priceInput);
//       const image = validateImage(imageInput);
  
//       // Confirmation prompt
//       Swal.fire({
//         title: "Confirm Submission",
//         text: `You are about to create a listing with the following details:\nCar ID: ${carId}\nPrice: $${price}\nImage URL: ${image}`,
//         icon: "info",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Submit",
//         cancelButtonText: "Cancel"
//       }).then(async (result) => {
//         if (result.isConfirmed) {
//           Swal.fire("Processing request...");
//           Swal.showLoading();
  
//           try {
//             const response = await fetch(form.action, {
//               method: form.method,
//               headers: {
//                 'Content-Type': 'application/json'
//               },
//               body: JSON.stringify({
//                 carId,
//                 price,
//                 image,
//                 itemType: itemTypeInput
//               })
//             });
  
//             const result = await response.json();
  
//             if (response.ok) {
//               Swal.fire({
//                 title: "Success!",
//                 text: "Your listing has been created successfully.",
//                 icon: "success"
//               }).then(() => {
//                 window.location.href = "/seller"; // Redirect to the seller page
//               });
//             } else {
//               Swal.fire({
//                 title: "Oops!",
//                 text: result.content || "Something went wrong.",
//                 icon: "error"
//               });
//             }
//           } catch (error) {
//             Swal.fire({
//               title: "Oops!",
//               text: "An unexpected error occurred.",
//               icon: "error"
//             });
//           }
//         }
//       });
//     } catch (error) {
//       Swal.fire({
//         title: "Validation Error",
//         text: error,
//         icon: "error"
//       });
//     }
//   });