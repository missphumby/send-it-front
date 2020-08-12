const url = "https://send-it-app.herokuapp.com";

const login = (event) => {
  event.preventDefault();

  fetch(`${url}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);

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
            console.log("res", res);
            if (res.success) {
              console.log("res2", res.success);
              localStorage.setItem("firstname", res.data.firstname);
              localStorage.setItem("userId", res.data._id);
              console.log("got here", res.data.roles[0])
              if (res.data.roles[0].name == "user") {
                window.location.href = "./profile.html";
              } else if (res.data.roles[0].name == "admin") {
                window.location.href = "./admin.html";
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

document.getElementById("login").addEventListener("click", login);


