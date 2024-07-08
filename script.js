// Get references to the DOM elements
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

// Initialize variables
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API configuration
const count = 30;
const apiKey = "v30rG3ppD-VoRXMA-aofmMBk2j2fIn7XxLJKaoh4pkE";
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

/**
 * Function to check if all images were loaded
 */
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

/**
 * Helper function to set attributes on DOM elements
 * @param {HTMLElement} element - The element to set attributes on
 * @param {Object} attributes - The attributes to set
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
}

/**
 * Function to create elements for links and photos, and add them to the DOM
 */
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;

  // Clear previous photos
  imageContainer.innerHTML = "";

  photosArray.forEach((photo) => {
    // Create <a> element to link to the full photo
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    // Create <img> element for the photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Add event listener to check when each image has finished loading
    img.addEventListener("load", imageLoaded);

    // Put <img> inside <a>, then put both inside the imageContainer
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

/**
 * Async function to get photos from the Unsplash API
 */
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    console.error("Failed to fetch photos:", error);
  }
}

/**
 * Event listener to check if scrolling near the bottom of the page,
 * and load more photos if conditions are met
 */
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On load
getPhotos();
