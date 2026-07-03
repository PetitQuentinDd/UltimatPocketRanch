/* ==========================================================================
   IDLE POCKET RANCH - INTERFACE ET AFFICHAGE (ui.js)
   ========================================================================== */

function updateUI() {
    // 1. Mise à jour de l'argent
    const moneyEl = document.getElementById('money');
    if (moneyEl) {
        moneyEl.innerText = Math.floor(gameState.money);
    }

    // 2. Mise à jour de la réserve (onglet Stock)
    const reserveDiv = document.getElementById('reserve');
    if (reserveDiv) {
        reserveDiv.innerHTML = "";
        
        // --- NOUVEAU : TRI AUTOMATIQUE PAR ID POKÉDEX ---
        if (typeof POKEDEX_IDS !== 'undefined') {
            gameState.reserve.sort((a, b) => {
                let idA = POKEDEX_IDS[a.name] || 9999;
                let idB = POKEDEX_IDS[b.name] || 9999;
                
                // Si c'est le même Pokémon, on trie du plus fort au plus faible (Niveau)
                if (idA === idB) {
                    return b.level - a.level;
                }
                
                return idA - idB; // Tri croissant par N° de Pokédex
            });
        }
        
        // Affichage des cartes une fois triées
        gameState.reserve.forEach(m => {
            reserveDiv.appendChild(createCard(m, 'reserve'));
        });
    }

    // 3. Mise à jour de l'équipe (onglet Ranch)
    const activeDiv = document.getElementById('active-team');
    if (activeDiv) {
        activeDiv.innerHTML = "";
        gameState.activeTeam.forEach(m => {
            activeDiv.appendChild(createCard(m, 'team'));
        });
    }
    
    // 4. Mise à jour du compteur d'équipe
    const teamCount = document.getElementById('team-count');
    if (teamCount) teamCount.innerText = gameState.activeTeam.length;

    // 5. Mise à jour du Pokédex
    if (typeof updatePokedex === 'function') updatePokedex();

    // 6. --- NOUVEAU : MISE À JOUR DE LA PENSION ---
   for (let i = 0; i < 2; i++) {
        let slotDiv = document.getElementById(`pension-slot-${i + 1}`);
        if (slotDiv) {
            let parent = gameState.pension[i];
            if (parent) {
                // Si occupé, on affiche l'image
                slotDiv.innerHTML = `<img src="${parent.image}" style="width: 100%; height: 100%; object-fit: contain;">`;
                slotDiv.style.borderStyle = "solid";
                slotDiv.style.borderColor = "#e11d48";
            } else {
                // Si vide, on affiche le chiffre
                slotDiv.innerHTML = `<span style="color: #475569; font-size: 24px;">${i + 1}</span>`;
                slotDiv.style.borderStyle = "dashed";
                slotDiv.style.borderColor = "#475569";
            }
        }
    }

    // Mise à jour de la barre d'incubation (si elle existe)
    let incubateurUi = document.getElementById("incubateur-ui");
    if (incubateurUi && gameState.activeEggIncubation) {
        let progress = Math.min(50000, gameState.activeEggIncubation.progress);
        let percent = (progress / 50000) * 100;
        
        if (progress >= 50000) {
            incubateurUi.innerHTML = `<button onclick="recupererOeuf()" style="background: #10b981; color: white; border: none; padding: 8px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11px; width: 100%;">L'ŒUF EST PRÊT !</button>`;
        } else {
            incubateurUi.innerHTML = `
                <div style="color: #79eddf; font-size: 10px; margin-bottom: 2px;">Incubation : ${Math.floor(progress)} / 50 000</div>
                <div style="width: 100%; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${percent}%; height: 100%; background: #79eddf;"></div>
                </div>
            `;
        }
    } else if (incubateurUi) {
        incubateurUi.innerHTML = "";
    }
}
function createCard(m, loc) {
    let div = document.createElement("div");
    // Ajout de la classe "on-expedition" si le Pokémon est occupé
    div.className = "monster-card" + (m.onExpedition ? " on-expedition" : "");

    // --- GESTION DU TEXTE DU BAS (Argent ou Timer) ---
    let footerText = `+${calculateTickIncome(m)} PO/min`;
    if (m.onExpedition && m.expeditionEnd) {
        const remaining = Math.max(0, Math.floor((m.expeditionEnd - Date.now()) / 1000));
        footerText = remaining > 0 ? `⏳ ${remaining}s` : "⏳ Retour...";
    }

// --- CALCUL DES POURCENTAGES DES BARRES ---
    const pctEnergie = Math.min(100, (m.energie / 3) * 100);
    const pctBonheur = Math.min(100, (m.bonheur / 3) * 100);
    
    // --- MODIFICATION ICI : La barre s'adapte à l'XP requise ! ---
    const xpRequired = (typeof getRequiredXP === "function") ? getRequiredXP(m.level) : 100;
    const pctXP = Math.min(100, ((m.xp || 0) / xpRequired) * 100);

    // --- INJECTION HTML DE LA CARTE ---
    div.innerHTML = `
        <div class="monster-image-container">
            <img src="${m.image}" draggable="false" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div class="monster-info">
            <div class="monster-name">${m.name} <span style="color: #fbbf24; font-size: 10px;">Lv.${m.level}</span></div>
            <div style="font-size: 9px; color: #79eddf; margin-bottom: 2px;">Talent: ${m.talent}</div>
            
            <div style="width:100%; height:4px; background:#333; margin-top:2px; border-radius:2px;" title="Énergie">
                <div style="width:${pctEnergie}%; height:100%; background:#fbbf24; border-radius:2px; transition: 0.3s;"></div>
            </div>
            
            <div style="width:100%; height:4px; background:#333; margin-top:2px; border-radius:2px;" title="Bonheur">
                <div style="width:${pctBonheur}%; height:100%; background:#f472b6; border-radius:2px; transition: 0.3s;"></div>
            </div>
            
            <div style="width:100%; height:3px; background:#333; margin-top:2px; border-radius:2px;" title="Expérience">
                <div style="width:${pctXP}%; height:100%; background:#3b82f6; border-radius:2px; transition: 0.3s;"></div>
            </div>
            
            <div class="monster-income" style="margin-top: 3px;">${footerText}</div>
        </div>
    `;

    // Clic pour déplacer le Pokémon (Stock <-> Ranch)
   // Remplace ton ancien div.onclick dans la fonction createCard par ceci :

let pressTimer;

div.onmousedown = () => {
    // Démarre le compteur au toucher
    pressTimer = setTimeout(() => {
        evolvePokemon(m); // Déclenche l'évolution après 2s
        pressTimer = null;
    }, 2000);
};

div.onmouseup = () => {
    // Si on lâche avant 2s, on annule l'évolution et on fait l'action normale
    if (pressTimer) {
        clearTimeout(pressTimer);
        switchZone(m.id, loc); // Action normale (Switch zone)
    }
};

// Sécurité pour mobile (Tactile)
div.ontouchstart = (e) => {
    e.preventDefault(); // Empêche le scroll pendant le maintien
    pressTimer = setTimeout(() => {
        evolvePokemon(m);
        pressTimer = null;
    }, 2000);
};

div.ontouchend = () => {
    if (pressTimer) {
        clearTimeout(pressTimer);
        switchZone(m.id, loc);
    }
};
    
    return div;
}

