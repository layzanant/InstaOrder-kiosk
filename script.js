const cards = document.getElementById("products");
let content = "";

// List of all products being displayed on HTML
let allProducts = [
  {
    id: "1",
    name: "Hot Chocolate",
    image: "assets/img/hot chocolate.jpg",
    price: 12,
    orderQuantity: 0,
  },
  {
    id: "2",
    name: "Ice Tea",
    image: "assets/img/ice tea.jpg",
    price: 18,
    orderQuantity: 0,
  },
  {
    id: "3",
    name: "Juice",
    image: "assets/img/juice.jpeg",
    price: 8,
    orderQuantity: 0,
  },
  {
    id: "4",
    name: "Lemonade",
    image: "assets/img/lemonade.jpg",
    price: 6,
    orderQuantity: 0,
  },
  {
    id: "5",
    name: "Milkshake",
    image: "assets/img/milkshake.jpg",
    price: 26,
    orderQuantity: 0,
  },
  {
    id: "6",
    name: "Soda",
    image: "assets/img/soda.png",
    price: 4,
    orderQuantity: 0,
  },
];
let products = JSON.parse(JSON.stringify(allProducts));
let quantityErrorBoo = false;

// Logic to display all the products
for (let i = 0; i < products.length; i++) {
  content += `<div class="card">
      <img src="${products[i].image}" width="250px" height="200px" alt="${products[i].name} image" />
      <div>
        <h4>${products[i].name}</h4>
        <h4>
          $${products[i].price}
        </h4>
      </div>
      <div class="alignRow">
      <label for="quantity">Enter Quantity:</label>
      <input type="text" name="quantity" id="quantity${i}" class="quantity">
      <button class="addToCartButton" onclick=addToCart(${i})>Add</button>
      </div>
      <div id="quantityError${i}" class="errorMessage">Invalid Quantity.</div>
      </div>`;
}
cards.innerHTML = content;

// Add to cart that works conditionally based on the index
function addToCart(index) {
  let quantity = document.getElementById(`quantity${index}`).value;
  const regex = /^[0-9]+$/;
  if (regex.test(quantity)) {
    products[index].orderQuantity = Number(quantity);
    clearError(`quantityError${index}`);
    quantityErrorBoo = false;
  } else {
    setError(`quantityError${index}`);
    products[index].orderQuantity = 0;
    quantityErrorBoo = true;
  }
  console.log(products, allProducts);
  let orderQuantity = 0;
  let orderAmount = 0;
  for (let i = 0; i < products.length; i++) {
    orderQuantity += products[i].orderQuantity;
    orderAmount += products[i].price * products[i].orderQuantity;
  }
  if (orderAmount >= 10 && orderQuantity > 0 && !quantityErrorBoo) {
    document.getElementById("buyNowButton").style.display = "block";
    document.getElementById("buyNowButton").focus();
  } else {
    document.getElementById("buyNowButton").style.display = "none";
  }
}

// Name field validation
function validateName() {
  const regex = /^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/;
  const name = document.getElementById("name").value;
  if (regex.test(name)) {
    clearError("nameError");
    return true;
  } else {
    setError("nameError");
  }
  return false;
}

// Phone Number field validation
function validatePhone() {
  const regex = /^\(?(\d{3})\)?[\.\-\/\s]?(\d{3})[\.\-\/\s]?(\d{4})$/;
  const phone = document.getElementById("phone").value;
  if (regex.test(phone)) {
    clearError("phoneError");
    return true;
  } else {
    setError("phoneError");
  }
  return false;
}

// Card number field validation
function validateCardNumber() {
  const regex = /^\d{4}\-\d{4}\-\d{4}\-\d{4}$/;
  const cardNumber = document.getElementById("cardNumber").value;
  if (cardNumber != "" && !regex.test(cardNumber)) {
    setError("cardNumberError");
    return false;
  } else {
    clearError("cardNumberError");
  }
  return true;
}

