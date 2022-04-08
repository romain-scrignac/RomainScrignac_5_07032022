// On récupère l'id de la commande dans l'url pour l'afficher
const url = new URL(location);
const orderId = url.searchParams.get('id');

const regexId = /^([a-z0-9]{8})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{4})-([a-z0-9]{12})$/;

if ((orderId == null) || !orderId.match(regexId)) {
    alert("Aucune commande en cours");
} else {
    document.getElementById("orderId").innerText = orderId;
    localStorage.clear();
}
