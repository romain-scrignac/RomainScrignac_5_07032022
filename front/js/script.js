window.addEventListener("load", async () => {

  try {
    const productsAPICall = await fetch('http://localhost:3000/api/products');
    const products = await productsAPICall.json();

    // Boucle qui crée un lien différent pour chaque produit
    for (let product of products) {
      
      // Création du lien
      const newLink = document.createElement("a");
      const parentLink = document.getElementById("items");
      parentLink.appendChild(newLink);
      newLink.setAttribute("href", "./product.html?id="+ product._id);
      newLink.setAttribute("id", "link-"+ product._id);

      // Création de l'article
      const newArticle = document.createElement("article");
      const parentNewArticle = document.getElementById("link-"+ product._id);
      parentNewArticle.appendChild(newArticle);
      newArticle.setAttribute("id", "article-"+ product._id);

      // Création de l'image
      const imageKanap = document.createElement("img");
      const parentImageKanap = document.getElementById("article-"+ product._id);
      parentImageKanap.appendChild(imageKanap);
      imageKanap.setAttribute("src", product.imageUrl);
      imageKanap.setAttribute("alt", product.altTxt);

      // Création du titre
      const nameKanap = document.createElement("h3");
      const parentNameKanap = document.getElementById("article-"+ product._id);
      parentNameKanap.appendChild(nameKanap);
      nameKanap.setAttribute("class", "productName");
      nameKanap.innerText = product.name;

      // Création de la description
      const descriptionKanap = document.createElement("p");
      const parentDescriptionKanap = document.getElementById("article-"+ product._id);
      parentDescriptionKanap.appendChild(descriptionKanap);
      descriptionKanap.setAttribute("class", "productDescription");
      descriptionKanap.innerText = product.description;
    }
  } catch (error) {
    console.error(error);
  } 
});  
