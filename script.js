// Select DOM elements for menu, order summary, payment modal, and pay button
const menu = document.querySelector("#menu");
const orderSummary = document.querySelector("#order-summary");
const paymentModal = document.querySelector("#payment-modal");
const paymentForm = document.querySelector("#payment-modal form");

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
          class="w-11 h-11 rounded-full border border-neutral-300 text-xl flex items-center justify-center hover:bg-neutral-100 transition cursor-pointer">
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

// Function to render the order summary with grouped items
const renderOrderSummary = () => {
  orderSummary.innerHTML = "";

  if (cartItems.length === 0) {
    orderSummary.innerHTML = `
      <h3 class="text-center text-3xl text-neutral-900 leading-none py-8">Your order</h3>
      <p class="text-center text-neutral-400">Your cart is empty</p>
    `;
    return;
  }

  orderSummary.insertAdjacentHTML(
    "beforeend",
    `<h3 class="text-center text-3xl text-neutral-900 leading-none py-8">Your order</h3>`,
  );

  // Group items by ID for quantity
  const summaryMap = {};
  cartItems.forEach((item) => {
    if (summaryMap[item.id]) {
      summaryMap[item.id].quantity += 1;
    } else {
      summaryMap[item.id] = { ...item, quantity: 1 };
    }
  });

  // Container for cart items
  const itemsContainer = document.createElement("div");
  itemsContainer.className = "w-[90%] mx-auto flex flex-col gap-4";
  orderSummary.appendChild(itemsContainer);

  Object.values(summaryMap).forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "flex items-center justify-between";

    itemDiv.innerHTML = `
      <div class="flex gap-4 items-center">
        <span class="text-2xl text-neutral-700 font-semibold">${item.quantity}x</span>
        <h4 class="text-3xl text-neutral-900 leading-none">${item.name}</h4>
        <button class="text-xs text-neutral-400 hover:text-red-500 active:text-red-600 cursor-pointer" id="remove-${index}">remove</button>
      </div>
      <p class="text-2xl text-neutral-700">$${item.price * item.quantity}</p>
    `;

    itemsContainer.appendChild(itemDiv);

    // Remove one quantity or full item
    document.querySelector(`#remove-${index}`).addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
        cartItems.splice(
          cartItems.findIndex((cartItem) => cartItem.id === item.id),
          1,
        );
      } else {
        cartItems = cartItems.filter((cartItem) => cartItem.id !== item.id);
      }
      renderOrderSummary();
    });
  });

  // Total price container with border
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const totalContainer = document.createElement("div");
  totalContainer.className =
    "flex justify-between items-center w-[90%] mx-auto border-t border-black mt-6 py-4";
  totalContainer.innerHTML = `
    <p class="text-3xl text-neutral-900 leading-none">Total price</p>
    <p class="text-2xl text-neutral-700 leading-none">$${total}</p>
  `;
  orderSummary.appendChild(totalContainer);

  // Complete order button
  orderSummary.insertAdjacentHTML(
    "beforeend",
    `
    <div class="flex justify-center w-[90%] mx-auto mt-6 pb-8">
      <button class="complete-order bg-[#16DB99] w-full py-4 px-4 rounded font-bold text-white cursor-pointer">
        Complete order
      </button>
    </div>
    `,
  );

  // Open modal in center with overlay and block background scrolling
  const completeOrderBtn = document.querySelector(".complete-order");
  completeOrderBtn.addEventListener("click", () => {
    paymentModal.classList.remove("hidden");
    document.body.classList.add("overflow-hidden"); // block scrolling

    // Add overlay background if not already there
    if (!document.querySelector("#modal-overlay")) {
      const overlay = document.createElement("div");
      overlay.id = "modal-overlay";
      overlay.className = "fixed inset-0 bg-black/50 z-40";
      document.body.appendChild(overlay);
    }
    paymentModal.classList.add(
      "fixed",
      "inset-0",
      "z-50",
      "flex",
      "justify-center",
      "items-center",
    );
  });
};

// Handle payment form submission for all devices
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload

  const name = document.querySelector("#name").value;
  const cardNumber = document.querySelector("#card-number").value;
  const expiryDate = document.querySelector("#expiry-date").value;
  const cvv = document.querySelector("#cvv").value;

  if (!name || !cardNumber || !expiryDate || !cvv) {
    alert("Please fill in all payment details.");
    return;
  }

  const customerName = name;

  // Hide modal and overlay, restore scrolling
  paymentModal.classList.add("hidden");
  const overlay = document.querySelector("#modal-overlay");
  if (overlay) overlay.remove();
  document.body.classList.remove("overflow-hidden");

  cartItems = [];
  renderOrderSummary();

  const successMessage = document.querySelector("#success-message");
  successMessage.insertAdjacentHTML(
    "beforeend",
    `<p>Thanks, ${customerName}! Your order is on its way!</p>`,
  );
  successMessage.classList.remove("hidden");
});
