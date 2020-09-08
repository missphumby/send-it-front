const firstname = localStorage.getItem("firstname");
const url = "https://send-it-app.herokuapp.com";

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
      const cancelled = result.data.filter((val) => val.status === "Cancelled")
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
                          <td><button type="button" orderid="${parcel.orderId}" class="btn btn-sm btn-primary noUnderlineCustom text-white changeDest" data-toggle="modal" data-target="#editModal"><i class="fa fa-pencil" aria-hidden="true"></i></button></td>
                          <td><button id="cancelOrder" orderid="${parcel.orderId}" class="cancelOrder"><i class="fa fa-trash"></i></button></td>
                           `;
    ordersTable.append(parcelRow);
  });

  //edit order
  const destPrompt = (orderId) => {
    console.log("order", orderId);
    const newDest = document.getElementById('newDest')
    const saveChanges = document.getElementById('saveEdit')
    console.log(saveChanges)
    console.log(newDest)
    saveChanges.addEventListener('click', function(){
if (newDest.value !== "") {
  changeDestination(newDest, orderId);
  console.log(newDest.value)
} else {
  return;
}
    })

// $('#saveEdit').click(function() {
//   if(newDest != ""){
//   changeDestination(newDest, orderId);
//   $('#editModal').modal('hide');
//   }else{
//     return;
//   }
// });
  };
  
  const changeDestination = function (newDest, orderId) {
    fetch(`${url}/order/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        //   Authorization: token
      },
      body: JSON.stringify({
        destination: newDest.value.toUpperCase()
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          toastr.success("Destination changed successfully!");
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
  const cancelPrompt = (orderId) => {
    console.log("order", orderId);
    if(confirm('Are you sure you want to cancel this order?') === true) {
      cancelOrder(orderId);
      // disabledBtn(orderId)
    } else {
      return;
    }
  };
  const cancelOrder = function (orderId) {
    fetch(`${url}/order/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        //   Authorization: token
      },
      body: JSON.stringify({
        status
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.success) {
          toastr.success("Order successfully cancelled!");
          location.reload();
          // disabledBtn()
                  }
      })
      .catch((err) => console.log("error occured", err));
  };

  let cancelButton = document.getElementsByClassName("cancelOrder");
  cancelButton = Array.from(cancelButton);
  cancelButton.forEach((b) =>b.addEventListener("click", (event) => {
      event.preventDefault();
      const orderId = b.getAttribute("orderid");
      cancelPrompt(orderId);
    })
  );

disableBtn(changeButton)
disableBtn(cancelButton)
//   cancelButton.forEach((b) => {
//     const tr = b.parentElement.parentElement.children[5];
//  if(tr.innerText == "Cancelled"){
//    b.disabled = true;
//  }
//   })

//   changeButton.forEach((b) => {
//     const tr = b.parentElement.parentElement.children[5];
//  if(tr.innerText == "Cancelled"){
//    b.disabled = true;
//  }
//   })

 };

 const disableBtn = (btnAction) => {
  btnAction.forEach((b) => {
    const tr = b.parentElement.parentElement.children[5];
    if (tr.innerText == "Cancelled") {
      b.disabled = true;
    }
  })
}
