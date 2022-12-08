import { resetValues, showToast, saveTask } from "./utils/CommonFunctions.js";
import {
  taskTitle,
  taskContent,
  saveTaskButton,
  taskListBox,
  toastBar,
  editCard,
  saveEditTaskButton,
  editWrapper,
  body,
  BACKEND,
} from "./utils/tagvalue.js";

let task = {
  title: `Adding crud from db`,
  content: `Working on making db and backend connection to frontend`,
  isArchived: false,
  isDeleted: false,
  userID: "",
  background: "#000fff",
  isDone: false,
};

let taskList = [];

//get task list from backend
(async function () {
  taskList = (await getTaskListFromApi("taskList")) || [];
  await renderList(taskList);
  console.log("at iife", task.userID);
})();

function renderList(arr) {
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      addTaskToDisplay(arr[i]);
    }
  }
}

function getTokenFromLocalStorage() {
  return JSON.parse(localStorage.getItem("token"));
}
function getUserIDFromLocalStorage() {
  console.log(JSON.parse(localStorage.getItem("userID")));
  return JSON.parse(localStorage.getItem("userID"));
}
//setting token to local storage to make requests to backend
// setTokenToLocalStorage();

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
  async () => {
    try {
      let taskToBeAdded = await addTaskToList(task, taskList);
      console.log({ taskList }, "in saving task");
      addTaskToDisplay(taskToBeAdded);

      showToast(`${taskToBeAdded.title || "Untitled"} saved successfully `);
      resetValues(task, taskTitle, taskContent);
    } catch (err) {
      showToast("Error at saving task");
      console.error("task cannot be added to display,");
    }
  },
  false
);

async function addTaskToDisplay(taskObject) {
  let taskItem = document.createElement("div");
  let deleteTaskButton = document.createElement("button");
  let editTaskButton = document.createElement("button");
  let doneTaskButton = document.createElement("button");

  let deleteIcon = document.createElement("em");
  let editIcon = document.createElement("em");
  let doneIcon = document.createElement("em");

  taskItem.setAttribute("id", taskObject._id);
  taskItem.className = `${taskObject.isDone ? "task-card done" : "task-card"}`;
  console.log(`${taskObject.isDone ? "task-card done" : "task-card"}`);
  deleteTaskButton.setAttribute("class", "icon-task button icon-button");
  editTaskButton.setAttribute("class", "icon-task button icon-button");
  doneTaskButton.setAttribute("class", "icon-task button icon-button");

  deleteIcon.className = "fa-solid fa-trash";
  editIcon.className = "fa-solid fa-edit";
  doneIcon.className = "fa-solid fa-square-check";

  taskItem.innerHTML = `<h3 class="task__header--display" id="display-header">${taskObject.title}</h3><p class="task__content--display" id="display-content"> ${taskObject.content} </p>`;

  deleteTaskButton.addEventListener("click", async (e) => {
    try {
      console.log(e.target.parentElement.parentElement.id);
      let deleteItem = document.getElementById(
        e.target.parentElement.parentElement.id
      );
      await deleteTaskFromList(e.target.parentElement.parentElement.id);
      showToast(`Deleted successfully ${taskObject.title} `);
      let deletedItem = taskListBox.removeChild(deleteItem);
      console.log(deletedItem);
    } catch (err) {
      showToast("Error at deleting the task");
      console.error(err, "error at deleting task");
    }
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
        async (e) => {
          editCard.id = taskToBeEdited.id;
          try {
            let response = await axios.post(
              `${BACKEND}/${getUserIDFromLocalStorage()}/tasks/${
                taskToBeEdited.id
              }`,
              taskToBeEdited
            );
            showToast("Updated task successfully");
          } catch (err) {
            console.error(err, "at saving the edited task");
            showToast("Error while updating the task");
          }
          let deleteItem = document.getElementById(
            e.target.parentElement.parentElement.parentElement.id
          );

          editWrapper.classList = ["edit-wrapper visibility"];
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
    let taskListFromLocalStorage = getTaskListFromApi("taskList");

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

    // return getTaskListFromApi(taskListFromLocalStorage);
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
  let postedTask = await setTaskToBackend(taskObj);
  let taskToBeAdded = postedTask.data.response;
  return taskToBeAdded;
}

//posting task object to backend
async function setTaskToBackend(taskObj) {
  console.log(getUserIDFromLocalStorage(), "from setTakslISt");
  const response = await axios.post(
    `${BACKEND}/${getUserIDFromLocalStorage()}/tasks`,
    taskObj,
    {
      headers: { authorization: getTokenFromLocalStorage() },
    }
  );
  console.log(response, "at posting tasks to backend");
  return response;
}

async function deleteTaskFromList(taskObjID) {
  try {
    let afterDeletingResponse = await axios.delete(
      `${BACKEND}/${getUserIDFromLocalStorage()}/tasks/${taskObjID}`,
      {
        headers: { authorization: getTokenFromLocalStorage() },
      }
    );

    console.log(deleteItemIndex, "deleteItemIndex at 103");
    if (deleteItemIndex < 0) return getTaskListFromApi("taskList");
    taskItems.splice(deleteItemIndex >= 0 && deleteItemIndex, 1);
    showToast("Deleted task successfully");
  } catch (err) {
    showToast("Error in deleting task");
    console.error(err);
  }
  return getTaskListFromApi("taskList");
}

async function getTaskListFromApi(taskListFromStorage) {
  try {
    const response = await axios.get(
      `${BACKEND}/${getUserIDFromLocalStorage()}/tasks`,
      {
        headers: { authorization: getTokenFromLocalStorage() },
      }
    );
    console.log(response, "at getting task List from backend");
    return response.data.response;
  } catch (err) {
    console.error(err, "error at getting task list from backend");
    showToast("Error at fetching list items");
    return JSON.parse(localStorage.getItem(taskListFromStorage));
  }
}

function findElement(taskID, arr) {
  return arr.find((item) => item._id === taskID);
}

export { taskList, renderList };
const a = "text-value-test";
export { a };
