import { BACKEND, resetValues } from "./utils/CommonFunctions.js";

const taskTitle = document.querySelector("#task-title");
const taskContent = document.querySelector("#task-content");
const saveTaskButton = document.querySelector("#save-task");
const taskListBox = document.querySelector("#task-list-box");
const toastBar = document.querySelector("#toast-bar");
const editCard = document.querySelector(".edit-position.task-card");
const saveEditTaskButton = document.querySelector("#save-edit-task");
const body = document.querySelector("body");
const editWrapper = document.querySelector(".edit-wrapper");

let task = {
  id: 0,
  title: `Adding crud from db`,
  content: `Working on making db and backend connection to frontend`,
  // setTime: new Date(),
  background: "#000fff",
  isDone: false,
};

let taskList = getLocalTaskList("taskList") || [];
async () => console.log(await taskList);
// let taskList = [];
function renderList(arr) {
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      addTaskToDisplay(arr[i]);
    }
  }
}
//displaying the taskList
renderList(taskList);
taskTitle.addEventListener(
  "change",
  (e) => {
    task = saveTask(task, "title", e);
  },
  false
);

taskContent.addEventListener(
  "change",
  (e) => {
    task = saveTask(task, "content", e);
  },
  false
);

editWrapper.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target === editWrapper) {
    editWrapper.classList = ["edit-wrapper visibility"];
  }
});

saveTaskButton.addEventListener(
  "click",
  () => {
    taskList = addTaskToList(task, taskList);
    console.log({ taskList }, "in saving task");
    let taskToBeAdded = taskList[taskList.length - 1];
    addTaskToDisplay(taskToBeAdded);

    showToast(`${taskToBeAdded.title || "Untitled"} saved successfully `);
    resetValues(task);
  },
  false
);

function addTaskToDisplay(taskObject) {
  let taskItem = document.createElement("div");
  let deleteTaskButton = document.createElement("button");
  let editTaskButton = document.createElement("button");
  let doneTaskButton = document.createElement("button");

  let deleteIcon = document.createElement("em");
  let editIcon = document.createElement("em");
  let doneIcon = document.createElement("em");

  taskItem.setAttribute("id", taskObject.id);
  taskItem.className = `${taskObject.isDone ? "task-card done" : "task-card"}`;
  console.log(`${taskObject.isDone ? "task-card done" : "task-card"}`);
  deleteTaskButton.setAttribute("class", "icon-task button icon-button");
  editTaskButton.setAttribute("class", "icon-task button icon-button");
  doneTaskButton.setAttribute("class", "icon-task button icon-button");

  deleteIcon.className = "fa-solid fa-trash";
  editIcon.className = "fa-solid fa-edit";
  doneIcon.className = "fa-solid fa-square-check";

  taskItem.innerHTML = `<h3 class="task__header--display" id="display-header">${taskObject.title}</h3><p class="task__content--display" id="display-content"> ${taskObject.content} </p>`;

  deleteTaskButton.addEventListener("click", (e) => {
    console.log(e.target.parentElement.parentElement.id);
    let deleteItem = document.getElementById(
      e.target.parentElement.parentElement.id
    );
    deleteTaskFromList(e.target.parentElement.parentElement.id);
    showToast(`Deleted successfully ${taskObject.title} `);
    let deletedItem = taskListBox.removeChild(deleteItem);
    console.log(deletedItem);
  });

  editTaskButton.addEventListener(
    "click",
    (e) => {
      e.preventDefault();
      editWrapper.classList = ["edit-wrapper"];
      editCard.children["display-header"].value = taskObject.title;
      editCard.children["display-content"].value = taskObject.content;
      let taskToBeEdited = taskObject;
      editCard.children["display-header"].addEventListener("change", (e) => {
        taskToBeEdited = saveTask(taskToBeEdited, "title", e);
      });
      editCard.children["display-content"].addEventListener("change", (e) => {
        taskToBeEdited = saveTask(taskToBeEdited, "content", e);
      });
      editCard.children["display-header"].value = taskToBeEdited.title;
      editCard.children["display-content"].value = taskToBeEdited.content;
      saveEditTaskButton.addEventListener(
        "click",
        (e) => {
          editCard.id = taskToBeEdited.id;
          let deleteItem = document.getElementById(
            e.target.parentElement.parentElement.parentElement.id
          );
          deleteTaskFromList(
            e.target.parentElement.parentElement.parentElement.id
          );
          let deletedItem = taskListBox.removeChild(deleteItem);
          let newTaskList = addTaskToList(
            { ...taskToBeEdited, id: Date.now() },
            getLocalTaskList("taskList")
          );
          addTaskToDisplay(newTaskList[newTaskList.length - 1]);
          editWrapper.classList = ["edit-wrapper visibility"];
          return newTaskList;
        },
        false
      );

      console.log(taskToBeEdited, "after editing inputs");

      /*
       * firstly, when edit button clicked, editcard pops up using css.
       * edit card input values filled with the respective task values.
       * after changing inputs,using save task , the taskinput and taskcontent are changed.
       * Now , the task values in the respective node are to be the new task values.
       * For that, copy editableTask values into newTask with new date ,as it's changed.
       * the newTask has to be entered into localstorage using splice and old editTask has to be deleted.
       * the editTask has to be removed from display too, using removeChild.
       * now addTaskToDisplay(newTask) do, this adds newTask into taskList as well as localstorgae.
       * I think , it to be added to DISPLAY also.
       */
    },

    false
  );

  doneTaskButton.addEventListener("click", (e) => {
    let taskDoneToBeToggledID = e.target.parentElement.parentElement.id;
    taskDoneToBeToggledID = parseInt(taskDoneToBeToggledID, 10);
    let taskDoneToBeToggledNode = document.getElementById(
      taskDoneToBeToggledID
    );
    let taskListFromLocalStorage = getLocalTaskList("taskList");

    let taskDoneToBeToggled = taskListFromLocalStorage.find(
      (item) => item.id === taskDoneToBeToggledID
    );
    taskDoneToBeToggled.isDone = !taskDoneToBeToggled.isDone;
    taskDoneToBeToggledNode.setAttribute(
      "class",
      `${taskDoneToBeToggled.isDone ? "task-card done" : "task-card"}`
    );
    showToast(`${taskDoneToBeToggled.title} updated`);

    setLocalTaskList(taskListFromLocalStorage);

    // return getLocalTaskList(taskListFromLocalStorage);
  });

  deleteTaskButton.appendChild(deleteIcon);
  editTaskButton.appendChild(editIcon);
  doneTaskButton.appendChild(doneIcon);
  taskItem.appendChild(deleteTaskButton);
  taskItem.appendChild(editTaskButton);
  taskItem.appendChild(doneTaskButton);
  taskListBox.insertBefore(taskItem, taskListBox.firstChild);
}

