document.addEventListener("DOMContentLoaded", () => {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const cartButton = document.getElementById("cart-button");
    const cartButtonMobile = document.getElementById("cart-button-mobile");

    // Vérifie si les boutons existent
    if (!cartButton || !cartButtonMobile) return;

    const countSpan = cartButton.querySelector(".count");
    const countSpanMobile = cartButtonMobile.querySelector(".count");

    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // ✅ Mise à jour du compteur du panier
    function updateCartCount() {
        let totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        countSpan.textContent = totalCount;
        countSpanMobile.textContent = totalCount;
    }

    // ✅ Sauvegarde du panier
    function saveCart() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    // ✅ Ajout au panier
    addToCartButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-id"));
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            const image = button.getAttribute("data-image");
            const restaurant = button.getAttribute("data-restaurant");

            let existingItem = cartItems.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartItems.push({ id, name, restaurant, price, quantity: 1, image });
            }

            saveCart();
            updateCartCount();
            alert(`${name} a été ajouté au panier !`);
        });
    });

    // ✅ Redirection vers la page panier (desktop et mobile)
    cartButton.addEventListener("click", () => window.location.href = "panier.html");
    cartButtonMobile.addEventListener("click", () => window.location.href = "panier.html");

    // ✅ Mise à jour initiale
    updateCartCount();
});





document.addEventListener("DOMContentLoaded", () => {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartContainer = document.querySelector(".cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const taxElement = document.getElementById("tax");
    const totalElement = document.getElementById("total");
    const checkoutButton = document.querySelector(".checkout-btn");
    const clearCartButton = document.createElement("button");
    clearCartButton.textContent = "Vider le panier";
    clearCartButton.classList.add("clear-cart-btn");
    document.querySelector(".cart-summary").appendChild(clearCartButton);

    function updateCartDisplay() {
        cartContainer.innerHTML = "";

        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <h2>Votre panier est vide</h2>
                    <p>Ajoutez des articles pour commencer vos achats</p>
                </div>
            `;
            updateSummary();
            return;
        }

        cartItems.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.dataset.id = item.id;
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-title">${item.name}</div>
                    <div class="item-restaurant">${item.restaurant}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                </div>
                <div class="item-price">${(item.price * item.quantity).toFixed(2)} FCFA</div>
                <button class="remove-item" data-id="${item.id}">X</button>
            `;
            cartContainer.appendChild(cartItem);
        });

        updateSummary();
    }

    function updateSummary() {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.18; // TVA 18%
        const total = subtotal + tax;

        subtotalElement.textContent = `${subtotal.toFixed(2)} FCFA`;
        taxElement.textContent = `${tax.toFixed(2)} FCFA`;
        totalElement.textContent = `${total.toFixed(2)} FCFA`;
    }

    function saveCart() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    cartContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("quantity-btn")) {
            const itemId = parseInt(event.target.dataset.id);
            const action = event.target.dataset.action;
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                if (action === "increase") {
                    item.quantity++;
                } else if (action === "decrease" && item.quantity > 1) {
                    item.quantity--;
                } else if (action === "decrease" && item.quantity === 1) {
                    cartItems = cartItems.filter(item => item.id !== itemId);
                }
                saveCart();
                updateCartDisplay();
            }
        }

        if (event.target.classList.contains("remove-item")) {
            const itemId = parseInt(event.target.dataset.id);
            cartItems = cartItems.filter(item => item.id !== itemId);
            saveCart();
            updateCartDisplay();
        }
    });

    checkoutButton.addEventListener("click", () => {
        if (cartItems.length === 0) {
            alert("Votre panier est vide");
            return;
        }
        window.location.href = "payement.html";
    });

    clearCartButton.addEventListener("click", () => {
        cartItems = [];
        saveCart();
        updateCartDisplay();
    });

    updateCartDisplay();
});
