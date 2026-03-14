const loadingBar = document.getElementById("loadingBar");
const loadingText = document.getElementById("loadingText");

const messages = [
  "Brewing your experience...",
  "Grinding fresh ideas...",
  "Pouring your favorites...",
  "Almost ready..."
];

let progress = 0;
let messageIndex = 0;

const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 12) + 6;

  if (progress > 100) {
    progress = 100;
  }

  loadingBar.style.width = `${progress}%`;

  if (progress >= 25 && messageIndex === 0) {
    messageIndex = 1;
    loadingText.textContent = messages[messageIndex];
  } else if (progress >= 50 && messageIndex === 1) {
    messageIndex = 2;
    loadingText.textContent = messages[messageIndex];
  } else if (progress >= 75 && messageIndex === 2) {
    messageIndex = 3;
    loadingText.textContent = messages[messageIndex];
  }

  if (progress === 100) {
    clearInterval(interval);

    setTimeout(() => {
      // Change this to your next page
      window.location.href = "index.html";
    }, 700);
  }
}, 350);