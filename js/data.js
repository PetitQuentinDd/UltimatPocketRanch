// ==========================================================================
// 1. DÉFINITION DES REVENUS ET EXPÉDITIONS
// ==========================================================================
const EXPLORATIONS = {
    foretBaies: {
        name: "Forêt des Baies",
        duration: 60000,
        rewards: ["baieOran", "baieCeriz", "baieWikia",],
        description: "Envoie tes Pokémon chercher des baies fraîches."
    },
    grottePierre: {
        name: "Grotte Sombre",
        duration: 300000,
        rewards: ["pierreEau", "pierreFeu", "pierrePlante","pierreFoudre", "pierreLune", "pierreSoleil","pierreNuit"],
        description: "Une grotte où l'on trouve des pierres d'évolution."
    },
    centraleElectrique: {
        name: "Centrale Électrique",
        duration: 600000,
        rewards: [ "cableLien", "potion", "superPotion", "hyperPotion"],
        description: "Un lieu chargé en électricité et en objets technologiques."
    },
    manoirPokemon : {
        name: "Manoir Pokémon",
        duration: 1200000,
        rewards:["pierreOvale","pierreAube","pierreEclat","pierreGlace","cableLien","rocheRoyale","peauMetal","ameliorator","ecailleDraco","belEcaille","tissuFauche","dentOcean","ecailleOcean","griffeRasoir","protecteur","électriseur","magmariseur","crocRasoir","cdDouteux"],
        description: "Un lieu où les experiences sur les Pokemons sont courant."
    
    }
};

