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

  cartItems.forEach((item) => {
    orderSummary.insertAdjacentHTML(
      "beforeend",
      `
        <div class="order-item">
          <h3>${item.name}</h3>
          <button id="remove-${item.id}">remove</button>

          <p>Price: $${item.price}</p>
        </div>
      `,
    );
  });
};
