/* ==========================================================================
   IDLE POCKET RANCH - MOTEUR PRINCIPAL (game.js)
   ========================================================================== */

let gameState = { 
    money: 0, 
    activeTeam: [], 
    reserve: [], 
    lastTick: Date.now(),
    starterChosen: false,
    pokedexUnlocked: [],
    inventory: [],
    pension: [null, null],
    activeEggIncubation: null
};

// --- RACCOURCI POUR LES NOTIFICATIONS ---
function notify(msg) {
    if (typeof showToast === "function") showToast(msg);
    else alert(msg);
}

// --- COURBE D'EXPÉRIENCE PROCÉDURALE ---
function getRequiredXP(level) {
    return 100 + ((level - 1) * 50); // Ex: Nv.1=100, Nv.2=150, Nv.3=200...
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

        // Calcul du nombre de cycles de 5 min (300s) passés
        // Si on est passé de 280s à 310s, on a passé 1 cycle.
        // Si on est passé de 280s à 620s, on a passé 2 cycles.
        const cyclesPassed = Math.floor(gameState.totalSeconds / 300);

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

                // --- GESTION BONHEUR ---
                // On perd 1 point de bonheur par cycle de 300s écoulé
                if (cyclesPassed > 0) {
                    m.bonheur = Math.max(0, m.bonheur - (1.0 * cyclesPassed));
                }
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
        // localStorage.removeItem("pokemonBreeder_save");
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
        energie: 3.0,
        bonheur: 3.0,
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
    let pIndex;
    
    if (currentLocation === 'team') {
        // --- DÉPLACEMENT VERS LA RÉSERVE ---
        pIndex = gameState.activeTeam.findIndex(p => p.id === id);
        if (pIndex > -1) {
            let p = gameState.activeTeam.splice(pIndex, 1)[0];
            
            if (p.onExpedition) {
                // On remet le pokémon dans la team si l'expédition empêche le mouvement
                gameState.activeTeam.push(p); 
                notify("Ce Pokémon est en expédition !");
                return;
            }
            
            // On marque l'heure d'arrivée dans le stockage
            p.timestampStockage = Date.now();
            gameState.reserve.push(p);
        }
    } else {
        // --- DÉPLACEMENT VERS L'ÉQUIPE ---
        if (gameState.activeTeam.length >= 6) {
            notify("Ton équipe est pleine (Max 6) !");
            return;
        }
        
        pIndex = gameState.reserve.findIndex(p => p.id === id);
        if (pIndex > -1) {
            let p = gameState.reserve.splice(pIndex, 1)[0];
            
            // On supprime le timestamp car il quitte le stockage
            delete p.timestampStockage;
            
            gameState.activeTeam.push(p);
        }
    }
    
    saveGame();
    if(typeof updateUI === "function") updateUI();
}

