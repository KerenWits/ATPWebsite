import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";

document.addEventListener("DOMContentLoaded", function () {
  let passedVar = localStorage.getItem("passedVar");
  console.log(passedVar);
  let quote = Quote.unStringify(passedVar);
  const startDateTime = new Date(quote.startDateTime);
  const endDateTime = new Date(quote.endDateTime);
  quote.startDateTime = startDateTime;
  quote.endDateTime = endDateTime;
  console.log(quote);

  const quoteId = document.getElementById("quoteInfo");
  quoteId.textContent = `Quote #${quote.id}`;

  let service = quote.service;

  const questionContainer = document.getElementById("questions-container");
  questionContainer.innerHTML = "";

  service.riskAnalysis.forEach((question, index) => {
    let questionDiv = document.createElement("div");
    questionDiv.className = "question-block";

    let questionPTag = document.createElement("p");
    questionPTag.textContent = `Question ${index + 1}: ${question.questionTxt}`;

    let answerPTag = document.createElement("p");
    answerPTag.textContent = `Answer: ${quote.raAnswers[index].answer}`;

    questionDiv.appendChild(questionPTag);
    questionDiv.appendChild(answerPTag);

    questionContainer.appendChild(questionDiv);
  });

  const date = document.getElementById("displayDate");
  const time = document.getElementById("displayTime");

  // Format the date part
  const formattedDate = startDateTime.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Format the time part
  const startTime = startDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const endTime = endDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedTime = `${startTime} - ${endTime}`;

  date.textContent = formattedDate;
  time.textContent = formattedTime;

  const comment = document.getElementById("quote-comment");
  comment.textContent = quote.comment;

  const amount = document.getElementById("quoteAmount");

  const generateBtn = document.getElementById("generate-quote-button");
  generateBtn.onclick = async function () {
    const dialog = new ConfirmDialog({
      document: document,
      title: "Generate Quote?",
      message: "Are you sure you want to generate this quote?",
      buttons: ["Generate", "Cancel"],
      callBacks: [
        async () => {
          let lc = new LoadingScreen(document);
          lc.show("Generating Quote...");
          quote.amount = Number(amount.value);
          quote.status = Quote.sStatusQuoted;
          await QuoteDA.instance.updateQuote({ quote: quote });
          lc.hide();
          const dialog = new ConfirmDialog({
            document: document,
            title: "Quote Generated",
            message: "Quote has been generated successfully",
            buttons: ["Ok"],
            callBacks: [() => {}],
          });
        },
        () => {},
      ],
    });
    // quote.amount = amount;
    // quote.status = QuoteStatus.GENERATED;
    // let quoteDA = QuoteDA.instance;
    // await quoteDA.updateQuote({ quote: quote });
    // window.location.href = "/admin home/Home(Admin).html";
  };
});
