/** @format */
let id = 0;
let todoData = [];
// let todoData = [{ id: 1, title: "Gaming", data: ["A", "B", "C"] }];
const mainNode = document.getElementsByTagName("main").item(0);
const sidebarListNode = document.getElementById("sidebarList"); //sidebar Ul
sidebarListNode.addEventListener("click", (e) => selectList(e));

const inputNodeHTML = document.createElement("input"); //New li input area
inputNodeHTML.placeholder = "Start typing...";
inputNodeHTML.className = "list-input";
inputNodeHTML.name = "input";
inputNodeHTML.addEventListener("blur", (e) => inputBlur(e));

LoadFromLocal();  //run on page load

function SaveToLocal() {
  window.localStorage.setItem("todos", JSON.stringify(todoData));
  window.localStorage.setItem("todosCount", id);
}

function LoadFromLocal() {
  const data = JSON.parse(window.localStorage.getItem("todos"));
  const merged = todoData.concat(data);
  todoData = [...merged];
  const id = window.localStorage.getItem("todosCount");
  generateSidebarListBtns(todoData); //run on load?
}

/**
 * @summary
 * Runs on start to generate the buttons to access each list
 * @param {{id:string, title:string, data:string[]}} lists
 */
function generateSidebarListBtns(lists) {
  sidebarListNode.innerHTML = "";
  for (li of lists) {
    const liNode = document.createElement("li");
    const liBtn = document.createElement("button");
    liBtn.className = "list-button";
    liBtn.innerText = li.title;
    liBtn.name = li.id;
    liNode.appendChild(liBtn);
    sidebarListNode.appendChild(liNode);
  }
}

/**
 * @summary
 * Changes the current list dispalyed within <main>
 * Runs when a List Selector Button is pressed in the <aside>
 * @param {PointerEvent} event
 */
function selectList(event) {
  listId = event.target.name;
  if (mainNode.name == listId) return; //prevent refreshing the list when the active list button is pressed again
  mainNode.name = listId; //set main list name to list index
  mainNode.replaceChildren(
    CreateListView(todoData.find((e) => e.id == listId))
  );
}

/**
 * @summary
 * Runs when the create list button is clicked.
 * Creates a new list entry in todoData, as well as a matching button.
 * Sets the current viewed list to newly created list
 */
function createList() {
  //maks sure id is unique

  const thisId = id;
  //create the button
  const liNode = document.createElement("li");
  const liBtn = document.createElement("button");
  liBtn.className = "list-button";
  liBtn.innerText = "Todo Name";
  liBtn.name = id;
  liNode.appendChild(liBtn);
  sidebarListNode.appendChild(liNode);

  todoData.push({
    id: id,
    title: "Todo Name",
    data: [],
  });

  id++; //next list id will be one above. make sure to save this value for load in local storage.
  mainNode.replaceChildren(
    CreateListView(todoData.find((e) => e.id == thisId))
  );
  SaveToLocal();
}

/** @summary
 * Creates a HTML element for the main list display.
 * Runs when a list is selected in the sidebar
 * @param {{id:number, title:string, data:string[]}} list
 * @returns HTML element containing the list
 */
function CreateListView(list) {
  const { id, title, data } = list;
  const container = document.createElement("div");
  container.className = "list-container";
  container.name = id;
  container.addEventListener("focusout", (e) => EditLi(e));

  const titleNode = document.createElement("input");
  titleNode.className = "list-header";
  titleNode.value = title;
  titleNode.name = "title";
  titleNode.addEventListener("blur", (e) => SetTitle(e));

  const ulNode = document.createElement("ul");
  ulNode.className = "list";
  ulNode.name = id;

  for (li of data) {
    const liNode = document.createElement("li");
    liNode.className = "list-item";
    const liInNode = document.createElement("input");
    liInNode.value = li;
    liNode.appendChild(liInNode);
    ulNode.appendChild(liNode);
  }

  container.appendChild(titleNode);
  ulNode.appendChild(inputNodeHTML);
  container.appendChild(ulNode);
  return container;
}

/**
 * @summary
 * Runs when the title is unfocused.
 * Sets the title of the list to the input value (cant be empty)
 * @param {FocusEvent} event
 */
function SetTitle(event) {
  const listId = event.target.closest("div").name;
  const dataObj = todoData.find((e) => e.id == listId);
  if (
    event.target.value.trim() == "" ||
    event.target.value.trim() == dataObj.title
  )
    return (event.target.value = dataObj.title); //cant be set to nothing
  dataObj.title = event.target.value;
  const btns = sidebarListNode.children;
  for (el of btns) {
    if (el.children.item(0).name == listId) {
      el.children.item(0).innerText = event.target.value;
    }
  }
  SaveToLocal();
}

/**
 * @summary
 * Runs when the main list input is blurred.
 * Inserts the text value into a new li before the input element.
 * Also adds it to the array storing list data
 * @param {event} event
 */
function inputBlur(event) {
  const input = event.target.value.trim();
  if (!input) return (event.target.value = "");
  //add to data array of this list
  const id = event.target.closest("ul").name;
  todoData.find((e) => e.id == id).data.push(event.target.value);

  //Input into HTML of current list displayed
  const node = createLi(event.target.value);
  event.target.parentNode.insertBefore(node, event.target);
  event.target.value = "";
  SaveToLocal();
}

//Creates and styles Li with the innerText = text. Li for the main lists
createLi = (text) => {
  const newliNode = document.createElement("li");
  newliNode.className = "list-item";
  const newLiIn = document.createElement("input");
  newLiIn.value = text;
  newliNode.appendChild(newLiIn);
  return newliNode;
};

/**
 * @summary
 * Changes the value of the edited li and saves the data.
 * Runs when a li is unfocused
 * @param {FocusEvent} event
 */
function EditLi(event) {
  if (event.target.name == "input" || event.target.name == "title") return;
  //update value in the array
  const inputNode = event.target;
  const ulNode = inputNode.closest("ul"); //parent list
  const liNode = inputNode.closest("li"); //parent li
  const ulChildren = Array.from(ulNode.children); //all Lis in Ul
  index = ulChildren.indexOf(liNode); //index of the input, should be the same as the data pos in array

  if (inputNode.value.trim() == "") {
    const listData = todoData
      .find((d) => d.id == ulNode.name)
      .data.splice(index, 1);
    ulNode.removeChild(liNode);
    return;
  }

  //set value in data array
  todoData.find((d) => d.id == ulNode.name).data[index] = inputNode.value;
  SaveToLocal();
}
