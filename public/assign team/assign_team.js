import createNavBar from "/utilities/navbar.js";

document.addEventListener("DOMContentLoaded", () => {
  const titles = [
    "Home",
    "Services",
    "Quotes",
    "Generate report",
    "My Profile",
  ];
  const links = [
    "/admin home/Home(Admin).html",
    "/services admin/ServicesAdmin.html",
    "/quotes/admin/Quotes(Admin).html",
    "/reports/Reports.html",
    "/profile/Profile.html",
  ];

  createNavBar({
    document: document,
    titles: titles,
    links: links,
    addLogout: true,
  });
});

function SaveTeam() {
  // Select all checkboxes with a specific class or within a specific container
  let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
  //check that atleast one member has been selected
  if (checkboxes.length >= 1) {
    console.log("save the rows");
    //get the rows
    let rows = getCheckedRowsData();
    // get rows
    console.log(rows);
    alert("team saved successfully");
  } else {
    alert("Nothing selected");
  }
}

function deselAll() {
  const mytable = document.getElementById("team-table");
  const ele = mytable.getElementsByTagName("input");
  for (var i = 0; i < ele.length; i++) {
    if (ele[i].type == "checkbox") {
      ele[i].checked = false;
    }
  }
}

function getCheckedRowsData() {
  let checkedRowsData = [];
  // Select all checked checkboxes within the table
  let checkedCheckboxes = document.querySelectorAll(
    'table#team-table input[type="checkbox"]:checked'
  );
  // Iterate over each checked checkbox
  for (checkbox of checkedCheckboxes) {
    // Get the row (parent <tr>) of the checkbox
    var row = checkbox.closest("tr");

    // Get all the cells (td) in the row
    var cells = row.querySelectorAll("td");

    // Extract data from each cell
    var rowData = [];

    for (cell of cells) {
      rowData.push(cell.innerText);
    }
    // Store the data in the checkedRowsData array
    checkedRowsData.push(rowData);
  }

  return checkedRowsData;
}
