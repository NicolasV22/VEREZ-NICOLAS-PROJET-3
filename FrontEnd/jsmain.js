/* Fonction de génération des travaux sur la page d'accueil via l'API */

const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();

const divGalerie = document.querySelector(".gallery");
function genererTravaux(travaux) {
    for (let i = 0; i < travaux.length; i++) {
        const oeuvre = travaux[i];
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

/* Filtres de la page d'accueil */

const filterAll = document.querySelector("#filter-all");
filterAll.addEventListener("click", function () {
    const noFiltered = travaux.filter(function (travail) {
        return (
            travail.categoryId === 1 ||
            travail.categoryId === 2 ||
            travail.categoryId === 3
        );
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(noFiltered);
});

const filterObjects = document.querySelector("#filter-objects");
filterObjects.addEventListener("click", function () {
    const objectsFiltered = travaux.filter(function (travail) {
        return travail.categoryId === 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(objectsFiltered);
});

const filterApt = document.querySelector("#filter-apt");
filterApt.addEventListener("click", function () {
    const aptFiltered = travaux.filter(function (travail) {
        return travail.categoryId === 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(aptFiltered);
});

const filterHR = document.querySelector("#filter-HR");
filterHR.addEventListener("click", function () {
    const HRFiltered = travaux.filter(function (travail) {
        return travail.categoryId === 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(HRFiltered);
});

/* JS connexion : ouverture de la page de connexion + formulaire */

const login = document.querySelector("#logButton");
login.addEventListener("click", function () {
    document.getElementById("introduction").style.display = "none";
    document.getElementById("portfolio").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("login").style.display = "flex";
    document.getElementById("logButton").style.fontWeight = "700";
});

const formlog = document.querySelector("#formlog");

formlog.addEventListener("submit", async function (connexion) {
    connexion.preventDefault();

    const emailInput = document.querySelector("#logmail");
    const passwordInput = document.querySelector("#password");

    const email = emailInput.value;
    const password = passwordInput.value;
    const request = { email: email, password: password };

    const logtenta = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(request),
    });

    const response = await logtenta.json();
    let tokenrecu = "";

    if (response.token) {
        tokenrecu = response.token;
    } else {
        alert("Identifiant ou mot de passe incorrect");
    }

    window.localStorage.setItem("token", tokenrecu);
    window.location.reload();
});

/* Récupération du token + activation mode admin si présence de token (modeEdition) */

const token = window.localStorage.getItem("token");
function modeEdition() {
    if (token) {
        document.getElementById("introduction").style.display = "flex";
        document.getElementById("portfolio").style.display = "block";
        document.getElementById("contact").style.display = "block";
        document.getElementById("login").style.display = "none";
        document.getElementById("logButton").style.display = "none";
        document.getElementById("logout").style.display = "list-item";
        document.getElementById("filters").style.display = "none";
        document.querySelector(".modifier").style.display = "flex";
        document.getElementById("modifierProjets").style.display = "flex";
        document.getElementById("portfolioTitle").style.marginLeft = "385px";
        document.getElementById("portfolioTitle").style.marginBottom = "100px";
        document.getElementById("edition").style.display = "flex";
        document.querySelector(".gallery").innerHTML = "";
        genererTravaux(travaux);
    }
}

modeEdition();

/*  Création de la modale */

function genererModale(travaux) {
    const modalePhotos = document.querySelector("#modalePhotos");
    modalePhotos.innerHTML = "";

    for (let i = 0; i < travaux.length; i++) {
        const oeuvre = travaux[i];
        const figurePhotos = document.createElement("figure");
        const modaleImg = document.createElement("img");
        const modaleEdit = document.createElement("p");
        const divIconeSupp = document.createElement("div");
        const modaleIconeSupp = document.createElement("i");
        modaleIconeSupp.classList.add("fas", "fa-trash-alt");
        modaleImg.src = oeuvre.imageUrl;
        modaleImg.alt = oeuvre.title;
        modaleEdit.innerText = "éditer";
        modaleIconeSupp.setAttribute("idphoto", oeuvre.id);
        modalePhotos.appendChild(figurePhotos);
        figurePhotos.appendChild(modaleImg);
        figurePhotos.appendChild(modaleEdit);
        figurePhotos.appendChild(divIconeSupp);
        divIconeSupp.appendChild(modaleIconeSupp);

        /* Fonction de suppression de photos et actualisation dans la modale et la page d'accueil */

        modaleIconeSupp.addEventListener("click", async function () {
            const photoId = event.target.getAttribute("idphoto");
            await fetch(`http://localhost:5678/api/works/${photoId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const maj = await fetch("http://localhost:5678/api/works");
            const travauxMaj = await maj.json();
            document.querySelector(".gallery").innerHTML = "";
            genererTravaux(travauxMaj);
            modalePhotos.innerHTML = "";
            genererModale(travauxMaj);
        });
    }
}





/*Apparition de la modale */

const clicModifier = document.getElementById("modifierProjets");

clicModifier.addEventListener("click", function () {
    const modale = document.getElementById("modale");

    modale.style.display = "flex";

    genererModale(travaux);
});


/* Ouverture de la modale Ajout de Photo */
const modaleAjouter = document.getElementById("modaleAjouter");
const cadreAjoutPhoto = document.getElementById("cadreAjoutPhoto");
const modaleContenu = document.getElementById("modaleContenu");
const ajoutPhoto = document.getElementById("ajoutPhoto");
let selectedFile;

modaleAjouter.addEventListener("click", function () {
    const ajoutValider = document.getElementById("ajoutValider");


    ajoutValider.style.backgroundColor = ""; 
    ajoutValider.disabled = true;
    modaleContenu.style.display = "none";
    ajoutPhoto.style.display = "flex";
    cadreAjoutPhoto.innerHTML = `<i class="far fa-image"></i>
	<label for="photoSelect" id="labelPhotoSelect">
		+ Ajouter photo
		<input type="file" id="photoSelect"> 
	</label>
	<p>jpg, png : 4mo max</p>`;



selectedFile='';
const photoCategory = document.getElementById("photoCategory");
const photoTitle = document.getElementById("photoTitle");
photoCategory.selectedIndex = 0;
photoTitle.value = '';


    /* Prévisualisation de l'image que l'on souhaite upload */


    const photoSelect = document.getElementById("photoSelect");
    photoSelect.value='';


    photoSelect.addEventListener("change", (event) => {
        cadreAjoutPhoto.innerHTML = "";
        const file = event.target.files[0];
        selectedFile = file;

        const reader = new FileReader();

        reader.onload = function () {
            const imgCadre = document.createElement("img");
            imgCadre.src = reader.result;

            cadreAjoutPhoto.appendChild(imgCadre);
        };

        reader.readAsDataURL(file);



        /* Bouton vert si les 3 input sont complétés */




        function boutonvert() {
            if (
                selectedFile !== '' &&
                photoCategory.value !== "default" &&
                photoTitle.value
            ) {
                ajoutValider.style.backgroundColor = "#1D6154";
                ajoutValider.disabled = false;
            } else {
                ajoutValider.style.backgroundColor = ""; 
                ajoutValider.disabled = true;
            }
        };

    
        photoCategory.addEventListener('change', function() {
            boutonvert();
        });
    
        photoTitle.addEventListener('input', function() {
            boutonvert();
        });

        boutonvert();
    });
});

const photoCategory = document.getElementById("photoCategory");
const photoTitle = document.getElementById("photoTitle");
const photoSelect = document.getElementById("photoSelect");
const ajoutValider = document.getElementById("ajoutValider");
const modale = document.getElementById("modale");


/* Requête API ajout de photo */

ajoutValider.addEventListener("click", async function () {
    var formDataPhoto = new FormData();

    formDataPhoto.append("image", selectedFile);
    formDataPhoto.append("title", photoTitle.value);
    formDataPhoto.append("category", photoCategory.value);

    const token = window.localStorage.getItem("token");

    await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formDataPhoto,
    });

    const retourUpload = await fetch("http://localhost:5678/api/works");
    const travauxUpload = await retourUpload.json();
    document.querySelector(".gallery").innerHTML = "";
    genererTravaux(travauxUpload);
    modalePhotos.innerHTML = "";
    genererModale(travauxUpload);

    modale.style.display = "flex";
    modaleContenu.style.display = "flex";
    ajoutPhoto.style.display = "none";
});

/* Fermeture de la modale au clic sur la croix dans la catégorie Galerie Photo ou zone grise background d*/

const modaleCroix = document.getElementById("croix");




modaleCroix.addEventListener("click", function (fermer) {
    ajoutPhoto.style.display = "none";
    modaleContenu.style.display = "flex";
    modale.style.display = "none";
    cadreAjoutPhoto.innerHTML='';
});

modale.addEventListener("click", function (fermer) {
    if (fermer.target === modale) {
        ajoutPhoto.style.display = "none";
        modaleContenu.style.display = "flex";
        modale.style.display = "none";
        cadreAjoutPhoto.innerHTML='';
    }
});

modaleContenu.addEventListener("click", function (fermer) {
    fermer.stopPropagation();
});




/* Fermeture de la modale ou retour en arrière dans la zone d'ajout photo */


const croixAjout = document.getElementById('croixAjout');
croixAjout.addEventListener('click', function() {
    ajoutPhoto.style.display = 'none';
    modaleContenu.style.display = 'flex';
    modale.style.display='none';
    cadreAjoutPhoto.innerHTML='';
});

const backAjout = document.getElementById('backAjout');
backAjout.addEventListener('click', function() {
    ajoutPhoto.style.display = 'none';
    modaleContenu.style.display = 'flex';
    cadreAjoutPhoto.innerHTML='';
});



/* Déconnexion */
const logout = document.getElementById("logout");
logout.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.reload();
});


/* Actualisation de la page au clic sur le logo du site */

const logoSite = document.getElementById('logoSite');
logoSite.addEventListener("click", function (){
    window.location.reload();
});