
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
 * @description this function calculates the total number of products,
 *              then updates inner text of passed id
 * @param {string} totalQuantityId the id of the element which has its display updated
 */
function calculateTotalProducts(totalQuantityId) {
    let sumArticle = 0;
    for(let i = 0; i < localStorage.length; i++) {
        const cartProduct = getProductFromLocalStorage(i);
        const quantityProduct = cartProduct.quantity;
        sumArticle += parseInt(quantityProduct);
    }
    document.getElementById(totalQuantityId).innerText = sumArticle;
}

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
const totalQuantityId = "totalQuantity";

// Création regex pour vérification du formulaire
const regexName = /^([À-ÿA-Za-z]{1,30})([\s|'|-]{1}[À-ÿA-Za-z]{1,30}){0,5}?$/;
const regexAddress = /^([0-9]{1,4})\s([À-ÿA-Za-z]{2,10})\s([À-ÿA-Za-z0-9]{1,})([\s|'|-]{1}[À-ÿA-Za-z0-9]{1,}){0,9}?$/;
const regexEmail = /^([a-z0-9]{1,20})([\.|_|-]{1}[a-z0-9]{1,20})?@{1}([a-z0-9]{2,15})\.[a-z]{2,4}$/;

// Initialisation du tableau des produits vide
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

                    // Création de l'article
                    const article = document.createElement("article");
                    const parentArticle = document.getElementById("cart__items");
                    parentArticle.appendChild(article);
                    article.setAttribute("class", "cart__item");
                    article.setAttribute("id", "item-"+ productKey);
                    article.setAttribute("data-id", productId);
                    article.setAttribute("data-color", productColor);

                    // Création du conteneur cart__item__img
                    const productImage = document.createElement("div");
                    const parentProductImage = document.getElementById("item-"+ productKey);
                    parentProductImage.appendChild(productImage);
                    productImage.setAttribute("class", "cart__item__img");
                    productImage.setAttribute("id", "img-"+ productKey);

                    // Création de la balise image
                    const imageKanap = document.createElement("img");
                    const parentImageKanap = document.getElementById("img-"+ productKey);
                    parentImageKanap.appendChild(imageKanap);
                    imageKanap.setAttribute("src", product.imageUrl);
                    imageKanap.setAttribute("alt", product.altTxt);

                    // Création du conteneur cart__item__content
                    const itemContent = document.createElement("div");
                    const parentItemContent = document.getElementById("item-"+ productKey);
                    parentItemContent.appendChild(itemContent);
                    itemContent.setAttribute("class", "cart__item__content");
                    itemContent.setAttribute("id", "content-"+ productKey);

                    // Création du conteneur cart__item__content__description
                    const itemContentDescription = document.createElement("div");
                    const parentItemContentDescription = document.getElementById("content-"+ productKey);
                    parentItemContentDescription.appendChild(itemContentDescription);
                    itemContentDescription.setAttribute("class", "cart__item__content__description");
                    itemContentDescription.setAttribute("id", "content__description-"+ productKey);

                    // Création de la description
                    const nameKanap = document.createElement("h2");
                    const parentNameKanap = document.getElementById("content__description-"+ productKey);
                    parentNameKanap.appendChild(nameKanap);
                    nameKanap.innerText = product.name;

                    const colorKanap = document.createElement("p");
                    const parentColorKanap = document.getElementById("content__description-"+ productKey);
                    parentColorKanap.appendChild(colorKanap);
                    colorKanap.innerText = productColor;

                    const priceKanap =  document.createElement("p");
                    const parentPriceKanap = document.getElementById("content__description-"+ productKey);
                    parentPriceKanap.appendChild(priceKanap);
                    priceKanap.innerText = product.price +" €";

                    // Création du conteneur cart__item__content__settings
                    const itemContentSettings = document.createElement("div");
                    const parentItemContentSettings = document.getElementById("content-"+ productKey);
                    parentItemContentSettings.appendChild(itemContentSettings);
                    itemContentSettings.setAttribute("class", "cart__item__content__settings");
                    itemContentSettings.setAttribute("id", "content__settings-"+ productKey);

                    // Création du conteneur cart__item__content__settings__quantity
                    const itemSettingsQuantity = document.createElement("div");
                    const parentItemSettingsQuantity = document.getElementById("content__settings-"+ productKey);
                    parentItemSettingsQuantity.appendChild(itemSettingsQuantity);
                    itemSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
                    itemSettingsQuantity.setAttribute("id", "item__settings__quantity-"+ productKey);

                    // Création de la quantité avec input pour la modifier
                    const quantityKanap = document.createElement("p");
                    const parentQuantityKanap = document.getElementById("item__settings__quantity-"+ productKey);
                    parentQuantityKanap.appendChild(quantityKanap);
                    quantityKanap.innerText = "Quantité : ";

                    const settingsQuantityKanap = document.createElement("input");
                    const parentSettingsQuantityKanap = document.getElementById("item__settings__quantity-"+ productKey);
                    parentSettingsQuantityKanap.appendChild(settingsQuantityKanap);
                    settingsQuantityKanap.setAttribute("type", "number");
                    settingsQuantityKanap.setAttribute("class", "itemQuantity");
                    settingsQuantityKanap.setAttribute("id", "quantity-"+ productKey);      // Cet id servira à modifier la quantité avec l'eventListener "change"
                    settingsQuantityKanap.setAttribute("name", "itemQuantity");
                    settingsQuantityKanap.setAttribute("min", "1");
                    settingsQuantityKanap.setAttribute("max", "100");
                    settingsQuantityKanap.setAttribute("value", productQuantity);

                    // Création du conteneur cart__item__content__settings__delete
                    const itemSettingsDelete = document.createElement("div");
                    const parentItemSettingsDelete = document.getElementById("content__settings-"+ productKey);
                    parentItemSettingsDelete.appendChild(itemSettingsDelete);
                    itemSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
                    itemSettingsDelete.setAttribute("id", "item__settings__delete-"+ productKey);

                    // Création de l'option de suppression
                    const deleteKanap = document.createElement("p");
                    const parentDeleteKanap = document.getElementById("item__settings__delete-"+ productKey);
                    parentDeleteKanap.appendChild(deleteKanap);
                    deleteKanap.setAttribute("class", "deleteItem");
                    deleteKanap.setAttribute("id", "delete-"+ productKey);                  // Cet id servira à supprimer l'article avec l'eventListener "click"
                    deleteKanap.innerText = "Supprimer";

                    // Ajout du prix du produit au tableau products pour le calcul total
                    cartProduct.price = product.price;
                    products.push(cartProduct);

                    // event listener pour changer la quantité d'un article
                    document.getElementById(`quantity-${productKey}`).addEventListener('change', event => {
                        const newQuantity = event.target.value;
                        // Si quantité non valide on averti l'utilisateur
                        if ((newQuantity <= 0) || (newQuantity > 100)) {
                            alert('Veuillez choisir un nombre d\'article(s) compris entre 0 et 100');
                        }
                        // Si quantité valide on modifie le panier
                        if((newQuantity > 0) && (newQuantity <= 100)) {
                            const updatedProduct = {
                                id: productId,
                                color: productColor,
                                quantity: newQuantity
                            };
                            // Mise à jour du tableau products avec la nouvelle quantité du produit
                            products = products.map(product => {
                                if (productKey === product.id + product.color) {
                                    product.quantity = newQuantity;
                                }
                                console.log(product.id + product.color);
                                return product;
                            });
                            // Mise à jour du local storage et modification nombre total d'articles + prix total
                            localStorage.setItem(productKey, JSON.stringify(updatedProduct));
                            calculateTotalProducts(totalQuantityId);
                            calculateTotalPrice(totalPriceId, products);

                            console.log(products);
                        }
                    });

                    // event listener pour supprimer un article
                    document.getElementById(`delete-${productKey}`).addEventListener('click', event => {
                        event.preventDefault();
                        // Suppression de l'article de la page, du tableau products et du local storage
                        article.remove();
                        localStorage.removeItem(productKey);
                        // Suppression de l'article du tableau products si la clé correspond bien à l'article
                        products = products.filter(product => (product.id + product.color) != productKey);
                        alert("Produit supprimé du panier");
                        console.log(products);
        
                        // Modification nombre total d'articles + prix total
                        calculateTotalProducts(totalQuantityId);
                        calculateTotalPrice(totalPriceId, products);
                    });

                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log("Erreur de clé");
            }
        }
    }

    // Affichage nombre total d'articles + prix total
    calculateTotalProducts(totalQuantityId);
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
    firstName.addEventListener('change', event => {
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

    // Si panier non vide et formulaire valide on envoi la requête POST
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
                // Si la requête POST est valide on récupère l'orderId et on redirige vers confirmation.html
                if (orderResult.ok) {
                    const orderResultJson = await orderResult.json();
                    const orderId = orderResultJson.orderId;
                    location.href = "confirmation.html?id="+ orderId;
                }
            } catch (error) {
                console.error(error);
            }
        }
    });
});
