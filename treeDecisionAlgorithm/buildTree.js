import {Tree} from "./treeDecision.js";

let isFileChosen = false;
let isBuilt = false;
let data;
let tree = new Tree(new Node());

inputFileEvent();

function inputFileEvent() {
  let input = document.getElementById("fileEntry");
  let inputButton = document.getElementById("chooseFileButton")
  if (!isBuilt) {
    console.log("hi");
    input.onchange = function () {
      document.getElementById("fileName").textContent = this.files.item(0).name;
      isFileChosen = true;
    }
  }

}
