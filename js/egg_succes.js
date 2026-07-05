/* ==========================================================================
   IDLE POCKET RANCH - SYSTÈME D'ŒUF JOURNALIER (daily_egg.js)
   ========================================================================== */
// --- AFFICHAGE DE L'ŒUF ---

   const DAILY_EGGS = {
    // LUNDI : Tous les starters de base (Gen 1 à 4)
    1: { 
        name: "Œuf des Débuts ", cost: 50, guaranteedRarity: "rare", 
        pool: [
            "Bulbizarre", "Salamèche", "Carapuce", 
            "Germignon", "Héricendre", "Kaiminus", 
            "Arcko", "Poussifeu", "Gobou", 
            "Tortipouss", "Ouisticram", "Tiplouf"
        ] 
    },
    
    // MARDI : Pokémon évoluant avec une Pierre ou un Objet
    2: { 
        name: "Œuf d'Évolution ", cost: 50, guaranteedRarity: "peuCommun", 
        pool: [
            "Pikachu", "Nidorina", "Nidorino", "Mélofée", "Rondoudou", "Goupix", "Caninos", 
            "Boustiflor", "Kokiyas", "Noeunoeuf", "Stari", "Tournegrin", "Lombre", "Pifeuil", 
            "Skitty", "Rosélia", "Insécateur", "Onix", "Porygon", "Porygon2", "Hypocéan", "Barpau", 
            "Téraclope", "Feuforêve", "Cornèbre", "Ptiravi", "Farfuret", "Magnéton", "Rhinoféros", 
            "Élektek", "Magmar", "Togetic", "Scorplane", "Tarinor", "Kadabra", "Machopeur", 
            "Gravalanch", "Spectrum", "Ortide", "Têtarte", "Kirlia", "Stalgamin", "Coquiperl", "Ramoloss"
        ] 
    },

    // MERCREDI : Tous les Légendaires (Gen 1 à 4)
    3: { 
        name: "Œuf Légendaires", cost: 500, guaranteedRarity: "legendaire", 
        pool: [
            "Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", 
            "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi", 
            "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", 
            "Créhelf", "Créfollet", "Créfadet", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus"
        ] 
    },

    // JEUDI : Toutes les évolutions d'Évoli (Gen 1 à 4)
    4: { 
        name: "Œuf Instable", cost: 100, guaranteedRarity: "rare", 
        pool: [
            "Aquali", "Voltali", "Pyroli", "Mentali", "Noctali", "Phyllali", "Givrali"
        ] 
    },

    // VENDREDI : Tous les Pokémon Bébés
    5: { 
        name: "Œuf Berceau ", cost: 50, guaranteedRarity: "peuCommun", 
        pool: [
            "Pichu", "Mélo", "Toudoudou", "Togepi", "Debugant", "Lippouti", 
            "Élekid", "Magby", "Azurill", "Okéoké", "Manzaï", "Mime Jr.", 
            "Ptiravi", "Goinfrex", "Babimanta", "Korillon", "Rozbouton"
        ] 
    },

    // SAMEDI : Évoluent APRÈS le niveau 30 (Lvl >= 31)
    6: { 
        name: "Œuf Tardif ", cost: 75, guaranteedRarity: "rare", 
        pool: [
            "Herbizarre", "Reptincel", "Carabaffe", "Macronium", "Feurisson", "Massko", "Galifeu", "Flobio", "Boskara", "Chimpenfeu", "Prinplouf", 
            "Roucoups", "Mimitoss", "Psykokwak", "Ponyta", "Otaria", "Tadmorv", "Rhinocorne", "Hypotrempe", "Poissirène", "Amonita", "Kabuto", 
            "Draco", "Pomdepik", "Limagma", "Marcacrin", "Ymphect", "Galegon", "Méditikka", "Chamallot", "Spoink", "Kraknoix", "Vibraninf", 
            "Cacnea", "Tylton", "Balbuto", "Lilia", "Anorith", "Polichombr", "Skelénox", "Obalie", "Phogleur", "Drackhaus", "Métang", 
            "Étourvol", "Capumain", "Chaglam", "Moufouette", "Archéomire", "Hippopotas", "Rapion", "Écayon", "Blizzi", "Yanma", "Cochignon", "Carmache"
        ] 
    },

    // DIMANCHE : Évoluent AVANT le niveau 30 (Lvl <= 30)
    0: { 
        name: "Œuf Précoce ", cost: 25, guaranteedRarity: "commun", 
        pool: [
            "Chenipan", "Chrysacier", "Aspicot", "Coconfort", "Roucool", "Rattata", "Piafabec", "Abo", "Sabelette", "Nosferapti", "Paras", "Taupiqueur", 
            "Miaouss", "Férosinge", "Machoc", "Racaillou", "Magnéti", "Krabby", "Voltorbe", "Osselait", "Magicarpe", "Minidraco", 
            "Fouinette", "Hoothoot", "Coxy", "Mimigal", "Loupio", "Natu", "Wattouat", "Marill", "Granivol", "Axoloto", "Snubbull", "Rémoraid", "Phanpy", "Embrylex", 
            "Medhyèna", "Zigzaton", "Chenipotte", "Nénupiot", "Grainipiot", "Nirondelle", "Goélise", "Tarsal", "Arakdo", "Balignon", "Parecool", "Ningale", 
            "Chuchmur", "Makuhita", "Dynavolt", "Gloupti", "Carvanha", "Barloche", "Écrapince", "Draby", "Terhal", 
            "Étourmi", "Keunotor", "Crikzik", "Lixy", "Cheniti", "Apitrini", "Mustébouée", "Ceribou", "Sancoki", "Baudrive", "Laporeille", "Griknot", "Riolu", "Saquedeneu"
        ] 
    }
};
window.updateDailyEggUI = function() {
    const day = new Date().getDay();
    const eggInfo = DAILY_EGGS[day];
    
    if(!eggInfo) return;

    const titleEl = document.getElementById('daily-egg-title');
    const descEl = document.getElementById('daily-egg-desc');
    const btnEl = document.getElementById('btn-buy-daily');

    if (titleEl) titleEl.innerText = "🌟 " + eggInfo.name;
    if (descEl) descEl.innerText = `Rareté garantie : ${eggInfo.guaranteedRarity.toUpperCase()}`;
    if (btnEl) btnEl.innerText = `ACHETER (${eggInfo.cost} 💎)`;
};

