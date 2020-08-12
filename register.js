function submit(e) {
  e.preventDefault();
  const firstname = document.getElementById("firstname");
  const lastname = document.getElementById("lastname");
  const email = document.getElementById("email");
  const mobile = document.getElementById("phone-no");
  const password = document.getElementById("password");
  const url = "https://send-it-app.herokuapp.com";

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
      
      if (res.token) {
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
              localStorage.setItem("firstname", res.data.firstname);
              localStorage.setItem("userId", res.data._id);
              window.location.href = "./profile.html";
            } else if (res.error) {
              console.log("error", res.err);
            }
          })
          .catch((err) => console.log("error occurred", err));
      } else if (res.err) {
        console.log("error occured", err);
      }
    })
    .catch((err) => console.log("err occured", err));
}

document.getElementById("register").addEventListener("click", submit);
