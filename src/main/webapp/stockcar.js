console.log(config.urlBack)
var contexte;

function accueil() {
	document.getElementById('saisieRecherche').value  = ""
	cacherFormulaireCreation()
	afficherTableauListeVoitures(1)
}

function afficherTableauListeVoitures(mini) {
	contexte = "TOUS";
	if (!mini) {
		if(document.querySelector("#pages a.active")) {
			mini = (document.querySelector("#pages a.active").innerHTML - 1) * config.ligneParPage + 1;
		} else {
			mini = 1;
		}
	}
	fetch(config.urlBack+ "/voiture/get/all/"+mini+"/"+config.ligneParPage)
		  .then(function(res) {
		    if (res.ok) {
		      return res.json();
		    } else {
				afficherSnackbar('snackbar_erreur_api');
			}
		  })
		  .then(function(value) {
				genererTableauListeVoitures(value, mini);
				effacerFormulaire()
				cacherFormulaireCreation()
		  })
		  .catch(function(err) {
		    console.log("ERR")
		  });
}

function effacerFormulaire() {
	document.getElementById("marque").value = ""
	document.getElementById("modele").value = ""
	document.getElementById("finition").value = ""
	document.getElementById("carburant").value = ""
	document.getElementById("km").value = ""
	document.getElementById("annee").value = ""
	document.getElementById("prix").value = ""
}

function genererTableauListeVoitures(data, mini) {
	var liste = document.getElementById('listeVoitureTable');
	if (liste) {
		liste.remove()
	}
	
	var table = document.createElement('table')
	table.setAttribute("id", "listeVoitureTable");
	
	table.appendChild(genererEntetesListeVoitures())
	var root = document.getElementById('listeVoiture');
	
	ajouterContenuListeVoitures(table, data)
	root.appendChild(table);
	
	genererPagination(data.nbVoitures, calculerNbPages(mini));
}

function genererEntetesListeVoitures() {
	var head = document.createElement('thead')
	let titres = ['Marque', 'Modèle', 'Finition', 'Carburant', 'Kilométrage', 'Année', 'Prix', ' '];
	
	titres.forEach(function(item, index, array) {
		var cellule = document.createElement('td');
		cellule.innerHTML = item
		head.appendChild(cellule)
	});
	return head
}

function ajouterContenuListeVoitures(table, data) {
	try {
		console.log(data);
		console.log(data.voitures)
		var tbody = document.createElement('tbody');
		table.appendChild(tbody)
		data.voitures.every(function(item, index, array) {
			console.log("item => " + item);
			var voiture = JSON.parse(item);
			console.log(voiture)
			var ligne = document.createElement('tr');
			var cell = document.createElement('td')
		
			cell.innerHTML = voiture.marque
			ligne.appendChild(cell)
			
			cell = document.createElement('td')
			cell.innerHTML = voiture.modele
			ligne.appendChild(cell)
			
			cell = document.createElement('td')
			cell.innerHTML = voiture.finition
			ligne.appendChild(cell)
			
			cell = document.createElement('td')
			cell.innerHTML = voiture.carburant
			ligne.appendChild(cell)
			
			cell = document.createElement('td')
			cell.innerHTML = voiture.km
			ligne.appendChild(cell)
			
			cell = document.createElement('td')
			cell.innerHTML = voiture.annee
			ligne.appendChild(cell)
			
			cell = document.createElement('td')
			cell.innerHTML = voiture.prix + " €"
			ligne.appendChild(cell)
			
			cell = document.createElement('td')
			var lien = document.createElement('a')
			lien.setAttribute('href', '#')
			lien.setAttribute('onclick', 'afficherVoiture(' + voiture.id + ')')
			lien.innerHTML = 'Détails'
			cell.appendChild(lien)
			ligne.appendChild(cell)
			
			tbody.appendChild(ligne)
			if (index+1 == config.ligneParPage) {
				return false;
			}
			return true;
	});
	} catch (error) {
		console.error(error);
	}
}

function afficherVoiture(id) {
	contexte = "ID="+id
	fetch(config.urlBack+ "/voiture/get/"+id+"/1/1")
		  .then(function(res) {
		    if (res.ok) {
		      return res.json();
		    } else {
				afficherSnackbar('snackbar_erreur_api');
			}
		  })
		  .then(function(value) {
			  afficherBlocVoiture(value.voiture);
		  })
		  .catch(function(err) {
		    // Une erreur est survenue
		  });
}

