window.addEventListener("load", async () => {

  try {
    const productsAPICall = await fetch('http://localhost:3000/api/products');
    const products = await productsAPICall.json();

    // Boucle qui crée un lien différent pour chaque produit
    for (let product of products) {

      // Création + ajout de l'élément "enfant" newLink <a> au parent <section id="items">
      let newLink = document.createElement("a");
      let parentLink = document.getElementById("items");
  
      parentLink.appendChild(newLink);
  
      // Création variables pour les balises contenues dans l'élément newlink <a>
      let imageKanap = `<img src="${product.imageUrl}" alt="${product.altTxt}"/>`
      let nameKanap = '<h3 class="productName">'+ product.name +'</h3>';
      let descriptionKanap = '<p class="productDescription">'+ product.description +'</p>';
  
      // Modification de l'attribut newlink <a>
      newLink.setAttribute("href", "./product.html?id="+ product._id);
  
      // Modification du contenu de l'élément newlink <a> avec les variables créées précédemment
      newLink.innerHTML = '<article>'+ imageKanap + nameKanap + descriptionKanap +'</article>';

    }
  } catch (error) {
    console.error(err);
    alert("Une erreur est survenue, veuillez recharger la page");
  } 
});  
