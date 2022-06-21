
const url = "https://send-it-app.herokuapp.com";

const email = document.getElementById("email");
// const mobile = document.getElementById("phone-no");
const password = document.getElementById("password");

const login = (event) => {
  event.preventDefault();

  fetch(`${url}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {

      if (res.message == "Authorization failed" && password != "" ){
        toastr.info('Unauthorized User, please enter a valid email address')
       }
       else if(res.error ){
        toastr.error('Incorrect password, please enter a valid password')
        
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
            console.log("res", res);

             if (res.success) {
              console.log("res2", res.success);
              localStorage.setItem("firstname", res.data.firstname);
              localStorage.setItem("userId", res.data._id);
              console.log("got here", res.data.roles[0])
              if (res.data.roles[0].name == "user") {
                window.location.href = "./profile.html";
                toastr.success("Login successful")
              } else if (res.data.roles[0].name == "admin") {
                window.location.href = "./admin.html";
                toastr.success("Login successful")
              }
            }
            else if (res.error) {
              console.log("error", res.err);
              
            }
          })
          .catch((err) => console.log("error occurred", err));


      }
    })
};

document.getElementById("registration-form").addEventListener("submit", login);

