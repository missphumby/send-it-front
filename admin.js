
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const url = "https://send-it-app.herokuapp.com";

// preventing unauthorised users from accessing the page
if (!token) {
  window.location.href = './login.html';
}

//handling logout
const logout = document.getElementById('logout');

logout.addEventListener('click', function () {
  localStorage.clear();
  window.location.href = './index.html';
});

//fetch request to render all user parcels into the table
// const userId = localStorage.getItem("userId");
fetch(`${url}/order`, {
  method: "GET",
  headers: {
      Authorization: token
  }
})
  .then(res => res.json())
  .then(result => {
    console.log("data", result.data)
    const ordersTable = document.querySelector(".parcel-details");
    if (!result.data.length) {
      document.querySelector("#message").innerHTML =
        "There are no pending orders";
    } else {
      result.data.sort((a, b) => a.id - b.id);
      renderTableData(result.data, ordersTable);

      //info table

      //total no of orders
      document.getElementById("ordersLength").innerHTML = `${result.data.length}`;
      //Number of items in transit
      const transitOrders = result.data.filter(val => val.status === "In-transit").length;
      document.getElementById("transit").innerHTML = `${transitOrders}`;
      //number of delivered items
      const delivered = result.data.filter(val => val.status === "Delivered").length;
      document.getElementById("delivered").innerHTML = `${delivered}`;
      //number of cancelled items
      const cancelled = result.data.filter(val => val.status === "Cancelled").length;
      document.getElementById("cancelled").innerHTML = `${cancelled}`;
    }
  });

const renderTableData = (data, ordersTable) => {
  data.forEach(parcel => {
    let parcelRow = document.createElement("tr");
    parcelRow.innerHTML = `<th scope="row">${parcel.orderId}</th>
                          <td class="location">${parcel.pickup}</td>
                          <td>${parcel.destination}</td>
                          <td>${parcel.current_loc}</td>
                          <td>${parcel.recName}</td>
                          <td>${parcel.recMobileNo}</td>
                          <td><h6 class="status">${parcel.status}</h6><span class="editStatus" orderid="${parcel.orderId}"><i class="fa fa-edit"></i></span></td>
                          <td><a id="changeDest" class="changeLoc" orderid="${parcel.orderId}"><i class="fa fa-edit"></i></a></td>
                          <td><a id="cancelOrder" class="cancelOrder" orderid="${parcel.orderId}"><i class="fa fa-trash"></i></a></td>
                           `;
    ordersTable.append(parcelRow);
  });

//edit location
const locPrompt = (orderId) => {
    console.log("order", orderId);
    const newLocation = prompt("Enter a new Location address");
    if (newLocation !== "" && newLocation !== null) {
      changeLocation(newLocation, orderId);
    } else {
      return;
    }
  };

  const changeLocation = function (newLocation, orderId) {
    fetch(`${url}/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        //   Authorization: token
      },
      body: JSON.stringify({
        current_loc: newLocation,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          toastr.success("Location changed successfully!");
          console.log;
          location.reload();
        }
      })
      .catch((err) => console.log("error occured", err));
  };

  let changeButton = document.getElementsByClassName("changeLoc");
  changeButton = Array.from(changeButton);
  changeButton.forEach((b) =>b.addEventListener("click", (event) => {
      event.preventDefault();
      const orderId = b.getAttribute("orderid");
      locPrompt(orderId);
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
          toastr.success("order deleted successfuly");
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

  //edit status
  
  const statusPrompt = (orderId) => {
    console.log("order", orderId);
    const statusOrder = document.getElementById('new')
    statusOrder.style.display = "block"
    const statusSelect = document.getElementById('select-filter')
    console.log(statusSelect)
    statusSelect.addEventListener('change', function(e){
      let newStatus = statusSelect.value;
      console.log(statusSelect.value)
      changeStatus(newStatus, orderId);
      
    })
  };

  const changeStatus = function (newStatus, orderId) {
    fetch(`${url}/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        //   Authorization: token
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          toastr.success("parcel status successfully changed!");
          console.log;
          location.reload();
        }
      })
      .catch((err) => console.log("error occured", err));
  };

  

  let statusButton = document.getElementsByClassName("editStatus");
  statusButton = Array.from(statusButton);
  statusButton.forEach((b) =>b.addEventListener("click", (event) => {
      event.preventDefault();
      const orderId = b.getAttribute("orderid");
      statusPrompt(orderId);
    })
  );

 };
