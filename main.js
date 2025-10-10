/** @format */

const testdata = [{ id: 1, title: "Gaming", data: ["A", "B", "C"] }];
const mainNode = document.getElementsByTagName("main").item(0);

const inputNodeHTML = document.createElement("input"); //`<input placeholder="Start typing..." class="list-input"/>`;
inputNodeHTML.placeholder = "Start typing...";
inputNodeHTML.className = "list-input";
inputNodeHTML.addEventListener("blur", (e) => inputBlur(e));

//testing
const data = createListHtml(
  testdata[0].id,
  testdata[0].title,
  testdata[0].data
);
mainNode.replaceChildren(data);

/** @summary
 * Creates a HTML element for the main list display
 * @param {string[]} listData Array of string to be used as list items
 * @param {string} listHeader Title of the list
 * @returns HTML element containing the list
 */
function createListHtml(listId, listHeader, listData) {
  const container = document.createElement("div");
  container.className = "list-container";

  const title = document.createElement("h2");
  title.className = "list-header";
  title.innerText = listHeader;

  const ulNode = document.createElement("ul");
  ulNode.className = "list";

  for (li of listData) {
    const liNode = document.createElement("li");
    liNode.className = "list-item";
    liNode.innerText = li;
    ulNode.appendChild(liNode);
  }

  container.appendChild(title);
  ulNode.appendChild(inputNodeHTML);
  container.appendChild(ulNode);
  inputNodeHTML.id = listId; //set the list to target
  return container;
}

/**
 * @summary Runs when the main list input is blurred.
 * Inserts the text value into a new li before the input element.
 * Also adds it to the array storing list data
 * @param {event} event
 */
function inputBlur(event) {
  const input = event.target.value.trim();
  if (!input) return event.target.value = "";
  //add to data array of this list
  const data = testdata
    .find((e) => (e.id = event.target.id))
    .data.push(event.target.value);

  //Input into current list displayed
  const node = createLi(event.target.value);
  event.target.parentNode.insertBefore(node, event.target);
  event.target.value = "";
}

//Creates and styles Li with the innerText = text
createLi = (text) => {
  const newLi = document.createElement("li");
  newLi.innerText = text;
  newLi.className = "list-item";
  return newLi;
};