const REVENUS_RARETE = {
    commun: { min: 1, max: 10 },
    peuCommun: { min: 11, max: 20 },
    rare: { min: 21, max: 30 },
    tresRare: { min: 31, max: 40 },
    legendaire: { min: 60, max: 70 }
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
    "Germignon": 152, "Macronium": 153, "Méganium": 154, "Héricendre": 155,
     "Feurisson": 156, "Typhlosion": 157, "Kaiminus": 158, "Crocrodil": 159, "Aligatueur": 160, 
     "Fouinette": 161, "Fouinar": 162, "Hoothoot": 163,"Noarfang": 164, "Coxy": 165,
      "Coxyclaque": 166, "Mimigal": 167, "Migalos": 168, "Nostenfer": 169,"Loupio": 170, 
      "Lanturn": 171, "Pichu": 172, "Mélo": 173, "Toudoudou": 174, "Togepi": 175,
    "Togetic": 176, "Natu": 177, "Xatu": 178, "Wattouat": 179, "Lainergie": 180, 
    "Pharamp": 181,"Joliflor": 182, "Marill": 183, "Azumarill": 184, "Simularbre": 185, 
    "Tarpaud": 186, "Granivol": 187,"Floravol": 188, "Cotovol": 189, "Capumain": 190, 
    "Tournegrin": 191, "Héliatronc": 192, "Yanma": 193,"Axoloto": 194, "Maraiste": 195, 
    "Mentali": 196, "Noctali": 197, "Cornèbre": 198, "Roigada": 199,"Feuforêve": 200, 
    "Zarbi": 201, "Qulbutoké": 202, "Girafarig": 203, "Pomdepik": 204, "Forretress": 205,
    "Insolourdo": 206, "Scarabrute": 207, "Scorplane": 208, "Steelix": 209, "Snubbull": 210, 
    "Granbull": 211,"Qwilfish": 212, "Cizayox": 213, "Caratroc": 214, "Scarhino": 215, 
    "Farfuret": 216, "Teddiursa": 217,"Ursaring": 218, "Limagma": 219, "Volcaropod": 220, 
    "Marcacrin": 221, "Cochignon": 222, "Corayon": 223,"Rémoraid": 224, "Octillery": 225,
     "Cadoizo": 226, "Démanta": 227, "Airmure": 228, "Malosse": 229,"Démolosse": 230, 
     "Hyporoi": 231, "Phanpy": 232, "Donphan": 233, "Porygon2": 234, "Cerfrousse": 235,
    "Debugant":236,"Queulorior": 235, "Kapoera": 237,  "Lippouti": 238, "Élekid": 239,
     "Magby": 240,"Écrémeuh": 241, "Leuphorie": 242, "Raikou": 243, "Entei": 244,
    "Suicune": 245, "Embrylex": 246,"Ymphect": 247, "Tyranocif": 248, "Lugia": 249, 
      "Ho-Oh": 250,"Celebi": 251,

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
    "Groudon": 383, "Rayquaza": 384, "Jirachi": 385, "Deoxys": 386,

    //4ème génération
    "Tortipouss": 387 ,"Boskara": 388, "Torterra": 389,"Ouisticram": 390,
    "Chimpenfeu": 391, "Simiabraz": 392, "Tiplouf": 393,"Prinplouf": 394,"Pingoléon": 395,
    "Étourmi": 396, "Étourvol": 397, "Étouraptor": 398, "Keunotor": 399, "Castorno": 400,
    "Crikzik": 401, "Mélokrik": 402, "Lixy": 403, "Luxio": 404 , "Luxray": 405,
    "Rozbouton": 406,"Roserade":407,"Kranidos":408,"Charkos":409,"Dinoclier":410,
    "Blastiodon":411,"Cheniti":412,"Cheniselle":413,"Papilord":414,"Apitrini":415,
    "Apireine":416,"Pachirisu":417,"Mustébouée":418,"Mustéflott":419,"Ceribou":420,
    "Ceriflor":421,"Sancoki":422,"Tritosor":423,"Capidextre":424,"Baudrive":425,
    "Grodrive":426,"Laporeille": 427,"Lockpin":428,"Magirêve":429,"Corboss,":430,
    "Chaglam":431,"Chaffreux":432,"Korillon":433,"Moufouette":434,"Moufflair":435,
    "Archéomire":436,"Archéodong":437,"Manzaï":438,"Mime Jr":439,"Ptitravi":440,
    "Pijako":441,"Spiritomb":442,"Griknot":443,"Carmache":444,"Carchacrok":445,
    "Goinfrex":446,"Riolu":447,"Lucario":448,"Hippopotas":449,"Hippodocus":450,
    "Rapion":451,"Drascore":452,"Cradopaud":453,"Coatox":454, "Vortente":455,
    "Écayon":456,"Luminéon":457,"Babimanta":458,"Blizzi":459,"Blizzaroi":460,
    "Dimoret":461,"Magnézone":462,"Coudlangue":463,"Rhinastoc":464,"Bouldeneu":465,
    "Élekable":466,"Maganon":467,"Togekiss":468,"Yanmega":469,"Phyllali":470,
    "Givrali":471,"Scorvol":472,"Mammochon":473,"Porygon-Z":474,"Gallame":475,
    "Tarinorme":476,"Noctunoir":477,"Momartik":478,"Motisma":479,"Créhelf":480,
    "Créfollet":481,"Créfadet":482,"Dialga":483,"Palkia":484,"Heatran":485,
    "Regigigas":486,"Giratina":487,"Cresselia":488,"Phione":489,"Manaphy":490,
    "Darkrai":491,"Shaymin":492,"Arceus":493,

    // 5ème génération
    //"Victini":494,"Vipélierre":495,
    //"Lianaja":496,"Majaspic":497,"Gruikui":498,"Grotichon":499,"Roitiflam":500,
    //"Moustillon":501,"Mateloutre":502,"Clamiral":503,"Ratentif":504,"Miradar":505,
    //"Ponchiot":506,"Ponchien":507,"Mastouffe":508,"Chacripan":509,"Léopardus":510,
    //"Feuillajou":511,"Feuiloutan":512,"Flamajou":513,"Flamoutan":514,"Florajou":515,
    //"Flotoutan":516,"Munna":517,"Mushana":518,"Poichigeon":519,"Colombeau":520,
    //"Déflaisan":521, "Zébribon":522, "Zéblitz":523, "Nodulithe":524, "Géolithe":525,
    //"Gigalithe":526, "Chovsourir":527, "Rhinolove":528, "Rototaupe":529, "Minotaupe":530,
    //"Nanméouïe":531, "Charpenti":532, "Ouvrifier":533, "Bétochef" : 534, "Tritonde":535,
    //"Batracné":536, "Crapustule":537, "Judokrak":538, "Karaclée":539, "Larveyette":540,
    //"Couverdure":541, "Manternel":542, "Venipatte":543, "Scobolide":544, "Brutapode":545,
   //"Doudouvet":546, "Farfaduvet":547, "Chlorobule":548, "Fragilady":549, "Bargantua":550, 
   //"Mascaïman":551, "Escroco":552, "Crocorible":553, "Darumarond":554, "Darumacho":555, 
   //"Maracachi":556, "Crabicoque":557, "Crabaraque":558, "Baggiguane":559, "Baggaïd":560,
    //"Cryptéro":561, "Tutafeh":562, "Tutankafer":563, "Carapagos":564, "Mégapagos":565, 
    //"Arkéapti":566, "Aéroptéryx":567, "Miamiasme":568, "Miasmax":569, "Zorua":570, 
    //"Zoroark":571, "Chinchidou":572, "Pashmilla":573, "Scrutella":574, "Mesmérella":575,
    //"Sidérella":576, "Nucléos":577, "Méios":578, "Symbios":579, "Couaneton":580,
    //"Lakmécygne":581, "Sorbébé":582, "Sorboul":583, "Sorbouboul":584, "Vivaldaim":585, 
    //"Haydaim":586, "Emolga":587, "Carabing":588, "Lançargot":589, "Trompignon":590, 
    //"Gaulet":591, "Viskuse":592, "Moyade":593, "Mamanbo":594, "Statitik":595,
    //"Mygavolt":596, "Grindur":597, "Noacier":598, "Tic":599, "Clic":600,
    //"Cliticlic":601, "Anchwatt":602, "Lampéroie":603, "Ohmassacre":604, "Lewsor":605,
    // "Neitram":606, "Funécire":607, "Mélancolux":608, "Lugulabre":609, "Coupenotte":610,
     //"Incisache":611, "Tranchodon":612, "Polarhume":613, "Polagriffe":614, "Hexagel":615,
    //"Escargaume":616, "Limaspeed":617, "Limonde":618, "Kungfouine":619, "Shaofouine":620,
    //"Drakkkarmin":621, "Gringolem":622, "Golemastoc":623, "Scalpion":624, "Scalproie":625, 
    //"Frison":626, "Furaiglon":627, "Gueriaigle":628, "Vostourno":629, "Vaututrice":630,
     //"Aflamanoir":631, "Fermite":632, "Solochi":633, "Diamat":634, "Trioxhydre":635, 
    //"Pyronille":636, "Pyrax":637, "Cobaltium":638, "Terrakium":639, "Viridium":640,
     //"Boréas":641, "Fulguris":642, "Reshiram":643, "Zekrom":644, "Démétéros":645,
     //"Kyurem":646, "Keldeo":647, "Meloetta":648, "Genesect":649,

     //6ème génération

//     "Marisson":650, "Boguérisse":651, "Blindépique":652, "Feunnec":653, "Roussil":654, "Goupelin":655,
//    "Grenousse":656, "Croâporal":657, "Amphinobi":658, "Sapereau":659, "Excavarenne":660,
//    "Passerouge":661, "Braisillon":662, "Flambusard":663, "Lépidonille":664, "Pérégrain":665,
//    "Prismillon":666, "Hélionceau":667, "Némélios":668, "Flabébé":669, "Floette":670,
//    "Florges":671, "Cabriolaine":672, "Chevroum":673, "Pandespiègle":674, "Pandarbare":675, 
//    "Couafarel":676, "Psystigri":677, "Mistigrix":678, "Monorpale":679, "Dimoclès":680, 
//    "Exagide":681, "Fluvetin":682, "Cocotine":683, "Sucroquin":684, "Cupcanaille":685,
//   "Opermine":686, "Golgopathe":687, "Venalgue":688, "Draïeul":689, "Flingouste":690,
//    "Gamblast":691, "Galvaran":692, "Iguolta":693, "Ptyranidur":694, "Rexillius":695,
//    "Amagara":696, "Dragmara":697, "Nymphali":698, "Carabing":699, "Dedenne":700,
//    "Strassie":701, "Mucuscule":702, "Colimucus":703, "Muplodocus":704, "Trousselin":705,
//    "Brocélôme":706, "Desséliande":707, "Pitrouille":708, "Banshitrouye":709, "Grelaçon":710, 
//    "Séracrawl":711, "Sonistrelle":712, "Bruyverne":713, "Xerneas":714, "Yveltal":715,
//     "Zygarde":716, "Diancie":717, "Hoopa":718, "Volcanion":719,

     //7eme generation

     //"Brindibou":720, "Efflèche":721, "Archduc":722, "Flamiaou":723, "Matoufeu":724, "Félinferno":725, 
     //"Otaquin":726, "Otarlette":727, "Oratoria":728, "Picassaut":729, "Piclairon":730,
    //"Bazoucan":731, "Manglouton":732, "Argouste":733, "Larvibule":734, "Chrysapile":735,
    //"Lucanon":736, "Crabagarre":737, "Crabominable":738, "Bombydou":739, "Rubombelle":740,
    //"Rocabot":741, "Lougaroc":742, "Froussardine":743, "Vorastérie":744, "Prédastérie":745, 
    //"Tiboudet":746, "Bourrinos":747, "Araqua":748, "Tarenbulle":749, "Mimantis":750, 
    //"Floramantis":751, "Spododo":752, "Lampignon":753, "Tritox":754, "Malamandre":755,
     //"Nounourson":756, "Chelours":757, "Croquine":758, "Candine":759, "Sucreine":760, 
     //"Guérilande":761, "Gaulet":762, "Bacabouh":763, "Trépassable":764, "Concombaffe":765, 
     //"Type:0":766, "Silvallié":767, "Météno":768, "Dodoala":769, "Boumata":770,
    //" Togedemaru":771, "Mimiqui":772, "Denticrisse":773, "Draïeul":774, "Sinistrail":775, 
    //"Bébécaille":776, "Écaïd":777, "Ékaïser":778, "Tokorico":779, "Tokopiyon":780, 
    //"Tokotoro":781, "Tokopisco":782, "Cosmog":783, "Cosmovum":784, "Solgaleo":785,
    //"Lunala":786, "Zéroïd":787, "Mouscoto":788, "Cancrelove":789, "Câblifère":790, 
    //"Bamboiselle":791, "Katagami":792, "Engloutyran":793, "Necrozma":794, "Magearna":795,
    //"Marshadow":796, "Vémini":797, "Mandrillon":798, "Ama-Ama":799, "Pierroteknik":800,
     //"Zeraora":801, "Meltan":802, "Melmetal":803

     //8eme generation

     //"Ouistempo":804, "Badabouin":805,
      //"Gorythmic":806, "Flambino":807, "Lapyro":808, "Pyrobut":809, "Larméléon":810, 
      //"Arrozard":811, "Lézargus":812, "Rongourmand":813, "Rongrigou":814, "Minisange":815,
      //"Bleuseille":816, "Corvaillus":817, "Larvadar":818, "Coléodôme":819, "Astronelle":820, 
      //"Goupilou":821, "Roublenard":822, "Tournicoton":823, "Eldegoss":824, "Moumouton":825, 
      //"Moumouflon":826, "Khélocrok":827, "Torgamord":828, "Voltoutou":829, "Fulgudog":830, 
      //"Charbi":831, "Wagomine":832, "Monthracite":833, "Verpom":834, "Pomdrapi":835, 
      //"Dratatin":836, "Dunaja":837, "Dunaconda":838, "Nigosier":839, "Embrochet":840, 
      //"Hastacuda":841, "Toxizap":842, "Salarsen":843, "Grillepattes":844, "Scolocendre":845, 
      //"Poulpaf":846, " Krakos":847, "Théffroi":848, "Polthégeist":849, "Bibichut":850,
       //"Chapotus":851, "Sorcilence":852, "Grimalin":853, "Fourbelin":854, "Angoliath":855,
        //"Fourrure":856, "Charmilly":857, "Frissonille":858, "Beldeneige":859, "Hexadron":860, 
        //"Sinistrail":861, "Polthégeist":862, "Miamiasme":863, "Miasmax":864, "Ponyta":865,
        // "Galopa":866, "Canarticho":867, "Palarticho":868, "Zigzaton":869, "Linéon":870, 
        // "Ixon":871, "Darumarond":872, "Darumacho":873, "Corayon":874, "Corossol":875, 
         //"Limonde":876, "Eiscue":877, "Indie":878, "Dolman":879, "Wimessir":880, 
         //"Charibari":881, "Pachyradjah":882, "Galvagon":883, "Galvagla":884, "Hydragon":885, 
         //"Hydragla":886, "Polthégeist":887, "Wimessir":888, "Desséliande":889, "Banshitrouye":890, 
         
         //9eme generation

    
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
         "Chenipan", "Aspicot", "Pikachu", 
        "Goupix", "Rondoudou", "Mystherbe", "Caninos", "Abra", "Ramoloss", "Otaria", 
        "Soporifik", "Kokiyas", "Osselait", "Smogo", "Rhinocorne", "Hypotrempe"
    ],
    rare: [
        "Mélofée", "Canarticho", "Fantominus", "Noeunoeuf", "Kicklee", "Tygnon", 
        "Excelangue", "Saquedeneu", "Poissirène", "Stari", "M. Mime", "Insécateur", 
        "Lippoutou", "Élektek", "Magmar", "Scarabrute", "Tauros", "Évoli", "Porygon"
    ],
    tresRare: [
        "Bulbizarre", "Salamèche", "Carapuce","Kangourex", "Lokhlass", "Métamorph", "Amonita", "Kabuto", "Ptera", 
        "Ronflex", "Minidraco", "Onix", "Leveinard"
    ],
    legendaire: [
        "Artikodin", "Électhor", "Sulfura", "Mewtwo", "Mew"
    ]
};

