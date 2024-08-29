class LoadingScreen {
  constructor(document) {
    this.document = document;
  }

  show(message = "Loading...") {
    const style = this.document.createElement("style");
    style.textContent = `
        /* Style for the overlay */
          .overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.1); /* 10% opacity */
              z-index: 9999; /* Ensures the overlay is on top */
              display: flex;
              justify-content: center;
              align-items: center;
          }
          
          /* Centered loading spinner */
          .loading-spinner {
              display: flex;
              flex-direction: column; /* Stack spinner and text vertically */
              align-items: center; /* Center items horizontally */
              justify-content: center; /* Center items vertically */
              color: #fff;
              font-size: larger;
          }
          
          /* Spinner style */
          .spinner {
              border: 8px solid #f3f3f3; /* Light grey */
              border-top: 8px solid #3498db; /* Blue */
              border-radius: 50%;
              width: 60px;
              height: 60px;
              animation: spin 2s linear infinite;
              margin-bottom: 10px; /* Add space between spinner and text */
          }
          
          /* Spinner animation */
          @keyframes spin {
              0% {
                  transform: rotate(0deg);
              }
              100% {
                  transform: rotate(360deg);
              }
          }
    `;
    this.document.head.appendChild(style);

    // Create the overlay element
    const overlay = this.document.createElement("div");
    overlay.className = "overlay";

    // Create the loading spinner container
    const loadingSpinner = this.document.createElement("div");
    loadingSpinner.className = "loading-spinner";

    // Create the spinner element
    const spinner = this.document.createElement("div");
    spinner.className = "spinner";

    // Create the loading text
    const loadingText = this.document.createElement("p");
    loadingText.textContent = message;

    // Append the spinner and text to the loading spinner container
    loadingSpinner.appendChild(spinner);
    loadingSpinner.appendChild(loadingText);

    // Append the loading spinner container to the overlay
    overlay.appendChild(loadingSpinner);

    // Append the overlay to the body
    this.document.body.appendChild(overlay);
  }

  updateText(message) {
    const loadingText = this.document.querySelector(".loading-spinner p");
    loadingText.textContent = message;
  }

  hide() {
    const overlay = this.document.querySelector(".overlay");
    this.document.body.removeChild(overlay);
  }
}

export default LoadingScreen;
