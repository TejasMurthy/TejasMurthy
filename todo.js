var myToDoList;

function init() {
  //Setup
  myToDoList = new ToDoList("my-todo");
  //To 
  myToDoList.mContainer.addEventListener("add-todo", addTask);
  myToDoList.mContainer.addEventListener("delete-todo", removeTask);

  //Add some start todos
  myToDoList.addTask("Finish development", "Finish creating something amazing");
  myToDoList.addTask("Submit for review", "Package it up and send it for review and testing");
  myToDoList.addTask("Relax", "Go and play a game and eat some food");

}

/*
I am using events and helper methods here
To get around scoping issues
*/
function addTask(pEvent) {
  myToDoList.addTask(myToDoList.mContainer.getElementsByClassName("todo-title")[0].value, myToDoList.mContainer.getElementsByClassName("todo-text")[0].value);
}

/*
I am using events and helper methods here
To get around scoping issues
*/
function removeTask(pEvent) {
  myToDoList.removeTask(pEvent.detail.id);
}


/*
A simple object to contain everything
*/
function ToDoList(pContainerID) {
  var toDoList = this;

  this.mContainerID = pContainerID;
  this.mContainer;

  this.count = 0;

  this.mTasks = [];
  this.setupContainer(pContainerID);
}

ToDoList.prototype.setupContainer = function(pContainerID) {
  //Get container
  this.mContainer = document.getElementById(pContainerID);
  document.getElementById("add-task").onclick = this.dispatchAddEvent;
};

/*
Create a new task object and add it to the task list
Create a new DOM object from our template and add it to the container
*/
ToDoList.prototype.addTask = function(pTitle, pText) {
  //Add an entry to the task list
  var tTask = {
    title: pTitle,
    text: pText,
    id: this.count++
  };
  this.mTasks.push(tTask);

  //Create a new object from template
  var tTaskTemplate = document.getElementById("todo-template").cloneNode(true);
  tTaskTemplate.getElementsByClassName("title-text")[0].textContent = tTask.title;
  tTaskTemplate.getElementsByClassName("body-text")[0].textContent = tTask.text;
  tTaskTemplate.getElementsByClassName("todo-id")[0].value = tTask.id;
  tTaskTemplate.getElementsByClassName("delete")[0].onclick = this.dispatchRemoveEvent;

  //Reset the class to just "todo" - removing "hidden"
  tTaskTemplate.className = "todo";

  //Update the ID - prepending the container ID allows us to
  //set up multiple todo lists if required
  tTaskTemplate.setAttribute("id", this.mContainerID + "-todo-" + tTask.id);

  //Add it to the DOM
  this.mContainer.appendChild(tTaskTemplate);

  console.log("Task Added to ToDo List");

  //Save the state here

};

/*
Remove the div containing the Task
Remove it from the list of tasks
*/
ToDoList.prototype.removeTask = function(pID) {
  document.getElementById(this.mContainerID + "-todo-" + pID).remove();
  for (var i = 0; i < this.mTasks.length; i++) {
    if (this.mTasks[i].id == pID) {
      this.mTasks.splice(i, 1);
      break;
    }
  }
  console.log("Task Removed");

  //Save the state here

};

/*
Dispatch an event when Removing a Task from the list
*/
ToDoList.prototype.dispatchRemoveEvent = function(pEvent) {
  this.dispatchEvent(new CustomEvent("delete-todo", {
    detail: {
      id: this.parentElement.getElementsByClassName("todo-id")[0].value
    },
    bubbles: true
  }));
};

/*
Dispatch an event when Adding a Task to the list
*/
ToDoList.prototype.dispatchAddEvent = function(pEvent) {
  this.dispatchEvent(new CustomEvent("add-todo", {
    bubbles: true
  }));
};

init();
