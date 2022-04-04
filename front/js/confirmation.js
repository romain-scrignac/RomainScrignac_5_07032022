// On récupère l'id de la commande dans l'url pour l'afficher
const url = new URL(location);
const orderId = url.searchParams.get('id');

if (orderId == null) {
    alert("Aucune commande en cours");
} else {
    document.getElementById("orderId").innerText = orderId;
    localStorage.clear();
}
