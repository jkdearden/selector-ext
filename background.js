chrome.commands.onCommand.addListener(function(command) {
  if (command == "toggleInspector") {
    console.log("toggling inspector");
  }
  else if (command == "freezeInspector") {
    console.log("freezing inspector");
  }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {op: command}, function(response) {
      if (response !== null)
        console.log("Response: ", response);
      else
        console.log("No response received");
    });
  });
  return true;
});