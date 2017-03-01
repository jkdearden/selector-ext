var mouseVisitedClassname = "mouseVisited";

var prevDOM = null;
var inspectorOn = false;
var inspectorFrozen = false;
var selectorDiv = null;

function genSelectorPopup(document) {
  selectorDiv = document.createElement("div");
  selectorDiv.className = "seleniumSelectors";
  document.body.appendChild(selectorDiv);
};

function updateSelectorPopup(document, srcElement) {
  if (inspectorFrozen) return;

  var selectorsTable = document.createElement("table");
  var row;
  if (srcElement.id) {
    row = genPopupRow("id: ", srcElement.id)
    selectorsTable.appendChild(row);
    if (searchID(document, srcElement.id))
      row.className = "uniqueSelector";
    else
      row.className = "repeatSelector";
  }
  if (srcElement.classList) {
    var iter = srcElement.classList.values();
    while (true) {
      var it = iter.next();
      if (it.done) break;
      if (it.value != mouseVisitedClassname) {
        row = genPopupRow("class: ", it.value);
        selectorsTable.appendChild(row);
        if (searchClass(document, it.value))
          row.className = "uniqueSelector";
        else
          row.className = "repeatSelector";
      }
    }
  }
  selectorDiv.appendChild(selectorsTable);
  selectorDiv.replaceChild(selectorsTable, selectorDiv.firstChild);
}

function elem(name, text) {
  var el = document.createElement(name);
  if (text)
    el.innerHTML = text;
  return el;
}

function genPopupRow(selectorType, selectorString) {
  tableRow = document.createElement("tr");
  tableRow.appendChild(elem("td", selectorType));
  tableRow.appendChild(elem("td", selectorString));
  return tableRow;
}

function searchID(document, idString) {
  return document.getElementById(idString) != null;
}

function searchClass(document, classString) {
  return document.getElementsByClassName(classString).length == 1;
}

document.addEventListener("mousemove", function(e) {
  if (inspectorOn && !inspectorFrozen) {
    // HIGHLIGHTS THE CURRENT ELEMENT
    var srcElement = e.srcElement;
    if (prevDOM != null && prevDOM != srcElement)
      prevDOM.classList.remove(mouseVisitedClassname);
    srcElement.classList.add(mouseVisitedClassname);
    // ADD SELECTOR POPUP THING
    if (selectorDiv != null) {
      if (prevDOM != srcElement)
        updateSelectorPopup(document, srcElement);        
    }
    else {
      genSelectorPopup(document);      
    }
    prevDOM = srcElement;
  }
}, false);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!request.op) {
      sendResponse({result:"command failed! ;_;"})
      return false;
    }
    if (request.op == "toggleInspector") {
      inspectorOn = !inspectorOn;
      if (prevDOM != null)
        prevDOM.classList.remove(mouseVisitedClassname);
      if (selectorDiv != null) {
        selectorDiv.remove();
        selectorDiv = null;
      }
      sendResponse({result: "success! >_<"});
    }
    else if (request.op == "freezeInspector") {
      if (inspectorOn) {
        inspectorFrozen = !inspectorFrozen;
      }
      sendResponse({result: "success! >_<"});
    }
    else {
      sendResponse({result: "unknown command... ._."})
    }
    return true;
});