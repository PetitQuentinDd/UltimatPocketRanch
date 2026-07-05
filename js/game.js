/* ==========================================================================
   IDLE POCKET RANCH - MOTEUR PRINCIPAL (game.js)
   ========================================================================== */

let gameState = { 
    money: 0, 
    fragments: 0,
    activeTeam: [], 
    reserve: [], 
    lastTick: Date.now(),
    starterChosen: false,
    pokedexUnlocked: [],
    inventory: [],
    pension: [null, null],
    activeEggIncubation: null
};

let multiReleaseMode = false;
let selectedForRelease = [];
let sellMode = false;
let selectedForSale = []; // Stocke les itemKey sélectionnés

function toggleSellMode() {
    sellMode = !sellMode;
    selectedForSale = []; // Reset si on quitte le mode
    updateInventoryUI();
}

function toggleItemSelection(itemKey) {
    if (!sellMode) return;
    
    // On ajoute ou on retire l'objet de la sélection
    if (selectedForSale.includes(itemKey)) {
        selectedForSale = selectedForSale.filter(k => k !== itemKey);
    } else {
        selectedForSale.push(itemKey);
    }
    updateInventoryUI(); // Rafraîchit pour voir les bordures
}

function confirmSale() {
    if (selectedForSale.length === 0) {
        notify("Aucun objet sélectionné !");
        return;
    }

    let totalGain = 0;
    selectedForSale.forEach(itemKey => {
        let invItem = gameState.inventory.find(i => i.itemKey === itemKey);
        if (invItem && invItem.quantity > 0) {
            let itemData = ITEMS_CONFIG[itemKey];
            totalGain += (itemData.price || 0);
            invItem.quantity--;
            if (invItem.quantity <= 0) gameState.inventory = gameState.inventory.filter(i => i.itemKey !== itemKey);
        }
    });

    gameState.money += totalGain;
    notify(`💰 Vente validée : +${totalGain} PO !`);
    
    selectedForSale = [];
    sellMode = false;
    saveGame();
    updateInventoryUI();
    if(typeof updateUI === "function") updateUI();
}

// --- RACCOURCI POUR LES NOTIFICATIONS ---
function notify(msg) {
    if (typeof showToast === "function") showToast(msg);
    else alert(msg);
}

// --- COURBE D'EXPÉRIENCE PROCÉDURALE ---
function getRequiredXP(level) {
    return 100 + ((level - 1) * 50);
}

// --- MOTEUR DE TEMPS (Gère le Hors Ligne & les Expéditions) ---
setInterval(performGameTick, 1000); 

