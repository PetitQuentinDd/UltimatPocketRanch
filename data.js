// ==========================================================================
// 1. DÉFINITION DES REVENUS ET EXPÉDITIONS
// ==========================================================================
const EXPLORATIONS = {
    foretBaies: {
        name: "Forêt des Baies",
        duration: 60000,
        rewards: ["baieOran", "baieCeriz", "baieWikia"],
        description: "Envoie tes Pokémon chercher des baies fraîches."
    },
    grottePierre: {
        name: "Grotte Sombre",
        duration: 300000,
        rewards: ["pierreEau", "pierreFeu", "pierrePlante", "pierreLune", "pierreSoleil"],
        description: "Une grotte où l'on trouve des pierres d'évolution."
    },
    centraleElectrique: {
        name: "Centrale Électrique",
        duration: 600000,
        rewards: ["pierreFoudre", "cableLien", "potion", "superPotion", "hyperPotion"],
        description: "Un lieu chargé en électricité et en objets technologiques."
    }
};

const REVENUS_RARETE = {
    commun: { min: 1, max: 3 },
    peuCommun: { min: 4, max: 6 },
    rare: { min: 8, max: 10 },
    tresRare: { min: 15, max: 18 },
    legendaire: { min: 20, max: 25 }
};

// ==========================================================================
// CORRESPONDANCE DES NOMS FRANÇAIS VERS LES ID OFFICIELS DU POKÉDEX
// ==========================================================================
const POKEDEX_IDS = {
    "Bulbizarre": 1, "Herbizarre": 2, "Florizarre": 3, "Salamèche": 4, "Reptincel": 5, "Dracaufeu": 6,
    "Carapuce": 7, "Carabaffe": 8, "Tortank": 9, "Chenipan": 10, "Chrysacier": 11, "Papilusion": 12,
    "Aspicot": 13, "Coconfort": 14, "Dardargnan": 15, "Roucool": 16, "Roucoups": 17, "Roucarnage": 18,
    "Rattata": 19, "Rattatac": 20, "Piafabec": 21, "Rapasdepic": 22, "Abo": 23, "Arbok": 24,
    "Pikachu": 25, "Raichu": 26, "Sabelette": 27, "Sablaireau": 28, "Nidoran♀": 29, "Nidorina": 30,
    "Nidoqueen": 31, "Nidoran♂": 32, "Nidorino": 33, "Nidoking": 34, "Mélofée": 35, "Mélodelfe": 36,
    "Goupix": 37, "Feunard": 38, "Rondoudou": 39, "Grodoudou": 40, "Nosferapti": 41, "Nosferalto": 42,
    "Mystherbe": 43, "Ortide": 44, "Rafflesia": 45, "Paras": 46, "Parasect": 47, "Mimitoss": 48,
    "Aéromite": 49, "Taupiqueur": 50, "Triopikeur": 51, "Miaouss": 52, "Persian": 53, "Psykokwak": 54,
    "Akwakwak": 55, "Férosinge": 56, "Colossinge": 57, "Caninos": 58, "Arcanin": 59, "Ptitard": 60,
    "Têtarte": 61, "Tartard": 62, "Abra": 63, "Kadabra": 64, "Alakazam": 65, "Machoc": 66,
    "Machopeur": 67, "Mackogneur": 68, "Chétiflor": 69, "Boustiflor": 70, "Empiflor": 71, "Tentacool": 72,
    "Tentacruel": 73, "Racaillou": 74, "Gravalanch": 75, "Grolem": 76, "Ponyta": 77, "Galopa": 78,
    "Ramoloss": 79, "Flagadoss": 80, "Magnéti": 81, "Magnéton": 82, "Canarticho": 83, "Doduo": 84,
    "Dodrio": 85, "Otaria": 86, "Lamantine": 87, "Tadmorv": 88, "Grotadmorv": 89, "Kokiyas": 90,
    "Crustabri": 91, "Fantominus": 92, "Spectrum": 93, "Ectoplasma": 94, "Onix": 95, "Soporifik": 96,
    "Hypnomade": 97, "Krabby": 98, "Krabboss": 99, "Voltorbe": 100, "Électrode": 101, "Noeunoeuf": 102,
    "Noadkoko": 103, "Osselait": 104, "Ossatueur": 105, "Kicklee": 106, "Tygnon": 107, "Excelangue": 108,
    "Smogo": 109, "Smogogo": 110, "Rhinocorne": 111, "Rhinoféros": 112, "Leveinard": 113, "Saquedeneu": 114,
    "Kangourex": 115, "Hypotrempe": 116, "Hypocéan": 117, "Poissirène": 118, "Poissoroy": 119, "Stari": 120,
    "Staross": 121, "M. Mime": 122, "Insécateur": 123, "Lippoutou": 124, "Élektek": 125, "Magmar": 126,
    "Scarabrute": 127, "Tauros": 128, "Magicarpe": 129, "Léviator": 130, "Lokhlass": 131, "Métamorph": 132,
    "Évoli": 133, "Aquali": 134, "Voltali": 135, "Pyroli": 136, "Porygon": 137, "Amonita": 138,
    "Amonistar": 139, "Kabuto": 140, "Kabutops": 141, "Ptera": 142, "Ronflex": 143, "Artikodin": 144,
    "Électhor": 145, "Sulfura": 146, "Minidraco": 147, "Draco": 148, "Dracolosse": 149, "Mewtwo": 150,
    "Mew": 151,

    // 2ème génération
    "Germignon": 152, "Macronium": 153, "Méganium": 154, "Héricendre": 155, "Feurisson": 156, "Typhlosion": 157,
    "Kaiminus": 158, "Crocrodil": 159, "Aligatueur": 160, "Fouinette": 161, "Fouinar": 162, "Hoothoot": 163,
    "Noarfang": 164, "Coxy": 165, "Coxyclaque": 166, "Mimigal": 167, "Migalos": 168, "Nostenfer": 169,
    "Loupio": 170, "Lanturn": 171, "Pichu": 172, "Mélo": 173, "Toudoudou": 174, "Togepi": 175,
    "Togetic": 176, "Natu": 177, "Xatu": 178, "Wattouat": 179, "Lainergie": 180, "Pharamp": 181,
    "Joliflor": 182, "Marill": 183, "Azumarill": 184, "Simularbre": 185, "Tarpaud": 186, "Granivol": 187,
    "Floravol": 188, "Cotovol": 189, "Capumain": 190, "Tournegrin": 191, "Héliatronc": 192, "Yanma": 193,
    "Axoloto": 194, "Maraiste": 195, "Mentali": 196, "Noctali": 197, "Cornèbre": 198, "Roigada": 199,
    "Feuforêve": 200, "Zarbi": 201, "Qulbutoké": 202, "Girafarig": 203, "Pomdepik": 204, "Forretress": 205,
    "Insolourdo": 206, "Scarabrute": 207, "Scorplane": 208, "Steelix": 209, "Snubbull": 210, "Granbull": 211,
    "Qwilfish": 212, "Cizayox": 213, "Caratroc": 214, "Scarhino": 215, "Farfuret": 216, "Teddiursa": 217,
    "Ursaring": 218, "Limagma": 219, "Volcaropod": 220, "Marcacrin": 221, "Cochignon": 222, "Corayon": 223,
    "Rémoraid": 224, "Octillery": 225, "Cadoizo": 226, "Démanta": 227, "Airmure": 228, "Malosse": 229,
    "Démolosse": 230, "Hyporoi": 231, "Phanpy": 232, "Donphan": 233, "Porygon2": 234, "Cerfrousse": 235,
    "Queulorior": 236, "Debugant": 237, "Kapoera": 238, "Lippouti": 239, "Élekid": 240, "Magby": 241,
    "Écrémeuh": 242, "Leuphorie": 243, "Raikou": 244, "Entei": 245, "Suicune": 246, "Embrylex": 247,
    "Ymphect": 248, "Tyranocif": 249, "Lugia": 250, "Ho-Oh": 251,

    // 3ème génération
    "Arcko": 252, "Massko": 253, "Jungko": 254, "Poussifeu": 255, "Galifeu": 256, "Braségali": 257,
    "Gobou": 258, "Flobio": 259, "Laggron": 260, "Medhyèna": 261, "Grahyèna": 262, "Zigzaton": 263,
    "Linéon": 264, "Chenipotte": 265, "Armulys": 266, "Charmillon": 267, "Blindalys": 268, "Papinox": 269,
    "Nénupiot": 270, "Lombre": 271, "Ludicolo": 272, "Grainipiot": 273, "Pifeuil": 274, "Tengalice": 275,
    "Nirondelle": 276, "Hélédelle": 277, "Goélise": 278, "Bekipan": 279, "Tarsal": 280, "Kirlia": 281,
    "Gardevoir": 282, "Arakdo": 283, "Maskadra": 284, "Balignon": 285, "Chapignon": 286, "Parecool": 287,
    "Vigoroth": 288, "Monaflèmit": 289, "Ningale": 290, "Ninjask": 291, "Munja": 292, "Chuchmur": 293,
    "Ramboum": 294, "Brouhabam": 295, "Makuhita": 296, "Hariyama": 297, "Azurill": 298, "Tarinor": 299,
    "Skitty": 300, "Delcatty": 301, "Ténéfix": 302, "Mysdibule": 303, "Galekid": 304, "Galegon": 305,
    "Galeking": 306, "Méditikka": 307,"Charmina": 308, "Dynavolt": 309, "Élecsprint": 310, "Posipi": 311,
     "Négapi": 312,"Muciole": 313, "Lumivole": 314, "Rosélia": 315, "Gloupti": 316, "Avaltout": 317,
    "Carvanha": 318, "Sharpedo": 319, "Wailmer": 320, "Wailord": 321, "Chamallot": 322,
    "Camérupt": 323, "Chartor": 324, "Spoink": 325, "Groret": 326, "Spinda": 327,
    "Kraknoix": 328, "Vibraninf": 329, "Libégon": 330, "Cacnea": 331, "Cacturne": 332,
    "Tylton": 333, "Altaria": 334, "Mangriff": 335, "Séviper": 336, "Séléroc": 337,
    "Solaroc": 338, "Barloche": 339, "Barbicha": 340, "Écrapince": 341, "Colhomard": 342,
    "Balbuto": 343, "Kaorine": 344, "Lilia": 345, "Vacilys": 346, "Anorith": 347,
    "Armaldo": 348, "Barpau": 349, "Milobellus": 350, "Morpheo": 351, "Kecleon": 352,
    "Polichombr": 353, "Branette": 354, "Skelénox": 355, "Téraclope": 356, "Tropius": 357,
    "Éoko": 358, "Absol": 359, "Okéoké": 360, "Stalgamin": 361, "Oniglali": 362,
    "Obalie": 363, "Phogleur": 364, "Kaimorse": 365, "Coquiperl": 366, "Serpang": 367,
    "Rosabyss": 368, "Relicanth": 369, "Lovdisc": 370, "Draby": 371, "Drackhaus": 372,
    "Drattak": 373, "Terhal": 374, "Métang": 375, "Métalosse": 376, "Regirock": 377,
    "Regice": 378, "Registeel": 379, "Latias": 380, "Latios": 381, "Kyogre": 382,
    "Groudon": 383, "Rayquaza": 384, "Jirachi": 385, "Deoxys": 386
};