// --- POKEDEX ---
function updatePokedex() {
    const grid = document.getElementById('pokedex-grid');
    if (!grid) return;
    
    grid.innerHTML = ""; 
    
    const totalPokemon = 151;
    const unlockedCount = gameState.pokedexUnlocked ? gameState.pokedexUnlocked.length : 0;
    
    const fill = document.getElementById('pokedex-progress-fill');
    const ratioText = document.getElementById('pokedex-count-ratio');
    if (fill) fill.style.width = `${(unlockedCount / totalPokemon) * 100}%`;
    if (ratioText) ratioText.innerText = `${unlockedCount} / ${totalPokemon}`;

    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(60px, 1fr))";
    grid.style.gap = "8px";

    if (typeof POKEDEX_IDS === 'undefined') return;

    let pokedexTrie = Object.entries(POKEDEX_IDS).sort((a, b) => a[1] - b[1]);

    pokedexTrie.forEach(([nom, id]) => {
        let isUnlocked = gameState.pokedexUnlocked && gameState.pokedexUnlocked.includes(nom);
        let spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
        
        let card = document.createElement("div");
        card.style.cssText = `border: 2px solid ${isUnlocked ? '#3b82f6' : '#334155'}; border-radius: 8px; padding: 5px; text-align: center; background: ${isUnlocked ? '#1e293b' : '#0f172a'};`;
        
        card.innerHTML = `
            <div style="font-size: 8px; color: #94a3b8;">N° ${id}</div>
            <img src="${spriteUrl}" style="height: 35px; filter: ${isUnlocked ? 'none' : 'brightness(0) opacity(0.4)'};">
            <div style="font-size: 9px; font-weight: bold; color: ${isUnlocked ? 'white' : '#475569'}; margin-top: 2px;">
                ${isUnlocked ? nom : "???"}
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- MAP & EXPÉDITIONS ---
function updateMapUI() {
    const container = document.getElementById('zones-container');
    if (!container) return;

    container.innerHTML = ""; 

    if (typeof EXPLORATIONS === 'undefined') return;

    Object.keys(EXPLORATIONS).forEach(key => {
        const zone = EXPLORATIONS[key];
        
        let div = document.createElement("div");
        div.className = "zone-card";
        div.innerHTML = `
            <div>
                <div style="font-size: 11px; font-weight: bold; color: white;">${zone.name}</div>
                <div style="font-size: 9px; color: #94a3b8;">${zone.description}</div>
            </div>
            <button class="zone-btn" onclick="selectPokemonForExpedition('${key}')">EXPLORER</button>
        `;
        container.appendChild(div);
    });
}

let selectedForExpedition = [];

function selectPokemonForExpedition(expKey) {
    const modal = document.getElementById('expedition-modal');
    const list = document.getElementById('expedition-list');
    if(!modal || !list) return; // Sécurité

    list.innerHTML = "";
    selectedForExpedition = [];

    // On affiche uniquement les Pokémon libres pour l'expédition
    gameState.activeTeam.forEach(m => {
        if (!m.onExpedition) {
            let div = document.createElement("div");
            div.style.border = "2px solid #334155";
            div.style.padding = "5px";
            div.style.borderRadius = "8px";
            div.style.textAlign = "center";
            div.style.cursor = "pointer";
            div.innerHTML = `<img src="${m.image}" style="width: 40px;"><div style="font-size: 10px; color: white;">${m.name}</div>`;
            
            div.onclick = () => {
                // Bascule la sélection on/off
                if (selectedForExpedition.includes(m.id)) {
                    selectedForExpedition = selectedForExpedition.filter(id => id !== m.id);
                    div.style.borderColor = "#334155";
                    div.style.backgroundColor = "transparent";
                } else {
                    selectedForExpedition.push(m.id);
                    div.style.borderColor = "#79eddf";
                    div.style.backgroundColor = "#334155";
                }
            };
            list.appendChild(div);
        }
    });

    // Validation du bouton de la fenêtre popup
    const confirmBtn = document.getElementById('confirm-expedition-btn');
    if(confirmBtn) {
        confirmBtn.onclick = () => {
            if (selectedForExpedition.length > 0) {
                startExpedition(selectedForExpedition, expKey);
                modal.style.display = 'none';
            }
        };
    }
    
    modal.style.display = 'flex';
}

// --- NAVIGATION DES ONGLETS ---
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => { 
        tab.style.display = 'none'; 
        tab.classList.remove('active'); 
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const target = document.getElementById(tabId);
    if (target) {
        // Remplacement de display block par flex pour garder la bonne mise en page
        target.style.display = 'flex';
        target.classList.add('active');
    }
    
    const navBtn = document.getElementById('nav-' + tabId);
    if (navBtn) navBtn.classList.add('active');
    
    updateUI();
    
    // Si on ouvre la map, on génère les boutons d'expédition
    if (tabId === 'tab-map') {
        updateMapUI();
    }
}

// --- RAFRAÎCHISSEMENT DU TIMER (EXPÉDITIONS) ---
// S'assure que le compte à rebours s'affiche chaque seconde sur l'onglet actif
setInterval(() => {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'tab-enclos') {
        updateUI();
    }
}, 1000);
// --- SYSTÈME DE NOTIFICATIONS FLUIDES ---

// 1. Notification discrète en haut de l'écran (pour l'argent gagné hors-ligne)
function showToast(message) {
    let toast = document.createElement("div");
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: #1e293b; color: #79eddf; padding: 12px 24px; 
        border-radius: 8px; z-index: 9999; border: 2px solid #79eddf; 
        font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.6);
        animation: fadeInOut 3s forwards;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 2. Écran d'éclosion majestueux (le fameux système que tu aimais)
function showHatchPopup(pokemon, isNew) {
    let overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.9); z-index: 9999; display: flex; 
        justify-content: center; align-items: center; flex-direction: column;
        transition: opacity 0.3s ease;
    `;
    
    let title = isNew ? "✨ NOUVEAU ! ✨" : "🎉 Éclosion ! 🎉";
    let color = isNew ? "#fbbf24" : "#79eddf"; 
    let imgStyle = isNew ? "width: 75px; height: 75px; filter: drop-shadow(0 0 10px #fbbf24);" : "width: 60px; height: 60px;";

    overlay.innerHTML = `
        <div style="background: #1e293b; padding: 20px; border-radius: 16px; border: 3px solid ${color}; text-align: center;">
            <h2 style="color: ${color}; margin-bottom: 10px; font-size: 18px;">${title}</h2>
            <img src="${pokemon.image}" style="object-fit: contain; margin-bottom: 10px; ${imgStyle}">
            <p style="color: white; font-weight: bold; font-size: 16px;">${pokemon.name}</p>
        </div>
    `;

    document.body.appendChild(overlay);

    // Disparaît après 1 seconde (au lieu de 2)
    setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 300); 
    }, 1000); // <-- 1 seconde pile
}
// Ajout d'une petite animation CSS pour les toasts
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -20px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(styleSheet);
// --- MISE À JOUR DU SAC (Inventaire) ---
function updateInventoryUI() {
    const invContainer = document.getElementById('inventory-container');
    if (!invContainer) return;

    invContainer.innerHTML = ""; // Vider le conteneur

    // Vérifier si l'inventaire existe
    if (!gameState.inventory || gameState.inventory.length === 0) {
        invContainer.innerHTML = "<p style='color:#64748b; text-align:center; margin-top:20px;'>Le sac est vide...</p>";
        return;
    }

    gameState.inventory.forEach(itemEntry => {
        const itemData = ITEMS_CONFIG[itemEntry.itemKey];
        if (!itemData) return;
        
        let div = document.createElement("div");
        div.className = "monster-card"; 
        div.style.cursor = "pointer";
        
        div.innerHTML = `
            <div class="monster-image-container">
                <img src="${itemData.image}" style="width: 40px; height: 40px;">
            </div>
            <div class="monster-info">
                <div class="monster-name" style="font-size: 11px;">${itemData.name}</div>
                <div style="font-size: 10px; color: #79eddf; font-weight: bold;">Qté: ${itemEntry.quantity}</div>
            </div>
        `;

        // Action au clic pour utiliser l'objet
        div.onclick = () => {
            alert("Sélectionne un Pokémon dans ton ranch pour lui donner cet objet !");
            // Ici, tu pourrais ajouter une logique pour sélectionner le Pokémon
            // Pour l'instant, cela confirme juste que l'objet est cliquable
        };

        invContainer.appendChild(div);
    });
}
// --- GESTION DU SAC ---
function toggleSac(open) {
    const modal = document.getElementById('poche-sac-modal');
    if (!modal) return;
    
    if (open) {
        modal.style.display = 'flex';
        updateInventoryUI(); // Met à jour le contenu dès l'ouverture
    } else {
        modal.style.display = 'none';
    }
}