function performGameTick() {
    const now = Date.now();
    if (!gameState.lastTick) gameState.lastTick = now;

    // 1. VÉRIFICATION DES EXPÉDITIONS
    let expeditionFinished = false;
    let finishedIdsByKey = {};
    gameState.activeTeam.forEach(p => {
        if (p.onExpedition && p.expeditionEnd && now >= p.expeditionEnd) {
            const key = p.explorationKey || 'foretBaies';
            if (!finishedIdsByKey[key]) finishedIdsByKey[key] = [];
            finishedIdsByKey[key].push(p.id);
        }
    });
    Object.keys(finishedIdsByKey).forEach(key => {
        finishExpedition(finishedIdsByKey[key], key);
        expeditionFinished = true;
    });

    // 2. GESTION DU TEMPS ET RESSENTI
    const elapsedMs = now - gameState.lastTick;
    const ticksToProcess = Math.floor(elapsedMs / 15000); 

    if (ticksToProcess > 0) {
        let totalIncome = 0;
        
        // Calcul du temps écoulé total en secondes
        const totalSecondsAdded = ticksToProcess * 15;
        const oldTotalSeconds = gameState.totalSeconds || 0;
        gameState.totalSeconds = oldTotalSeconds + totalSecondsAdded;

        // --- A. GESTION DE L'ÉQUIPE ACTIVE (Revenus, XP) ---
        gameState.activeTeam.forEach(m => {
            if (!m.onExpedition) {
                // Revenus et XP
                totalIncome += (calculateTickIncome(m) / 4) * ticksToProcess;
                m.xp += (25 * ticksToProcess); 
                
                // Niveau
                let xpNeeded = getRequiredXP(m.level);
                while (m.xp >= xpNeeded) {
                    m.xp -= xpNeeded;
                    m.level++;
                    xpNeeded = getRequiredXP(m.level);
                }
                
                // LE BONHEUR NE BAISSE PLUS DU TOUT ICI !
            }
        });

        // --- B. GESTION DE LA RÉSERVE (Régénération d'Énergie) ---
        // Le maximum d'énergie est 3. On veut que ça se remplisse en 1 heure (3600 secondes).
        const energieGagnee = 3 * (totalSecondsAdded / 3600);
        
        gameState.reserve.forEach(m => {
            // 1. Assurer que l'énergie est un nombre
    if (typeof m.energie !== 'number') m.energie = 0;
    
    // 2. Si le Pokémon a moins de 3 points
    if (m.energie < 3) {
        // On ajoute l'énergie uniquement pour le temps passé
        // 1 point toutes les 600s (10 min) = 0.00166 par seconde
        // Pour éviter les bugs, on fait l'addition très simplement :
        m.energie += (0.00166 * totalSecondsAdded);
        
        // 3. Plafond à 3
        if (m.energie > 3) m.energie = 3;
    }
        });

        // Garde uniquement le reste des secondes
        gameState.totalSeconds = gameState.totalSeconds % 300;
        gameState.money += totalIncome;
        
        // --- PROGRESSION DE L'INCUBATEUR ---
        if (gameState.activeEggIncubation && totalIncome > 0) {
            gameState.activeEggIncubation.progress += totalIncome;
        }

        gameState.lastTick += (ticksToProcess * 15000);
        
        saveGame();
        if (!expeditionFinished && typeof updateUI === "function") updateUI();
    }
}
// --- CALCUL DES REVENUS ---
function calculateTickIncome(m) {
    let income = m.incomePerMin + (m.level - 1);
    const multiBonheur = [0.5, 1.0, 1.5, 2.0];
    let indexBonheur = Math.max(0, Math.min(2, Math.floor(m.bonheur) - 1));
    income *= multiBonheur[indexBonheur];
    if (m.talent === "Productif") income *= 1.2;
    return Math.floor(income);
}

// --- SAUVEGARDE ET CHARGEMENT ---
function saveGame() {
    localStorage.setItem("idleRanchSaveV2", JSON.stringify(gameState));
}

function loadGame() {
    const oldSave = localStorage.getItem("pokemonBreeder_save");
    const newSave = localStorage.getItem("idleRanchSaveV2");

    if (oldSave && newSave === null) {
        gameState = migrateOldSave(JSON.parse(oldSave));
        localStorage.setItem("idleRanchSaveV2", JSON.stringify(gameState));
        return;
    } if (newSave !== null) {
        const dataV2 = localStorage.getItem("idleRanchSaveV2");
        gameState = JSON.parse(dataV2)
    } else {
        createNewGame();
    }
}

function createNewGame() {
    gameState = {
        money: 5000, 
        activeTeam: [], 
        reserve: [], 
        lastTick: Date.now(), 
        starterChosen: false, 
        pokedexUnlocked: [], 
        inventory: [],
        pension: [null, null],
        activeEggIncubation: null
    };
    saveGame();
    const starterModal = document.getElementById('starter-modal');
    if (starterModal && gameState.starterChosen === false) {
        starterModal.style.display = 'flex';
    }
}

function migrateOldSave(oldData) {
    let newData = oldData;
    newData.starterChosen = (newData.activeTeam.length > 0 || newData.reserve.length > 0);
    if (!newData.pokedexUnlocked) newData.pokedexUnlocked = [];
    if (!newData.inventory) newData.inventory = [];
    if (!newData.pension) newData.pension = [null, null];
    if (newData.activeEggIncubation === undefined) newData.activeEggIncubation = null;
    if (!newData.lastTick) newData.lastTick = Date.now();
    
    let tousLesPokemon = [...newData.activeTeam, ...newData.reserve];
    tousLesPokemon.forEach(p => {
        if (!newData.pokedexUnlocked.includes(p.name)) newData.pokedexUnlocked.push(p.name);
        if (p.xp === undefined) p.xp = 0;
        if (p.level === undefined) p.level = 1;
        if (p.talent === undefined) p.talent = TALENTS_DISPONIBLES[Math.floor(Math.random() * TALENTS_DISPONIBLES.length)];
        if (p.bonheur === undefined) p.bonheur = 2.0;
        if (p.energie === undefined) p.energie = 2.0;
    });
    return newData;
}