// ==========================================================================
// 2. LISTE BRUTE DES POKÉMON (KANTO ET HGSS)
// ==========================================================================
const LISTE_KANTO = {
    commun: [
        "Rattata", "Roucool", "Piafabec", "Abo", "Sabelette", "Nidoran♀", "Nidoran♂", 
        "Nosferapti", "Paras", "Mimitoss", "Taupiqueur", "Miaouss", "Psykokwak", 
        "Férosinge", "Ptitard", "Machoc", "Chétiflor", "Tentacool", "Racaillou", 
        "Ponyta", "Magnéti", "Doduo", "Tadmorv", "Krabby", "Voltorbe", "Magicarpe"
    ],
    peuCommun: [
        "Bulbizarre", "Salamèche", "Carapuce", "Chenipan", "Aspicot", "Pikachu", 
        "Goupix", "Rondoudou", "Mystherbe", "Caninos", "Abra", "Ramoloss", "Otaria", 
        "Soporifik", "Kokiyas", "Osselait", "Smogo", "Rhinocorne", "Hypotrempe"
    ],
    rare: [
        "Mélofée", "Canarticho", "Fantominus", "Noeunoeuf", "Kicklee", "Tygnon", 
        "Excelangue", "Saquedeneu", "Poissirène", "Stari", "M. Mime", "Insécateur", 
        "Lippoutou", "Élektek", "Magmar", "Scarabrute", "Tauros", "Évoli", "Porygon"
    ],
    tresRare: [
        "Kangourex", "Lokhlass", "Métamorph", "Amonita", "Kabuto", "Ptera", 
        "Ronflex", "Minidraco", "Onix", "Leveinard"
    ],
    legendaire: [
        "Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew"
    ]
};

