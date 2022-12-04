export const BACKEND = `https://takenoteslikeapro.manasa1998.repl.co`;

export function resetValues(taskItem) {
  taskItem.id = 0;
  taskItem.title = "";
  taskItem.content = "";
  taskItem.setTime = new Date();
  taskItem.isDone = false;
  taskItem.background = "#000fff";
  taskTitle.value = ``;
  taskContent.value = ``;
  return taskItem;
}