// --- ACHAT D'OEUFS ---
function buyEgg(region) {
    // 1. Vérification des prix et de l'argent
    const prixRegion = { "kanto": 250, "johto": 500, "hoenn": 1000, "sinnoh": 1500, "unys": 2000 };
    let cost = prixRegion[region] || 5000;


    console.log("Tentative d'achat :", region, "| Coût :", cost, "| Argent :", gameState.money);

    if (gameState.money < cost) {
        notify("Pas assez de PO !");
        return;
    }
    
    // 2. Sélection de la liste de Pokémon
    let listeObj;
    if (region === "johto") {
        listeObj = (typeof LISTE_HGSS !== 'undefined') ? LISTE_HGSS : null;
    } else {
        listeObj = (typeof LISTE_KANTO !== 'undefined') ? LISTE_KANTO : null;
    }

    if (!listeObj) {
        notify("Erreur : Les données de la région sont introuvables.");
        console.error("Liste non trouvée pour la région :", region);
        return;
    }

    // 3. Calcul de rareté
    let roll = Math.random() * 100;
    let rarete = "commun";
    if (roll > 99) rarete = "legendaire";
    else if (roll > 95) rarete = "tresRare";
    else if (roll > 85) rarete = "rare";
    else if (roll > 60) rarete = "peuCommun";

    let listePoke = listeObj[rarete];
    if (!listePoke || listePoke.length === 0) {
        notify("Erreur : Aucun Pokémon trouvé pour cette rareté.");
        return;
    }

    // 4. Achat et génération
    gameState.money -= cost;
    let nomPokemon = listePoke[Math.floor(Math.random() * listePoke.length)];
    
    let idPokedex = POKEDEX_IDS[nomPokemon] || 1;
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${idPokedex}.gif`;
    
    let minPO = REVENUS_RARETE[rarete].min;
    let maxPO = REVENUS_RARETE[rarete].max;
    let revenuBase = Math.floor(Math.random() * (maxPO - minPO + 1)) + minPO;
    let talentTire = TALENTS_DISPONIBLES[Math.floor(Math.random() * TALENTS_DISPONIBLES.length)];

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
    
    if(typeof showHatchPopup === "function") showHatchPopup(newPokemon, isNewToPokedex);
}

// --- EXPÉDITIONS CORRIGÉES ---
function startExpedition(pokemonIds, explorationKey) {
    if (typeof EXPLORATIONS === 'undefined' || !EXPLORATIONS[explorationKey]) return;
    
    const exp = EXPLORATIONS[explorationKey];
    const endTime = Date.now() + exp.duration;

    pokemonIds.forEach(id => {
        let p = gameState.activeTeam.find(p => p.id === id);
        if (p) {
            // --- NOUVEAU : Perte d'énergie de 1/3 ---
            if (p.energie >= 1.0) {
                p.energie = Math.max(0, p.energie - 1.0);
                p.onExpedition = true;
                p.expeditionEnd = endTime;
                p.explorationKey = explorationKey;
            } else {
                notify(`${p.name} n'a pas assez d'énergie !`);
            }
        }
    });

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
            
            p.energie = Math.max(0, p.energie - 1.0);
            p.bonheur = Math.max(0, p.bonheur - 1.0);
            
            p.xp += 50; 
            let xpNeeded = getRequiredXP(p.level);
            while (p.xp >= xpNeeded) { 
                p.xp -= xpNeeded;
                p.level++; 
                xpNeeded = getRequiredXP(p.level);
            }
        }
    });

    // 2. Gestion des récompenses aléatoires (Correction ici)
    const expData = EXPLORATIONS[explorationKey];
    
    // On vérifie si la zone possède bien une liste "rewards"
    if (expData && expData.rewards && expData.rewards.length > 0) {
        
        pokemonIds.forEach(() => {
            // On tire un objet aléatoire dans le tableau "rewards"
            const randomIndex = Math.floor(Math.random() * expData.rewards.length);
            const itemKey = expData.rewards[randomIndex];
            
            if (!itemKey) return; // Sécurité

            if (!gameState.inventory) gameState.inventory = [];
            
            let existingItem = gameState.inventory.find(i => i.itemKey === itemKey);
            
            if (existingItem) {
                existingItem.quantity += 1; 
            } else {
                gameState.inventory.push({ itemKey: itemKey, quantity: 1 });
            }
            
            notify(`Expédition : +1 ${itemKey} trouvé !`);
        });
        
    } else {
        // Fallback si jamais la zone est mal configurée
        notify("Expédition finie, mais aucun objet trouvé.");
    }
    
    saveGame();
    if(typeof updateUI === "function") updateUI();
}

// --- GESTION DES OBJETS ---
function useItemOnPokemon(itemKey, pokemonId) {
    let itemEntry = gameState.inventory.find(i => i.itemKey === itemKey);
    if (!itemEntry || itemEntry.quantity <= 0) return;

    let target = gameState.activeTeam.find(p => p.id === pokemonId);
    
    if (!target) {
        notify("Ce Pokémon doit être dans le Ranch pour recevoir un objet !");
        return;
    }

    const itemData = ITEMS_CONFIG[itemKey];
    if (itemData.effect === "bonheur") target.bonheur = Math.min(3, target.bonheur + itemData.value);
    if (itemData.effect === "energie") target.energie = Math.min(3, target.energie + itemData.value);

    itemEntry.quantity--;
    if (itemEntry.quantity <= 0) {
        gameState.inventory = gameState.inventory.filter(i => i.itemKey !== itemKey);
    }
    
    notify(`✨ ${target.name} a consommé : ${itemData.name} !`);
    
    saveGame();
    if(typeof updateUI === "function") updateUI();
    if(typeof updateInventoryUI === "function") updateInventoryUI();
}

// --- SYSTÈME D'ÉVOLUTION ---
function evolvePokemon(pokemon) {
    if (typeof EVOLUTIONS === 'undefined' || !EVOLUTIONS[pokemon.name]) {
        notify("Ce Pokémon ne peut pas évoluer !");
        return;
    }

    const evoData = EVOLUTIONS[pokemon.name];

    if (evoData.condition === "item" || (Array.isArray(evoData.condition) && evoData.condition.includes("item"))) {
        notify("Ce Pokémon évolue avec un objet ! Utilise-le depuis ton Sac.");
        return;
    }

    if (evoData.condition === "level" || (Array.isArray(evoData.condition) && evoData.condition.includes("level"))) {
        
        let isReady = false;
        let targetForm = "";

        if (Array.isArray(evoData.nextForm)) {
            targetForm = evoData.nextForm[Math.floor(Math.random() * evoData.nextForm.length)];
            let reqLevel = Array.isArray(evoData.levelNeeded) ? evoData.levelNeeded[0] : evoData.levelNeeded;
            if (pokemon.level >= reqLevel) isReady = true;
        } else {
            targetForm = evoData.nextForm;
            if (pokemon.level >= evoData.levelNeeded) isReady = true;
        }

        if (isReady) {
            let oldName = pokemon.name;
            pokemon.name = targetForm;
            
            let newId = POKEDEX_IDS[pokemon.name] || 1;
            pokemon.image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${newId}.gif`;

            let isNewToPokedex = false;
            if (!gameState.pokedexUnlocked.includes(pokemon.name)) {
                gameState.pokedexUnlocked.push(pokemon.name);
                isNewToPokedex = true;
            }

            saveGame();
            if(typeof updateUI === "function") updateUI();
            
            if(typeof showHatchPopup === "function") {
                showHatchPopup(pokemon, isNewToPokedex);
                setTimeout(() => {
                    notify(`✨ ${oldName} a évolué en ${pokemon.name} !`);
                }, 1000);
            } else {
                alert(`✨ Ton Pokémon a évolué en ${pokemon.name} !`);
            }
        } else {
            let needed = Array.isArray(evoData.levelNeeded) ? evoData.levelNeeded[0] : evoData.levelNeeded;
            notify(`Niveau ${needed} requis pour évoluer ! (Actuel: ${pokemon.level})`);
        }
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

    // On lance directement l'incubation à 0, sans retirer de PO !
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
    
    // Évolutions d'Évoli
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
        energie: 3.0,
        bonheur: 3.0,
        level: 1,
        xp: 0,
        talent: talentTire,
        onExpedition: false
    };

    gameState.reserve.push(nouveauPokemon);
    gameState.activeEggIncubation = null; // On vide l'incubateur
    
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
