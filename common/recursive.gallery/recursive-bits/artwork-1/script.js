document.addEventListener("DOMContentLoaded", () => {
  const imageUrls = [
    "https://d2w9rnfcy7mm78.cloudfront.net/30541094/original_8f197e45c75fbe6ac3ffb0f3f6b16eb7.png?1725854568?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541092/original_0b5189fcbdacff1ad28777c0e07cd243.png?1725854568?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541087/original_5da6b2c8ca57eb4ce8c445645cc3fede.png?1725854567?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541085/original_3add8a31e2252ab0d113ed0c9ffb8b7e.png?1725854567?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541084/original_89a4ad32f0a1b931e21ea46bd711853d.png?1725854567?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541082/original_eaee4e12da285e4051fd812fd94b36db.png?1725854566?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541081/original_a6e6af336c6b69b78bcfc8fdb5bdd367.png?1725854566?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541080/original_69094f48aa32538acdaaf0f41074d04e.png?1725854566?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541076/original_8379d683d3e82101241da58f6888de22.png?1725854565?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30541073/original_1877245c433c57d96fb558bd3c5c2493.png?1725854565?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540939/original_c38ddbdb3e580c7be22283200730d239.png?1725854137?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540938/original_356fb5b24270189813b94fe5fa0ee6b4.png?1725854136?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540933/original_a7fb2b0e4a48c13a2ff0d5b42bf66a83.png?1725854136?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540930/original_53dbf42f1ed3d16dc7051074df4d1af9.png?1725854135?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540929/original_e1da1c14a57fa3a046927d93bb28958b.png?1725854135?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540921/original_d8e44d04a0c20870bdb43334b2be5316.png?1725854134?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540919/original_ccda220d34d3d5db3cdd3be7cd4ec590.png?1725854132?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540916/original_79fa03c4d4eb4f69f3996ae47bf64657.png?1725854133?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540915/original_37673ed700dcff0bca302633187a5f06.png?1725854133?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540913/original_02d57fe69cf1168b53d10a0cd86b9a1b.png?1725854132?bc=0",
    "https://d2w9rnfcy7mm78.cloudfront.net/30540912/original_a157c746b20ce7c77a9ff36cfac18701.png?1725854132?bc=0"
  ];

  // Shuffle
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffle(imageUrls); // Shuffle the images

  const container = document.querySelector(".image-wrapper");

  // Add images
  imageUrls.forEach((url, index) => {
    const img = document.createElement("img");
    img.src = url;
    img.alt = `Pattern Image ${index + 1}`;
    img.classList.add("pattern-image");
    if (index === 0) {
      img.classList.add("half-screen-image");
    }
    container.appendChild(img);
  });

  const images = document.querySelectorAll(".pattern-image");
  let isGettingCloser = true;

  // killin g my self

  function bringImagesCloser() {
    images.forEach((image) => {
      if (!image.classList.contains("half-screen-image")) {
        const randomX = Math.random() * (window.innerWidth - image.width);
        const randomY = Math.random() * (window.innerHeight - image.height);
        const randomScale = Math.random() * 0.5 + 1.5; // Scale between 1.5 and 2
        const randomZ = Math.floor(Math.random() * 100); // Random z-index
        image.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
        image.style.zIndex = randomZ;
      }
    });
  }

  // resize
  function moveImagesFurther() {
    images.forEach((image) => {
      if (!image.classList.contains("half-screen-image")) {
        const randomX = Math.random() * (window.innerWidth - image.width);
        const randomY = Math.random() * (window.innerHeight - image.height);
        const randomScale = Math.random() * 0.5 + 0.5; // Scale between 0.5 and 1
        const randomZ = Math.floor(Math.random() * 100); // Random z-index
        image.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
        image.style.zIndex = randomZ;
      }
    });
  }

  // movement
  function toggleImageMovement() {
    if (isGettingCloser) {
      bringImagesCloser();
    } else {
      moveImagesFurther();
    }
    isGettingCloser = !isGettingCloser;
  }

  // random placements
  toggleImageMovement();

  // spacepress
  document.addEventListener("click", () => {
      toggleImageMovement();
  });
});