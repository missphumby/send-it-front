const myForm = document.getElementById("registration-form");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const email = document.getElementById("email");
const username = document.getElementById("username");
const mobile = document.getElementById("phone-no");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");
const url = "https://sendit-backend-n2mw.onrender.com";

const submitForm = (event) => {
  event.preventDefault();

  fetch(`${url}/signup`, {
    // mode: "no-cors",
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "content-type": "application/json",
    },
    // credentials: "include",
    body: JSON.stringify({
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      username: username.value,
      mobile: mobile.value,
      password: password.value,
      confirm_password: confirm_password.value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.message == "mail exists") {
        toastr.error("Mail exists");
        email.focus();
        return false;
      } else if (res.token) {
        const { _id } = res.user;
        localStorage.setItem("token", res.token);
        fetch(`${url}/login/me/${_id}`, {
          method: "GET",
          headers: {
            Authorization: res.token,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            if (res.success) {
              toastr.success("user created successfully");
              localStorage.setItem("firstname", res.data.firstname);
              localStorage.setItem("userId", res.data._id);
              window.location.href = "./profile.html";
            } else if (res.error) {
              console.log("error", res.err);
              toastr.error(res.err);
            }
          })
          .catch((err) => console.log("error occurred", err));
      } else if (res.err) {
        console.log("error occured", err);
      }
    })
    .catch((err) => console.log("err occured", err));
};

function isFieldEmpty() {
  if (
    firstname.value === "" ||
    lastname.value === "" ||
    password.value === "" ||
    mobile.value === "" ||
    password.value === "" ||
    confirm_password.value === ""
  ) {
    alert("please enter the feld");
    return false;
  }
}

function isEmailMatch() {
  // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var mailformat =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (email.value.match(mailformat)) {
    return true;
  } else {
    toastr.warning("Please enter a valid email address!");
    email.focus();
    // location.reload()
    return false;
  }
}

function check_pass() {
  if (password.value == confirm_password.value) {
    // document.getElementById('register').disabled = false;
    return true;
  } else {
    // document.getElementById('register').disabled = true;
    toastr.error("password does not match");
    return false;
  }
}

function isNumberMatch() {
  var numbers = "^[0-9]*$";
  if (mobile.value.match(numbers) && mobile.value.length == 11) {
    return true;
  } else if (
    (mobile.value.length < 11 && mobile.value.length != 0) ||
    mobile.value.length > 11
  ) {
    toastr.error("Phone number must be valid");
    mobile.focus();
    return false;
  }
  // else if(mobile.value == ""){
  // // toastr.error('Recipient Mobile-Number must have numeric characters only');
  // // mobile.focus();
  // return false;}
}

myForm.addEventListener("submit", submitForm);
