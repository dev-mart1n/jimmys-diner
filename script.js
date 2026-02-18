const menu = document.querySelector("#menu");
const orderSummary = document.querySelector("#order-summary");
const paymentModal = document.querySelector("#payment-modal");
const payBtn = document.querySelector("#pay-btn");

let cartItems = [];

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
      <div class="">
        <h3 class="text-center">Your order</h3>
        <h3>${item.name}</h3>
        <button id="remove-${index}">remove</button>
        <p>$${item.price}</p>
      </div>
    `,
    );

    document.querySelector(`#remove-${index}`).addEventListener("click", () => {
      cartItems.splice(index, 1);
      renderOrderSummary();
    });
  });

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  orderSummary.insertAdjacentHTML(
    "beforeend",
    `<h2>Total price: $${total}</h2>`,
  );

  orderSummary.insertAdjacentHTML(
    "beforeend",
    `
    <div class="flex justify-center">
      <button class="complete-order bg-[#16DB99] w-[90%] py-3 px-4 rounded font-bold text-white">
        Complete order
      </button>
    </div>
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

  const name = document.querySelector("#name").value;
  const cardNumber = document.querySelector("#card-number").value;
  const expiryDate = document.querySelector("#expiry-date").value;
  const cvv = document.querySelector("#cvv").value;

  if (name === "" || cardNumber === "" || expiryDate === "" || cvv === "") {
    alert("Please fill in all payment details.");
    return;
  }

  const successMessage = document.querySelector("#success-message");

  successMessage.insertAdjacentHTML(
    "beforeend",
    `<p>Thanks, ${customerName}! Your order is on its way!</p>`,
  );
  successMessage.classList.remove("hidden");
});
