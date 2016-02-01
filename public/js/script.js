function calculAge()
{
    naissance= new Date(document.getElementById('datenaissance').value);
    now = new Date();

    if (naissance.getYear() > now.getYear()) {
        document.getElementById('age').value = 0;
    }
    else {
        ageMs = now - naissance.getTime();
        ageDate = new Date(ageMs);
        document.getElementById('age').value = Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}

function validerMdp()
{
    var mdp1 = document.getElementById('mdp');
    var mdp2 = document.getElementById('mdpconfirm');
    var reg = "^[a-zA-Z0-9]{4,8}$";
    if (mdp1.value == mdp2.value) {
    // ici on supprime le message d'erreur personnalisé, et du coup mdp2 devient valide.
    document.getElementById('mdpconfirm').setCustomValidity('');
    } else {
    // ici on ajoute un message d'erreur personnalisé, et du coup mdp2 devient invalide.
    document.getElementById('mdpconfirm').setCustomValidity('Les mots de passes doivent être égaux.');
    }
}

function chargerPhotoProfil(){
    // on récupère le canvas où on affichera l'image
    var canvas = document.getElementById("preview");
    var ctx = canvas.getContext("2d");
    // on réinitialise le canvas: on l'efface, et déclare sa largeur et hauteur à 0
    ctx.setFillColor = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    canvas.width=0;
    canvas.height=0;
    // on récupérer le fichier: le premier (et seul dans ce cas là) de la liste
    var file = document.getElementById("profilepicfile").files[0];
    // l'élément img va servir à stocker l'image temporairement
    var img = document.createElement("img");
    // l'objet de type FileReader nous permet de lire les données du fichier.
    var reader = new FileReader();
    // on prépare la fonction callback qui sera appelée lorsque l'image sera chargée
    reader.onload = function(e) {
        //on vérifie qu'on a bien téléchargé une image, grâce au mime type
        if (!file.type.match(/image.*/)) {
            // le fichier choisi n'est pas une image: le champs profilepicfile est invalide, et on supprime sa valeur
            document.getElementById("profilepicfile").setCustomValidity("Il faut télécharger une image.");
            document.getElementById("profilepicfile").value = "";
        }
        else {
            // le callback sera appelé par la méthode getAsDataURL, donc le paramètre de callback e est une url qui contient
            // les données de l'image. On modifie donc la source de l'image pour qu'elle soit égale à cette url
            // on aurait fait différemment si on appelait une autre méthode que getAsDataURL.
            img.src = e.target.result;
            // le champs profilepicfile est valide
            document.getElementById("profilepicfile").setCustomValidity("");
            var MAX_WIDTH = 96;
            var MAX_HEIGHT = 96;
            var width = img.width;
            var height = img.height;
            var dH = 0;
            var dW = 0;

            if ((height >= MAX_HEIGHT) || (width >= MAX_WIDTH)) {
                // Si la largeur et la hauteur depassent la taille maximale
                if ((height >= MAX_HEIGHT) && (width >= MAX_WIDTH)) {
                    // On cherche la plus grande valeur
                    if (height > width) {
                        dH = MAX_HEIGHT;
                        // On recalcule la taille proportionnellement
                        dW = parseInt((width * dH) / height, 10);
                    } else {
                        dW = MAX_WIDTH;
                        // On recalcule la taille proportionnellement
                        dH = parseInt((height * dW) / width, 10);
                    }
                } else if ((height > MAX_HEIGHT) && (width < MAX_WIDTH)) {
                    // Si la hauteur depasse la taille maximale
                    dH = MAX_HEIGHT;
                    // On recalcule la taille proportionnellement
                    dW = parseInt((width * dH) / height, 10);
                } else if ((height < MAX_HEIGHT) && (width > MAX_WIDTH)) {
                    // Si la largeur depasse la taille maximale
                    dW = MAX_WIDTH;
                    // On recalcule la taille proportionnellement
                    dH = parseInt((height * dW) / width, 10);
                }
            }

            canvas.width = dW;
            canvas.height = dH;
            // on dessine l'image dans le canvas à la position 0,0 (en haut à gauche)
            // et avec une largeur de width et une hauteur de height
            ctx.drawImage(img, 0, 0, dW, dH);
            // on exporte le contenu du canvas (l'image redimensionnée) sous la forme d'une data url
            var dataurl = canvas.toDataURL("image/png");
            // on donne finalement cette dataurl comme valeur au champs profilepic
            document.getElementById("profilepic").value = dataurl;
        };
    }
    // on charge l'image pour de vrai, lorsque ce sera terminé le callback loadProfilePic sera appelé.
    reader.readAsDataURL(file);
}