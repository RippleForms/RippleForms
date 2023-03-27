/**
 * Adds a custom menu to the active form to show the add-on sidebar.
 */
function onOpen(e) {
  
  FormApp.getUi()
    .createAddonMenu()
    .addItem('Configure', 'showSidebar')
    .addItem('Get Sheets Link', 'showAlert')
    .addToUi();
}
function showAlert() {
  var form = FormApp.getActiveForm();
  var sheetID = form.getDestinationId();
  var link = sheetID;
  var link1 = "https://docs.google.com/spreadsheets/d/" + link
  FormApp.getUi().alert('Link', link1, FormApp.getUi().ButtonSet.OK)
}
/**
 * Runs when the add-on is installed.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the form containing the add-on's user interface for
 * configuring the notifications this add-on will produce.
 */
function showSidebar() {
  var sidebarPage = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('Your add-on configuration')
  FormApp.getUi().showSidebar(sidebarPage);
}

// Save settings
// Code.gs

/**
 * Used by the client-side via `google.script.run` to save setings from the form.
 */
function saveSettings(settings) {
  PropertiesService.getDocumentProperties().setProperties(settings);
  var form = FormApp.getActiveForm();
  form.setConfirmationMessage("You can now start accepting XRP payments")
  var ss = SpreadsheetApp.create("XRP Pay Responses");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  var fileId = ss.getId()
  var file = DriveApp.getFileById(fileId);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  // file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  // file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  file.addEditor("Your Service Mail"); 
  // var file = DriveApp.getFileById(fileId);
  // file.addViewer("anyone");
  ScriptApp.newTrigger('onRun')
      .forForm(form)
      .onFormSubmit()
      .create();
}

/**
 * Used by the client-side via `google.script.run` to load saved setings.
 */
function fetchSettings() {
  return PropertiesService.getDocumentProperties().getProperties();  
}

function onRun(e){
var settings = PropertiesService.getDocumentProperties();
var form1 = FormApp.getActiveForm();
var items = form1.getItems()
var c = items.length
var sheetID1 = form1.getDestinationId();
var sheeter = SpreadsheetApp.openById(sheetID1);
var sheet = sheeter.getActiveSheet()
var cell  = sheet.getRange((form1.getResponses().length+1),(c+2));
cell.setValue("Not paid")
form1.setConfirmationMessage("Thank you. You can pay using the following link " + "https://rippleforms.onrender.com" + "/?w=" + settings.getProperty("wallet")+"&r=" + (form1.getResponses().length) + "&id=" + sheetID1 +"&c="+ (c+1))
Logger.log("/?w=" + settings.getProperty("wallet")+"&r=" + form1.getResponses().length + "&id=" + sheetID1)
}