function rechercher() {
	var saisie = document.getElementById('saisieRecherche').value;
	if (saisie == '') { saisie = 'all'}
	contexte = "RECHERCHE="+saisie
	fetch(config.urlBack+ "/voiture/get/"+saisie+"/1/"+config.ligneParPage)
		  .then(function(res) {
		    if (res.ok) {
		      return res.json();
		    }else {
				afficherSnackbar('snackbar_erreur_api');
			}
		  })
		  .then(function(value) {
				document.getElementById('listeVoitureTable').remove()
			  genererTableauListeVoitures(value);
		  })
		  .catch(function(err) {
		    // Une erreur est survenue
		  });
}

function dispatchContexte(mini) {
	if (contexte == "TOUS") {
		afficherTableauListeVoitures(mini);
	} else if (contexte.startsWith("ID")) {
		afficherVoiture(contexte.substring(contexte.indexOf("=")));
	} else if (contexte.startsWith("RECHERCHE")) {
		rechercher(contexte.substring(contexte.indexOf("=")));
	}
}

function paginer(active) {
	var mini = (active-1) * config.ligneParPage + 1;
	dispatchContexte(mini);
}
function ajouterVoiture() {
	var voiture = new Voiture();
	voiture.marque = document.getElementById("marque").value
	voiture.modele = document.getElementById("modele").value
	voiture.finition = document.getElementById("finition").value
	voiture.carburant = document.getElementById("carburant").value
	voiture.km = document.getElementById("km").value
	voiture.annee = document.getElementById("annee").value
	voiture.prix = document.getElementById("prix").value
	fetch(config.urlBack+ " + /voiture/add/", {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(voiture),
		})
		  .then(function(res) {
		    if (res.ok) {
		      return res.json();
		    }else {
				afficherSnackbar('snackbar_erreur_api');
			}
		  })
		  .then(function(value) {
			if(value.succes) {
			  	afficherSnackbar('snackbar_ajout');
				afficherTableauListeVoitures();
			}
			else {
				afficherSnackbar('snackbar_erreur');
			}
		  })
		  .catch(function(err) {
		    // Une erreur est survenue
		  });
}

function supprimerVoiture(id) {
	var voiture = new Voiture();
	voiture.id = id
	var json = JSON.stringify(voiture)
	fetch(config.urlBack+ "/voiture/del/", {
		  method: 'POST',
		  headers: {
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(id),
		})
		  .then(function(res) {
		    if (res.ok) {
		      return res.json();
		    }else {
				afficherSnackbar('snackbar_erreur_api');
			}
		  })
		  .then(function(value) {
			if(value.succes) {
			  	afficherSnackbar('snackbar_suppression');
				document.getElementById('contenuVoiture').remove();
				document.getElementById('divSupprimer').remove();
				afficherTableauListeVoitures();
			}
			else {
				afficherSnackbar('snackbar_erreur');
			}
		  })
		  .catch(function(err) {
		    // Une erreur est survenue
		  });
}


function afficherBlocVoiture(voiture) {
	var v = voiture[0]
	console.log(v)
	console.log(v.marque)

	var root = document.getElementById('infos');
	let labels = ['Marque : ', 'Modèle : ', 'Finition : ', 'Carburant : ', 'Kilométrage : ', 'Année : ', 'Prix : '];
	let elems = [];
	
	elems[0] = v.marque;
	elems[1] = v.modele;
	elems[2] = v.finition;
	var carb;
	switch (v.carburant.char) {
		case 'D' : carb = "Diesel"; break;
		case 'E' : carb = "Essence"; break;
		case 'H' : carb = "Hybride"; break;
		default : carb = "Autre"; break;
	}
	elems[3] = carb
	elems[4] = v.km;
	elems[5] = v.annee;
	elems[6] = v.prix;
	var bloc = document.createElement('div');
	bloc.setAttribute('id', 'contenuVoiture')
	
	labels.forEach(function(item, index, array) {
		var label = document.createElement('label');
		label.innerHTML = item
		bloc.appendChild(label)
		
		var span = document.createElement('span');
		span.classList.add("infoVoiture");
		span.innerHTML = elems[index]
		bloc.appendChild(span)
		bloc.appendChild(document.createElement('br'))
	});
	
	var contenuVoiture = document.getElementById('contenuVoiture');
	if (contenuVoiture) {
		contenuVoiture.remove()
	}
	var blocSupprimer = document.getElementById('divSupprimer');
	if (blocSupprimer) {
		blocSupprimer.remove()
	}
	root.appendChild(bloc)
	var divBouton = document.createElement('div');
	divBouton.setAttribute('id', 'divSupprimer')
	var bouton = document.createElement('button');
	bouton.innerHTML = 'Supprimer'
	bouton.setAttribute('onclick', 'supprimerVoiture('+v.id+')')
	divBouton.appendChild(bouton)
	root.appendChild(divBouton)
}

function afficherFormulaireCreation() {
	document.getElementById('nouvelle').style.display = "block";
	
	document.getElementById('fiche').style.display = "none";
	document.getElementById('recherche').style.display = "none";
}

function cacherFormulaireCreation() {
	document.getElementById('nouvelle').style.display = "none";
	
	document.getElementById('fiche').style.display = "block";
	document.getElementById('recherche').style.display = "block";
}

function afficherSnackbar(id) {
  var snackbar = document.getElementById(id);

  snackbar.classList.add("show");


  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 3000);
}