// Expiry month field validation
function validateMonth() {
  const regex = /^(0?[1-9]|1[012])$/;
  const month = document.getElementById("month").value;
  if (month != "" && !regex.test(month)) {
    setError("monthError");
    return false;
  } else {
    clearError("monthError");
  }
  return crossValidateMonthAndYear();
}

// Expiry Year Validation
function validateYear() {
  const regex = /^\d{4}$/;
  const year = document.getElementById("year").value;
  if (year != "") {
    if (regex.test(year) && Number(year) >= new Date().getFullYear()) {
      clearError("yearError");
      return crossValidateMonthAndYear();
    } else {
      setError("yearError");
    }
  } else {
    clearError("yearError");
    return true;
  }
  return false;
}

// Cross validation of relationship between month and year
function crossValidateMonthAndYear() {
  const month = document.getElementById("month").value;
  const year = document.getElementById("year").value;
  if (
    Number(month) < new Date().getMonth() + 1 &&
    Number(year) == new Date().getFullYear()
  ) {
    setError("monthError");
    return false;
  }
  return true;
}

// Common function to display field errors based on id being passed
function setError(id) {
  document.getElementById(id).style.display = "block";
}

// Common function to clear the error once user fixes it, based on id being passed
function clearError(id) {
  document.getElementById(id).style.display = "none";
}

/* Function that triggers on clicking Place Order button which triggers 
the entire form validation and respond accordingly */
function placeOrder() {
  let validateNameBoo = validateName();
  const validatePhoneBoo = validatePhone();
  const validateCardNumberBoo = validateCardNumber();
  const validateMonthBoo = validateMonth();
  const validateYearBoo = validateYear();
  if (
    validateNameBoo &&
    validatePhoneBoo &&
    validateCardNumberBoo &&
    validateMonthBoo &&
    validateYearBoo
  ) {
    showReceipt();
    document.getElementById("placeOrder").style.display = "none";
    document.getElementById("form").reset();
    document.getElementById("newOrder").style.display = "block";
  }
}

// Function to prepare to receipt and display in the form of table once all the validation passes
function showReceipt() {
  const receipt = document.getElementById("receipt");
  const cardNumber = document.getElementById("cardNumber").value;
  let total = 0;
  let lastFourDigits = "";
  if (
    cardNumber != "" &&
    document.getElementById("month").value != "" &&
    document.getElementById("year").value != ""
  ) {
    lastFourDigits = cardNumber.slice(cardNumber.length - 4);
  }
  let content = `<h2>Order Summary</h2><table>
    <tr>
    <th colspan="3">Name</th>
    <td>${document.getElementById("name").value}</td>
    </tr>
    <tr>
    <th colspan="3">Phone Number</th>
    <td>${document.getElementById("phone").value}</td>
    </tr>
    <tr>
    <th>Product Name</th>
    <th>Quantity</th>
    <th>Unit Price</th>
    <th>Total Price</th>
    </tr>`;
  for (let i = 0; i < products.length; i++) {
    if (products[i].orderQuantity > 0) {
      total += products[i].price * products[i].orderQuantity;
      content += `<tr>
      <td>${products[i].name}</td>
      <td>${products[i].orderQuantity}</td>
      <td>$${products[i].price}</td>
      <td>$${products[i].price * products[i].orderQuantity}</td>
      </tr>`;
    }
  }
  const tax = Math.round((13 / 100) * total, 2);
  content += `<tr>
    <th colspan="3">Tax (GST) @13%</th>
    <td>$${tax}</td>
  </tr>
  <tr>
    <th colspan="3">Grand Total</th>
    <th>$${Math.round(total + tax + (total >= 50 ? 0 : 10), 2)}</th>
  </tr>
  <tr>
    <th colspan="2">Payment Mode</th>
    <th colspan="2">${
      lastFourDigits != "" ? "Card ending with " + lastFourDigits : "Cash"
    }</th>
  </tr></table>`;
  receipt.innerHTML = content;
}

// Function that displays the Billing form on click of buy now button
function showForm() {
  document.getElementById("alignForm").style.display = "block";
  document.getElementById("name").focus();
  document.getElementById("buyNowButton").style.display = "none";
  document.getElementById("products").style.display = "none";
}
