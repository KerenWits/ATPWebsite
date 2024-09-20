// import MyClass from "/classes/my_class.js";

// class Review extends MyClass {
//   constructor({ id, clientId, quoteId, rating, comments }) {
//     super();
//     this.id = id;
//     this.clientId = clientId;
//     this.quoteId = quoteId;
//     this.rating = rating;
//     this.comments = comments;
//   }

//   static fromJson({ docID, json }) {
//     return new Review({
//       id: docID,
//       clientId: json[Review.sClientId],
//       quoteId: json[Review.sQuoteId],
//       rating: json[Review.sRating],
//       comments: json[Review.sComments],
//     });
//   }

//   toJson() {
//     return {
//       [Review.sClientId]: this.clientId,
//       [Review.sQuoteId]: this.quoteId,
//       [Review.sRating]: this.rating,
//       [Review.sComments]: this.comments,
//     };
//   }

//   toString() {
//     return `Review{
//         ${Review.sId}: ${this.id},
//         ${Review.sClientId}: ${this.clientId},
//         ${Review.sQuoteId}: ${this.quoteId},
//         ${Review.sRating}: ${this.rating},
//         ${Review.sComments}: ${this.comments},
//         }`;
//   }

//   static sId = "id";
//   static sClientId = "clientId";
//   static sQuoteId = "quoteId";
//   static sRating = "rating";
//   static sComments = "comments";
// }

// export default Review;
