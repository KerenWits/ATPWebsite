class ConfirmDialog {
  constructor({
    document,
    title,
    message,
    buttons = ["Confirm", "Cancel"],
    callBacks = [() => {}, () => {}],
  }) {
    this.document = document;
    const style = document.createElement("style");
    style.textContent = `
        .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999; /* Ensure it is above all other content */
        }

        .popup-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            max-width: 400px;
            width: 80%;
        }

        .popup-content p {
            margin-bottom: 20px;
            font-size: 16px;
            color: black;
        }

        .popup-content h2 {
            margin-bottom: 20px;
            color: black;
        }

        .popup-button {
            background-color: red;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .popup-button:hover {
            background-color: #2980b9;
        }
        .button-container {
            display: flex;
            justify-content: center;
            gap: 30px; /* Add space between the buttons */
            margin-top: 20px;
        }


    `;
    document.head.appendChild(style);

    const overlay = this.document.createElement("div");
    overlay.className = "popup-overlay";
    this.document.body.appendChild(overlay);

    const content = this.document.createElement("div");
    content.className = "popup-content";
    overlay.appendChild(content);

    const titleElement = this.document.createElement("h2");
    titleElement.textContent = title;
    content.appendChild(titleElement);

    const messageElement = this.document.createElement("p");
    messageElement.textContent = message;
    content.appendChild(messageElement);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";

    buttons.forEach((button, index) => {
      const buttonElement = this.document.createElement("button");
      buttonElement.className = "popup-button";
      buttonElement.textContent = button;
      buttonElement.onclick = () => {
        callBacks[index]();
        this.close();
      };
      buttonContainer.appendChild(buttonElement);
    });
    content.appendChild(buttonContainer);
  }

  close() {
    let popupOverlay = this.document.querySelector(".popup-overlay");
    this.document.body.removeChild(popupOverlay);
  }
}

export default ConfirmDialog;
