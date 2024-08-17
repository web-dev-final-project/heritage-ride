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