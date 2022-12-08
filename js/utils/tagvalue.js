// from index page

export const taskTitle = document.querySelector("#task-title");
export const taskContent = document.querySelector("#task-content");
export const saveTaskButton = document.querySelector("#save-task");
export const taskListBox = document.querySelector("#task-list-box");
export const toastBar = document.querySelector("#toast-bar");
export const editCard = document.querySelector(".edit-position.task-card");
export const saveEditTaskButton = document.querySelector("#save-edit-task");
export const body = document.querySelector("body");
export const editWrapper = document.querySelector(".edit-wrapper");

//from signup page

// export const firstNameContainer = document.querySelector(
//   "#first-name--container"
// );
export const firstNameInput = document.querySelector("#first--name");

export let firstNameAlert = document.querySelector("#first-name--alert");

// const lastNameContainer = document.querySelector("#last-name--container");
export const lastNameInput = document.querySelector("#last-name");

export let lastNameAlert = document.querySelector("#last-name--alert");

// export const emailContainer = document.querySelector("#email--container");
// export const passwordContainer = document.querySelector("#password--container");

export const emailInput = document.querySelector("#email--input");
export let emailAlert = document.querySelector("#email--alert");

export const passwordInput = document.querySelector("#password--input");
export let passwordAlert = document.querySelector("#password--alert");

export const isShownButton = document.querySelector("#is--shown");

export const loginButton = document.querySelector("#login--button");

//backend url
export const BACKEND = `https://takenoteslikeapro.manasa1998.repl.co`;
