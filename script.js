const menu = document.querySelector("#menu");
const orderSummary = document.querySelector("#order-summary");
const paymentModal = document.querySelector("#payment-modal");
const payBtn = document.querySelector("#pay-btn");

let cartItems = [];

menuArray.forEach((item) => {
  menu.insertAdjacentHTML(
    "beforeend",
    `
      <div class="menu-item">
        <span>${item.emoji}</span>
        <h3>${item.name}</h3>
        <p>${item.ingredients.join(", ")}</p>
        <p>Price: $${item.price}</p>
        <button id="btn-${item.id}">+</button>
      </div>
    `,
  );

  document.querySelector(`#btn-${item.id}`).addEventListener("click", () => {
    cartItems.push(item);
    renderOrderSummary();
  });
});

const renderOrderSummary = () => {
  orderSummary.innerHTML = "";

  cartItems.forEach((item, index) => {
    orderSummary.insertAdjacentHTML(
      "beforeend",
      `
      <div class="order-item">
        <h3>${item.name}</h3>
        <button id="remove-${index}">remove</button>
        <p>Price: $${item.price}</p>
      </div>
    `,
    );

    document.querySelector(`#remove-${index}`).addEventListener("click", () => {
      cartItems.splice(index, 1);
      renderOrderSummary();
    });
  });

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  orderSummary.insertAdjacentHTML("beforeend", `<p>Total price: $${total}</p>`);

  orderSummary.insertAdjacentHTML(
    "beforeend",
    `
      <button class="complete-order">Complete order
      </button>
    `,
  );

  const completeOrderBtn = document.querySelector(".complete-order");
  completeOrderBtn.addEventListener("click", () => {
    paymentModal.classList.remove("hidden");
  });
};

payBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const customerName = document.querySelector("#name").value;

  paymentModal.classList.add("hidden");
  cartItems = [];
  renderOrderSummary();

  const successMessage = document.querySelector("#success-message");

  successMessage.insertAdjacentHTML(
    "beforeend",
    `<p>Thanks, ${customerName}! Your order is on its way!</p>`,
  );
  successMessage.classList.remove("hidden");
});