async function addTaskToList(taskObj, taskArray) {
  console.log(taskObj, taskArray, "from addtasktolist");
  // if (taskObj.content.length <= 0) return taskArray;
  if (taskArray.length === 0) {
    taskArray = await [
      { ...taskObj, id: Date.now(), title: taskObj.title || "Untitled" },
    ];
  } else {
    taskArray = await [
      ...taskArray,
      {
        ...taskObj,
        id: Date.now(),
        title: taskObj.title || "Untitled",
      },
    ];
  }
  setLocalTaskList(taskArray);
  console.log(
    getLocalTaskList("taskList"),
    "in addTaskto List method from Localstorage"
  );
  return getLocalTaskList("taskList");
}

function deleteTaskFromList(taskObjID) {
  taskObjID = parseInt(taskObjID, 10);
  let taskItems = getLocalTaskList("taskList");
  console.log(taskItems, taskObjID, "before tasks deleted");
  let deleteItemIndex = taskItems.findIndex((taskItem) => {
    return taskItem.id === taskObjID;
  });
  console.log(deleteItemIndex, "deleteItemIndex at 103");
  if (deleteItemIndex < 0) return getLocalTaskList("taskList");
  taskItems.splice(deleteItemIndex >= 0 && deleteItemIndex, 1);
  setLocalTaskList(taskItems);
  console.log("after deleted", taskList);
  return getLocalTaskList("taskList");
}

function saveTask(taskItem, taskKey, e, _taskValue) {
  taskItem[taskKey] = e.target.value;
  console.log(e.target.value, taskKey, taskItem);

  return taskItem;
}

async function setLocalTaskList(taskList) {
  try {
    const postedTaskList = await axios.post(`${BACKEND}/tasks`, {
      body: taskList[0],
    });
    console.log(postedTaskList, "from setting task at backedn");
  } catch (err) {
    console.error(err, "error at setting task to backend");
  }
  return localStorage.setItem("taskList", JSON.stringify(taskList));
}

async function getLocalTaskList(taskListFromStorage) {
  try {
    const response = await axios.get(`${BACKEND}/tasks`);
    console.log(response, "at getting task List from backend");
    return response.data.resultData;
  } catch (err) {
    console.error(err, "at getting task list from backend");
    return JSON.parse(localStorage.getItem(taskListFromStorage));
  }
}

function showToast(message) {
  toastBar.innerHTML = message;
  toastBar.className = "toast show";
  return setTimeout(() => {
    toastBar.className = toastBar.className.replace(
      "toast show",
      "toast visibility"
    );
  }, 2000);
}

function findElement(taskID, arr) {
  return arr.find((item) => item.id === taskID);
}

export { taskList, renderList };
const a = "text-value-test";
export { a };
