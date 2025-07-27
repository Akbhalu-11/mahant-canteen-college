// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('nav').classList.toggle('active');
});

// Menu Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const menuItems = document.querySelectorAll('.menu-item');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        // Show/hide menu items based on category
        menuItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Don't prevent default for cart link
        if (!this.classList.contains('cart-icon')) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId !== '#cart') {
                const targetElement = document.querySelector(targetId);

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }

        // Close mobile menu if open
        document.querySelector('nav').classList.remove('active');
    });
});

// Cart Functionality
let cart = [];
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.querySelector('.cart-items');
const totalAmountElement = document.getElementById('total-amount');
const cartCountElement = document.querySelector('.cart-count');

// Open cart modal when cart icon is clicked
document.querySelector('.cart-icon').addEventListener('click', function(e) {
    e.preventDefault();
    updateCartDisplay();
    cartModal.style.display = 'block';
});

// Close modal when X is clicked
document.querySelector('.close-modal').addEventListener('click', function() {
    cartModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));

        // Check if item already exists in cart
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price,
                quantity: 1
            });
        }

        updateCartCount();

        // Show added to cart feedback
        this.textContent = 'Added!';
        setTimeout(() => {
            this.textContent = 'Add to Cart';
        }, 1000);
    });
});

// Update cart count display
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Update cart display in modal
function updateCartDisplay() {
    // Clear current items
    cartItemsContainer.innerHTML = '';

    // Add each item to cart display
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');

        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price * item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
                <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    // Calculate and display total
    const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalAmountElement.textContent = `₹${totalAmount}`;

    // Add event listeners to new buttons
    addCartItemEventListeners();
}

// Add event listeners to cart item buttons
function addCartItemEventListeners() {
    // Increase quantity
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            updateCartDisplay();
            updateCartCount();
        });
    });

    // Decrease quantity
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const item = cart.find(item => item.id === id);

            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove item if quantity would go to 0
                cart = cart.filter(item => item.id !== id);
            }

            updateCartDisplay();
            updateCartCount();
        });
    });

    // Remove item
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            cart = cart.filter(item => item.id !== id);
            updateCartDisplay();
            updateCartCount();
        });
    });
}

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length === 1000) {
        alert('Your cart is empty!');
        return;
    }

    // In a real application, this would process the order
    alert(`Order placed! Total: ₹${totalAmountElement.textContent.substring(1)}`);
    cart = [];
    updateCartCount();
    updateCartDisplay();
    cartModal.style.display = 'none';
});

// Feedback form submission
document.getElementById('feedback-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your feedback!');
    this.reset();
});