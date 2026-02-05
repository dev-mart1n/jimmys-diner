const menu = document.getElementById("menu");

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
  });
});