// Remplace ton bloc LISTE_HGSS actuel par celui-ci (sans la virgule après l'accolade)
const LISTE_HGSS = {
    commun: [
        "Rattata", "Roucool", "Piafabec", "Abo",  "Sabelette", 
        "Nidoran♀", "Nidoran♂", "Nosferapti", "Paras", "Mimitoss", "Taupiqueur", "Miaouss", 
        "Psykokwak", "Férosinge", "Ptitard", "Têtarte", "Machoc", "Chétiflor", "Tentacool", 
        "Racaillou", "Magnéti", "Doduo", "Tadmorv", "Krabby", "Voltorbe", "Magicarpe", 
        "Fouinette", "Hoothoot", "Coxy", "Mimigal", "Wattouat"
    ],
    peuCommun: [
        "Bulbizarre", "Salamèche", "Carapuce", "Chenipan", "Aspicot", "Pikachu", "Goupix", 
        "Rondoudou", "Mystherbe", "Caninos", "Abra", "Ramoloss", "Otaria", "Soporifik", 
        "Kokiyas", "Osselait", "Smogo", "Rhinocorne", "Hypotrempe", "Germignon", "Héricendre", 
        "Kaiminus", "Loupio", "Natu", "Marill", "Granivol", "Axoloto", "Pomdepik", "Phanpy"
    ],
    rare: [
        "Mélofée", "Canarticho", "Fantominus", "Noeunoeuf", "Kicklee", "Tygnon", "Excelangue", 
        "Saquedeneu", "Poissirène", "Stari", "M. Mime", "Insécateur", "Lippoutou", "Élektek", 
        "Magmar", "Scarabrute", "Tauros", "Évoli", "Porygon", "Togepi", "Cerfrousse", 
        "Scorplane", "Farfuret", "Malosse", "Debugant", "Lippouti", "Élekid", "Magby"
    ],
    tresRare: [
        "Kangourex", "Lokhlass", "Métamorph", "Amonita", "Kabuto", "Ptera", "Ronflex", 
        "Minidraco", "Onix", "Leveinard", "Steelix", "Cizayox", "Caratroc", "Scarhino", 
        "Porygon2", "Kapoera", "Écrémeuh", "Leuphorie", "Embrylex"
    ],
    legendaire: [
        "Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew", "Raikou", "Entei", "Suicune", 
        "Lugia", "Ho-Oh"
    ]
}; 

 const LISTE_ROSA = {

    commun: [
        "Medhyèna", "Grahyèna", "Zigzaton", "Linéon", "Chenipotte", "Armulys", "Blindalys", 
        "Nirondelle", "Hélédelle", "Goélise", "Bekipan", "Tarsal", "Chuchmur", "Ramboum", 
        "Makuhita", "Gloupti", "Arakdo", "Balignon", "Ténéfix", "Dynavolt", "Élecsprint",
        "Wailmer", "Chamallot", "Spoink", "Kraknoix", "Cacnea", "Tylton", "Barloche"
    ],
    peuCommun: [
        "Arcko", "Poussifeu", "Gobou", "Massko", "Galifeu", "Flobio", "Nénupiot", 
        "Lombre", "Grainipiot", "Pifeuil", "Kirlia", "Gardevoir", "Ningale", "Brouhabam", 
        "Hariyama", "Avaltout", "Maskadra", "Chapignon", "Mysdibule", "Galekid", 
        "Galegon", "Méditikka", "Charmina", "Muciole", "Lumivole", "Rosélia", 
        "Carvanha", "Sharpedo", "Camérupt", "Chartor", "Groret", "Vibraninf", 
        "Cacturne", "Mangriff", "Séviper", "Séléroc", "Solaroc", "Barbicha", 
        "Écrapince", "Colhomard", "Balbuto", "Kaorine", "Polichombr", "Branette", 
        "Skelénox", "Téraclope", "Tropius", "Absol", "Stalgamin", "Obalie", "Phogleur"
    ],
    rare: [
        "Jungko", "Braségali", "Laggron", "Ludicolo", "Tengalice", "Charmillon", "Papinox", 
        "Munja", "Azurill", "Tarinor", "Skitty", "Delcatty", "Galeking", "Spinda", 
        "Libégon", "Altaria", "Lilia", "Vacilys", "Anorith", "Armaldo", "Barpau", 
        "Morpheo", "Kecleon", "Éoko", "Okéoké", "Oniglali", "Kaimorse", "Coquiperl", 
        "Serpang", "Rosabyss", "Relicanth", "Lovdisc", "Draby", "Drackhaus", "Drattak", 
        "Terhal", "Métang"
    ],
    tresRare: [
        "Milobellus", "Métalosse", "Regirock", "Regice", "Registeel"
    ],
    legendaire: [
        "Kyogre", "Groudon", "Rayquaza", "Latias", "Latios", "Jirachi", "Deoxys",
        
    ]
};