const LISTE_HGSS = {
    commun: [
        "Fouinette", "Hoothoot", "Coxy", "Mimigal", "Wattouat", "Loupio", "Natu", 
        "Marill", "Granivol", "Axoloto", "Pomdepik", "Snubbull", "Limagma", 
        "Marcacrin", "Rémoraid", "Phanpy"
    ],
    peuCommun: [
         "Togepi", "Yanma", "Cornèbre", 
        "Feuforêve", "Zarbi", "Girafarig", "Insolourdo", "Scorplane", "Qwilfish", 
        "Caratroc", "Scarhino", "Farfuret", "Teddiursa", "Corayon", "Cadoizo", 
        "Démanta", "Malosse", "Cerfrousse", "Queulorior", "Debugant", "Lippouti", 
        "Élekid", "Magby", "Écrémeuh"
    ],
    rare: [
        "Pichu", "Mélo", "Toudoudou", "Azurill", "Simularbre", "Capumain"
    ],
    tresRare: [
        "Embrylex","Germignon", "Héricendre", "Kaiminus",
    ],
    legendaire: [
        "Raikou", "Entei", "Suicune", "Lugia", "Ho-Oh", "Celebi"
    ]
}; 

const LISTE_ROSA = {
    commun: [
        "Medhyèna", "Zigzaton", "Chenipotte", "Nirondelle", "Goélise", "Tarsal", "Chuchmur", 
        "Makuhita", "Gloupti", "Arakdo", "Balignon", "Ténéfix", "Dynavolt",
        "Wailmer", "Chamallot", "Spoink", "Kraknoix", "Cacnea", "Tylton", "Barloche"
    ],
    peuCommun: [
         "Nénupiot", "Grainipiot", "Ningale", "Mysdibule", 
        "Galekid", "Méditikka", "Muciole", "Lumivole", "Rosélia", "Carvanha", "Chartor", 
        "Mangriff", "Séviper", "Séléroc", "Solaroc", "Écrapince", "Balbuto", "Lilia", 
        "Anorith", "Barpau", "Morpheo", "Kecleon", "Polichombr", "Skelénox", "Tropius", 
        "Absol", "Stalgamin", "Obalie"
    ],
    rare: [
        "Azurill", "Tarinor", "Skitty", "Spinda", "Éoko", "Okéoké", "Coquiperl", 
        "Relicanth", "Lovdisc", "Draby", "Terhal"
    ],
    tresRare: [
        "Regirock", "Regice", "Registeel","Arcko", "Poussifeu", "Gobou","Latias", "Latios", 
    ],
    legendaire: [
        "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys"
    ]
};
const LISTE_DBPE= {
    commun:[
       "Tortipouss", "Ouisticram", "Tiplouf", "Étourmi", "Keunotor", 
       "Crikzik", "Lixy", "Rozbouton", "Mustébouée", "Sancoki", 
       "Baudrive", "Laporeille", "Korillon"
    ],
    peuCommun:[
        "Ceribou", "Apitrini", "Rapion", "Cradopaud", "Écayon",
         "Blizzi", "Pachirisu", "Hippopotas", "Moufouette", "Chaglam"
    ],
    rare:[
        "Ptitravi","Débugant","Cheniselle","Ceriflor"

    ],
    tresRare:[
        "Riolu","Griknot","Pijako","Vortente","Kranidos","Dinoclier",
        "Spiritomb","Motisma","Archéomire"
    ],
    legendaire:[
        "Dialga","Palkia","Giratina","Créhelf","Créfollet","Créfadet",
        "Heatran","Regigigas","Cresselia","Phione","Manaphy","Darkrai",
        "Shaymin","Arceus"
    ],







};


