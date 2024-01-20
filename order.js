const mobile = document.getElementById("mobile");
console.log(mobile);
const firstname = localStorage.getItem("firstname");
// const token = localStorage.getItem("token");
// const userId = localStorage.getItem("userId");
const url = "https://sendit-backend-n2mw.onrender.com";

// preventing unauthorised users from accessing the page
// if(!token && !userId){
//   window.location.href = './login.html';
// }
document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

//handling logout
const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "./index.html";
});

const createOrder = (event) => {
  event.preventDefault();

  fetch(`${url}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      userId,
      pickup: document.getElementById("pickup").value.toUpperCase(),
      destination: document.getElementById("dest").value.toUpperCase(),
      recName: document.getElementById("name").value.toUpperCase(),
      recMobileNo: document.getElementById("mobile").value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("userid", userId);
      console.log(res);
      if (res.data) {
        toastr.success("parcel created successfully!");
        window.location.href = "./profile.html";
      } else if (res.error) {
        console.log(res.error);
      }
    })
    .catch((err) => console.log("error occured", err));
};

function isNumberMatch() {
  let numbers = /^[0-9]+$/;
  if (mobile.value.match(numbers) && mobile.value.length == 11) {
    return true;
  } else if (mobile.value.length < 11 || mobile.value.length > 11) {
    toastr.error("Phone number must be valid");
    return false;
  } else {
    toastr.error("Recipient Mobile-Number must have numeric characters only");
    mobile.focus();
    return false;
  }
}

function cancelOrd() {
  document.getElementById("pickup").value = "";
  document.getElementById("dest").value = "";
  document.getElementById("name").value = "";
  document.getElementById("mobile").value = "";
}

document
  .getElementById("registration-form")
  .addEventListener("submit", createOrder);
document.getElementById("cancel").addEventListener("click", function (e) {
  window.location.href = "./profile.html";
});
