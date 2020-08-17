
  const firstname = document.getElementById("firstname");
  const lastname = document.getElementById("lastname");
  const email = document.getElementById("email");
  const mobile = document.getElementById("phone-no");
  const password = document.getElementById("password");
  const url = "https://send-it-app.herokuapp.com";

  function submit() {
    // e.preventDefault()

  fetch(`${url}/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      mobile: mobile.value,
      password: password.value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if(res.message == "mail exists"){
       alert('mail exists')
       email.focus()
      }
      else if (res.token) {
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
              alert('user created successfully')
              localStorage.setItem("firstname", res.data.firstname);
              localStorage.setItem("userId", res.data._id);
              window.location.href = "./profile.html";
            } else if (res.error) {
              console.log("error", res.err);
             alert('please enter the correct email and password')
            }
          })
          .catch((err) => console.log("error occurred", err));
      } else if (res.err) {
        console.log("error occured", err);
      }
    })
    .catch((err) => console.log("err occured", err));
};

function isFieldEmpty(){
if (firstname.value === "" || lastname.value === "" || password.value === "" || mobile.value === "") {
  alert("please enter the field");
  return false;
}
};

function isEmailMatch(){
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.value.match(mailformat)){
      password.focus()
      return true
  }else if(email.value.length < 0 || email.value === ""){
alert('email cannot be empty')
  }
  else{
      alert("You have entered an invalid email address!")
      email.focus()
      // location.reload()
      return false;
  }
  
};


document.getElementById("register").addEventListener("click", function(e){
  e.preventDefault();
  isFieldEmpty()
  isEmailMatch()
  submit()
});