// ==========================================================================//
// DICTIONNAIRE COMPLET DES ÉVOLUTIONS    (a faire la 4eme generation)                                   
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
    "Arcko":      {nextForm:  "Massko",     condition: "level", levelNeeded:16 },
    "Massko":      { nextForm: "Jungko", condition: "level", levelNeeded: 36 },
    "Poussifeu": { nextForm: "Galifeu", condition: "level", levelNeeded: 16 },
    "Galifeu": { nextForm: "Braségali", condition: "level", levelNeeded: 36 },
    "Gobou": { nextForm: "Flobio", condition: "level", levelNeeded: 16 },
    "Flobio": { nextForm: "Laggron", condition: "level", levelNeeded: 36 },
    "Tortipouss": { nextForm: "Boskara", condition: "level", levelNeeded: 18 },
    "Boskara": { nextForm: "Torterra", condition: "level", levelNeeded: 32 },
    "Ouisticram": { nextForm: "Chimpenfeu", condition: "level", levelNeeded: 14 },
    "Chimpenfeu": { nextForm: "Simiabraz", condition: "level", levelNeeded: 36 },
    "Tiplouf": { nextForm: "Prinplouf", condition: "level", levelNeeded: 16 },
    "Prinplouf": { nextForm: "Pingoléon", condition: "level", levelNeeded: 36 },


    // --- ÉVOLUTIONS PAR NIVEAU (Classiques) ---
    "Chenipan":   { nextForm: "Chrysacier", condition: "level", levelNeeded: 7 },
    "Chrysacier": { nextForm: "Papilusion", condition: "level", levelNeeded: 10 },
    "Aspicot":    { nextForm: "Coconfort",  condition: "level", levelNeeded: 7 },
    "Coconfort":  { nextForm: "Dardargnan", condition: "level", levelNeeded: 10 },
    "Roucool":    { nextForm: "Roucoups",   condition: "level", levelNeeded: 18 },
    "Roucoups":   { nextForm: "Roucarnage", condition: "level", levelNeeded: 36 },
    "Rattata":    { nextForm: "Rattatac",   condition: "level", levelNeeded: 20 },
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
    "Medhyèna": { nextForm: "Grahuèna", condition: "level", levelNeeded: 18 },
    "Zigzaton": { nextForm: "Linéon", condition: "level", levelNeeded: 20 },
    "Chenipotte": { nextForm: ["Armulys","Blindalys"] , condition: "level", levelNeeded: [7, 7] },
    "Armulys": { nextForm: "Charmillon", condition: "level", levelNeeded: 10 },
    "Blindalys": { nextForm: "Papinox", condition: "level", levelNeeded: 10 },
    "Nénupiot": { nextForm: "Lombre", condition: "level", levelNeeded: 14 },
    "Grainipiot": { nextForm: "Pifeuil", condition: "level", levelNeeded: 14 },
    "Nirondelle": { nextForm: "Hélédelle", condition: "level", levelNeeded: 22 },
    "Goélise": { nextForm: "Bekipan", condition: "level", levelNeeded: 25 },
    "Tarsal": { nextForm: "Kirlia", condition: "level", levelNeeded: 20 },
    "Arakdo": { nextForm: "Maskadra", condition: "level", levelNeeded: 22 },
    "Balignon": { nextForm: "Chapignon", condition: "level", levelNeeded: 23 },
    "Parecool": { nextForm: "Vigoroth", condition: "level", levelNeeded: 18 },
    "Vigoroth": { nextForm: "Monaflémit", condition: "level", levelNeeded: 36 },
    "Ningale": { nextForm: ["Ninjask","Munja"] , condition: "level", levelNeeded: [20, 20] },
    "Chuchmur": { nextForm: "Ramboum", condition: "level", levelNeeded: 20 },
    "Ramboum": { nextForm: "Brouhabam", condition: "level", levelNeeded: 40 },
    "Makuhita": { nextForm: "Hariyama", condition: "level", levelNeeded: 24 },
    "Galekid": { nextForm: "Galegon", condition: "level", levelNeeded: 32 },
    "Galegon": { nextForm: "Galeking", condition: "level", levelNeeded: 42 },
    "Méditikka": { nextForm: "Charmina", condition: "level", levelNeeded: 37 },
    "Dynavolt": { nextForm: "Élecsprint", condition: "level", levelNeeded: 26 },
    "Gloupti": { nextForm: "Avaltout", condition: "level", levelNeeded: 26 },
    "Carvanha": { nextForm: "Sharpedo", condition: "level", levelNeeded: 30 },
    "Wailmer": { nextForm: "Wailord", condition: "level", levelNeeded: 40 },
    "Chamallot": { nextForm: "Camérupt", condition: "level", levelNeeded: 33 },
    "Spoink": { nextForm: "Groret", condition: "level", levelNeeded: 32 },
    "Kraknoix": { nextForm: "Vibraninf", condition: "level", levelNeeded: 35 },
    "Vibraninf": { nextForm: "Libégon", condition: "level", levelNeeded: 45 },
    "Cacnea": { nextForm: "Cacturne", condition: "level", levelNeeded: 32 },
    "Tylton": { nextForm: "Altaria", condition: "level", levelNeeded: 35 },
    "Barloch": { nextForm: "Barbicha", condition: "level", levelNeeded: 30 },
    "Écrapince": { nextForm: "Colhomard", condition: "level", levelNeeded: 30 },
    "Balbuto": { nextForm: "Kaorine", condition: "level", levelNeeded: 36 },
    "Lilia": { nextForm: "Vacilys", condition: "level", levelNeeded: 40 },
    "Anorith": { nextForm: "Armaldo", condition: "level", levelNeeded: 40 },
    "Polichombr": { nextForm: "Branette", condition: "level", levelNeeded: 37 },
    "Skelénox": { nextForm: "Téraclope", condition: "level", levelNeeded: 37 },
    "Obalie": { nextForm: "Phogleur", condition: "level", levelNeeded: 32 },
    "Phogleur": { nextForm: "Kaimorse", condition: "level", levelNeeded: 44 },
    "Draby": { nextForm: "Drackhaus", condition: "level", levelNeeded: 30 },
    "Drackhaus": { nextForm: "Drattak", condition: "level", levelNeeded: 50 },
    "Terhal": { nextForm: "Métang", condition: "level", levelNeeded: 20 },
    "Métang": { nextForm: "Métalosse", condition: "level", levelNeeded: 45 },
    "Étourmi": { nextForm: "Étourvol", condition: "level", levelNeeded: 14 },
    "Étourvol": { nextForm: "Étouraptor", condition: "level", levelNeeded: 34 },
    "Keunotor": { nextForm: "Castorno", condition: "level", levelNeeded: 15 },
    "Crikzik": { nextForm: "Mélokrik", condition: "level", levelNeeded: 10 },
    "Lixy": { nextForm: "Luxio", condition: "level", levelNeeded: 15 },
    "Luxio": { nextForm: "Luxray", condition: "level", levelNeeded: 30 },
    "Kranidos": { nextForm: "Charkos", condition: "level", levelNeeded: 30 },
    "Dinoclier": { nextForm: "Bastiodon", condition: "level", levelNeeded: 30 },
    "Cheniti": { nextForm: ["Cheniselle","Papilord"] , condition: "level", levelNeeded: [20, 20] },
    "Apitrini": { nextForm: "Apireine", condition: "level", levelNeeded: 21 },
    "Mustébouée": { nextForm: "Mustéflott", condition: "level", levelNeeded: 26 },
    "Ceribou": { nextForm: "Ceriflor", condition: "level", levelNeeded: 25 },
    "Sancoki": { nextForm: "Tritosor", condition: "level", levelNeeded: 30 },
    "Capumain": { nextForm: "Capidexte", condition: "level", levelNeeded: 32 },
    "Baudrive": { nextForm: "Grodive", condition: "level", levelNeeded: 28 },
    "Laporeille": { nextForm: "Lockpin", condition: "level", levelNeeded: 16 },
    "Chaglam": { nextForm: "Chaffreux", condition: "level", levelNeeded: 38 },
    "Moufouette": { nextForm: "Moufflair", condition: "level", levelNeeded: 34 },
    "Archéomire": { nextForm: "Archéodong", condition: "level", levelNeeded: 33 },
    "Griknot": { nextForm: "Carmache", condition: "level", levelNeeded: 24 },
    "Carmache": { nextForm: "Carchacrok", condition: "level", levelNeeded: 48 },
    "Riolu": { nextForm: "Lucario", condition: "level", levelNeeded: 24 },
    "Hippopotas": { nextForm: "Hippodocus", condition: "level", levelNeeded: 34 },
    "Rapion": { nextForm: "Drascore", condition: "level", levelNeeded: 40 },
    "Écayon": { nextForm: "Luminéon", condition: "level", levelNeeded: 31 },
    "Blizzi": { nextForm: "Blizzaroi", condition: "level", levelNeeded: 40 },
    "Excelangue": { nextForm: "Coudlangue", condition: "level", levelNeeded: 6},
    "Saquedeneu": { nextForm: "Bouldeneu", condition: "level", levelNeeded: 24},
    "Yanma": { nextForm: "Yanmega", condition: "level", levelNeeded: 33},
    "Cochignon": { nextForm: "Mammochon", condition: "level", levelNeeded: 43},




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
    "Chétiflor":  { nextForm: "Boustiflor", condition: "level", levelNeeded: 21 },
    "Boustiflor": { nextForm: "Empiflor",   condition: "item", itemNeeded: "pierrePlante" },
    "Kokiyas":    { nextForm: "Crustabri",  condition: "item", itemNeeded: "pierreEau" },
    "Noeunoeuf":  { nextForm: "Noadkoko",   condition: "item", itemNeeded: "pierrePlante" },
    "Stari":      { nextForm: "Staross",    condition: "item", itemNeeded: "pierreEau" },
    "Tournegrin": { nextForm: "Héliatronc", condition: "item",  itemNeeded: "pierreSoleil" },
    "Lombre":   {nextForm: "Ludicolo", condition: "item", itemNeeded:"pierreEau"},
    "Pifeuil":  {nextForm: "Tengalice", condition:"item", itemNeeded:"pierrePlante"},
    "Tarinor": {nextForm: "Tarinorme", condition:"item", itemNeeded:"pierreFoudre"},
    "Skitty": {nextForm: "Delcatty", condition:"item", itemNeeded:"pierreLune"},
    "Rosélia": {nextForm: "Roserade", condition:"item", itemNeeded:"pierreEclat"},
    "Insécateur": { nextForm: "Cizayox", condition: "item", itemNeeded: "peauMetal" },
    "Onix":       { nextForm: "Steelix", condition: "item", itemNeeded: "peauMetal" },
    "Porygon":    { nextForm: "Porygon2", condition: "item", itemNeeded: "ameliorator" },
    "Hypocéan":   { nextForm: "Hyporoi", condition: "item", itemNeeded: "ecailleDraco" },
    "Barpau":   { nextForm: "Milobellus", condition: "item", itemNeeded: "belEcaille" },
    "Téraclope":   { nextForm: "Noctunoir", condition: "item", itemNeeded: "tissuFauche" },
    "Feuforêve": { nextForm: "Magirêve",   condition: "item", itemNeeded: "pierreNuit" },
    "Cornèbre": { nextForm: "Corboss",   condition: "item", itemNeeded: "pierreNuit" },
    "Korillon": { nextForm: "Éoko",   condition: "item", itemNeeded: "pierreNuit" },
    "Ptitravi": { nextForm: "Leveinard",   condition: "item", itemNeeded: "pierreOvale" },
    "Farfuret": { nextForm: "Dimoret",   condition: "item", itemNeeded: "griffeRasoir" },
    "Magnéton": { nextForm: "Magnézone",   condition: "item", itemNeeded: "pierreFoudre" },
    "Rhinoféros": { nextForm: "Rhinastoc",   condition: "item", itemNeeded: "protecteur" },
    "Élektek": { nextForm: "Élekable",   condition: "item", itemNeeded: "électriseur" },
    "Magmar": { nextForm: "Maganon",   condition: "item", itemNeeded: "magmariseur" },
    "Togetic": { nextForm: "Togekiss",   condition: "item", itemNeeded: "pierreEclat" },
    "Scorplane": { nextForm: "Scorvol",   condition: "item", itemNeeded: "crocRasoir" },
    "Porygon2": { nextForm: "Porygon-Z",   condition: "item", itemNeeded: "cdDouteux" },
    "Tarinor": { nextForm: "Tarinorme",   condition: "item", itemNeeded: "pierreFoudre" },

    

    // --- ÉVOLUTIONS MULTIPLES (ÉVOLI ET RAMOLOSS) ---
    "Évoli": { 
        nextForm: ["Aquali", "Voltali", "Pyroli","Mentali","Noctali","Phyllali","Grivrali"], 
        condition: ["item", "item", "item","item","item","item","item"], 
        itemNeeded: ["pierreEau", "pierreFoudre", "pierreFeu","pierreLune", "pierreSoleil","pierrePlante","pierreGlace"] 
    },
    "Ramoloss": { 
        nextForm: ["Flagadoss", "Roigada"], 
        condition: ["level", "item"], 
        levelNeeded: [37, 0], 
        itemNeeded: ["none", "rocheRoyale"],
    },
    "Ortide": { 
        nextForm: ["Rafflesia", "Joliflor"], 
        condition: ["item", "item"], 
        itemNeeded: ["pierrePlante", "pierreSoleil"] 
    },
    "Têtarte":{ 
        nextForm: ["Tartard", "Tarpaud"], 
        condition: ["item","item"],
         itemNeeded: ["pierreEau","rocheRoyale"] 
        },
    
    "Kirlia":{
        nextForm:["Gardevoir","Gallame"],
        condition:["level","item"],
        levelNeeded: [30,0],
        itemNeeded:["none","pierreAube"],
    },
    "Stalgamin":{
        nextForm:["Oniglali","Momartik"],
        levelNeeded:42,
        itemNeeded:["none","pierreAube"],
    },
    "Coquiperl":{
        nextForm:["Serpang","Rosabyss"],
        condition:["item","item"],
        itemNeeded:["dentOcean","ecailleOcean"],
    },

    // --- ÉVOLUTIONS PAR "ÉCHANGE" (CÂBLE LIEN) ---
    "Abra":       { nextForm: "Kadabra",    condition: "level", levelNeeded: 16 },
    "Kadabra":    { nextForm: "Alakazam",   condition: "item", itemNeeded: "cableLien" },
    "Machopeur":  { nextForm: "Mackogneur", condition: "item", itemNeeded: "cableLien" },
    "Gravalanch": { nextForm: "Grolem",     condition: "item", itemNeeded: "cableLien" },
    "Fantominus": { nextForm: "Spectrum",   condition: "level", levelNeeded: 25 },
    "Spectrum":   { nextForm: "Ectoplasma", condition: "item", itemNeeded: "cableLien" },
    

    // Évolutions par niveau de "Bébé" ou spécial
    "Debugant": { nextForm: ["Kicklee", "Tygnon", "Kapoera"], condition: ["level","level","level"], levelNeeded: [20,20,20] },
    "Pichu":    { nextForm: "Pikachu",    condition: "level", levelNeeded: 14 }, 
    "Mélo":       { nextForm: "Mélofée",    condition: "level", levelNeeded: 14 },
    "Toudoudou":  { nextForm: "Rondoudou",  condition: "level", levelNeeded: 14 },
    "Togepi":     { nextForm: "Togetic",    condition: "level", levelNeeded: 21 },
    "Azurill": { nextForm: "Marill", condition: "level", levelNeeded: 14 },
    "Rozbouton": {nextForm:"Rosélia", condition:"level", levelNeeded: 14},
    "Okéoké": {nextForm:"Qulbutoké", condition:"level", levelNeeded: 14},
    "Manzaï": { nextForm: "Simularbre", condition: "level", levelNeeded: 21 },
    "Mime Jr.": { nextForm: "M.Mime", condition: "level", levelNeeded: 21 },
    "Goinfrex": { nextForm: "Ronflex", condition: "level", levelNeeded: 21 },
    "Babimanta": { nextForm: "Démenta", condition: "level", levelNeeded: 17 },
    
};

