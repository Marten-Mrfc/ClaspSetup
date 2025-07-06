function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('EXAMPLE')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
