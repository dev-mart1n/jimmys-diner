// Select DOM elements for menu, order summary, payment modal, and pay button
const menu = document.querySelector("#menu");
const orderSummary = document.querySelector("#order-summary");
const paymentModal = document.querySelector("#payment-modal");
const payBtn = document.querySelector("#pay-btn");

// Array to store items added to the cart
let cartItems = [];

// Loop through the menu items and display them on the page
menuArray.forEach((item) => {
  menu.insertAdjacentHTML(
    "beforeend",
    `
    <div class="px-6">
      <div class="flex items-start justify-between border-b border-neutral-200 mx-auto w-[90%] py-9 pb-7">
        <div class="flex items-start gap-8">
          <img src="${item.image}" alt="${item.name}" class="w-22 h-22 object-contain">
          <div class="flex flex-col leading-snug">
            <h3 class="text-3xl text-neutral-900 leading-none">${item.name}</h3>
            <p class="text-md text-neutral-400 mt-1 leading-6">${item.ingredients.join(", ")}</p>
            <p class="text-2xl text-neutral-700 mt-2 leading-6">$${item.price}</p>
          </div>
        </div>
        <button 
          id="btn-${item.id}"
          class="w-11 h-11 rounded-full border border-neutral-300 text-xl flex items-center justify-center hover:bg-neutral-100 transition">
          +
        </button>
      </div>
    </div>
  `,
  );

  // Add click event to "+" button to add item to cart and update order summary
  document.querySelector(`#btn-${item.id}`).addEventListener("click", () => {
    cartItems.push(item);
    renderOrderSummary();
  });
});

// Function to render the order summary
const renderOrderSummary = () => {
  // Clear the previous order summary
  orderSummary.innerHTML = "";

  // If cart is empty, show a message
  if (cartItems.length === 0) {
    orderSummary.innerHTML = `
      <h3 class="text-center text-3xl text-neutral-900 leading-none py-8">Your order</h3>
      <p class="text-center text-neutral-400">Your cart is empty</p>
    `;
    return;
  }

  // Display the order header
  orderSummary.insertAdjacentHTML(
    "beforeend",
    `<h3 class="text-center text-3xl text-neutral-900 leading-none py-8">Your order</h3>`,
  );

  // Container for all cart items
  const itemsContainer = document.createElement("div");
  itemsContainer.className = "w-[90%] mx-auto flex flex-col gap-4";
  orderSummary.appendChild(itemsContainer);

  // Loop through cart items and display each item
  cartItems.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "flex items-center justify-between";

    itemDiv.innerHTML = `
      <div class="flex gap-4 items-center">
        <h4 class="text-3xl text-neutral-900 leading-none">${item.name}</h4>
        <button class="text-xs text-neutral-400" id="remove-${index}">remove</button>
      </div>
      <p class="text-2xl text-neutral-700">$${item.price}</p>
    `;

    itemsContainer.appendChild(itemDiv);

    // Remove item from cart when "remove" button is clicked
    document.querySelector(`#remove-${index}`).addEventListener("click", () => {
      cartItems.splice(index, 1);
      renderOrderSummary();
    });
  });

  // Calculate total price of all items in the cart
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Display total price with a border above
  const totalContainer = document.createElement("div");
  totalContainer.className =
    "flex justify-between items-center w-[90%] mx-auto border-t border-black mt-6 py-4";
  totalContainer.innerHTML = `
    <p class="text-3xl text-neutral-900 leading-none">Total price</p>
    <p class="text-2xl text-neutral-700 leading-none">$${total}</p>
  `;
  orderSummary.appendChild(totalContainer);

  // Display "Complete order" button below total price
  orderSummary.insertAdjacentHTML(
    "beforeend",
    `
    <div class="flex justify-center w-[90%] mx-auto mt-6 pb-8">
      <button class="complete-order bg-[#16DB99] w-full py-3 px-4 rounded font-bold text-white">
        Complete order
      </button>
    </div>
    `,
  );

  // Show payment modal when "Complete order" button is clicked
  const completeOrderBtn = document.querySelector(".complete-order");
  completeOrderBtn.addEventListener("click", () => {
    paymentModal.classList.remove("hidden");
  });
};

// Handle payment form submission
payBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const customerName = document.querySelector("#name").value;

  // Hide modal and clear cart
  paymentModal.classList.add("hidden");
  cartItems = [];
  renderOrderSummary();

  // Get payment details
  const name = document.querySelector("#name").value;
  const cardNumber = document.querySelector("#card-number").value;
  const expiryDate = document.querySelector("#expiry-date").value;
  const cvv = document.querySelector("#cvv").value;

  // Validate payment details
  if (name === "" || cardNumber === "" || expiryDate === "" || cvv === "") {
    alert("Please fill in all payment details.");
    return;
  }

  // Show success message
  const successMessage = document.querySelector("#success-message");
  successMessage.insertAdjacentHTML(
    "beforeend",
    `<p>Thanks, ${customerName}! Your order is on its way!</p>`,
  );
  successMessage.classList.remove("hidden");
});
