// Données du panier
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// Communes d'Abidjan avec leurs zones
const abidjanCommunes = [
    { name: "Abobo", zone: "nord" },
    { name: "Adjamé", zone: "centre" },
    { name: "Attécoubé", zone: "centre" },
    { name: "Cocody", zone: "est" },
    { name: "Koumassi", zone: "sud" },
    { name: "Marcory", zone: "sud" },
    { name: "Plateau", zone: "centre" },
    { name: "Port-Bouët", zone: "sud" },
    { name: "Treichville", zone: "centre" },
    { name: "Yopougon", zone: "ouest" },
    { name: "Bingerville", zone: "est" },
    { name: "Songon", zone: "ouest" },
    { name: "Anyama", zone: "nord" }
];

// Autres villes principales de Côte d'Ivoire avec leurs distances et frais
const otherCities = [
    { name: "Bouaké", fee: 7000, distance: "379 km" },
    { name: "Yamoussoukro", fee: 6000, distance: "248 km" },
    { name: "San Pedro", fee: 8000, distance: "368 km" },
    { name: "Korhogo", fee: 10000, distance: "635 km" },
    { name: "Daloa", fee: 7000, distance: "401 km" },
    { name: "Man", fee: 8000, distance: "592 km" },
    { name: "Divo", fee: 6000, distance: "187 km" },
    { name: "Gagnoa", fee: 7000, distance: "286 km" },
    { name: "Abengourou", fee: 6000, distance: "210 km" },
    { name: "Grand-Bassam", fee: 5000, distance: "43 km" }
];

// Éléments DOM
const cartItemsContainer = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const deliveryFeeElement = document.getElementById('deliveryFee');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const originCommuneSelect = document.getElementById('originCommune');
const destinationTypeSelect = document.getElementById('destinationType');
const destinationCommuneSelect = document.getElementById('destinationCommune');
const destinationCitySelect = document.getElementById('destinationCity');
const deliveryDetailsElement = document.getElementById('deliveryDetails');
const cardPaymentForm = document.getElementById('cardPaymentForm');
const mobilePaymentForm = document.getElementById('mobilePaymentForm');
const paymentTypes = document.getElementsByName('paymentType');
const confirmButton = document.querySelector('.confirm-button');

// Formatage des montants en FCFA
function formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// Remplir les sélecteurs de communes et de villes
function initializeSelects() {
    // Remplir les communes de destination
    const communeOptions = abidjanCommunes.map(commune => 
        `<option value="${commune.name}">${commune.name}</option>`
    ).join('');
    
    destinationCommuneSelect.innerHTML = '<option value="">Sélectionnez une commune</option>' + communeOptions;

    // Remplir les autres villes
    const cityOptions = otherCities.map(city => 
        `<option value="${city.name}">${city.name} (${city.distance})</option>`
    ).join('');
    
    destinationCitySelect.innerHTML = '<option value="">Sélectionnez une ville</option>' + cityOptions;

    // Définir la commune de départ comme "Cocody" et désactiver le sélecteur
    originCommuneSelect.innerHTML = `<option value="Cocody" selected>Cocody</option>`;
    originCommuneSelect.disabled = true;
}

// Calcul des frais de livraison
function calculateDeliveryFee() {
    const destinationType = destinationTypeSelect.value;

    if (destinationType === 'abidjan') {
        const destinationCommune = destinationCommuneSelect.value;

        if (!destinationCommune) {
            updateDeliveryDetails("Veuillez sélectionner une commune de destination.");
            return 0;
        }

        if (destinationCommune === "Cocody") {
            updateDeliveryDetails(`Livraison dans Cocody - Délai: 24h`);
            return 1000; // Même commune
        } else {
            updateDeliveryDetails(`Livraison de Cocody à ${destinationCommune} - Délai: 24-48h`);
            return 1500; // Communes différentes
        }
    } else {
        const selectedCity = otherCities.find(city => city.name === destinationCitySelect.value);
        if (selectedCity) {
            updateDeliveryDetails(`Expédition vers ${selectedCity.name} (${selectedCity.distance}) - Délai: 2-5 jours`);
            return selectedCity.fee;
        } else {
            updateDeliveryDetails("Veuillez sélectionner une ville de destination.");
            return 0;
        }
    }
}

// Mise à jour des détails de livraison
function updateDeliveryDetails(details) {
    if (deliveryDetailsElement) {
        deliveryDetailsElement.textContent = details;
    }
}

// Calcul des totaux
function calculateTotals() {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = calculateDeliveryFee();
    const tax = subtotal * 0.18; // TVA 18%
    const total = subtotal + deliveryFee + tax;

    // Mise à jour de l'affichage
    if (subtotalElement) subtotalElement.textContent = formatAmount(subtotal);
    if (deliveryFeeElement) deliveryFeeElement.textContent = formatAmount(deliveryFee);
    if (taxElement) taxElement.textContent = formatAmount(tax);
    if (totalElement) totalElement.textContent = formatAmount(total);

    // Stockage du total pour le paiement
    localStorage.setItem("totalAmount", total);
}

// Affichage des articles du panier
function displayCartItems() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${formatAmount(item.price * item.quantity)}</span>
        </div>
    `).join('');
}

// Gestion des modes de paiement
function togglePaymentForms() {
    const selectedPaymentType = document.querySelector('input[name="paymentType"]:checked').value;
    if (cardPaymentForm) cardPaymentForm.style.display = selectedPaymentType === 'card' ? 'block' : 'none';
    if (mobilePaymentForm) mobilePaymentForm.style.display = selectedPaymentType === 'mobile' ? 'block' : 'none';
}

// Écouteurs d'événements
destinationTypeSelect.addEventListener('change', updateDestinationOptions);
destinationCommuneSelect.addEventListener('change', calculateTotals);
destinationCitySelect.addEventListener('change', calculateTotals);

if (paymentTypes.length > 0) {
    paymentTypes.forEach(option => {
        option.addEventListener('change', togglePaymentForms);
    });
}

// Mise à jour des options de destination
function updateDestinationOptions() {
    const destinationType = destinationTypeSelect.value;
    const communeContainer = document.getElementById('communeContainer');
    const cityContainer = document.getElementById('cityContainer');

    if (destinationType === 'abidjan') {
        communeContainer.style.display = 'block';
        cityContainer.style.display = 'none';
    } else {
        communeContainer.style.display = 'none';
        cityContainer.style.display = 'block';
    }

    calculateTotals();
}

// Validation du formulaire
confirmButton.addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;

    if (!firstName || !lastName || !address) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    if (calculateDeliveryFee() === 0) {
        alert("Veuillez sélectionner une commune ou une ville de destination.");
        return;
    }
    window.location.href = "validation.html";
    alert("Payez maintenant !");
});

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeSelects();
    displayCartItems();
    calculateTotals();
    togglePaymentForms();
    updateDestinationOptions();
});