function genererPagination(nbLignes, active) {
	var nbPages = calculerNbPages(nbLignes);
	
	var pages = document.querySelector("div#pages");
	if(pages) {
		pages.remove();
	}
	var root = document.querySelector("div.pagination");
	var divPages = document.createElement("div");
	divPages.setAttribute('id', 'pages');
	for (let i = 0; i < nbPages; i++) {
		var lien = document.createElement('a');
		lien.setAttribute('href', '#');
		lien.setAttribute('onclick', 'paginer('+(i+1) + ')');
		lien.setAttribute('value', (i+1));
		lien.innerHTML = (i+1);
		divPages.appendChild(lien);
	}
	var previous = document.querySelector("div.pagination a.previous");
	var next_sib = previous.nextSibling;
	if (next_sib) {
  		root.insertBefore(divPages, next_sib);
	}
	else {
		root.appendChild(divPages);
	}
	selectionnerPage(active, nbLignes);
}

function calculerNbPages(nbLignes) {
	var nbPage = Math.trunc(nbLignes / config.ligneParPage);
	if(nbLignes % config.ligneParPage != 0) {
		nbPage = nbPage + 1;
	}
	return nbPage;
}

function selectionnerPage(numeroPage, nbLignes) {
	var pages = document.querySelectorAll("div.pagination div#pages a");
	var nbPages = pages.length;
	pages.forEach(function(item, index, array) {
		item.classList.remove('active');
	});
	document.querySelector("div#pages a[value='" + numeroPage + "']").classList.add('active');
	if(numeroPage == 1) {
		document.querySelector("div.pagination a.previous").classList.add('disabled');
		document.querySelector("div.pagination a.previous").removeAttribute('href');
	}
	else if (nbPages > 1) {
		document.querySelector("div.pagination a.previous").classList.remove('disabled');
		document.querySelector("div.pagination a.previous").setAttribute('href', '#');
		document.querySelector("div.pagination a.previous").setAttribute('onclick', 'paginer('+(numeroPage-1)+')');
	}
	if (numeroPage < nbPages) {
		document.querySelector("div.pagination a.next").classList.remove('disabled');
		document.querySelector("div.pagination a.next").setAttribute('href', '#');
		document.querySelector("div.pagination a.next").setAttribute('onclick', 'paginer('+(numeroPage+1)+')');
	}
	else if (numeroPage == nbPages) {
		document.querySelector("div.pagination a.next").classList.add('disabled');
		document.querySelector("div.pagination a.next").removeAttribute('href');
	}
}

class Voiture {
  constructor(id, marque, modele, finition, carburant, km, annee, prix) {
    this.id = id;
    this.marque = marque;
	this.modele = modele;
	this.finition = finition;
	this.carburant = carburant;
	this.km = km;
	this.annee = annee;
	this.prix = prix;
  }
}
