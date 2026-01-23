let noClickCount = 0;

// EmailJS Configuration - Replace with your actual values from emailjs.com
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Get from EmailJS dashboard
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Get from EmailJS dashboard  
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Get from EmailJS dashboard

function showMessage(response) {
  if (response === "No") {
    noClickCount++;
    localStorage.setItem("noClickCount", noClickCount);

    const noButton = document.getElementById("no-button");
    const yesButton = document.getElementById("yesButton");
    const container = document.querySelector(".container");
    const maxWidth = window.innerWidth - noButton.offsetWidth;
    const maxHeight = window.innerHeight - noButton.offsetHeight;

    // Set button position to absolute
    noButton.style.position = "absolute";

    // Make Yes button bigger each time No is clicked
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = (currentSize + 4) + "px";
    yesButton.style.padding = `${10 + noClickCount * 2}px ${30 + noClickCount * 5}px`;

    // Change image source to "gun.gif"
    document.getElementsByClassName("image")[0].src = "images/babywithgun.gif";

    // Generate random coordinates within the visible container
    const randomX = Math.max(0, Math.floor(Math.random() * maxWidth));
    const randomY = Math.max(0, Math.floor(Math.random() * maxHeight));

    // Apply new coordinates to the button
    noButton.style.left = randomX + "px";
    noButton.style.top = randomY + "px";

    // Update text content and hide name message
    document.getElementById("question").textContent =
      "The no button is just for visuals, Celine!";
    document.getElementById("name").style.display = "none";

    // Optional: You can also add a timeout to reset the position after a few seconds
  }

  if (response === "Yes") {
    // Trigger confetti animation
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    // Multiple bursts for more effect
    setTimeout(() => confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } }), 250);
    setTimeout(() => confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } }), 400);

    // Send email notification with click count
    sendClickNotification();

    // Remove name message and no button
    document.getElementById("name").remove();
    document.getElementById("no-button").remove();

    // Update text content, show message
    const yesMessage = document.getElementById("question");
    yesMessage.textContent = "LESGOOO see you on the 14th Celine! 😘😘";
    yesMessage.style.display = "block";
    yesMessage.style.fontStyle = "normal";

    // Replace image with video
    const imgElement = document.getElementsByClassName("image")[0];
    const video = document.createElement("video");
    video.src = "images/GIFMaker_me.mp4";
    video.className = "image";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    imgElement.parentNode.replaceChild(video, imgElement);

    // Remove yes button
    document.getElementById("yesButton").remove();
  }
}

function sendClickNotification() {
  // Send email via EmailJS
  if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      no_clicks: noClickCount,
      message: `Celine said YES! She clicked No ${noClickCount} time(s) before saying Yes.`,
      timestamp: new Date().toLocaleString()
    }).then(
      () => console.log("Notification sent!"),
      (error) => console.log("Failed to send:", error)
    );
  }
}

// Initialize counter from localStorage on page load (hidden from user)
window.addEventListener("DOMContentLoaded", () => {
  const savedCount = localStorage.getItem("noClickCount");
  if (savedCount) {
    noClickCount = parseInt(savedCount, 10);
  }
});
