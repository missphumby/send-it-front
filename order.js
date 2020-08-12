// const userId = localStorage.getItem("userId");
const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const url = "https://send-it-app.herokuapp.com";

// preventing unauthorised users from accessing the page
if(!token){
  window.location.href = './login.html';
}
document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

const createOrder = (event) => {
  event.preventDefault();

  fetch(`${url}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
       Authorization: token
    },
    body: JSON.stringify({
      userId,
      pickup: document.getElementById("pickup").value,
      destination: document.getElementById("dest").value,
      recName: document.getElementById("name").value,
      recMobileNo: document.getElementById("mobile").value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("userid", userId);
      console.log(res);
      if (res.data) {
        alert("parcel created successfully!");
        window.location.href = "./profile.html";
      } else if (res.error) {
        console.log(res.error);
      }
    })
    .catch((err) => console.log("error occured", err));
};

document.getElementById("create").addEventListener("click", createOrder);
