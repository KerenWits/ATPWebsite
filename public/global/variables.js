class state {
  static loggedInUser = null;
  static services = {};
  static myquotes = {};
  static myreviews = {};
  static myteams = {};
}

// Attach properties to the global window object
window.loggedInUser = state.loggedInUser;
window.services = state.services;
window.myquotes = state.myquotes;
window.myreviews = state.myreviews;
window.myteams = state.myteams;

export default state;