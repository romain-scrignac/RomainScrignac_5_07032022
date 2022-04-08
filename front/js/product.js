/**
 * Fonction qui écrit dans le local storage les données nécessaires pour la commande
 * - productId
 * - productName
 * - productQuantity
 * - productColor
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

  if (productQuantity <= 0) {
    alert('Veuillez choisir un nombre d\'article(s)');
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

// Fonction qui récupère l'id du produit
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
    const parentImg = document.getElementById('item__img');
    parentImg.innerHTML = '<img src='+ imageUrl +' alt='+ altTxt +' />';

    const parentName = document.getElementById('title');
    parentName.innerHTML = productName;

    const parentPrice = document.getElementById('price');
    parentPrice.innerHTML = price;

    const parentDescription = document.getElementById('description');
    parentDescription.innerHTML = description;

    const parentColorOption = document.getElementById('colors');

    const quantityInput = document.getElementById('quantity');

    // Boucle pour le choix des couleurs
    for (let i = 0; i < colors.length; i++) {
      let colorOption = document.createElement('option');
      parentColorOption.appendChild(colorOption);
      colorOption.setAttribute('value', colors[i]);
      colorOption.innerHTML = colors[i];
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
