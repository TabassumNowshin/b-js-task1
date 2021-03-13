// Task 1
// Task List


// Define UI elements
let form = document.querySelector("#task_form");
let taskLi = document.querySelector('ul');
let clrbtn = document.querySelector("#clear_task_btn");
let filter = document.querySelector("#task_filter");
let tskinp = document.querySelector('#new_task');


// Add eventlistener
form.addEventListener("submit", addTask);
taskLi.addEventListener("click", rmTask);
clrbtn.addEventListener("click", rmAll);
filter.addEventListener("keyup", filterTask); // when you let go of a pressed key
//when the document is loaded
document.addEventListener("DOMContentLoaded", getTask);


// functions

// Add task
function addTask(e) {
  // so it won't refresh each time form is submitted (which is form's default behaviour)
  e.preventDefault();

  // create list item
  let li = document.createElement("li");
  li.appendChild( document.createTextNode(tskinp.value + " ") );
  
  // add a del btn for each li
  let delbtn = document.createElement("a");
  delbtn.setAttribute("href", "#");
  delbtn.appendChild(document.createTextNode("X"));
  li.appendChild(delbtn);

  // add item to list
  taskLi.appendChild(li);

  // calling function to store data in localStorage
  storeTask(tskinp.value);

  //so after adding, it no longer shows on task input
  tskinp.value = "";
}

// remove individual task
function rmTask(e) {
  if (e.target.hasAttribute("href")) {
    if(confirm("Are you sure?")) {
      let liItem = e.target.parentElement;
      liItem.remove();

      //remove the item from local storage as well
      rmfromLS(liItem);
    }
  }
}

// remove all
function rmAll(e) {
  // if(confirm("Are you sure?")) {
  //   taskLi.innerHTML = "";
  // }

  //apparently this is faster! 
  while(taskLi.firstChild) {
    taskLi.removeChild(taskLi.firstChild);
  }
  localStorage.clear();6
}

//filter task

function filterTask(e) {
  let text  = e.target.value.toLowerCase();

  document.querySelectorAll("li").forEach( (task) => {
    let item = task.firstChild.textContent; // innerText == undefined (!) because node has textContent as its property. no innerText
    
    //see if text exists in the lowercased version of item. [if not, -1 is returned]
    if (item.toLocaleLowerCase().indexOf(text) != -1) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  })
} 

// Store in localStorage | localStorage is a built-in object that can be used to store the data in a webpage so that when it reloads, no data is lost
function storeTask(task) {
  let tasks;
  
  //if localStorage has no key called tasks it will return null. it will only hold true the first time. we assign tasks as an array
  if(localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {  // if there is a key, then get the value of that key (which is returned by getItem(key) method) since it is sent as a JSON string we convert it into JS object and store it in tasks [so now tasks become an object! before it was an array!!]
    //console.log(localStorage.getItem("tasks")); // returned array
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  //console.log(tasks); // returned array
  //we the new task we got from add task into the object (?) // // it's actually an array!
  tasks.push(task);
  //console.log(tasks); // // returned array

  //the object is now turned into a JSON string and stored in localStorage under the tasks key using setItem(key, value) methdod
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// get the tasks from local storage and display them on the list
function getTask() {
  // get task from JSON
  let tasks;
  if(localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  // display tasks in ul
  tasks.forEach( (task) => {
    let li = document.createElement("li");
    li.appendChild( document.createTextNode(task + " ") );
    let delbtn = document.createElement("a");
    delbtn.setAttribute("href", "#");
    delbtn.appendChild(document.createTextNode("X"));
    li.appendChild(delbtn);
    taskLi.appendChild(li);
  })
}

function rmfromLS(taskItem) {
  let tasks;
  if(localStorage.getItem("tasks") === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  let li = taskItem;
  li.removeChild(li.lastChild); // remove <a>X<a/> part

  tasks.forEach( (task, index) => {
    if (li.textContent.trim() === task) {
      tasks.splice(index, 1); // start from index of tasks[index] and remove 1 item
    }
  })
  localStorage.setItem('tasks', JSON.stringify(tasks)); 
}