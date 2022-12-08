import {
  firstNameInput,
  firstNameAlert,
  lastNameInput,
  lastNameAlert,
  emailInput,
  emailAlert,
  passwordInput,
  passwordAlert,
  isShownButton,
  loginButton,
  BACKEND,
} from "./utils/tagvalue.js";

import { showToast, resetSignupUser } from "./utils/CommonFunctions.js";

let firstNameInputValue = firstNameInput.value;
let lastNameInputValue = lastNameInput.value;
let emailInputValue = emailInput.value;
let passwordInputValue = passwordInput.value;
let isShownButtonValue = isShownButton.value;

let showPassword = false;
let user = {
  firstName: ``,
  lastName: ``,
  emailID: ``,
  password: ``,
};

const nameRegx = new RegExp(
  "^(?=.{5,14}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$"
);
const emailRegx = new RegExp("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$", "i");
const passwordRegx = new RegExp(
  "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,18}$",
  "i"
);

firstNameInput.addEventListener("input", (eve) => {
  eve.preventDefault();
  firstNameInputValue = eve.target.value;
});
firstNameInput.addEventListener(
  "blur",
  (eve) => {
    if (firstNameInputValue.length === 0) {
      showErrorAlert(firstNameAlert, firstNameInput);
      firstNameAlert.innerHTML = `<span ><i class="fa-solid fa-circle-xmark"></i> Name can't be blank</span>`;
      return false;
    } else if (!nameRegx.test(firstNameInputValue)) {
      showErrorAlert(firstNameAlert, firstNameInput);
      firstNameAlert.innerHTML = `<span ><i class="fa-solid fa-circle-xmark"></i>  Must be an appropriate name</span>`;
      return false;
    } else {
      hideErrorAlert(firstNameAlert, firstNameInput);
      user.firstName = firstNameInputValue;
      return true;
    }
  },
  false
);

lastNameInput.addEventListener("input", (eve) => {
  eve.preventDefault();
  lastNameInputValue = eve.target.value;
});
lastNameInput.addEventListener(
  "blur",
  (eve) => {
    if (lastNameInputValue.length === 0) {
      showErrorAlert(lastNameAlert, lastNameInput);
      lastNameAlert.innerHTML = `<span ><i class="fa-solid fa-circle-xmark"></i> Name can't be blank</span>`;
      return false;
    } else if (!nameRegx.test(lastNameInputValue)) {
      showErrorAlert(lastNameAlert, lastNameInput);
      lastNameAlert.innerHTML = `<span ><i class="fa-solid fa-circle-xmark"></i>  Must be an appropriate name</span>`;
      return false;
    } else {
      hideErrorAlert(lastNameAlert, lastNameInput);
      user.lastName = lastNameInputValue;
      return true;
    }
  },
  false
);

emailInput.addEventListener("input", (e) => {
  e.preventDefault();
  emailInputValue = e.target.value;
});
emailInput.addEventListener("blur", (eve) => {
  eve.preventDefault();
  if (emailInputValue.length === 0) {
    showErrorAlert(emailAlert, emailInput);
    emailAlert.innerHTML = `<span><i class="fa-solid fa-triangle-exclamation"></i> Email can't be blank</span>`;
    return false;
  } else if (!emailRegx.test(emailInputValue)) {
    emailAlert.innerHTML = `<span><i class="fa-solid fa-circle-xmark"></i> Must be an email</span>`;
    showErrorAlert(emailAlert, emailInput);
    return false;
  } else {
    hideErrorAlert(emailAlert, emailInput);
    user.emailID = emailInputValue;
    return true;
  }
});

passwordInput.addEventListener("input", (e) => {
  passwordInputValue = e.target.value;
});
passwordInput.addEventListener("blur", (eve) => {
  eve.preventDefault();
  if (passwordInputValue.length === 0) {
    showErrorAlert(passwordAlert, passwordInput);
    passwordAlert.innerHTML = `<span><i class="fa-solid fa-triangle-exclamation"></i> Password can't be blank</span>`;
    return false;
  } else if (!passwordRegx.test(passwordInputValue)) {
    showErrorAlert(passwordAlert, passwordInput);
    passwordAlert.innerHTML = `<span><i class="fa-solid fa-triangle-exclamation"></i> Password is invalid</span>`;
    return false;
  } else {
    hideErrorAlert(passwordAlert, passwordInput);
    user.password = passwordInputValue;

    return true;
  }
});

isShownButton.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    if (showPassword === false) {
      isShownButton.innerHTML = `<em class="fa fa-eye"></em>`;
      passwordInput.type = "text";
    } else if (showPassword === true) {
      isShownButton.innerHTML = `<em class="fa fa-eye-slash"></em>`;
      passwordInput.type = "password";
    }

    showPassword = !showPassword;
  },
  false
);

function showErrorAlert(alertField, entryField) {
  alertField.classList.add("alert");
  entryField.style.borderColor = "var(--error-red)";
}
export function hideErrorAlert(alertField, entryField) {
  alertField.classList.remove("alert");
  alertField.innerHTML = "";
  entryField.style.borderColor = "var(--pastel-blue)";
}
//to check there exists any validation failed on fields
let errorArr = document.querySelectorAll(".para.text--red");
loginButton.addEventListener(`click` || `submit`, async (e) => {
  e.preventDefault();
  let doesErrorExist = false;
  for (let i = 0; i < errorArr.length; i++) {
    if (errorArr[i].innerText.length !== 0) {
      doesErrorExist = true;
      break;
    }
  }
  if (doesErrorExist) {
    showToast("Cannot signup as fields are not valid");
  } else {
    //set user to backend
    try {
      let data = await setUserToBackend(user);
      if (data.token.length > 0) {
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("userID", JSON.stringify(data.userID));
        showToast(`${data.firstName} signed up successfully`);
      } else {
        showToast(`${data}`);
        window.location.pathname = "../login.html";
      }

      resetSignupUser(
        user,
        firstNameInput,
        lastNameInput,
        emailInput,
        passwordInput
      );
    } catch (err) {
      showToast(`Error while signing up`);
      console.error(err, "at settignuser to backend");
    }
  }
});

async function setUserToBackend(user) {
  try {
    let response = await axios.post(`${BACKEND}/signup`, user);
    return response.data;
  } catch (err) {
    console.error(err, "error in signing up user to backend");
  }
  // let response = await axios.get(`${BACKEND}/signup`);
}
