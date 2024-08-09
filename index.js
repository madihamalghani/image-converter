document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.id = 'previewImg'; // Add ID for the preview image
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.innerHTML = ''; // Clear previous preview
            imagePreview.appendChild(img);
            document.getElementById('conversionButtons').style.display = 'block'; // Show conversion buttons
            document.getElementById('resizeOptions').style.display = 'block'; // Show resize options
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file.');
    }
});

function resizeImage(width, height) {
    const img = document.getElementById('previewImg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL('image/jpeg');
}

document.getElementById('resizePreviewButton').addEventListener('click', function() {
    const width = parseInt(document.getElementById('resizeWidth').value);
    const height = parseInt(document.getElementById('resizeHeight').value);

    if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        const resizedDataUrl = resizeImage(width, height);
        const resizedImagePreview = document.getElementById('resizedImagePreview');
        resizedImagePreview.innerHTML = `<img src="${resizedDataUrl}" id="resizedPreviewImg" style="max-width: 100%; height: auto;">`;

        document.getElementById('downloadResizedButton').style.display = 'block'; // Show download button
        document.getElementById('downloadResizedButton').setAttribute('data-url', resizedDataUrl); // Store the data URL for download
    } else {
        alert('Please enter valid width and height values.');
    }
});

document.getElementById('downloadResizedButton').addEventListener('click', function() {
    const resizedDataUrl = this.getAttribute('data-url');
    if (resizedDataUrl) {
        downloadImage(resizedDataUrl, 'resized_image.jpg');
    } else {
        alert('No resized image to download.');
    }
});

function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
}

document.getElementById('convertToJpeg').addEventListener('click', function() {
    convertImage('jpeg');
});

document.getElementById('convertToPng').addEventListener('click', function() {
    convertImage('png');
});

document.getElementById('convertToWebp').addEventListener('click', function() {
    convertImage('webp');
});

function convertImage(format, width = null, height = null) {
    const img = document.getElementById('previewImg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Use the provided width and height, or default to the image's original size
    const imgWidth = width || img.naturalWidth;
    const imgHeight = height || img.naturalHeight;

    canvas.width = imgWidth;
    canvas.height = imgHeight;
    ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

    let mimeType;
    let fileExtension;

    switch (format) {
        case 'jpeg':
            mimeType = 'image/jpeg';
            fileExtension = 'jpg';
            break;
        case 'png':
            mimeType = 'image/png';
            fileExtension = 'png';
            break;
        case 'webp':
            mimeType = 'image/webp';
            fileExtension = 'webp';
            break;
        default:
            return;
    }

    const dataUrl = canvas.toDataURL(mimeType);
    downloadImage(dataUrl, `converted_image.${fileExtension}`);
}
