document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const errorContainer = document.getElementById('errorContainer');
  
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const formData = new FormData(form);
  
      const carId = formData.get('carId');
      const price = formData.get('price');
      const image = formData.get('image');

      // Get itemType from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const itemType = urlParams.get('itemtype');
  
      try {
        // Field validations
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
  
        // Send form data
        const response = await fetch('/api/listings/create', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              carId: carId,
              price: parsedPrice,
              image: image,
              itemType: itemType
            })
          });
  
        if (response.ok) {
          document.location.replace('/seller');
        } else {
          const json = await response.json();
          throw new Error(json.content || 'An error occurred');
        }
      } catch (e) {
        errorContainer.innerHTML = e.message;
        errorContainer.style.display = 'block';
      }
    });
  });