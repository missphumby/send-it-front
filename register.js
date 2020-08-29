
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
    credentials: "include",
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
        toastr.error('Mail exists')
       email.focus()
       return false
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
              toastr.success('user created successfully')
              localStorage.setItem("firstname", res.data.firstname);
              localStorage.setItem("userId", res.data._id);
              window.location.href = "./profile.html";
            } else if (res.error) {
              console.log("error", res.err);
              toastr.error(res.err)
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
  // var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var mailformat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  if (email.value.match(mailformat && email.value != "")){
          return true;

  }
  else{
    toastr.warning("Sorry, you have entered an invalid email address!")
      email.focus()
      // location.reload()
       return false;
  }
  
};


document.getElementById("register").addEventListener("click", function(e){
  e.preventDefault();
  // isFieldEmpty()
  isEmailMatch()
  submit()
});
