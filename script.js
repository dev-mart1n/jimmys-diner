const menu = document.getElementById("menu");

menuArray.forEach((item) => {
  menu.innerHTML += `
  <div class="menu-item">
    <span>${item.emoji}</span>
    <h3>${item.name}</h3>
    <p>${item.ingredients.join(", ")}</p>
    <p>Price: $${item.price}</p>
    <button>+</button>
  </div>`;
});