// ==========================================================================
// CONFIGURATION DES OBJETS D'ÉVOLUTION
// ==========================================================================
const ITEMS_CONFIG = {
    // --- OBJETS D'ÉVOLUTION ---
    pierreEau:    { name: "Pierre Eau",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/water-stone.png", price: 1000 },
    pierreFeu:    { name: "Pierre Feu",  type:"evolution",  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fire-stone.png", price: 1000 },
    pierreFoudre: { name: "Pierre Foudre", type:"evolution",image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/thunder-stone.png", price: 1000 },
    pierrePlante: { name: "Pierre Plante", type:"evolution",image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/leaf-stone.png", price: 1000 },
    pierreLune:   { name: "Pierre Lune", type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png", price: 1500 },
    pierreSoleil: { name: "Pierre Soleil",type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png", price: 1500 },
    pierreNuit:    { name: "Pierre Nuit",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dusk-stone.png", price: 1800 },
    pierreOvale:    { name: "Pierre Ovale",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oval-stone.png", price: 1800 },
    pierreAube:     {name: "Pierre Aube", type:"evolution",image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dawn-stone.png", price: 2500 },
    pierreEclat:    {name: "Pierre Eclat",type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-stone.png", price: 2500 },
    pierreGlace:    { name: "Pierre Glace",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ice-stone.png", price: 1000 },
    cableLien:    { name: "Câble Lien",  type:"evolution",  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/link-cable.png", price: 2500 },
    rocheRoyale:  { name: "Roche Royale", type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/kings-rock.png", price: 2000 },
    peauMetal:    { name: "Peau Métal",  type:"evolution",  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/metal-coat.png", price: 2500 },
    ameliorator:  { name: "Améliorator", type:"evolution",  image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/up-grade.png", price: 2500 },
    ecailleDraco: { name: "Écaille Draco",type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dragon-scale.png", price: 2500 },
    belEcaille: { name: "Bel'Écaille",type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/prism-scale.png", price: 2500 },
    tissuFauche: { name: "Tissu Fauche",type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/reaper-cloth.png", price: 2500 },
    dentOcean:{ name:"Dent Océan", type :"evolution",image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/deep-sea-tooth.png", price: 1500 },
    ecailleOcean:{ name: "Écaille Océan", type: "evolution",image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/deep-sea-scale.png", price: 1500 },
    griffeRasoir:    { name: "Griffe Rasoir",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/razor-claw.png", price: 3200 },
    protecteur:    { name: "Protecteur",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protector.png", price: 3200 },
    électriseur:    { name: " Électriseur ",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/electirizer.png", price: 3200 },
    magmariseur:    { name: " Magmariseur ",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/magmarizer.png", price: 3200 },
    crocRasoir:    { name: "Croc Rasoir",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/razor-fang.png", price: 1000 },
    cdDouteux:    { name: "CD Douteux",   type:"evolution", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dubious-disc.png", price: 5000 },
   


    // --- BAIES ---
    baieOran:     { name: "Baie Oran",     effect: "bonheur", value: 1, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/oran-berry.png", price: 500 },
    baieCeriz:    { name: "Baie Ceriz",    effect: "bonheur", value: 2, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png", price: 1000 },
    baieWikia:    { name: "Baie Wikia",    effect: "bonheur", value: 3, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wiki-berry.png", price: 2000 },
    
    // --- POTIONS ---
    potion:       { name: "Potion",        effect: "energie", value: 1, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png", price: 500 },
    superPotion:  { name: "Super Potion",  effect: "energie", value: 2, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-potion.png", price: 1000 },
    hyperPotion:  { name: "Hyper Potion",  effect: "energie", value: 3, image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png", price: 2000 }
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