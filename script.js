const menu = document.getElementById("menu");
const orderSummary = document.getElementById("order-summary");

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

  document.getElementById(`btn-${item.id}`).addEventListener("click", () => {
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

    document.getElementById(`remove-${index}`).addEventListener("click", () => {
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
};
