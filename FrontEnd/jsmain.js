const reponse = await fetch('http://localhost:5678/api/works');
const travaux = await reponse.json();

function genererTravaux(travaux) {
    for (let i = 0; i < travaux.length; i++) {
        const oeuvre = travaux[i];
        const divGalerie = document.querySelector(".gallery");
        const figureOeuvre = document.createElement("figure");
        const imageOeuvre = document.createElement("img");
        imageOeuvre.src = oeuvre.imageUrl;
        imageOeuvre.alt = oeuvre.title;
        const titreOeuvre = document.createElement("figcaption");
        titreOeuvre.innerText = oeuvre.title;
        divGalerie.appendChild(figureOeuvre);
        figureOeuvre.appendChild(imageOeuvre);
        figureOeuvre.appendChild(titreOeuvre);
    }
}

genererTravaux(travaux);

function afficherContenu() {
    const enfants = cadreAjoutPhoto.children;
    for (let i = 0; i < enfants.length; i++) {
        const enfant = enfants[i];
        enfant.style.display = 'flex';
    }
};

const filterAll = document.querySelector('#filter-all');
filterAll.addEventListener('click', function() {
    const noFiltered = travaux.filter(function(travail) {
        return travail.categoryId === 1 || travail.categoryId === 2 || travail.categoryId === 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(noFiltered);
});

const filterObjects = document.querySelector('#filter-objects');
filterObjects.addEventListener('click', function() {
    const objectsFiltered = travaux.filter(function(travail) {
        return travail.categoryId === 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(objectsFiltered);
});

const filterApt = document.querySelector('#filter-apt');
filterApt.addEventListener('click', function() {
    const aptFiltered = travaux.filter(function(travail) {
        return travail.categoryId === 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(aptFiltered);
});

const filterHR = document.querySelector('#filter-HR');
filterHR.addEventListener('click', function() {
    const HRFiltered = travaux.filter(function(travail) {
        return travail.categoryId === 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(HRFiltered);
});

const login = document.querySelector('#logButton');
login.addEventListener('click', function() {
    document.getElementById('introduction').style.display = 'none';
    document.getElementById('portfolio').style.display = 'none';
    document.getElementById('contact').style.display = 'none';
    document.getElementById('login').style.display = 'flex';
    document.getElementById('logButton').style.fontWeight = '700';
});

const formlog = document.querySelector('#formlog');

formlog.addEventListener('submit', async function(connexion) {
    connexion.preventDefault();

    const emailInput = document.querySelector('#logmail');
    const passwordInput = document.querySelector('#password');

    const email = emailInput.value;
    const password = passwordInput.value;
    const request = { email: email, password: password };

    const logtenta = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(request)
    });

    const response = await logtenta.json();
    let tokenrecu = '';

    if (response.token) {
        tokenrecu = response.token;
    } else {
        alert('Identifiant ou mot de passe incorrect');
    }

    window.localStorage.setItem("token", tokenrecu);
    window.location.reload();


});

function modeEdition() {
    const token = window.localStorage.getItem('token');
    if (token) {
        document.getElementById('introduction').style.display = 'flex';
        document.getElementById('portfolio').style.display = 'block';
        document.getElementById('contact').style.display = 'block';
        document.getElementById('login').style.display = 'none';
        document.getElementById('logButton').style.display = 'none';
        document.getElementById('logout').style.display = 'list-item';
        document.getElementById('filters').style.display = 'none';
        document.querySelector('.modifier').style.display = 'flex';
        document.getElementById('modifierProjets').style.display = 'flex';
        document.getElementById('portfolioTitle').style.marginLeft = '385px';
        document.getElementById('portfolioTitle').style.marginBottom = '100px';
        document.getElementById('edition').style.display = 'flex';
        document.querySelector('.gallery').innerHTML='';
        genererTravaux(travaux);
    }
}

modeEdition();
const clicModifier = document.getElementById('modifierProjets');
clicModifier.addEventListener('click', function() {
    const modale = document.getElementById('modale');

    modale.style.display = 'flex';

    function generermodale(travaux) {
        const modalePhotos = document.querySelector("#modalePhotos");
        modalePhotos.innerHTML = '';

        for (let i = 0; i < travaux.length; i++) {
            const oeuvre = travaux[i];

            const figurePhotos = document.createElement('figure');
            const modaleImg = document.createElement('img');
            const modaleEdit = document.createElement('p');
            const divIconeSupp = document.createElement('div');
            const modaleIconeSupp = document.createElement('i');
            modaleIconeSupp.classList.add('fas', 'fa-trash-alt');
            modaleImg.src = oeuvre.imageUrl;
            modaleImg.alt = oeuvre.title;
            modaleEdit.innerText = 'éditer';
            modaleIconeSupp.setAttribute('idphoto', oeuvre.id);
            modalePhotos.appendChild(figurePhotos);
            figurePhotos.appendChild(modaleImg);
            figurePhotos.appendChild(modaleEdit);
            figurePhotos.appendChild(divIconeSupp);
            divIconeSupp.appendChild(modaleIconeSupp);

            modaleIconeSupp.addEventListener('click', async function() {
                const photoId = event.target.getAttribute('idphoto');
                const token = window.localStorage.getItem('token');

                await fetch(`http://localhost:5678/api/works/${photoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const response = await fetch('http://localhost:5678/api/works');
                const travauxMisAJour = await response.json();
                document.querySelector(".gallery").innerHTML = "";
                genererTravaux(travauxMisAJour);
            });
        }
        const ajoutPhoto = document.getElementById('ajoutPhoto');
        ajoutPhoto.style.display = 'none';

        const modaleCroix = document.getElementById('croix');
        modaleCroix.addEventListener('click', function(fermer) {
            const ajoutPhoto = document.getElementById('ajoutPhoto');
            ajoutPhoto.style.display = 'none';
            const modaleContenu = document.getElementById('modaleContenu');
            modaleContenu.style.display = 'flex';
            modale.style.display='none';
            const cadreAjoutPhoto = document.getElementById('cadreAjoutPhoto');
            const imgCadre = cadreAjoutPhoto.querySelector('img');
            if (imgCadre) {
                cadreAjoutPhoto.removeChild(imgCadre);
        }});

        modale.addEventListener('click', function(fermer) {
            if (fermer.target === modale) {
                const ajoutPhoto = document.getElementById('ajoutPhoto');
                ajoutPhoto.style.display = 'none';
                const modaleContenu = document.getElementById('modaleContenu');
                modaleContenu.style.display = 'flex';
                modale.style.display='none';
                const cadreAjoutPhoto = document.getElementById('cadreAjoutPhoto');
                const imgCadre = cadreAjoutPhoto.querySelector('img');
                if (imgCadre) {
                    cadreAjoutPhoto.removeChild(imgCadre);
            }
    }});

        const modaleContenu = document.getElementById('modaleContenu');
        modaleContenu.addEventListener('click', function(fermer) {
            fermer.stopPropagation();
        });
    }
    modalePhotos.innerHTML = '';
    generermodale(travaux);

    const modaleAjouter = document.getElementById('modaleAjouter');
    modaleAjouter.addEventListener('click', function() {
        modaleContenu.style.display = 'none';
        ajoutPhoto.style.display = 'flex';
    });

    const photoSelect = document.getElementById('photoSelect');
    const cadreAjoutPhoto = document.getElementById('cadreAjoutPhoto');
    let selectedFile;

    photoSelect.addEventListener('change', (event) => {
        const file = event.target.files[0];
        selectedFile = file;

        function masquerContenu() {
            const enfants = cadreAjoutPhoto.children;
            for (let i = 0; i < enfants.length; i++) {
                const enfant = enfants[i];
                enfant.style.display = 'none';
            }
        }
        masquerContenu();

        const reader = new FileReader();

        reader.onload = function() {
            const imgCadre = document.createElement('img');
            imgCadre.src = reader.result;

            cadreAjoutPhoto.appendChild(imgCadre);
        };

        reader.readAsDataURL(file);
    });

    const divPhotoCategory = document.getElementById('divPhotoCategory');
    const photoCategory = document.getElementById('photoCategory');



    const ajoutValider = document.getElementById('ajoutValider');
    const photoTitle = document.getElementById('photoTitle');

    function boutonvert() {
        if (photoSelect.value && photoCategory.value !== "default" && photoTitle.value) {
            ajoutValider.style.backgroundColor = '#1D6154';
            ajoutValider.disabled = false;
        } else {
            ajoutValider.style.backgroundColor = '#A7A7A7';
        }
    }

    photoSelect.addEventListener('change', function() {
        boutonvert();
    });

    photoCategory.addEventListener('change', function() {
        boutonvert();
    });

    photoTitle.addEventListener('input', function() {
        boutonvert();
    });

    ajoutValider.addEventListener('click', async function() {
        var formDataPhoto = new FormData();

        formDataPhoto.append('image', selectedFile);
        formDataPhoto.append('title', photoTitle.value);
        formDataPhoto.append('category', photoCategory.value);

        const token = window.localStorage.getItem('token');

        await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataPhoto
        });

        const response = await fetch('http://localhost:5678/api/works');
        const travauxMisAJour = await response.json();
        document.querySelector(".gallery").innerHTML = "";
        genererTravaux(travauxMisAJour);

        modale.style.display = 'flex';
        modaleContenu.style.display = 'flex';
        ajoutPhoto.style.display = 'none';

    });
});

const croixAjout = document.getElementById('croixAjout');
croixAjout.addEventListener('click', function() {
    const ajoutPhoto = document.getElementById('ajoutPhoto');
    ajoutPhoto.style.display = 'none';
    const modaleContenu = document.getElementById('modaleContenu');
    modaleContenu.style.display = 'flex';
    modale.style.display='none';
    const cadreAjoutPhoto = document.getElementById('cadreAjoutPhoto');
    const imgCadre = cadreAjoutPhoto.querySelector('img');
    if (imgCadre) {
        cadreAjoutPhoto.removeChild(imgCadre);
}
photoCategory.selectedIndex = 0;
photoTitle.value = '';
        afficherContenu();
    boutonvert() ;
});

const backAjout = document.getElementById('backAjout');
backAjout.addEventListener('click', function() {
    const ajoutPhoto = document.getElementById('ajoutPhoto');
    ajoutPhoto.style.display = 'none';
    const modaleContenu = document.getElementById('modaleContenu');
    modaleContenu.style.display = 'flex';
    const cadreAjoutPhoto = document.getElementById('cadreAjoutPhoto');
    const imgCadre = cadreAjoutPhoto.querySelector('img');
    if (imgCadre) {
        cadreAjoutPhoto.removeChild(imgCadre);
    }
    photoCategory.selectedIndex = 0;
    photoTitle.value = '';
    afficherContenu();
    boutonvert();
});

const logout = document.getElementById('logout');
logout.addEventListener('click', function (){
    localStorage.removeItem('token');
    window.location.reload();
});


