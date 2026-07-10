/* ==========================================================================
   IDLE POCKET RANCH - INTERFACE ET AFFICHAGE (ui.js)
   ========================================================================== */

function updateUI() {
    try {
        // 1. Mise à jour de l'argent et des fragments
        const moneyEl = document.getElementById('money');
        if (moneyEl) moneyEl.innerText = Math.floor(gameState.money);

        const fragmentsEl = document.getElementById('fragments');
        if (fragmentsEl) fragmentsEl.innerText = Math.floor(gameState.fragments || 0);

        // 2. Mise à jour de la réserve (onglet Stock)
        const reserveDiv = document.getElementById('reserve');
        if (reserveDiv) {
            reserveDiv.innerHTML = "";
            if (typeof POKEDEX_IDS !== 'undefined') {
                gameState.reserve.sort((a, b) => {
                    let idA = POKEDEX_IDS[a.name] || 9999;
                    let idB = POKEDEX_IDS[b.name] || 9999;
                    if (idA === idB) return b.level - a.level;
                    return idA - idB; 
                });
            }
            gameState.reserve.forEach(m => {
                let isSelected = false;
                if (typeof selectedForRelease !== 'undefined' && Array.isArray(selectedForRelease)) {
                    isSelected = selectedForRelease.includes(m.id);
                }
                reserveDiv.appendChild(createCard(m, 'reserve', isSelected));
            });
        }

        // 3. Mise à jour de l'équipe (onglet Ranch)
        const activeDiv = document.getElementById('active-team');
        if (activeDiv) {
            activeDiv.innerHTML = "";
            gameState.activeTeam.forEach(m => {
                activeDiv.appendChild(createCard(m, 'team', false));
            });
        }
        
        // 4. Mise à jour du compteur d'équipe
        const teamCount = document.getElementById('team-count');
        if (teamCount) teamCount.innerText = gameState.activeTeam.length;

        // 5. Mise à jour du Pokédex
        if (typeof updatePokedex === 'function') updatePokedex();

        // 6. Mise à jour de la Pension
        for (let i = 0; i < 2; i++) {
            let slotDiv = document.getElementById(`pension-slot-${i + 1}`);
            if (slotDiv) {
                let parent = gameState.pension[i];
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

        // 7. Mise à jour de l'Incubateur
        let incubateurUi = document.getElementById("incubateur-ui");
        if (incubateurUi) {
            if (gameState.activeEggIncubation) {
                let progress = Math.min(50000, gameState.activeEggIncubation.progress || 0);
                let percent = (progress / 50000) * 100;
                if (progress >= 50000) {
                    incubateurUi.innerHTML = `<button onclick="recupererOeuf()" style="background: #10b981; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px; width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">✨ L'ŒUF EST PRÊT ! ✨</button>`;
                } else {
                    incubateurUi.innerHTML = `
                        <div style="color: #79eddf; font-size: 11px; margin-bottom: 5px; font-weight: bold; text-align: center;">Incubation : ${Math.floor(progress)} / 50 000 PO</div>
                        <div style="width: 100%; height: 14px; background: #334155; border-radius: 7px; overflow: hidden; border: 1px solid #475569;">
                            <div style="width: ${percent}%; height: 100%; background: #79eddf; transition: width 0.3s;"></div>
                        </div>`;
                }
            } else {
                incubateurUi.innerHTML = `<button onclick="lancerIncubation()" style="background: #e11d48; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px; width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🥚 FAIRE UN ŒUF (0 PO)</button>`;
            }
        }

        // 8. --- MISE À JOUR DES QUÊTES JOURNALIÈRES ---
        const questContainer = document.getElementById("succes-list-container");
        if (questContainer) {
            questContainer.innerHTML = ""; 
            
            if (gameState.lastQuestReset !== new Date().toDateString()) {
                if (typeof genererQuetesJournalieres === "function") genererQuetesJournalieres();
            }
            
            if (gameState.dailyQuests) {
                gameState.dailyQuests.forEach(q => {
                    let pct = Math.min((q.progress / q.goal) * 100, 100);
                    let questDiv = document.createElement("div");
                    
                    // Design calqué sur ton "Œuf Journalier" (Fond sombre, bordure néon cyan, ombre lumineuse)
                    questDiv.style.cssText = "background: #151924; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #79eddf; margin-bottom: 15px; box-shadow: 0 0 10px rgba(121, 237, 223, 0.3);";
                    
                    let btnHtml = "";
                    
                    // Gestion des 3 états du bouton
                    if (q.claimed) {
                        // ETAT 3 : Déjà récupéré (Bouton Gris inactif)
                        btnHtml = `<button disabled style="background: #475569; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; font-size: 12px; width: 100%; margin-top: 10px; cursor: not-allowed;">✔️ RÉCUPÉRÉ</button>`;
                    } else if (q.completed) {
                        // ETAT 2 : Prêt à récupérer (Bouton Vert cliquable)
                        btnHtml = `<button onclick="recupererRecompense(${q.id})" style="background: #10b981; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; font-size: 12px; width: 100%; margin-top: 10px; cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">✅ RÉCUPÉRER (${q.reward} PO)</button>`;
                    } else {
                        // ETAT 1 : En cours (Bouton Rouge inactif)
                        btnHtml = `<button disabled style="background: #ef4444; color: white; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; font-size: 12px; width: 100%; margin-top: 10px; cursor: not-allowed; opacity: 0.7;">EN COURS...</button>`;
                    }

                    // Structure HTML de la carte
                    questDiv.innerHTML = `
                        <h3 style="color: #79eddf; margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase;">${q.desc}</h3>
                        <div style="color: #94a3b8; font-size: 10px; font-weight: bold; margin-bottom: 8px;">Progression : ${q.progress} / ${q.goal}</div>
                        
                        <div style="width: 100%; height: 14px; background: #334155; border-radius: 7px; overflow: hidden; border: 1px solid #475569;">
                            <div style="width: ${pct}%; height: 100%; background: #79eddf; transition: width 0.3s;"></div>
                        </div>
                        
                        ${btnHtml}
                    `;
                    questContainer.appendChild(questDiv);
                });
            }
        
        }
        
    } catch (error) {
        console.error("CRASH DANS L'AFFICHAGE (updateUI) :", error);
    }
}
function createCard(m, loc, isSelected = false) {
    let div = document.createElement("div");
    
    div.className = "monster-card" + (m.onExpedition ? " on-expedition" : "");
    
    if (isSelected) {
        div.style.border = "3px solid #ef4444";
    } else {
        div.style.border = "";
    }
    
    let footerText = `+${calculateTickIncome(m)} PO/min`;
    if (m.onExpedition && m.expeditionEnd) {
        const remaining = Math.max(0, Math.floor((m.expeditionEnd - Date.now()) / 1000));
        footerText = remaining > 0 ? `⏳ ${remaining}s` : "⏳ Retour...";
    }

    const pctEnergie = Math.min(100, (m.energie / 3) * 100);
    const pctBonheur = Math.min(100, (m.bonheur / 3) * 100);
    
    const xpRequired = (typeof getRequiredXP === "function") ? getRequiredXP(m.level) : 100;
    const pctXP = Math.min(100, ((m.xp || 0) / xpRequired) * 100);

    let evoData = typeof EVOLUTIONS !== 'undefined' ? EVOLUTIONS[m.name] : null;
    let pierreInfo = "";
    if (evoData && evoData.condition === "item") {
        let item = ITEMS_CONFIG[evoData.itemNeeded];
        pierreInfo = `<div style="font-size: 8px; color: #fbbf24; margin-top: -2px; margin-bottom: 2px;">ℹ️ ${item ? item.name : "Pierre requise"}</div>`;
    }
    
    div.innerHTML = `
        <div class="monster-image-container">
            <img src="${m.image}" draggable="false" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div class="monster-info">
            <div class="monster-name">${m.name} <span style="color: #fbbf24; font-size: 10px;">Lv.${m.level}</span></div>
            ${pierreInfo}
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

    let pressTimer;
    let startX = 0, startY = 0;

    // --- GESTION TACTILE SÉCURISÉE (ANTI-SCROLL) ---
    div.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        pressTimer = setTimeout(() => {
            if (typeof multiReleaseMode !== 'undefined' && !multiReleaseMode) evolvePokemon(m);
            pressTimer = null;
        }, 2000);
    }, { passive: true });

    div.addEventListener('touchend', (e) => {
        if (pressTimer) {
            clearTimeout(pressTimer);
        }
        
        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;
        let distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

        // Si la distance est faible (< 10px), on valide le clic
        if (distance < 10 && pressTimer !== null) {
            if (loc === 'reserve' && typeof multiReleaseMode !== 'undefined' && multiReleaseMode) {
                toggleSelection(m.id);
            } else {
                switchZone(m.id, loc);
            }
        }
    }, { passive: true });

    // --- GESTION SOURIS (PC) ---
    div.onmousedown = () => {
        pressTimer = setTimeout(() => {
            if (typeof multiReleaseMode !== 'undefined' && !multiReleaseMode) evolvePokemon(m); 
            pressTimer = null;
        }, 2000);
    };

    div.onmouseup = () => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            if (loc === 'reserve' && typeof multiReleaseMode !== 'undefined' && multiReleaseMode) {
                toggleSelection(m.id);
            } else {
                switchZone(m.id, loc);
            }
        }
    };
    
    // Empêche le menu contextuel natif pour un appui long sans erreur
    div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    return div;
}

// --- POKEDEX ---
function updatePokedex() {
    const grid = document.getElementById('pokedex-grid');
    if (!grid) return;
    
    grid.innerHTML = ""; 
    
    const totalPokemon = 493;
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
    if(!modal || !list) return;

    list.innerHTML = "";
    selectedForExpedition = [];

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

// --- RAFRAÎCHISSEMENT DU TIMER (EXPÉDITIONS) ---
setInterval(() => {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab && activeTab.id === 'tab-enclos') {
        updateUI();
    }
}, 1000);

// --- SYSTÈME DE NOTIFICATIONS FLUIDES ---
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

    setTimeout(() => {
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 300); 
    }, 1000);
}

function openTab(tabId) {
    // 1. Cacher tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => { 
        tab.style.display = 'none'; 
        tab.classList.remove('active'); 
    });
    
    // 2. Désactiver tous les boutons de navigation
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    // 3. Afficher l'onglet ciblé
    const target = document.getElementById(tabId);
    if (target) {
        target.style.display = 'flex';
        target.classList.add('active');
    }
    
    // 4. Activer le bouton de navigation correspondant
    const navBtn = document.getElementById('nav-' + tabId);
    if (navBtn) navBtn.classList.add('active');
    
    // 5. Mise à jour de base de l'interface
    updateUI();
    
    // 6. Mises à jour spécifiques selon l'onglet ouvert
    if (tabId === 'tab-map') {
        if (typeof updateMapUI === "function") updateMapUI();
    }
    
    // Mise à jour pour l'onglet des Succès et de l'Œuf Journalier
    if (tabId === 'tab-succes') {
        if (typeof window.updateDailyEggUI === "function") {
            window.updateDailyEggUI();
        }
        if (typeof updateAchievementsUI === "function") {
            updateAchievementsUI(); 
        }
    }
}

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


/* ==========================================================================
   GESTION DU SAC ET DES ONGLETS
   ========================================================================== */

let currentInventoryTab = 'soins'; // Variable globale pour mémoriser l'onglet actif

function toggleSac(open) {
    const modal = document.getElementById('poche-sac-modal');
    if (!modal) return;
    
    if (open) {
        modal.style.display = 'flex';
        updateInventoryUI(); 
    } else {
        modal.style.display = 'none';
    }
}

function updateInventoryUI() {
    const invContainer = document.getElementById('inventory-container');
    if (!invContainer) return;

    invContainer.innerHTML = ""; 
    invContainer.style.alignContent = "start";

    const confirmBtn = document.getElementById('btn-confirm-sale');
    if (confirmBtn) {
        confirmBtn.style.display = (typeof sellMode !== 'undefined' && sellMode) ? "block" : "none";
    }

    // 1. CRÉATION DES BOUTONS D'ONGLETS
    let tabsContainer = document.createElement("div");
    tabsContainer.style.cssText = "grid-column: 1 / -1; display: flex; gap: 5px; margin-bottom: 15px; width: 100%; justify-content: center;";
    
    const tabs = [
        { id: 'soins', icon: '🩹', label: 'Soins' },
        { id: 'baies', icon: '🍒', label: 'Baies' },
        { id: 'evolution', icon: '✨', label: 'Évolution' }
    ];

    tabs.forEach(tab => {
        let btn = document.createElement("button");
        let isActive = currentInventoryTab === tab.id;
        btn.innerHTML = `${tab.icon} ${tab.label}`;
        btn.style.cssText = `
            flex: 1; padding: 8px 4px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer; border: none;
            background: ${isActive ? '#79eddf' : '#334155'};
            color: ${isActive ? '#0f172a' : 'white'};
            transition: 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        `;
        btn.onclick = () => {
            currentInventoryTab = tab.id;
            updateInventoryUI(); 
        };
        tabsContainer.appendChild(btn);
    });

    invContainer.appendChild(tabsContainer);

    // 2. VÉRIFICATION DU SAC VIDE
    if (!gameState.inventory || gameState.inventory.length === 0) {
        invContainer.innerHTML += "<p style='color:#64748b; text-align:center; margin-top:20px; width: 100%; grid-column: 1 / -1;'>Ton sac est complètement vide...</p>";
        return;
    }

    // 3. AFFICHAGE ET FILTRAGE DES OBJETS
    let itemsFound = false;

    gameState.inventory.forEach(itemEntry => {
        const itemData = ITEMS_CONFIG[itemEntry.itemKey];
        if (!itemData) return;
        
        const itemCategory = itemData.categorie || 'soins';
        
        if (itemCategory !== currentInventoryTab) return;

        itemsFound = true; 

        const prixAffiché = itemEntry.price !== undefined ? itemEntry.price : (itemData.price || 0);
        
        let div = document.createElement("div");
        div.className = "monster-card";
        div.style.cursor = "pointer";
        
        if (typeof selectedForSale !== 'undefined' && selectedForSale.includes(itemEntry.itemKey)) {
            div.style.border = "3px solid #f59e0b";
            div.style.transform = "scale(0.95)"; 
        } else if (typeof sellMode !== 'undefined' && sellMode) {
            div.style.border = "1px solid #f59e0b";
            div.style.transform = "scale(1)";
        } else {
            div.style.border = "";
            div.style.transform = "scale(1)";
        }
        
   div.innerHTML = `
            <div class="monster-image-container" style="height: 55px; display: flex; justify-content: center; align-items: center; margin-bottom: 5px;">
                <img src="${itemData.image}" style="max-width: 45px; max-height: 45px; object-fit: contain;">
            </div>
            <div class="monster-info" style="width: 100%; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                <div class="monster-name" style="text-align: center; font-size: 10px; font-weight: bold; margin-bottom: 2px; height: 24px; overflow: hidden; display: flex; align-items: center; justify-content: center; line-height: 1.1;">
                    ${itemData.name}
                </div>
                <div style="text-align: center; font-size: 9px; color: #fbbf24; margin-bottom: 5px;">
                    ${prixAffiché} PO
                </div>
                <div class="monster-income" style="color: #79eddf; font-weight: bold; background: #334155; padding: 3px; border-radius: 4px; text-align: center; font-size: 10px;">
                    Qté : ${itemEntry.quantity}
                </div>
            </div>
        `;

        div.onclick = () => {
            if (typeof sellMode !== 'undefined' && sellMode) {
                if (typeof toggleItemSelection === 'function') toggleItemSelection(itemEntry.itemKey);
            } else {
                openPokemonSelector(itemEntry.itemKey);
            }
        };

        invContainer.appendChild(div);
    });

    if (!itemsFound) {
        let emptyMsg = document.createElement("p");
        emptyMsg.style.cssText = "color:#64748b; text-align:center; margin-top:20px; width: 100%; grid-column: 1 / -1;";
        emptyMsg.innerText = "Aucun objet de ce type dans ton sac.";
        invContainer.appendChild(emptyMsg);
    }
}

// --- SÉLECTION DU POKÉMON POUR UTILISER UN OBJET ---
function openPokemonSelector(itemKey) {
    let allPokemon = [...gameState.activeTeam];
    
    if (allPokemon.length === 0) {
        if(typeof showToast === "function") showToast("Il n'y a aucun Pokémon dans ton ranch !");
        return;
    }

    allPokemon.sort((a, b) => {
        let idA = POKEDEX_IDS[a.name] || 0;
        let idB = POKEDEX_IDS[b.name] || 0;
        return idA - idB;
    });

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

    let closeBtn = document.createElement("button");
    closeBtn.innerText = "Annuler";
    closeBtn.style.cssText = "width:100%; margin-top:15px; padding:10px; background:#ef4444; color:white; border:none; border-radius:8px; font-weight:bold; cursor:pointer;";
    closeBtn.onclick = () => overlay.remove();
    container.appendChild(closeBtn);

    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

function getSortedReserve() {
    let reserve = [...gameState.reserve];
    return reserve.sort((a, b) => {
        let idA = POKEDEX_IDS[a.name] || 0;
        let idB = POKEDEX_IDS[b.name] || 0;
        return idA - idB;
    });
}