// ==========================================================================
// DICTIONNAIRE COMPLET DES ÉVOLUTIONS 
// ==========================================================================
const EVOLUTIONS = {
    // --- LES STARTERS ---
    "Bulbizarre": { nextForm: "Herbizarre", condition: "level", levelNeeded: 16 },
    "Herbizarre": { nextForm: "Florizarre", condition: "level", levelNeeded: 32 },
    "Salamèche":  { nextForm: "Reptincel",  condition: "level", levelNeeded: 16 },
    "Reptincel":  { nextForm: "Dracaufeu",  condition: "level", levelNeeded: 36 },
    "Carapuce":   { nextForm: "Carabaffe",  condition: "level", levelNeeded: 16 },
    "Carabaffe":  { nextForm: "Tortank",    condition: "level", levelNeeded: 36 },
    "Germignon":  { nextForm: "Macronium", condition: "level", levelNeeded: 16 },
    "Macronium":  { nextForm: "Méganium",  condition: "level", levelNeeded: 32 },
    "Héricendre": { nextForm: "Feurisson", condition: "level", levelNeeded: 14 },
    "Feurisson":  { nextForm: "Typhlosion", condition: "level", levelNeeded: 36 },
    "Kaiminus":   { nextForm: "Crocrodil", condition: "level", levelNeeded: 18 },
    "Crocrodil":  { nextForm: "Aligatueur", condition: "level", levelNeeded: 30 },

    // --- ÉVOLUTIONS PAR NIVEAU (Classiques) ---
    "Chenipan":   { nextForm: "Chrysacier", condition: "level", levelNeeded: 7 },
    "Chrysacier": { nextForm: "Papilusion", condition: "level", levelNeeded: 10 },
    "Aspicot":    { nextForm: "Coconfort",  condition: "level", levelNeeded: 7 },
    "Coconfort":  { nextForm: "Dardargnan", condition: "level", levelNeeded: 10 },
    "Roucool":    { nextForm: "Roucoups",   condition: "level", levelNeeded: 18 },
    "Roucoups":   { nextForm: "Roucarnage", condition: "level", levelNeeded: 36 },
    "Piafabec":   { nextForm: "Rapasdepic", condition: "level", levelNeeded: 20 },
    "Abo":        { nextForm: "Arbok",      condition: "level", levelNeeded: 22 },
    "Sabelette":  { nextForm: "Sablaireau", condition: "level", levelNeeded: 22 },
    "Nosferapti": { nextForm: "Nosferalto", condition: "level", levelNeeded: 22 },
    "Mystherbe":  { nextForm: "Ortide",     condition: "level", levelNeeded: 21 },
    "Paras":      { nextForm: "Parasect",   condition: "level", levelNeeded: 24 },
    "Mimitoss":   { nextForm: "Aéromite",   condition: "level", levelNeeded: 31 },
    "Taupiqueur": { nextForm: "Triopikeur", condition: "level", levelNeeded: 26 },
    "Miaouss":    { nextForm: "Persian",    condition: "level", levelNeeded: 28 },
    "Psykokwak":  { nextForm: "Akwakwak",   condition: "level", levelNeeded: 33 },
    "Férosinge":  { nextForm: "Colossinge", condition: "level", levelNeeded: 28 },
    "Machoc":     { nextForm: "Machopeur",  condition: "level", levelNeeded: 28 },
    "Tentacool":  { nextForm: "Tentacruel", condition: "level", levelNeeded: 30 },
    "Racaillou":  { nextForm: "Gravalanch", condition: "level", levelNeeded: 25 },
    "Ponyta":     { nextForm: "Galopa",     condition: "level", levelNeeded: 40 },
    "Magnéti":    { nextForm: "Magnéton",   condition: "level", levelNeeded: 30 },
    "Doduo":      { nextForm: "Dodrio",     condition: "level", levelNeeded: 31 },
    "Otaria":     { nextForm: "Lamantine",  condition: "level", levelNeeded: 34 },
    "Tadmorv":    { nextForm: "Grotadmorv", condition: "level", levelNeeded: 38 },
    "Krabby":     { nextForm: "Krabboss",   condition: "level", levelNeeded: 28 },
    "Voltorbe":   { nextForm: "Électrode",  condition: "level", levelNeeded: 30 },
    "Osselait":   { nextForm: "Ossatueur",  condition: "level", levelNeeded: 28 },
    "Smogo":      { nextForm: "Smogogo",    condition: "level", levelNeeded: 35 },
    "Rhinocorne": { nextForm: "Rhinoféros", condition: "level", levelNeeded: 42 },
    "Hypotrempe": { nextForm: "Hypocéan",   condition: "level", levelNeeded: 32 },
    "Poissirène": { nextForm: "Poissoroy",  condition: "level", levelNeeded: 33 },
    "Magicarpe":  { nextForm: "Léviator",   condition: "level", levelNeeded: 20 },
    "Amonita":    { nextForm: "Amonistar",  condition: "level", levelNeeded: 40 },
    "Kabuto":     { nextForm: "Kabutops",   condition: "level", levelNeeded: 40 },
    "Minidraco":  { nextForm: "Draco",      condition: "level", levelNeeded: 30 },
    "Draco":      { nextForm: "Dracolosse", condition: "level", levelNeeded: 55 },
    "Fouinette":  { nextForm: "Fouinar",    condition: "level", levelNeeded: 15 },
    "Hoothoot":   { nextForm: "Noarfang",   condition: "level", levelNeeded: 20 },
    "Coxy":       { nextForm: "Coxyclaque", condition: "level", levelNeeded: 18 },
    "Mimigal":    { nextForm: "Migalos",    condition: "level", levelNeeded: 22 },
    "Loupio":     { nextForm: "Lanturn",    condition: "level", levelNeeded: 27 },
    "Natu":       { nextForm: "Xatu",       condition: "level", levelNeeded: 25 },
    "Wattouat":   { nextForm: "Lainergie",  condition: "level", levelNeeded: 15 },
    "Lainergie":  { nextForm: "Pharamp",    condition: "level", levelNeeded: 30 },
    "Marill":     { nextForm: "Azumarill",  condition: "level", levelNeeded: 18 },
    "Granivol":   { nextForm: "Floravol",   condition: "level", levelNeeded: 18 },
    "Floravol":   { nextForm: "Cotovol",    condition: "level", levelNeeded: 27 },
    
    "Axoloto":    { nextForm: "Maraiste",   condition: "level", levelNeeded: 20 },
    "Pomdepik":   { nextForm: "Forretress", condition: "level", levelNeeded: 31 },
    "Snubbull":   { nextForm: "Granbull",   condition: "level", levelNeeded: 23 },
    "Limagma":    { nextForm: "Volcaropod", condition: "level", levelNeeded: 38 },
    "Marcacrin":  { nextForm: "Cochignon",  condition: "level", levelNeeded: 33 },
    "Rémoraid":   { nextForm: "Octillery",  condition: "level", levelNeeded: 25 },
    "Phanpy":     { nextForm: "Donphan",    condition: "level", levelNeeded: 25 },
    "Embrylex":   { nextForm: "Ymphect",    condition: "level", levelNeeded: 30 },
    "Ymphect":    { nextForm: "Tyranocif",  condition: "level", levelNeeded: 55 },

    // --- ÉVOLUTIONS PAR PIERRE ---
    "Pikachu":    { nextForm: "Raichu",     condition: "item", itemNeeded: "pierreFoudre" },
    "Nidoran♀":   { nextForm: "Nidorina",   condition: "level", levelNeeded: 16 },
    "Nidorina":   { nextForm: "Nidoqueen",  condition: "item", itemNeeded: "pierreLune" },
    "Nidoran♂":   { nextForm: "Nidorino",   condition: "level", levelNeeded: 16 },
    "Nidorino":   { nextForm: "Nidoking",   condition: "item", itemNeeded: "pierreLune" },
    "Mélofée":    { nextForm: "Mélodelfe",  condition: "item", itemNeeded: "pierreLune" },
    "Rondoudou":  { nextForm: "Grodoudou",  condition: "item", itemNeeded: "pierreLune" },
    "Goupix":     { nextForm: "Feunard",    condition: "item", itemNeeded: "pierreFeu" },
    "Caninos":    { nextForm: "Arcanin",    condition: "item", itemNeeded: "pierreFeu" },
    
    "Ptitard":    { nextForm: "Têtarte",    condition: "level", levelNeeded: 25 },
    "Têtarte":    { nextForm: "Tartard",    condition: "item", itemNeeded: "pierreEau" },
    "Chétiflor":  { nextForm: "Boustiflor", condition: "level", levelNeeded: 21 },
    "Boustiflor": { nextForm: "Empiflor",   condition: "item", itemNeeded: "pierrePlante" },
    "Kokiyas":    { nextForm: "Crustabri",  condition: "item", itemNeeded: "pierreEau" },
    "Noeunoeuf":  { nextForm: "Noadkoko",   condition: "item", itemNeeded: "pierrePlante" },
    "Stari":      { nextForm: "Staross",    condition: "item", itemNeeded: "pierreEau" },
    "Tournegrin": { nextForm: "Héliatronc", condition: "item",  itemNeeded: "pierreSoleil" },
    "Ortide":     { nextForm: ["Rafflesia", "Joliflor"], condition: ["item", "item"], itemNeeded: ["pierrePlante", "pierreSoleil"] },

    // --- ÉVOLUTIONS MULTIPLES (ÉVOLI ET RAMOLOSS) ---
    "Évoli": { 
        nextForm: ["Aquali", "Voltali", "Pyroli","Mentali","Noctali"], 
        condition: ["item", "item", "item","item","item"], 
        itemNeeded: ["pierreEau", "pierreFoudre", "pierreFeu","pierreLune", "pierreSoleil"] 
    },
    "Ramoloss": { 
        nextForm: ["Flagadoss", "Roigada"], 
        condition: ["level", "item"], 
        levelNeeded: 37, 
        itemNeeded: ["none", "rocheRoyale"]
    }, // <-- CORRECTION ICI : Il manquait cette accolade

    // --- ÉVOLUTIONS PAR "ÉCHANGE" (CÂBLE LIEN) ---
    "Abra":       { nextForm: "Kadabra",    condition: "level", levelNeeded: 16 },
    "Kadabra":    { nextForm: "Alakazam",   condition: "item", itemNeeded: "cableLien" },
    "Machopeur":  { nextForm: "Mackogneur", condition: "item", itemNeeded: "cableLien" },
    "Gravalanch": { nextForm: "Grolem",     condition: "item", itemNeeded: "cableLien" },
    "Fantominus": { nextForm: "Spectrum",   condition: "level", levelNeeded: 25 },
    "Spectrum":   { nextForm: "Ectoplasma", condition: "item", itemNeeded: "cableLien" },
    "Insécateur": { nextForm: "Cizayox", condition: "item", itemNeeded: "peauMetal" },
    "Onix":       { nextForm: "Steelix", condition: "item", itemNeeded: "peauMetal" },
    "Porygon":    { nextForm: "Porygon2", condition: "item", itemNeeded: "ameliorator" },
    "Hypocéan":   { nextForm: "Hyporoi", condition: "item", itemNeeded: "ecailleDraco" },
    "Têtarte":    { nextForm: ["Tartard", "Tarpaud"], condition: ["item", "item"], itemNeeded: ["pierreEau", "rocheRoyale"] },

    // Évolutions par niveau de "Bébé" ou spécial
    "Debugant": { nextForm: ["Kicklee", "Tygnon", "Kapoera"], condition: "level", levelNeeded: 20 },
    "Pichu":    { nextForm: "Pikachu",    condition: "level", levelNeeded: 14 }, 
    "Mélo":       { nextForm: "Mélofée",    condition: "level", levelNeeded: 14 },
    "Toudoudou":  { nextForm: "Rondoudou",  condition: "level", levelNeeded: 14 },
    "Togepi":     { nextForm: "Togetic",    condition: "level", levelNeeded: 21 }
};