function updateInventoryUI() {
    const invContainer = document.getElementById('inventory-container');
    if (!invContainer) return;

    invContainer.innerHTML = ""; 

    if (!gameState.inventory || gameState.inventory.length === 0) {
        invContainer.innerHTML = "<p style='color:#64748b; text-align:center; margin-top:20px;'>Le sac est vide...</p>";
        return;
    }

    gameState.inventory.forEach(itemEntry => {
        const itemData = ITEMS_CONFIG[itemEntry.itemKey];
        if (!itemData) return;
        
        let div = document.createElement("div");
        div.className = "monster-card"; 
        div.style.cursor = "pointer";
        
        div.innerHTML = `
            <div class="monster-image-container">
                <img src="${itemData.image}" style="width: 40px; height: 40px;">
            </div>
            <div class="monster-info">
                <div class="monster-name" style="font-size: 11px;">${itemData.name}</div>
                <div style="font-size: 10px; color: #79eddf; font-weight: bold;">Qté: ${itemEntry.quantity}</div>
            </div>
        `;

        // Action au clic pour utiliser l'objet sur un Pokémon
        div.onclick = () => {
    openPokemonSelector(itemEntry.itemKey);
        };
    

        invContainer.appendChild(div);
    });
}
// --- SÉLECTION DU POKÉMON POUR UTILISER UN OBJET ---
function openPokemonSelector(itemKey) {
    // 1. On ne prend QUE les Pokémon de l'enclos (activeTeam)
    let allPokemon = [...gameState.activeTeam];
    
    if (allPokemon.length === 0) {
        if(typeof showToast === "function") showToast("Il n'y a aucun Pokémon dans ton ranch !");
        return;
    }

    // 2. Trier par ID Pokedex (croissant)
    allPokemon.sort((a, b) => {
        let idA = POKEDEX_IDS[a.name] || 0;
        let idB = POKEDEX_IDS[b.name] || 0;
        return idA - idB;
    });

    // 3. Créer le modal de sélection
    let overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:flex; justify-content:center; align-items:center;";

    let container = document.createElement("div");
    container.style.cssText = "background:#1e293b; padding:20px; border-radius:12px; border:2px solid #79eddf; max-width:400px; width:90%; max-height:80vh; overflow-y:auto;";
    
    container.innerHTML = `<h3 style="color:white; text-align:center; margin-bottom:15px;">Choisir un Pokémon du Ranch</h3>`;

    allPokemon.forEach(m => {
        let div = document.createElement("div");
        div.style.cssText = "display:flex; align-items:center; background:#0f172a; margin:5px 0; padding:10px; border-radius:8px; cursor:pointer; border:1px solid #334155;";
        div.innerHTML = `
            <img src="${m.image}" style="width:40px; height:40px; margin-right:15px; object-fit:contain;">
            <div style="color:white;">
                <div style="font-weight:bold; font-size:14px;">${m.name}</div>
                <div style="font-size:10px; color:#94a3b8;">N°${POKEDEX_IDS[m.name]} | Lv.${m.level}</div>
            </div>
        `;
        div.onclick = () => {
            useItemOnPokemon(itemKey, m.id);
            overlay.remove();
        };
        container.appendChild(div);
    });

    // Bouton retour
    let closeBtn = document.createElement("button");
    closeBtn.innerText = "Annuler";
    closeBtn.style.cssText = "width:100%; margin-top:15px; padding:10px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;";
    closeBtn.onclick = () => overlay.remove();
    container.appendChild(closeBtn);

    overlay.appendChild(container);
    document.body.appendChild(overlay);
}
// Remplace ta fonction getSortedReserve actuelle par celle-ci :
function getSortedReserve() {
    let reserve = [...gameState.reserve];
    
    // Tri par numéro Pokedex croissant (ID Pokedex)
    // On utilise la table POKEDEX_IDS définie dans ton data.js
    return reserve.sort((a, b) => {
        let idA = POKEDEX_IDS[a.name] || 0;
        let idB = POKEDEX_IDS[b.name] || 0;
        return idA - idB;
    });
}