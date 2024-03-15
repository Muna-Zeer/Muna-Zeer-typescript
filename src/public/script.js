function displayUploadedImages() {
    fetch('/uploads')
        .then(response => response.json())
        .then((data) => { 
            const uploadedImagesContainer = document.getElementById('uploadedImages');
            uploadedImagesContainer.innerHTML = '';
            data.forEach(imageUrl => {
                const imgElement = document.createElement('img');
                imgElement.src = `/uploads/${imageUrl}`;
                uploadedImagesContainer.appendChild(imgElement);
            });
        })
        .catch(error => console.error('Error fetching uploaded images:', error));
}

window.onload = displayUploadedImages;
