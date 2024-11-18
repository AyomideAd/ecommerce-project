// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.shipping = 0;
        this.taxRate = 0.08; // 8% tax
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.renderCart();
        this.setupEventListeners();
    }

    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
       
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }

        this.saveToLocalStorage();
        this.renderCart();
        this.updateCartIcon();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
        this.renderCart();
        this.updateCartIcon();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveToLocalStorage();
            this.renderCart();
        }
    }

    calculateSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    calculateShipping() {
        const subtotal = this.calculateSubtotal();
        return subtotal > 50 ? 0 : 5.99;
    }

    calculateTax() {
        return this.calculateSubtotal() * this.taxRate;
    }

    calculateTotal() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        const tax = this.calculateTax();
        return subtotal + shipping + tax;
    }

    renderCart() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Browse our products and add your favorites to the cart!</p>
                    <a href="/" class="btn-shop">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = this.items.map(item => this.generateCartItemHTML(item)).join('');
        this.updateSummary();
    }

    generateCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        </div>
                        <i class="fas fa-trash remove-item" onclick="cart.removeItem('${item.id}')"></i>
                    </div>
                </div>
            </div>
        `;
    }

    updateSummary() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping();
        const tax = this.calculateTax();
        const total = this.calculateTotal();

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    updateCartIcon() {
        const cartCount = document.querySelector('.header-actions a[href="/cart"]');
        if (cartCount) {
            cartCount.textContent = `Cart (${this.items.length})`;
        }
    }

    setupEventListeners() {
        // Add any additional event listeners here
        const checkoutBtn = document.querySelector('.btn-checkout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        const promoBtn = document.querySelector('.btn-apply');
        if (promoBtn) {
            promoBtn.addEventListener('click', () => this.applyPromoCode());
        }
    }

    applyPromoCode() {
        const promoInput = document.querySelector('.promo-code input');
        const promoCode = promoInput.value.trim().toUpperCase();
       
        // Example promo code logic
        if (promoCode === 'WELCOME10') {
            this.applyDiscount(10); // 10% discount
            alert('Promo code applied successfully!');
        } else {
            alert('Invalid promo code');
        }
    }

    applyDiscount(percentageOff) {
        const discountAmount = this.calculateSubtotal() * (percentageOff / 100);
        document.getElementById('discount').textContent = `-$${discountAmount.toFixed(2)}`;
        document.querySelector('.discount-row').classList.remove('hidden');
    }

    proceedToCheckout() {
        // Implement checkout logic here
        if (this.items.length === 0) {
            alert('Your cart is empty');
            return;
        }
        // Redirect to checkout page or show checkout modal
        window.location.href = '/checkout';
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart functionality for product pages
function addToCart(productId, name, price, image) {
    cart.addItem({
        id: productId,
        name: name,
        price: price,
        image: image
    });
}