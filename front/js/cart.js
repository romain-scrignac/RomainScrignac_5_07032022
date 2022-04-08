
/**
 * @description this function calculates a total price with a list of products as an input,
 *              then updates inner text of passed id
 * 
 * @param {string} totalPriceId the id of the element which has its display updated
 * @param {Array} products the array of products to calculate total price 
 * 
 */
function calculateTotalPrice(totalPriceId, products) {
    let sumOrder = 0;
    products.forEach(function(product) {
        // Calcul du prix de la commande + ajout au total du panier
        const priceOrder = product.quantity * product.price;
        sumOrder += priceOrder;
    });
    document.getElementById(totalPriceId).innerText = sumOrder;
};

/**
 * @description this function takes a key as parameter to return the associated product from local storage
 * 
 * @param {string} key the id of the product in local storage
 */
function getProductFromLocalStorage(key) {
    const productKey = localStorage.key(key);
    const cartProduct = JSON.parse(localStorage.getItem(productKey));
    return cartProduct;
}

const totalPriceId = "totalPrice";

// Création regex pour vérification du formulaire
const regexName = /^([À-ÿA-Za-z]{1,30})([\s|'|-]{1}[À-ÿA-Za-z]{1,30}){0,5}?$/;
const regexAddress = /^([0-9]{1,4})\s([À-ÿA-Za-z]{2,10})\s([À-ÿA-Za-z0-9]{1,})([\s|'|-]{1}[À-ÿA-Za-z0-9]{1,}){0,9}?$/;
const regexEmail = /^([a-z0-9]{1,20})([\.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;

// Initialisation du nombre d'articles à 0 et du tableau des produits vide
let sumArticle = 0;
let products = [];

window.addEventListener("load", async () => {

    // Condition de présence d'article(s) dans le panier
    if(localStorage.length > 0) {

        // Boucle qui récupère chaque produit du local storage
        for (let i = 0; i < localStorage.length; i++) {

            const productKey = localStorage.key(i);
            const cartProduct = getProductFromLocalStorage(i);
            const productId = cartProduct.id;
            const productColor = cartProduct.color;
            const productQuantity = cartProduct.quantity;

            // Vérification clé unique avec regex
            // id: 32 caractères
            // color: 1 majuscule et 2 lettres min, 5 max après la majuscule (ex: Red, Yellow)
            // Deuxième couleur optionnelle (ex: Black/Yellow)
            const regexKey = /^([a-z0-9]){32}([A-Z]){1}([a-z]){2,5}(\/([A-Z]){1}([a-z]){2,5})?$/;

            // Si clé valide on récupère les données de l'article
            if(productKey.match(regexKey)) {
                try {        
                    const productsAPICall = await fetch('http://localhost:3000/api/products/'+ productId);
                    const product = await productsAPICall.json();

                    // Création + ajout de l'élément enfant <article> au parent <section id="cart__items">
                    let article = document.createElement("article");
                    let parentArticle = document.getElementById("cart__items");

                    parentArticle.appendChild(article);

                    // Modification des attributs <article>
                    article.setAttribute("class", "cart__item");
                    article.setAttribute("data-id", product._id);
                    article.setAttribute("data-color", productColor);

                    // Création variables pour les balises contenues dans l'élément <article>
                    let productImage = `<div class="cart__item__img"><img src="${product.imageUrl}" alt="${product.altTxt}"></div>`;
                        let productDescription = `<div class="cart__item__content__description"><h2>${product.name}</h2><p>${productColor}</p><p>${product.price} €</p></div>`
                        let productSettingsQuantity = `<div class="cart__item__content__settings__quantity">
                            <p>Quantité: </p>
                            <input id="quantity-${productId}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productQuantity}">
                        </div>`;
                        let productDelete = `<div class="cart__item__content__settings__delete">
                            <p id="delete-${productId}" class="deleteItem">Supprimer</p>
                        </div>`;
                        let productContentSettings = `<div class="cart__item__content__settings">${productSettingsQuantity + productDelete}</div>`;
                    let productContent = `<div class="cart__item__content">${productDescription + productContentSettings}</div>`;

                    // Modification du contenu de l'élément article
                    article.innerHTML = productImage + productContent;

                    // Ajout du prix du produit au tableau products pour le calcul total
                    cartProduct.price = product.price;
                    products.push(cartProduct);

                    // Ajout d'un article à chaque loop pour le nombre total
                    sumArticle++;

                    // event listener pour changer la quantité d'un article
                    document.getElementById(`quantity-${productId}`).addEventListener('change', event => {
                        const newQuantity = event.target.value;
                        // Si quantité valide on modifie le panier
                        if((newQuantity > 0) && (newQuantity <= 100) && (newQuantity != productQuantity)) {
                            const updatedProduct = {
                                id: productId,
                                color: productColor,
                                quantity: newQuantity
                            };
                            // Mise à jour du tableau products avec la nouvelle quantité du produit
                            products = products.map(product => {
                                if (product.id === updatedProduct.id) {
                                    product.quantity = newQuantity;
                                }
                                return product;
                            });
                            // Mise à jour du local storage et calcul du nouveau prix total
                            localStorage.setItem(productKey, JSON.stringify(updatedProduct));
                            calculateTotalPrice(totalPriceId, products);

                            console.log(products);
                        }
                    });

                    // event listener pour supprimer un article
                    document.getElementById(`delete-${productId}`).addEventListener('click', event => {
                        event.preventDefault();
                        // Suppression de l'article de la page, du tableau products et du local storage
                        article.remove();
                        localStorage.removeItem(productKey);
                        products = products.filter(product => product.id != cartProduct.id);
                        alert("Produit supprimé du panier");
        
                        // Modification quantité d'articles
                        sumArticle--;
                        totalQuantityId.innerText = sumArticle;
        
                        // Calcul du nouveau prix total                        
                        calculateTotalPrice(totalPriceId, products);
                    });

                } catch (error) {
                    console.error(error);
                    alert("Une erreur est survenue, veuillez recharger la page");
                }
            } else {
                console.log("Erreur de clé");
            }
        }
    }

    // Affichage nombre d'articles et prix total
    let totalQuantityId = document.getElementById("totalQuantity");
    totalQuantityId.innerText = sumArticle;
    calculateTotalPrice(totalPriceId, products);

    let firstName = document.forms[0]["firstName"];
    let lastName = document.forms[0]["lastName"];
    let address = document.forms[0]["address"];
    let city = document.forms[0]["city"];
    let email = document.forms[0]["email"];

    /**
     * @description This function checks the data of the form
     *              then returns true if it's ok
     * 
     * @param {boolean} validateAllInputs a boolean condition for checks all inputs to the form
     * @param {string} inputToValidate the id input to the form
     * 
     */
    function validateForm(validateAllInputs = true, inputToValidate = '') {

        let isValid = true;

        if ((validateAllInputs || inputToValidate === "firstName") && !firstName.value.match(regexName)){
            document.getElementById("firstNameErrorMsg").textContent = "Mauvais prénom";
            firstName.focus();
            isValid = false;
        } else {
            firstNameErrorMsg.textContent = "";
        }
        if ((validateAllInputs || inputToValidate === "lastName") && !lastName.value.match(regexName)) {
            document.getElementById("lastNameErrorMsg").textContent = "Mauvais nom";
            lastName.focus();
            isValid = false;
        } else {
            lastNameErrorMsg.textContent = "";
        }
        if ((validateAllInputs || inputToValidate === "address") && !address.value.match(regexAddress)) {
            document.getElementById("addressErrorMsg").textContent = "Mauvaise adresse";
            address.focus();
            isValid = false;
        } else {
            addressErrorMsg.textContent = "";
        }
        if ((validateAllInputs || inputToValidate === "city") && !city.value.match(regexName)) {
            document.getElementById("cityErrorMsg").textContent = "Mauvaise ville";
            city.focus();
            isValid = false;
        } else {
            cityErrorMsg.textContent = "";
        }
        if ((validateAllInputs || inputToValidate === "email") && !email.value.match(regexEmail)) {
            document.getElementById("emailErrorMsg").textContent = "Email non valide, le format doit être sans accent et en minuscule (ex: example@mail.fr)";
            email.focus();
            isValid = false;
        } else {
            emailErrorMsg.textContent = "";
        }
        return isValid;
    };

    // Event listener pour vérifier chaque input en direct
    firstName.addEventListener('blur', event => {
        validateForm(false, "firstName");
    });

    lastName.addEventListener('change', event => {
        validateForm(false, "lastName");
    });

    address.addEventListener('change', event => {
        validateForm(false, "address");
    });

    city.addEventListener('change', event => {
        validateForm(false, "city");
    });

    email.addEventListener('change', event => {
        validateForm(false, "email");
    });

    // Si panier non vide et formulaire valide on envoie la requête POST
    document.forms[0].addEventListener('submit', async (event) => {
        event.preventDefault();
        if (localStorage.length == 0) {
            alert("Panier vide !");
        } else if (!validateForm()) {
            alert("Formulaire non valide !");
        } else {
            // Création objet contact
            let contact = {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value
            };
            console.log(contact);

            // Création tableau des product-ID
            products = [];
            for (let i = 0; i < localStorage.length; i++) {
                products.push(getProductFromLocalStorage(i).id);
            }
            console.log(products);
            try {
                const orderResult = await fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers: { 
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({contact, products})
                });
                if (orderResult.ok) {
                    const orderResultJson = await orderResult.json();
                    const orderId = orderResultJson.orderId;
                    location.href = "confirmation.html?id="+ orderId;
                }
            } catch (error) {
                console.error(error);
                alert("Une erreur est survenue, veuillez recharger la page");
            }
        }
    });
});
