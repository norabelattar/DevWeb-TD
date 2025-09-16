const modal = document.getElementById("myModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function openModalWithDescription(title = 'Mon titre par defaut', content = 'Contenu par defaut') {
    modalTitle.textContent = title;
    modalBody.textContent = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Empecher les utilisateurs de scroller dans la page
}

function openModalWithHTMLContent(title = 'Mon titre par defaut', content = 'Contenu par defaut') {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Empecher les utilisateurs de scroller dans la page
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

modal.addEventListener('click', function(event) {
    console.log(event);
    if(event.target === modal) {
        closeModal();
    }
});

function confirmAction() {
    alert('Votre commande est bien completee !');
    // window.location.href = 'https://mcdonalds.com'
}

modal.addEventListener('keydown', function(event) {
    if(event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

modal.addEventListener('keyup', function(event) {
    if(event.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

function showReservationModal() {
    openModal(
        'Reservation',
        '<p> Bienvenue au restaurant !</p><p>Decouvrez notre menu et reserver sans tarder ! </p>'
    )
}

function zoomOnPhoto(imageURL) {
    modalBody.innerHTML = `
    <div>
        <img src="${imageURL}">
        </div`  
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}