const container = document.querySelector(".container");
const titleInput = document.querySelector(".title");
const noteInput = document.querySelector(".message");
const form = document.querySelector(".note-form");
const addButton = document.querySelector(".add-btn");
const alert = document.querySelector(".alert");
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');

form.addEventListener('submit', addNote);
window.addEventListener("DOMContentLoaded", getNotesFromLocalStorage);

let editTitle;
let editContent;
let editFlag = false;
let editID = "";

function addNote(e){
    const title = titleInput.value;
    const content = noteInput.value;
    const id = new Date().getTime().toString();
    e.preventDefault();
    //Create note div
    if(titleInput.value !== "" && noteInput.value !== "" && !editFlag){
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        //Create note-title
        const noteTitle = document.createElement('h2');
        noteTitle.classList.add('note-title');
        noteTitle.innerText = titleInput.value;
        noteDiv.appendChild(noteTitle);
        //Create note-message
        const noteContent = document.createElement('p');
        noteContent.classList.add('note-content');
        noteContent.innerText = noteInput.value;
        noteDiv.appendChild(noteContent);
        //add id
        const attr = document.createAttribute('data-id');
        attr.value = id;
        noteDiv.setAttributeNode(attr);
        //Create button-div
        const noteButton = document.createElement('div')
        noteButton.classList.add('note-btn');
        noteDiv.appendChild(noteButton);
        //Add view details button
        const detailsButton = document.createElement('button');
        detailsButton.classList.add('view-detail');
        detailsButton.innerText = 'View details';
        detailsButton.addEventListener("click", viewDetails);
        noteButton.appendChild(detailsButton);
        //Add edit button
        const editButton = document.createElement('button');
        editButton.classList.add('edit-note');
        editButton.innerText = 'Edit task';
        editButton.addEventListener("click", editNote);
        noteButton.appendChild(editButton);
        //Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-note');
        deleteButton.innerText = 'Delete task';
        deleteButton.addEventListener("click", deleteNote);
        noteButton.appendChild(deleteButton);
        container.appendChild(noteDiv);
        //add to local storage
        addToLocalStorage(id, title, content);
        //Display alert
        displayAlert('Task successfully added', 'success');
        //set back to default
        setBackToDefault();
    }else if(title !== "" && content !== "" && editFlag === true){
        editTitle.innerHTML = title;
        editContent.innerHTML = content;
        displayAlert('Successfully edit task', 'success');
        //edit local storage
        editLocalStorage(editID, title, content);
        setBackToDefault();
    }else{
        displayAlert('Title or content not filled', 'danger');
    }
};

//display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    //remove alert
    setTimeout(function(){
        alert.textContent = '';
        alert.classList.remove(`alert-${action}`);
    }, 2000);
};

//Delete Note
function deleteNote(e){
    const note = e.target.parentElement.parentElement;
    const id = note.dataset.id;
    //delete note
    if(e.target.classList[0] === 'delete-note'){
        note.remove();
    }
    displayAlert('Task successfully deleted', 'success');
    removeFromLocalStorage(id);
}

//Edit Note
function editNote(e){
    const note = e.target.parentElement.parentElement;
    editTitle = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
    editContent = e.currentTarget.parentElement.previousElementSibling;
    //set form value
    titleInput.value = editTitle.innerHTML;
    noteInput.value = editContent.innerHTML;
    editFlag = true;
    editID = note.dataset.id;
    addButton.textContent = "Edit";
}

//View details
function viewDetails(e){
    modalContainer.classList.add('open-modal');
    title = e.currentTarget.parentElement.previousElementSibling.previousElementSibling;
    content = e.currentTarget.parentElement.previousElementSibling;
    const modalTitle = document.querySelector('.modal-title')
    const modalContent =document.querySelector('.modal-body');
    modalTitle.textContent = title.innerHTML;
    modalContent.textContent = content.innerHTML;
}

//Close modal
const closeBtn = document.querySelector('.close-btn')
closeBtn.addEventListener('click', function(){
        modalContainer.classList.remove('open-modal');
})


//set back to default
function setBackToDefault(){
    titleInput.value = "";
    noteInput.value = "";
    editFlag = false;
    editID = "";
    addButton.textContent = "Add task"
}

function addToLocalStorage(id, title, content){
    const input = {id, title, content};
    let items = getLocalStorage();
    items.push(input);
    localStorage.setItem('notes', JSON.stringify(items));
}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !== id){
            return item;
        }
    })
    localStorage.setItem('notes', JSON.stringify(items));
}

function editLocalStorage(id, title, content){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.title = title;
            item.content = content;
        }
        return item;
    })
    localStorage.setItem('notes', JSON.stringify(items));
}

function getNotesFromLocalStorage(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createNote(item.id, item.title, item.content);
        })
        container.classList.add('show-container')
    }
}

function getLocalStorage(){
    return localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
}

function createNote(id, title, content){
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');
    const noteTitle = document.createElement('h2');
    noteTitle.classList.add('note-title');
    noteTitle.innerText = title;
    noteDiv.appendChild(noteTitle);
    //Create note-message
    const noteContent = document.createElement('p');
    noteContent.classList.add('note-content');
    noteContent.innerText = content;
    noteDiv.appendChild(noteContent);
    //add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    noteDiv.setAttributeNode(attr);
    //Create button-div
    const noteButton = document.createElement('div')
    noteButton.classList.add('note-btn');
    noteDiv.appendChild(noteButton);
    //Add view details button
    const detailsButton = document.createElement('button');
    detailsButton.classList.add('view-detail');
    detailsButton.innerText = 'View details';
    detailsButton.addEventListener("click", viewDetails);
    noteButton.appendChild(detailsButton);
    //Add edit button
    const editButton = document.createElement('button');
    editButton.classList.add('edit-note');
    editButton.innerText = 'Edit task';
    editButton.addEventListener("click", editNote);
    noteButton.appendChild(editButton);
    //Add delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-note');
    deleteButton.innerText = 'Delete task';
    deleteButton.addEventListener("click", deleteNote);
    noteButton.appendChild(deleteButton);
    container.appendChild(noteDiv);
}