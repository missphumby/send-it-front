const mobile = document.getElementById('mobile');
console.log(mobile)
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
  // event.preventDefault();

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

function isNumberMatch(){
  let numbers = /^[0-9]+$/;
  if(mobile.value.match(numbers) && mobile.value.length == 11)
  {return true;}
  else if(mobile.value.length < 11 || mobile.value.length > 11){
     alert("Phone number must be 11 digits")
     return false;
  }
  else{
  alert('Recipient Mobile-Number must have numeric characters only');
  mobile.focus();
  return false;}
  }


document.getElementById("create").addEventListener("click", function(e){
  e.preventDefault()
  isNumberMatch()
  createOrder()
});