// --- GESTION DES POKÉMON ---
function chooseStarter(pokemonName) {
    const starters = {
        "Bulbizarre": { name: "Bulbizarre", type: "Plante", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif", incomePerMin: 5 },
        "Salamèche": { name: "Salamèche", type: "Feu", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/4.gif", incomePerMin: 5 },
        "Carapuce": { name: "Carapuce", type: "Eau", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/7.gif", incomePerMin: 5 }
    };

    const choice = starters[pokemonName];
    if (!choice) return;

    const newPokemon = {
        id: Date.now().toString(),
        name: choice.name,
        image: choice.image,
        incomePerMin: choice.incomePerMin,
        niveauRarete: "starter",
        energie: 3,
        bonheur: 1,
        level: 5,
        xp: 0,
        talent: "Leader",
        onExpedition: false
    };

    gameState.activeTeam.push(newPokemon);
    gameState.starterChosen = true;
    gameState.pokedexUnlocked.push(choice.name);
    gameState.lastTick = Date.now();

    document.getElementById('starter-modal').style.display = 'none';
    saveGame();
    if(typeof updateUI === "function") updateUI();
}

function switchZone(id, currentLocation) {
    if (multiReleaseMode && currentLocation === 'reserve') {
        toggleSelection(id);
        return; 
    }
    let pIndex;
    
    if (currentLocation === 'team') {
        pIndex = gameState.activeTeam.findIndex(p => p.id === id);
        if (pIndex > -1) {
            let p = gameState.activeTeam.splice(pIndex, 1)[0];
            if (p.onExpedition) {
                gameState.activeTeam.push(p); 
                notify("Ce Pokémon est en expédition !");
                return;
            }
            p.timestampStockage = Date.now();
            gameState.reserve.push(p);
        }
    } else {
        if (gameState.activeTeam.length >= 6) {
            notify("Ton équipe est pleine (Max 6) !");
            return;
        }
        pIndex = gameState.reserve.findIndex(p => p.id === id);
        if (pIndex > -1) {
            let p = gameState.reserve.splice(pIndex, 1)[0];
            delete p.timestampStockage;
            gameState.activeTeam.push(p);
        }
    }
    
    saveGame();
    if(typeof updateUI === "function") updateUI();
}

// --- ACHAT D'OEUFS (VERSION DATA-DRIVEN SÉCURISÉE) ---
function buyEgg(region) {
    console.log("Achat demandé pour la région :", region);

    const PRIX_REGION = { 
        "kanto": 2500, "johto": 5000, "hoenn": 10000, "sinnoh": 15000, 
    };
    
    const LISTES_REGION = {
        "kanto": typeof LISTE_KANTO !== 'undefined' ? LISTE_KANTO : null,
        "johto": typeof LISTE_HGSS !== 'undefined' ? LISTE_HGSS : null,
        "hoenn": typeof LISTE_ROSA !== 'undefined' ? LISTE_ROSA : null,
        "sinnoh": typeof LISTE_DBPE !== 'undefined' ? LISTE_DBPE : null
    };

    const regionKey = region ? region.toLowerCase() : "kanto";
    const cost = PRIX_REGION[regionKey] || 2500;
    const listeObj = LISTES_REGION[regionKey];

    if (!listeObj) {
        notify("Boutique fermée ou données introuvables pour : " + regionKey);
        console.error("Erreur : La liste pour", regionKey, "n'est pas chargée.");
        return;
    }

    if (gameState.money < cost) {
        notify(`Pas assez de PO ! Il te faut ${cost} PO.`);
        return;
    }

    let roll = Math.random() * 100;
    let rarete = "commun";
    if (roll > 99) rarete = "legendaire";
    else if (roll > 95) rarete = "tresRare";
    else if (roll > 85) rarete = "rare";
    else if (roll > 60) rarete = "peuCommun";

    let listePoke = listeObj[rarete];
    
    if (!listePoke || listePoke.length === 0) {
        rarete = "commun";
        listePoke = listeObj["commun"];
        if (!listePoke || listePoke.length === 0) {
            notify("Erreur critique : Aucun Pokémon dans la liste de cette région.");
            return;
        }
    }

    gameState.money -= cost;
    let nomPokemon = listePoke[Math.floor(Math.random() * listePoke.length)];
    
    let idPokedex = (typeof POKEDEX_IDS !== 'undefined' && POKEDEX_IDS[nomPokemon]) ? POKEDEX_IDS[nomPokemon] : 1;
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${idPokedex}.gif`;
    
    let revenus = (typeof REVENUS_RARETE !== 'undefined' && REVENUS_RARETE[rarete]) 
        ? REVENUS_RARETE[rarete] 
        : { min: 1, max: 10 };
    let revenuBase = Math.floor(Math.random() * (revenus.max - revenus.min + 1)) + revenus.min;
    
    let talentTire = (typeof TALENTS_DISPONIBLES !== 'undefined' && TALENTS_DISPONIBLES.length > 0) 
        ? TALENTS_DISPONIBLES[Math.floor(Math.random() * TALENTS_DISPONIBLES.length)] 
        : "Aucun talent";

    let newPokemon = {
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        name: nomPokemon,
        image: imageUrl,
        incomePerMin: revenuBase,
        niveauRarete: rarete,
        energie: 2.0,
        bonheur: 2.0,
        level: 1,
        xp: 0,
        talent: talentTire,
        onExpedition: false
    };

    gameState.reserve.push(newPokemon);
    
    let isNewToPokedex = false;
    if (!gameState.pokedexUnlocked.includes(nomPokemon)) {
        gameState.pokedexUnlocked.push(nomPokemon);
        isNewToPokedex = true;
    }

    saveGame();
    if(typeof updateUI === "function") updateUI();
    
    if(typeof showHatchPopup === "function") {
        showHatchPopup(newPokemon, isNewToPokedex);
    } else {
        notify(`🥚 Un magnifique ${nomPokemon} est sorti de l'œuf !`);
    }
}

function startExpedition(pokemonIds, explorationKey) {
    if (typeof EXPLORATIONS === 'undefined' || !EXPLORATIONS[explorationKey]) return;
    
    const exp = EXPLORATIONS[explorationKey];
    const endTime = Date.now() + exp.duration;

    // --- LE BLOC DOIT ÊTRE ICI, DANS LA FONCTION ---
    pokemonIds.forEach(id => {
        let p = gameState.activeTeam.find(p => p.id === id);
        if (p) {
            if (p.energie > 1) {
                p.energie = Math.max(0, p.energie - 1);
                p.onExpedition = true;
                p.expeditionEnd = endTime;
                p.explorationKey = explorationKey;
            } else {
                notify(`${p.name} est trop fatigué !`);
            }
        }
    });
    // ------------------------------------------------

    saveGame();
    if(typeof updateUI === "function") updateUI();
}
function finishExpedition(pokemonIds, explorationKey) {
    // 1. Mise à jour des Pokémon
    pokemonIds.forEach(id => {
        let p = gameState.activeTeam.find(p => p.id === id);
        if (p) {
            p.onExpedition = false;
            p.expeditionEnd = null;
            p.explorationKey = null;
            
            // L'expédition consomme de l'énergie (comme avant)
            p.energie = Math.max(0, p.energie - 1.0);
            
            // Le bonheur NE BOUGE PLUS (supprimé)
            
            // Gain d'XP
            p.xp += 50; 
            let xpNeeded = getRequiredXP(p.level);
            while (p.xp >= xpNeeded) { 
                p.xp -= xpNeeded;
                p.level++; 
                xpNeeded = getRequiredXP(p.level);
            }
        }
    });

    // 2. Gestion des récompenses avec sauvegarde du prix
    const expData = EXPLORATIONS[explorationKey];
    
    if (expData && expData.rewards && expData.rewards.length > 0) {
        pokemonIds.forEach(() => {
            const randomIndex = Math.floor(Math.random() * expData.rewards.length);
            const itemKey = expData.rewards[randomIndex];
            
            if (!itemKey) return;
            const itemData = ITEMS_CONFIG[itemKey]; // Récupère les infos de l'objet

            if (!gameState.inventory) gameState.inventory = [];
            
            let existingItem = gameState.inventory.find(i => i.itemKey === itemKey);
            
            if (existingItem) {
                existingItem.quantity += 1; 
            } else {
                // IMPORTANT : On ajoute le prix ici pour que ton sac l'affiche bien plus tard
                gameState.inventory.push({ 
                    itemKey: itemKey, 
                    quantity: 1,
                    price: itemData.price || 0 
                });
            }
            
            notify(`Expédition : +1 ${itemData.name} trouvé !`);
        });
    } else {
        notify("Expédition finie, mais aucun objet trouvé.");
    }
    
    saveGame();
    if(typeof updateUI === "function") updateUI();
}

function useItemOnPokemon(itemKey, pokemonId) {
    let target = gameState.activeTeam.find(p => p.id === pokemonId);
    if (!target) {
        notify("Ce Pokémon doit être dans le Ranch !");
        return;
    }

    const itemData = ITEMS_CONFIG[itemKey];

    if (itemData.type === "evolution") { 
        evolvePokemon(target, itemKey);
    } 
    else {
        let itemEntry = gameState.inventory.find(i => i.itemKey === itemKey);
        if (!itemEntry || itemEntry.quantity <= 0) return;
        
        if (itemData.effect === "bonheur") target.bonheur = Math.min(3, target.bonheur + itemData.value);
        if (itemData.effect === "energie") target.energie = Math.min(3, target.energie + itemData.value);

        itemEntry.quantity--;
        if (itemEntry.quantity <= 0) gameState.inventory = gameState.inventory.filter(i => i.itemKey !== itemKey);
        
        notify(`✨ ${target.name} a consommé : ${itemData.name} !`);
        saveGame();
        updateInventoryUI();
        if(typeof updateUI === "function") updateUI();
    }
}

function evolvePokemon(pokemon, itemKey = null) {
    if (typeof EVOLUTIONS === 'undefined' || !EVOLUTIONS[pokemon.name]) {
        notify("Ce Pokémon ne peut pas évoluer !");
        return;
    }

    const evoData = EVOLUTIONS[pokemon.name];
    const conditions = Array.isArray(evoData.condition) ? evoData.condition : [evoData.condition];
    const nextForms = Array.isArray(evoData.nextForm) ? evoData.nextForm : [evoData.nextForm];
    
    let index = -1;

    if (itemKey) {
        const itemNeeded = Array.isArray(evoData.itemNeeded) ? evoData.itemNeeded : [evoData.itemNeeded];
        index = itemNeeded.indexOf(itemKey);
    } else {
        index = conditions.indexOf("level");
        let reqLevel = Array.isArray(evoData.levelNeeded) ? (Array.isArray(evoData.levelNeeded) ? evoData.levelNeeded[index] : evoData.levelNeeded) : evoData.levelNeeded;
        if (index !== -1 && pokemon.level < reqLevel) index = -1;
    }

    if (index === -1) {
        let levelIdx = conditions.indexOf("level");
        if (levelIdx !== -1) {
            let needed = Array.isArray(evoData.levelNeeded) ? (Array.isArray(evoData.levelNeeded) ? evoData.levelNeeded[levelIdx] : evoData.levelNeeded) : evoData.levelNeeded;
            notify(`Niveau ${needed} requis pour évoluer ! (Actuel: ${pokemon.level})`);
        } else {
            notify("Conditions non remplies pour évoluer !");
        }
        return;
    }

    let oldName = pokemon.name;
    let nextName = nextForms[index];

    if (POKEDEX_IDS.hasOwnProperty(nextName)) {
        pokemon.name = nextName;
        pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${POKEDEX_IDS[nextName]}.gif`;
        if (!gameState.pokedexUnlocked.includes(pokemon.name)) gameState.pokedexUnlocked.push(pokemon.name);
        
        if (itemKey) {
            let itemEntry = gameState.inventory.find(i => i.itemKey === itemKey);
            if (itemEntry) {
                itemEntry.quantity--;
                if (itemEntry.quantity <= 0) gameState.inventory = gameState.inventory.filter(i => i.itemKey !== itemKey);
            }
        }
        saveGame();
        if (typeof updateUI === "function") updateUI();
        
        if (typeof showHatchPopup === "function") {
            showHatchPopup(pokemon, true);
            setTimeout(() => notify(`✨ ${oldName} a évolué en ${pokemon.name} !`), 1000);
        } else {
            alert(`✨ ${oldName} a évolué en ${pokemon.name} !`);
        }
    } else {
        console.error("Nom introuvable dans POKEDEX_IDS :", nextName);
        notify("Erreur : Impossible de trouver " + nextName);
    }
}

// --- SYSTÈME DE PENSION ---
let slotEnCoursDeSelection = null;

function gererClicPension(slotIndex) {
    if (gameState.pension && gameState.pension[slotIndex] !== null) {
        retirerDePension(slotIndex);
    } else {
        ouvrirSelectionPension(slotIndex);
    }
}

function ouvrirSelectionPension(slotIndex) {
    if (gameState.reserve.length === 0) {
        notify("Vous n'avez aucun Pokémon dans votre réserve à placer !");
        return;
    }

    slotEnCoursDeSelection = slotIndex;

    let ancienneModale = document.getElementById("pension-selection-modal");
    if (ancienneModale) ancienneModale.remove();

    let modal = document.createElement("div");
    modal.id = "pension-selection-modal";
    modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 3500; display: flex; justify-content: center; align-items: center; padding: 20px; box-sizing: border-box;";

    let content = document.createElement("div");
    content.style.cssText = "background: #1e293b; width: 100%; max-width: 340px; border-radius: 8px; border: 2px solid #e11d48; display: flex; flex-direction: column; max-height: 80vh;";

    content.innerHTML = `
        <div style="background: #0f172a; padding: 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;">
            <span style="font-weight: bold; color: white; font-size: 13px;">❤️ Placer un parent (Slot ${slotIndex + 1})</span>
            <button onclick="document.getElementById('pension-selection-modal').remove()" style="background: #ef4444; color: white; border: none; border-radius: 4px; width: 22px; height: 22px; font-weight: bold; cursor: pointer;">✕</button>
        </div>
        <div id="pension-choices-container" style="display: flex; flex-wrap: wrap; gap: 8px; padding: 12px; overflow-y: auto; background: #0b0f19; flex: 1;"></div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    let choicesContainer = document.getElementById("pension-choices-container");
    gameState.reserve.forEach((m, idx) => {
        let card = document.createElement("div");
        card.style.cssText = "background: #1a1f2c; border: 1px solid #4a5568; border-radius: 6px; padding: 6px; width: calc(33.33% - 6px); display: flex; flex-direction: column; align-items: center; cursor: pointer; text-align: center;";
        card.innerHTML = `
            <img src="${m.image}" style="width: 40px; height: 40px; object-fit: contain;">
            <div style="color: white; font-size: 9px; font-weight: bold; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">${m.name}</div>
            <div style="color: #94a3b8; font-size: 8px;">Lvl ${m.level}</div>
        `;
        card.onclick = () => validerChoixPension(idx);
        choicesContainer.appendChild(card);
    });
}

function validerChoixPension(reserveIndex) {
    let p = gameState.reserve[reserveIndex];
    if (!p || slotEnCoursDeSelection === null) return;

    gameState.pension[slotEnCoursDeSelection] = gameState.reserve.splice(reserveIndex, 1)[0];
    notify(`❤️ ${p.name} est placé au Slot ${slotEnCoursDeSelection + 1} !`);

    slotEnCoursDeSelection = null;
    let modal = document.getElementById("pension-selection-modal");
    if (modal) modal.remove();

    saveGame(); 
    if(typeof updateUI === "function") updateUI();
}

function retirerDePension(slotIndex) {
    if (gameState.activeEggIncubation) {
        notify("⚠️ Impossible de retirer un parent tant que l'incubation est en cours !");
        return;
    }

    let p = gameState.pension[slotIndex]; 
    if (!p) return;
    
    gameState.reserve.push(p); 
    gameState.pension[slotIndex] = null;
    notify(`🏡 ${p.name} retourne dans la réserve.`);
    
    saveGame(); 
    if(typeof updateUI === "function") updateUI();
}

function estCompatible(p1, p2) {
    const legendaires = ["Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", 
                         "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi",
                         "Regirock", "Regice", "Registeel", "Latias", "Latios", 
                         "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys"];
    if (legendaires.includes(p1.name) || legendaires.includes(p2.name)) return false;
    if (p1.name === "Métamorph" || p2.name === "Métamorph") return true;
    return p1.name === p2.name;
}

function lancerIncubation() {
    let p1 = gameState.pension[0];
    let p2 = gameState.pension[1];

    if (!p1 || !p2) { 
        notify("Il faut 2 Pokémon en pension !"); 
        return; 
    }
    if (!estCompatible(p1, p2)) { 
        notify("❌ Ces Pokémon ne sont pas compatibles ! (Même espèce requise, ou Métamorph. Légendaires exclus)."); 
        return; 
    }
    if (gameState.activeEggIncubation) { 
        notify("Une incubation est déjà en cours !"); 
        return; 
    }

    gameState.activeEggIncubation = { progress: 0 };
    notify("🧪 Incubation lancée ! Ton équipe doit maintenant récolter 50 000 PO pour le faire éclore.");
    
    saveGame(); 
    if(typeof updateUI === "function") updateUI();
}

function recupererOeuf() {
    if (!gameState.activeEggIncubation || gameState.activeEggIncubation.progress < 50000) {
        notify("L'œuf n'est pas encore prêt !");
        return;
    }

    let parent1 = gameState.pension[0];
    let parent2 = gameState.pension[1];
    let parentCible = (parent1.name === "Métamorph") ? parent2 : parent1;
    
    const eeveelutions = ["Aquali", "Pyroli", "Voltali", "Mentali", "Noctali", "Phyllali", "Givrali", "Nymphali"];
    let nomCible = eeveelutions.includes(parentCible.name) ? "Évoli" : parentCible.name; 

    let idPokedex = POKEDEX_IDS[nomCible] || 1;
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${idPokedex}.gif`;
    
    let talentTire = TALENTS_DISPONIBLES[Math.floor(Math.random() * TALENTS_DISPONIBLES.length)];

    let nouveauPokemon = {
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        name: nomCible,
        image: imageUrl,
        incomePerMin: Math.floor(parentCible.incomePerMin * (Math.random() * (1.2 - 0.8) + 0.8)), 
        niveauRarete: parentCible.niveauRarete,
        energie: 3,
        bonheur: 3,
        level: 1,
        xp: 0,
        talent: talentTire,
        onExpedition: false
    };

    gameState.reserve.push(nouveauPokemon);
    gameState.activeEggIncubation = null;
    
    if(typeof showHatchPopup === "function") showHatchPopup(nouveauPokemon, false);
    
    saveGame(); 
    if(typeof updateUI === "function") updateUI();
}

function rafraichirPensionVisuelle() {
    for (let i = 0; i < 2; i++) {
        let slotDiv = document.getElementById(`pension-slot-${i + 1}`);
        if (!slotDiv) continue;
        
        let parent = gameState.pension ? gameState.pension[i] : null;
        if (parent) {
            slotDiv.innerHTML = `<img src="${parent.image}" style="width: 100%; height: 100%; object-fit: contain;">`;
            slotDiv.style.borderStyle = "solid";
            slotDiv.style.borderColor = "#e11d48";
        } else {
            slotDiv.innerHTML = `<span style="color: #475569; font-size: 24px;">${i + 1}</span>`;
            slotDiv.style.borderStyle = "dashed";
            slotDiv.style.borderColor = "#475569";
        }
    }
}

// --- RÉINITIALISATION DU JEU ---
function hardResetGame() {
    if (confirm("🚨 ATTENTION ! Veux-tu vraiment effacer toute ta partie ? Tu vas perdre tous tes Pokémon et tes PO ! C'est irréversible.")) {
        localStorage.removeItem("idleRanchSaveV2");
        localStorage.removeItem("pokemonBreeder_save");
        location.reload(); 
    }
}

// --- DÉMARRAGE ---
document.addEventListener("DOMContentLoaded", () => {
    loadGame();
    performGameTick(); 
    if(typeof updateUI === "function") updateUI();
});

// --- LIBÉRATION MULTIPLE ---
function libererSelection(idsSelectionnes) {
    let totalFragments = 0;
    
    idsSelectionnes.forEach(id => {
        let index = gameState.reserve.findIndex(p => p.id === id);
        if (index > -1) {
            let p = gameState.reserve.splice(index, 1)[0];
            const gainsParRarete = { "commun": 5, "peuCommun": 10, "rare": 20, "tresRare": 50, "legendaire": 100 };
            totalFragments += (gainsParRarete[p.niveauRarete] || 5);
        }
    });

    gameState.fragments += totalFragments;
    notify(`✨ Tu as libéré des Pokémon et gagné ${totalFragments} fragments !`);
    
    saveGame();
    if (typeof updateUI === "function") updateUI();
}

function toggleSelection(pokemonId) {
    if (!multiReleaseMode) return;
    
    if (selectedForRelease.includes(pokemonId)) {
        selectedForRelease = selectedForRelease.filter(id => id !== pokemonId);
    } else {
        selectedForRelease.push(pokemonId);
    }
    updateUI();
}

function toggleMultiReleaseMode() {
    multiReleaseMode = !multiReleaseMode;
    selectedForRelease = [];
    
    const status = document.getElementById("release-status");
    const confirmBtn = document.getElementById("btn-confirm-release");
    
    if (status) {
        status.innerText = multiReleaseMode ? "ON" : "OFF";
        status.style.color = multiReleaseMode ? "#79eddf" : "#94a3b8"; 
    }
    
    if (confirmBtn) {
        confirmBtn.style.display = multiReleaseMode ? "inline-block" : "none";
    }
    
    if (typeof updateUI === "function") updateUI(); 
}

function confirmMultiRelease() {
    if (selectedForRelease.length === 0) {
        notify("Aucun Pokémon sélectionné !");
        toggleMultiReleaseMode();
        return;
    }

    // 1. On calcule le total exact de fragments selon la rareté avant de demander confirmation
    let totalFragments = 0;
    const gainsParRarete = { "commun": 1, "peuCommun": 5, "rare": 10, "tresRare": 50, "legendaire": 100 };

    gameState.reserve.forEach(m => {
        if (selectedForRelease.includes(m.id)) {
            totalFragments += (gainsParRarete[m.niveauRarete] || 5);
        }
    });

    // 2. On affiche le bon nombre de fragments dans le message de confirmation
    if (confirm(`🗑️ Relâcher ces ${selectedForRelease.length} Pokémon contre ${totalFragments} fragment(s) ?`)) {
        
        // 3. On retire les Pokémon sélectionnés de la réserve
        gameState.reserve = gameState.reserve.filter(m => !selectedForRelease.includes(m.id));
        
        // 4. SÉCURITÉ : On s'assure que gameState.fragments est bien un nombre (corrige le bug d'affichage)
        if (typeof gameState.fragments !== 'number' || isNaN(gameState.fragments)) {
            gameState.fragments = 0;
        }

        // 5. On ajoute l'argent
        gameState.fragments += totalFragments;
        
        // 6. On ferme proprement le mode de sélection
        selectedForRelease = [];
        multiReleaseMode = false;
        
        const status = document.getElementById("release-status");
        const confirmBtn = document.getElementById("btn-confirm-release");
        if (status) {
            status.innerText = "OFF";
            status.style.color = "#94a3b8";
        }
        if (confirmBtn) {
            confirmBtn.style.display = "none";
        }

        notify(`✨ Pokémon libérés ! Tu as gagné ${totalFragments} fragment(s).`);
        
        saveGame();
        if (typeof updateUI === "function") updateUI();
    }
}