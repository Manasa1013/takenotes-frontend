import {
  emailInput,
  firstNameInput,
  lastNameInput,
  passwordInput,
  toastBar,
} from "./tagvalue.js";

export function resetValues(taskItem, taskTitle, taskContent) {
  taskItem.id = 0;
  taskItem.title = "";
  taskItem.content = "";
  taskItem.setTime = new Date();
  taskItem.isDone = false;
  taskItem.background = "#000fff";
  taskTitle.value = `Adding data after reset`;
  taskContent.value = `Text added after reset`;
  return taskItem;
}

export function resetSignupUser(user) {
  user.firstName = "";
  user.lastName = "";
  user.emailID = "";
  user.password = "";
  firstNameInput.value = ``;
  lastNameInput.value = ``;
  emailInput.value = ``;
  passwordInput.value = ``;
}

export function showToast(message) {
  toastBar.innerHTML = message;
  toastBar.className = "toast show";
  return setTimeout(() => {
    toastBar.className = toastBar.className.replace(
      "toast show",
      "toast visibility"
    );
  }, 2000);
}

export function saveTask(taskItem, taskKey, e, _taskValue) {
  taskItem[taskKey] = e.target.value;
  console.log(e.target.value, taskKey, taskItem);

  return taskItem;
}
