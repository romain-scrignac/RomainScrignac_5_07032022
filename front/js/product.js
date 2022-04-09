/**
 * @description this function writes in the local storage the data necessary for the product order
 * 
 * @param {string} productId the id of the product
 * @param {string} productName the name of the product for order alert
 * @param {number} productQuantity the quantity of the product
 * @param {string} productColor the color of the product
 */
function order(productId, productName, productQuantity, productColor) {

  let color = document.getElementById('colors').value;
  console.log("from order function", color);

  let validated = true;
  
  if (productId.trim() === "") {
    alert('Veuillez sélectionner un produit');
    validated = false;
  }

  if( productColor.trim() === "") {
    alert('Veuillez choisir une couleur');
    validated = false;
  }

  if ((productQuantity <= 0) || (productQuantity > 100)) {
    alert('Veuillez choisir un nombre d\'article(s) compris entre 0 et 100');
    validated = false;
  }

  if (validated) {
    // Création d'une clé unique par produit
    const keyOrder = productId + productColor;
    // Ajout du produit au panier
    localStorage.setItem(keyOrder, JSON.stringify({
      color: productColor,
      id: productId,
      quantity: productQuantity
    }))

    alert(productName +' ajouté au panier');
  }
}

/**
 * @description this function retrieves the product id from url
 */
function recupId(){
  const url = new URL(location);
  const productId = url.searchParams.get('id');

  return productId;
}

window.addEventListener("load", async () => {

  const productId = recupId();
 
  try {
    const productsAPICall = await fetch('http://localhost:3000/api/products/'+ productId);
    const product = await productsAPICall.json();

    // Récupération infos produit    
    const imageUrl = product.imageUrl;
    const altTxt = product.altTxt;
    const productName = product.name;
    const description = product.description;
    const price = product.price;
    const colors = product.colors;
    console.log(colors);

    // Affichage infos produit
    const img = document.createElement("img");
    const parentImg = document.getElementById('item__img');
    parentImg.appendChild(img);
    img.setAttribute("src", imageUrl);
    img.setAttribute("alt", altTxt);

    const parentName = document.getElementById('title');
    parentName.innerText = productName;

    const parentPrice = document.getElementById('price');
    parentPrice.innerText = price;

    const parentDescription = document.getElementById('description');
    parentDescription.innerText = description;

    const parentColorOption = document.getElementById('colors');

    const quantityInput = document.getElementById('quantity');

    // Boucle pour le choix des couleurs
    for (let i = 0; i < colors.length; i++) {
      let colorOption = document.createElement('option');
      parentColorOption.appendChild(colorOption);
      colorOption.setAttribute('value', colors[i]);
      colorOption.innerText = colors[i];
    }

    // Création évènement au clic sur bouton de commande
    const addProduct = document.getElementById('addToCart');
    addProduct.addEventListener('click', () => {
      const productColor = parentColorOption.value;
      const productQuantity = quantityInput.value;
      order(productId, productName, productQuantity, productColor);
    });

  } catch (error) {
    console.error(error);
    alert("Une erreur est survenue, veuillez recharger la page");
  }
});
