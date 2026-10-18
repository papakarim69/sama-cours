document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#form-ajouter-cours');
    const listeCours = document.querySelector('#liste-cours');

    // Fonction pour afficher les cours et leurs photos enregistrés
    function afficherCours() {
        if (!listeCours) return;

        const lecons = JSON.parse(localStorage.getItem('sama_cours_lecons')) || [];
        listeCours.innerHTML = '';

        if (lecons.length === 0) {
            listeCours.innerHTML = '<p>Aucune leçon enregistrée pour le moment.</p>';
            return;
        }

        lecons.forEach((cours) => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.marginBottom = '15px';
            div.style.padding = '15px';
            div.style.border = '1px solid #ccc';
            div.style.borderRadius = '8px';

            let imageHtml = '';
            if (cours.image) {
                imageHtml = `<div style="margin-top: 10px;"><img src="${cours.image}" alt="Photo de la leçon" style="max-width: 100%; height: auto; border-radius: 5px;"></div>`;
            }

            div.innerHTML = `
                <h3>${cours.titre}</h3>
                <p>${cours.contenu.replace(/\n/g, '<br>')}</p>
                ${imageHtml}
                <small style="color: gray;">Ajouté le : ${new Date(cours.date).toLocaleDateString()}</small>
            `;
            listeCours.appendChild(div);
        });
    }

    // Afficher les cours au chargement
    afficherCours();

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const titreInput = document.querySelector('#titre');
            const contenuInput = document.querySelector('#contenu');
            const imageInput = document.querySelector('#imageLecon');

            if (!titreInput || !contenuInput) return;

            const titre = titreInput.value.trim();
            const contenu = contenuInput.value.trim();

            if (!titre || !contenu) {
                alert("Veuillez remplir le titre et le contenu.");
                return;
            }

            const sauvegarderLecon = (imageData = null) => {
                const nouvelleLecon = {
                    titre: titre,
                    contenu: contenu,
                    image: imageData, // Stocke la photo prise directement
                    date: new Date().toISOString()
                };

                let lecons = JSON.parse(localStorage.getItem('sama_cours_lecons')) || [];
                lecons.push(nouvelleLecon);
                localStorage.setItem('sama_cours_lecons', JSON.stringify(lecons));

                form.reset();
                alert('Leçon et photo enregistrées avec succès !');
                afficherCours();
            };

            // Vérifie si une photo a été prise ou sélectionnée
            if (imageInput && imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    sauvegarderLecon(e.target.result);
                };
                reader.onerror = function () {
                    sauvegarderLecon(null);
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                sauvegarderLecon(null);
            }
        });
    }
});