// ****** SELECT ITEMS **********

const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

let editElement;
let editFlag = false;
let editID = '';

// ****** EVENT LISTENERS **********
form.addEventListener('submit', addItem);
clearBtn.addEventListener('click', clearItems);
window.addEventListener('DOMContentLoaded', setupItems);

// ****** FUNCTIONS **********

/**
 * Adds an item to the list.
 *
 * @param {Event} event - The event object.
 * @return {undefined}
 */
function addItem(event) {
  event.preventDefault();
  const value = grocery.value;

  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id, value);
    //display alert
    displayAlert('item added to the list', 'success');
    //show container
    container.classList.add('show-container');
    // add to local storage
    addToLocalStorage(id, value);
    //set back to default
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value; // элемент,который мы изменяем теперь равняется значению в форме которое мы напишем,после того,как мы нажмем submit
    displayAlert('value changed', 'success');
    //editLocalStorage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert('empty value', 'danger');
  }
}
/**
 * Clears all the grocery items from the list.
 *
 * @return {undefined} There is no return value.
 */
function clearItems() {
  const items = document.querySelectorAll('.grocery-item');
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove('show-container');
  displayAlert("You've deleted all items", 'danger');
  setBackToDefault();
  localStorage.removeItem('list');
}

/**
 * Displays an alert with the specified text and action.
 *
 * @param {string} text - The text to be displayed in the alert.
 * @param {string} action - The action to be performed on the alert.
 * @return {undefined} This function does not return a value.
 */
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //remove alert
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1500);
}

/**
 * Deletes an item from the list.
 *
 * @param {Event} event - The event that triggered the deletion.
 * @return {undefined} This function does not return a value.
 */
function deleteItem(event) {
  const element = event.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayAlert('item has been removed', 'danger');
  setBackToDefault();
  //remove from local storage
  removeFromLocalStorage(id);
}

/**
 * Edits an item.
 *
 * @param {Event} event - The event object that triggered the function.
 * @return {void} This function does not return a value.
 */
function editItem(event) {
  const element = event.currentTarget.parentElement.parentElement;

  editElement = event.currentTarget.parentElement.previousElementSibling; //название продукта в списке
  grocery.value = editElement.innerHTML; //присваиваем название продукта в списке значению в поле формы
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = 'edit';
}

/**
 * Sets the values of certain variables and elements back to their default states.
 *
 * @param {none} none - This function does not take any parameters.
 * @return {none} This function does not return any value.
 */
function setBackToDefault() {
  grocery.value = '';
  editFlag = false;
  editID = '';
  submitBtn.textContent = 'submit';
}
// ****** LOCAL STORAGE **********

/**
 * Adds a grocery item to the local storage.
 *
 * @param {any} id - The ID of the grocery item.
 * @param {any} value - The value of the grocery item.
 */
function addToLocalStorage(id, value) {
  const grocery = { id: id, value: value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
}
/**
 * Removes an item from the local storage based on the provided ID.
 *
 * @param {number} id - The ID of the item to be removed.
 * @return {undefined} This function does not return a value.
 */
function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}

/**
 * Edits the local storage by updating the value of an item with the specified id.
 *
 * @param {string} id - The id of the item to be updated.
 * @param {any} value - The new value to be assigned to the item.
 */
function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items.forEach(function (item) {
    if (item.id === id) {
      item.value = value;
    }
  });
  localStorage.setItem('list', JSON.stringify(items));
}

/**
 * Retrieves the value stored in the local storage with the key 'list'.
 * If the value exists, it is parsed from JSON format to an array.
 * If the value does not exist, an empty array is returned.
 *
 * @return {Array} The value stored in the local storage with the key 'list',
 *                 parsed as an array or an empty array if the value does not exist.
 */
function getLocalStorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

/**
 * Sets up the items by retrieving them from local storage and creating list items for each item.
 * If there are no items, the container class is not modified.
 *
 * @return {undefined} This function does not return a value.
 */
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}

/**
 * Creates a list item element and appends it to the list.
 *
 * @param {any} id - The id of the list item.
 * @param {any} value - The value of the list item.
 * @return {undefined} This function does not return a value.
 */
function createListItem(id, value) {
  const element = document.createElement('article');
  //add class
  element.classList.add('grocery-item');
  //add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
    <p class="title">${value}</p>
            <div class="button-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  const deletebtn = element.querySelector('.delete-btn');
  const editbtn = element.querySelector('.edit-btn');

  deletebtn.addEventListener('click', deleteItem);
  editbtn.addEventListener('click', editItem);

  //append child
  list.appendChild(element);
}
