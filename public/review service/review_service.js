import createNavBar from "/utilities/navbar.js";
import Quote from "/classes/quote/quote.js";
import QuoteDA from "/classes/quote/quote_da.js";
import ConfirmDialog from "/utilities/dialogs/confirm_dialog.js";
import LoadingScreen from "/utilities/loading_screen/loading_screen.js";
import { UserType } from "/global/enums.js";

const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user || user.userType !== UserType.CLIENT) {
  window.location.href = "/index.html";
  // throw new Error("Unauthorized access");
}

document.addEventListener("DOMContentLoaded", async () => {
  const titles = [
    "Home",
    "Our Services",
    "About us",
    "Contact us",
    "FAQs",
    "Quotes",
    "My Profile",
  ];
  const links = [
    "/client home/client_home.html",
    "/view services/OurServices.html",
    "/about us/AboutUs.html",
    "/contact us/contactUs.html",
    "/FAQ/FAQs.html",
    "/quotes/Quotes.html",
    "/profile/Profile.html",
  ];

  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });

  const passedVar = localStorage.getItem("passedVar");
  let quote = Quote.unStringify(passedVar);
  console.log(quote);

  const stars = document.querySelectorAll(".star-rating input");
  const ratingMessage = document.getElementById("rating-message");

  stars.forEach((star) => {
    star.addEventListener("change", function () {
      const rating = this.value;
      // Update the rating message based on the selected star
      ratingMessage.textContent = `You've rated this service ${rating} ${
        rating > 1 ? "stars" : "star"
      }.`;

      // Update the star colors
      stars.forEach((s) => {
        if (s.value <= rating) {
          s.nextElementSibling.style.color = "#FFD700"; // Turn star yellow
        } else {
          s.nextElementSibling.style.color = "#444"; // Default color
        }
      });
    });
  });

  const submitBtn = document.getElementById("submit-review-btn");
  submitBtn.onclick = async (event) => {
    event.preventDefault();
    const dialog = new ConfirmDialog({
      document: document,
      title: "Review?",
      message: `Add Review for #${quote.id}?`,
      buttons: ["Review", "Cancel"],
      callBacks: [
        async () => {
          let lc = new LoadingScreen(document);
          lc.show("Adding Review...");
          // lc.hide();
          try {
            const rating = document.querySelector(
              ".star-rating input:checked"
            ).value;
            const comments = document.getElementById("review").value;
            // console.log(rating, comments);
            quote.reviewRating = rating;
            quote.reviewComments = comments;
            console.log(quote);
            await QuoteDA.instance.updateQuote({
              quote: {
                [Quote.sId]: quote.id,
                [Quote.sReviewRating]: rating,
                [Quote.sReviewComments]: comments,
              },
            });
            lc.hide();
            const dialog = new ConfirmDialog({
              document: document,
              title: "Success",
              message: `#${quote.id} reviewed successfully.`,
              buttons: ["Ok"],
              callBacks: [
                () => {
                //   window.location.href = "/quotes/Quotes.html";
                },
              ],
            });
          } catch (e) {
            lc.hide();
            const dialog = new ConfirmDialog({
              document: document,
              title: "Failed",
              message: `Failed to review #${quote.id}.`,
              buttons: ["Ok"],
              callBacks: [() => {}],
            });
          }
        },
        () => {},
      ],
    });
  };
});
