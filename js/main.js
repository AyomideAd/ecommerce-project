
document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.querySelector(".cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const shippingElement = document.getElementById("shipping");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");

  const SHIPPING_COST = 10.00;
  const TAX_RATE = 0.08;

  // Update Cart Totals
  function updateCartTotals() {
      let subtotal = 0;

      document.querySelectorAll(".cart-item").forEach(item => {
          const price = parseFloat(item.querySelector(".item-price").textContent.replace("$", ""));
          const quantity = parseInt(item.querySelector(".quantity").textContent);
          subtotal += price * quantity;
      });

      const tax = subtotal * TAX_RATE;
      const total = subtotal + SHIPPING_COST + tax;

      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      shippingElement.textContent = `$${SHIPPING_COST.toFixed(2)}`;
      taxElement.textContent = `$${tax.toFixed(2)}`;
      totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Handle Quantity Changes
  cartItems.addEventListener("click", (event) => {
      if (event.target.classList.contains("quantity-btn")) {
          const cartItem = event.target.closest(".cart-item");
          let quantityElement = cartItem.querySelector(".quantity");
          let quantity = parseInt(quantityElement.textContent);

          // Adjust quantity
          if (event.target.textContent === "+") {
              quantity++;
          } else if (event.target.textContent === "-" && quantity > 1) {
              quantity--;
          }

          quantityElement.textContent = quantity;
          updateCartTotals();
      }
  });

  // Handle Item Removal
  cartItems.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
          const cartItem = event.target.closest(".cart-item");
          cartItem.remove();
          updateCartTotals();
      }
  });

  // Initial Cart Totals Calculation
  updateCartTotals();
});
