document.addEventListener("DOMContentLoaded", function() {
    updateCartDisplay();
    setupAddToCartButtons();
    setupCheckoutButton();
});


function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || {};
    } catch (e) {
        return {};
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    let totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 12);

    const cartCountElement = document.querySelector('#cart-count');

    if (cartCountElement) {
        if (totalItems > 0) {
            cartCountElement.textContent = `(${totalItems})`;
            cartCountElement.style.display = 'inline';
        } else {
            cartCountElement.textContent = '';
            cartCountElement.style.display = 'none';
        }
    } else {
        console.error('Cart count display element not found');
    }
}



function addToCart(itemId, itemName, itemPrice) {
    const cart = getCart();
    let wasItemFound = false;

    if (cart[itemId]) {
        cart[itemId].quantity += 1;
        wasItemFound = true;
    } else {
        cart[itemId] = { name: itemName, price: itemPrice, quantity: 1 };
    }

    saveCart(cart);

    if (!wasItemFound) {
        updateCartCount(1);
    }
}



function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartButton = document.querySelector('.header-button[href="cart.html"]');
    const cart = getCart();
    let totalQuantity = 0;
    let totalPrice = 0;

    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        Object.entries(cart).forEach(([itemId, itemData]) => {
            const quantity = parseInt(itemData.quantity);
            const price = parseFloat(itemData.price);

            if (!isNaN(quantity) && !isNaN(price) && quantity > 0) {
                totalQuantity += quantity;
                totalPrice += price * quantity;

                const itemElement = document.createElement("div");
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `${itemData.name}: ${quantity} x $${price.toFixed(2)}
                <button onclick="removeFromCart('${itemId}')" class="remove-from-cart">Remove</button>`;
                cartItemsContainer.appendChild(itemElement);
            }
        });

        const totalItemsElement = document.getElementById('total-items');
        const totalPriceElement = document.getElementById('total-price');
        if (totalItemsElement && totalPriceElement) {
            totalItemsElement.textContent = ` ${totalQuantity}`;
            totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
        }
    }

    if (cartButton) {
        cartButton.textContent = `Cart (${totalQuantity})`;
    }

}



function refreshRemoveButtonListeners() {
    if (document.getElementById('cart-items')) {
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.itemId;
                removeFromCart(itemId);
            });
        });
    }
}

function removeFromCartListener(event) {
    const itemId = event.target.dataset.itemId;
    removeFromCart(itemId);
}

function removeFromCart(itemId) {
    let cart = getCart();
    if (cart[itemId] && cart[itemId].quantity > 1) {
        cart[itemId].quantity -= 1;
    } else {
        delete cart[itemId];
    }
    saveCart(cart);
    updateCartDisplay();
    updateCartCount();
}


function isUserSignedIn() {
    return localStorage.getItem('isUserSignedIn') === 'true';
}

function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (!isUserSignedIn()) {
                window.location.href = 'signup.html';
            } else {
                alert('Proceeding to checkout...');
            }
        });
    }
}

function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const itemElement = this.closest('.item');
            const itemId = itemElement.getAttribute('data-item-id');
            const itemName = itemElement.getAttribute('data-item-name');
            const itemPrice = parseFloat(itemElement.getAttribute('data-item-price'));

            if (!isNaN(itemPrice)) {
                addToCart(itemId, itemName, itemPrice);
                this.classList.add('added');
                setTimeout(() => {
                    this.classList.remove('added');
                }, 2000);
                updateCartCount();
            } else {
                console.error('Invalid price for item:', itemName);
            }
        });
    });
}