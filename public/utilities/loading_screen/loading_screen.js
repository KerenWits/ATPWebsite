let loadingScreen = document.getElementById("loading-screen");
let loadingText = document.getElementById("loading-text");

class LoadingScreen {
  constructor() {
    this.loadingScreen = loadingScreen;
    this.loadingText = loadingText;
  }

  show(text = "Loading...") {
    this.loadingText.textContent = text;
    this.loadingScreen.classList.remove("hidden");
  }

  update(text) {
    this.loadingText.textContent = text;
  }

  close() {
    this.loadingScreen.classList.add("hidden");
  }
}

export default LoadingScreen;

// // Usage example
// const loadingScreenController = new LoadingScreenController();

// // Show loading screen
// loadingScreenController.show('Please wait...');

// // Update loading screen text
// setTimeout(() => {
//     loadingScreenController.update('Almost there...');
// }, 2000);

// // Hide loading screen
// setTimeout(() => {
//     loadingScreenController.close();
// }, 4000);
