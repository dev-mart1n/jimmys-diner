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
        <button id="btn-${item.id}" class="w-11 h-11 rounded-full border border-neutral-300 text-xl flex items-center justify-center hover:bg-neutral-100 transition cursor-pointer">+</button>
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

  const summaryMap = {};
  cartItems.forEach((item) => {
    if (summaryMap[item.id]) summaryMap[item.id].quantity += 1;
    else summaryMap[item.id] = { ...item, quantity: 1 };
  });

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

    document.querySelector(`#remove-${index}`).addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
        cartItems.splice(
          cartItems.findIndex((ci) => ci.id === item.id),
          1,
        );
      } else {
        cartItems = cartItems.filter((ci) => ci.id !== item.id);
      }
      renderOrderSummary();
    });
  });

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const totalContainer = document.createElement("div");
  totalContainer.className =
    "flex justify-between items-center w-[90%] mx-auto border-t border-black mt-6 py-4";
  totalContainer.innerHTML = `
    <p class="text-3xl text-neutral-900 leading-none">Total price</p>
    <p class="text-2xl text-neutral-700 leading-none">$${total}</p>
  `;
  orderSummary.appendChild(totalContainer);

  orderSummary.insertAdjacentHTML(
    "beforeend",
    `
    <div class="flex justify-center w-[90%] mx-auto mt-6 pb-8">
      <button class="complete-order bg-[#16DB99] w-full py-4 px-4 rounded font-bold text-white cursor-pointer">Complete order</button>
    </div>
  `,
  );

  document.querySelector(".complete-order").addEventListener("click", () => {
    paymentModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
};

payBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const form = payBtn.closest("form");
  const nameField = form.querySelector("#name");
  const cardField = form.querySelector("#card-number");
  const expiryField = form.querySelector("#expiry-date");
  const cvvField = form.querySelector("#cvv");

  const existingError = form.querySelector(".form-error");
  if (existingError) existingError.remove();

  const fields = [nameField, cardField, expiryField, cvvField];
  const emptyFields = fields.filter((f) => !f.value.trim());

  if (emptyFields.length > 0) {
    const errorMsg = document.createElement("p");
    errorMsg.className = "form-error text-red-600 text-left text-sm";
    errorMsg.style.fontFamily = "sans-serif";
    errorMsg.textContent = "Please fill out all fields";
    form.prepend(errorMsg);

    emptyFields.forEach((field) => field.classList.add("border-red-500"));
    fields.forEach((field) => {
      field.addEventListener("input", () => {
        field.classList.remove("border-red-500");
        if (!form.querySelector(".border-red-500")) errorMsg.remove();
      });
    });
    return;
  }

  let hasError = false;
  const errorMsg = document.createElement("p");
  errorMsg.className = "form-error text-red-600 text-left text-sm";
  errorMsg.style.fontFamily = "sans-serif";

  if (!/^\d{16}$/.test(cardField.value.trim())) {
    errorMsg.textContent = "Card number must be 16-digits";
    cardField.classList.add("border-red-500");
    hasError = true;
  }

  let month, year;
  const expiry = expiryField.value.replace(/\s/g, "");
  if (expiry.includes("/")) {
    [month, year] = expiry.split("/").map((v) => parseInt(v));
  } else if (expiry.length === 4) {
    month = parseInt(expiry.slice(0, 2));
    year = parseInt(expiry.slice(2, 4));
  } else {
    month = year = 0;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;

  if (
    !month ||
    !year ||
    month < 1 ||
    month > 12 ||
    year < currentYear ||
    (year === currentYear && month < currentMonth)
  ) {
    if (!hasError) errorMsg.textContent = "Card must be valid and not expired";
    expiryField.classList.add("border-red-500");
    hasError = true;
  }

  if (!/^\d{3}$/.test(cvvField.value.trim())) {
    if (!hasError) errorMsg.textContent = "CVV must be 3 digits";
    cvvField.classList.add("border-red-500");
    hasError = true;
  }

  if (hasError) {
    form.prepend(errorMsg);
    fields.forEach((field) => {
      field.addEventListener("input", () => {
        field.classList.remove("border-red-500");
        if (!form.querySelector(".border-red-500")) errorMsg.remove();
      });
    });
    return;
  }

  const customerName = nameField.value;
  paymentModal.classList.add("hidden");
  document.body.style.overflow = "";
  cartItems = [];
  renderOrderSummary();

  const successMessage = document.querySelector("#success-message");
  successMessage.innerHTML = `
  <div class="px-6 w-[90%] mx-auto mt-12">
    <div class="text-center text-[28px] text-green-900 bg-green-100 px-8 py-8 rounded-md tracking-[0.05em]" style="font-family: 'Smythe', serif;">
      <span class="inline-block">Thanks, ${customerName}! Your order is on its way!</span>
    </div>
  </div>
  `;
  successMessage.classList.remove("hidden");
  orderSummary.innerHTML = "";
});
