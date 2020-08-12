const firstname = localStorage.getItem("firstname");
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const url = "https://send-it-app.herokuapp.com";

//preventing unauthorised users from accessing the page
if (!token) {
  window.location.href = "./login.html";
}

//handling logout
const logout = document.getElementById("logout");

logout.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "./index.html";
});

document.querySelector("#nameBar").innerHTML = firstname.toUpperCase();

//fetch request to render all user parcels into the table
fetch(`${url}/order/${userId}`, {
  method: "GET",
  headers: {
     Authorization: token,
  },
})
  .then((res) => res.json())
  .then((result) => {
    console.log("data", result);
    const ordersTable = document.querySelector(".parcel-details");
    if (!result.data.length) {
      document.querySelector("#message").innerHTML =
        "You do not have any Parcel Delivery Order yet";
    } else {
      // result.data.sort((a, b) => a.id - b.id);
      renderTableData(result.data, ordersTable);

      //total no of orders
      document.getElementById("ordersLength").innerHTML = `${result.data.length}`;
      //Number of items in transit
      const transitOrders = result.data.filter((val) => val.status === "In transit").length;
      document.getElementById("transit").innerHTML = `${transitOrders}`;
      //number of delivered items
      const delivered = result.data.filter((val) => val.status === "delivered")
        .length;
      document.getElementById("delivered").innerHTML = `${delivered}`;
      //number of cancelled items
      const cancelled = result.data.filter((val) => val.status === "cancelled")
        .length;
      document.getElementById("cancelled").innerHTML = `${cancelled}`;
    }
  });

const renderTableData = (data, ordersTable) => {
  data.forEach((parcel) => {
    let parcelRow = document.createElement("tr");
    parcelRow.innerHTML = `<th scope="row">${parcel.orderId}</th>
                          <td>${parcel.pickup}</td>
                          <td>${parcel.destination}</td>
                          <td>${parcel.recName}</td>
                          <td>${parcel.recMobileNo}</td>
                          <td class="status">${parcel.status}</td>
                          <td><a id="changeDest" orderid="${parcel.orderId}" class="changeDest"><i class="fa fa-edit"></i></a></td>
                          <td><a id="cancelOrder" orderid="${parcel.orderId}" class="cancelOrder"><i class="fa fa-trash"></i></a></td>
                           `;
    ordersTable.append(parcelRow);
  });

  //edit order
  const destPrompt = (orderId) => {
    console.log("order", orderId);
    const newDest = prompt("Enter a new Destination address");
    if (newDest !== "" && newDest !== null) {
      changeDestination(newDest, orderId);
    } else {
      return;
    }
  };

  const changeDestination = function (newDest, orderId) {
    fetch(`${url}/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        //   Authorization: token
      },
      body: JSON.stringify({
        destination: newDest,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          alert("Destination changed successfully!");
          console.log;
          location.reload();
        }
      })
      .catch((err) => console.log("error occured", err));
  };

  let changeButton = document.getElementsByClassName("changeDest");
  changeButton = Array.from(changeButton);
  changeButton.forEach((b) =>b.addEventListener("click", (event) => {
      event.preventDefault();
      const orderId = b.getAttribute("orderid");
      destPrompt(orderId);
    })
  );

  //cancel order

  const deletePrompt = (orderId) => {
    const deleteValue = confirm("Are you sure you want to cancel this order");
    if (deleteValue == true) {
      deleteOrder(orderId);
    } else {
    }
  };

  const deleteOrder = (orderId) => {
    fetch(`${url}/order/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          alert("order deleted successfuly");
          location.reload();
        } else if (res.error) {
          console.log(res.error);
        }
      })
      .catch((err) => console.log("error occured", err));
  };

  let deleteButton = document.getElementsByClassName("cancelOrder");
  deleteButton = Array.from(deleteButton);
  deleteButton.forEach((b) =>
    b.addEventListener("click", (event) => {
      event.preventDefault();
      const orderId = b.getAttribute("orderid");
      deletePrompt(orderId);
    })
  );
};