// --- ACHAT DE L'ŒUF ---
function buyDailyEgg() {
    const day = new Date().getDay();
    const eggInfo = DAILY_EGGS[day];

    if (!eggInfo) return;

    if (gameState.fragments < eggInfo.cost) {
        alert(`Pas assez de fragments ! Il te faut ${eggInfo.cost} 💎.`);
        return;
    }

    let listePoke = eggInfo.pool;
    if (!listePoke || listePoke.length === 0) return;

    // Tirage du Pokémon
    let nomPokemon = listePoke[Math.floor(Math.random() * listePoke.length)];
    let idPokedex = POKEDEX_IDS[nomPokemon] || 1;
    let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${idPokedex}.gif`;

    // Calcul des revenus
    let revenus = REVENUS_RARETE[eggInfo.guaranteedRarity] || { min: 10, max: 20 };
    let revenuBase = Math.floor(Math.random() * (revenus.max - revenus.min + 1)) + revenus.min;

    // Déduction du prix
    gameState.fragments -= eggInfo.cost;

    // Création du Pokémon
    let newPokemon = {
        id: Date.now().toString() + Math.floor(Math.random() * 1000),
        name: nomPokemon,
        image: imageUrl,
        incomePerMin: revenuBase,
        niveauRarete: eggInfo.guaranteedRarity,
        energie: 2.0,
        bonheur: 2.0,
        level: 1,
        xp: 0,
        onExpedition: false
    };

    gameState.reserve.push(newPokemon);

    // Ajout au Pokédex si nouveau
    if (!gameState.pokedexUnlocked.includes(nomPokemon)) {
        gameState.pokedexUnlocked.push(nomPokemon);
    }

    // Sauvegarde et mise à jour UI
    if (typeof saveGame === "function") saveGame();
    if (typeof updateUI === "function") updateUI();
    
    alert(`✨ Félicitations ! Un magnifique ${nomPokemon} est sorti de l'œuf journalier !`);
}