// ==========================================================================
// CONFIGURATION DES OBJETS D'ÉVOLUTION
// ==========================================================================
const ITEMS_CONFIG = {
    // --- OBJETS D'ÉVOLUTION ---
    pierreEau:    { name: "Pierre Eau",    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png", prix: 1000 },
    pierreFeu:    { name: "Pierre Feu",    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png", prix: 1000 },
    pierreFoudre: { name: "Pierre Foudre", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png", prix: 1000 },
    pierrePlante: { name: "Pierre Plante", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png", prix: 1000 },
    pierreLune:   { name: "Pierre Lune",   image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png", prix: 1500 },
    cableLien:    { name: "Câble Lien",    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/link-cable.png", prix: 2500 },
    pierreSoleil: { name: "Pierre Soleil", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png", prix: 1500 },
    rocheRoyale:  { name: "Roche Royale",  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png", prix: 2000 },
    peauMetal:    { name: "Peau Métal",    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png", prix: 2500 },
    ameliorator:  { name: "Améliorator",   image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png", prix: 2500 },
    ecailleDraco: { name: "Écaille Draco", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-scale.png", prix: 2500 },

    // --- BAIES ---
    baieOran:     { name: "Baie Oran",     effect: "bonheur", value: 1, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png", prix: 500 },
    baieCeriz:    { name: "Baie Ceriz",    effect: "bonheur", value: 2, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png", prix: 1000 },
    baieWikia:    { name: "Baie Wikia",    effect: "bonheur", value: 3, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wiki-berry.png", prix: 2000 },
    
    // --- POTIONS ---
    potion:       { name: "Potion",        effect: "energie", value: 1, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png", prix: 500 },
    superPotion:  { name: "Super Potion",  effect: "energie", value: 2, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png", prix: 1000 },
    hyperPotion:  { name: "Hyper Potion",  effect: "energie", value: 3, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png", prix: 2000 }
};

// ==========================================================================
// 3. LES TALENTS DISPONIBLES
// ==========================================================================
const TALENTS_DISPONIBLES = [
    "Ramassage", // +10% argent global
    "Productif", // +20% revenu perso
    "Chanceux",  // +5% chance shiny
    "Loyal",     // x2 récup bonheur
    "Leader"     // Boost les autres (x2)
];

// ==========================================================================
// 4. CONSTRUCTION AUTOMATIQUE DU POKÉDEX (KANTO ET HGSS)
// ==========================================================================
const POKEDEX = { kanto: {}, hgss: {} };

// Génération de Kanto
Object.keys(LISTE_KANTO).forEach(rarete => {
    POKEDEX.kanto[rarete] = LISTE_KANTO[rarete].map(nom => {
        let minPO = REVENUS_RARETE[rarete].min;
        let maxPO = REVENUS_RARETE[rarete].max;
        
        let idPoke = POKEDEX_IDS[nom] || 1; 
        
        return {
            name: nom,
            rareté: rarete,
            incomePerMin: Math.floor(Math.random() * (maxPO - minPO + 1)) + minPO,
            imagePlaceholder: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${idPoke}.gif`
        };
    });
});

// Génération de Johto (HGSS) - CORRECTION ICI
Object.keys(LISTE_HGSS).forEach(rarete => {
    POKEDEX.hgss[rarete] = LISTE_HGSS[rarete].map(nom => {
        let minPO = REVENUS_RARETE[rarete].min;
        let maxPO = REVENUS_RARETE[rarete].max;
        
        let idPoke = POKEDEX_IDS[nom] || 1; 
        
        return {
            name: nom,
            rareté: rarete,
            incomePerMin: Math.floor(Math.random() * (maxPO - minPO + 1)) + minPO,
            imagePlaceholder: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${idPoke}.gif`
        };
    });
});