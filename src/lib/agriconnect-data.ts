export const DISEASE_DB: Record<string, Record<string, any>> = {
  Maize: {
    yellow_spots: { disease:'Grey Leaf Spot', confidence:88, risk:'high', treatment:'Apply Mancozeb 75WP @ 2g/L. Improve air circulation.', spread:'Likely to spread via wind. Alert neighboring fields.' },
    brown_lesions: { disease:'Northern Leaf Blight', confidence:91, risk:'high', treatment:'Spray Propiconazole 25EC @ 1ml/L at first sign.', spread:'Moderate spread risk via rain splash.' },
    insect_holes: { disease:'Fall Armyworm', confidence:96, risk:'critical', treatment:'Apply Emamectin Benzoate 5SG @ 0.4g/L. Early morning spray.', spread:'HIGH spread risk. Moth can fly 100km in one night.' },
    leaf_curl: { disease:'Maize Streak Virus', confidence:82, risk:'medium', treatment:'No cure. Remove infected plants. Control leafhopper vectors.', spread:'Spreads via leafhoppers. Monitor nearby fields.' },
    white_powder: { disease:'Powdery Mildew', confidence:79, risk:'medium', treatment:'Spray Hexaconazole 5EC @ 1ml/L water.', spread:'Low spread risk under dry conditions.' },
    orange_rust: { disease:'Common Rust', confidence:85, risk:'medium', treatment:'Apply Trifloxystrobin + Propiconazole fungicide.', spread:'Spread via wind-borne spores. Check nearby farms.' },
    stem_rot: { disease:'Stalk Rot (Fusarium)', confidence:87, risk:'high', treatment:'No effective spray. Harvest early. Avoid water stress.', spread:'Soil-borne. Low direct spread but high local recurrence.' },
  },
  Rice: {
    brown_lesions: { disease:'Rice Blast', confidence:93, risk:'critical', treatment:'Apply Tricyclazole 75WP @ 0.6g/L. Drain field for 2 days.', spread:'Airborne spores spread rapidly in humid conditions.' },
    yellow_spots: { disease:'Brown Planthopper (BPH)', confidence:89, risk:'high', treatment:'Apply Imidacloprid 17.8SL @ 0.25ml/L. Maintain water level.', spread:'Can spread to entire paddy fields within a week.' },
    leaf_curl: { disease:'Bacterial Leaf Blight', confidence:84, risk:'high', treatment:'Apply Copper Oxychloride 50WP @ 3g/L. Avoid excess N.', spread:'Spreads via irrigation water and rain.' },
    insect_holes: { disease:'Stem Borer', confidence:91, risk:'high', treatment:'Apply Cartap Hydrochloride 50SP @ 1g/L at tillering stage.', spread:'Moths can spread to adjacent fields.' },
    stem_rot: { disease:'Sheath Blight', confidence:88, risk:'high', treatment:'Apply Hexaconazole 5EC @ 2ml/L. Reduce plant density.', spread:'Spreads via sclerotia in irrigation water.' },
    white_powder: { disease:'False Smut', confidence:76, risk:'medium', treatment:'Spray Propiconazole 25EC @ 1ml/L at panicle stage.', spread:'Low spread risk.' },
    orange_rust: { disease:'Narrow Brown Leaf Spot', confidence:72, risk:'medium', treatment:'Apply balanced NPK. Spray Mancozeb if severe.', spread:'Low spread risk. Mainly nutritional issue.' },
  },
  Cotton: {
    insect_holes: { disease:'Pink Bollworm', confidence:95, risk:'critical', treatment:'Apply Spinosad 45SC @ 0.2ml/L. Use pheromone traps.', spread:'Moth spreads to entire region within 2 weeks.' },
    leaf_curl: { disease:'Cotton Leaf Curl Virus', confidence:90, risk:'critical', treatment:'No cure. Remove infected plants. Control whitefly vector.', spread:'Whitefly spreads this virus rapidly across fields.' },
    yellow_spots: { disease:'Jassid (Leafhopper)', confidence:86, risk:'high', treatment:'Apply Thiamethoxam 25WG @ 0.5g/L.', spread:'High spread risk. Very mobile insect.' },
    white_powder: { disease:'Powdery Mildew', confidence:81, risk:'medium', treatment:'Apply Sulfur 80WP @ 3g/L or Hexaconazole 5EC.', spread:'Moderate spread via wind spores.' },
    brown_lesions: { disease:'Alternaria Leaf Spot', confidence:78, risk:'medium', treatment:'Spray Mancozeb + Copper Oxychloride mixture.', spread:'Low spread risk. Common in humid conditions.' },
    stem_rot: { disease:'Fusarium Wilt', confidence:84, risk:'high', treatment:'Soil drench with Carbendazim 50WP @ 2g/L.', spread:'Soil-borne pathogen. Spreads via water movement.' },
    orange_rust: { disease:'Rust (unusual in cotton)', confidence:65, risk:'low', treatment:'Monitor. Apply Propiconazole if confirmed.', spread:'Low risk.' },
  },
  Tomato: {
    brown_lesions: { disease:'Late Blight (Phytophthora)', confidence:94, risk:'critical', treatment:'Apply Metalaxyl + Mancozeb @ 2.5g/L. Avoid overhead irrigation.', spread:'Extremely fast spread in cool/wet conditions. Alert all tomato farmers nearby.' },
    yellow_spots: { disease:'Early Blight (Alternaria)', confidence:87, risk:'high', treatment:'Spray Chlorothalonil 75WP @ 2g/L. Remove lower leaves.', spread:'Moderate spread via rain splash and tools.' },
    leaf_curl: { disease:'Tomato Leaf Curl Virus', confidence:91, risk:'high', treatment:'Remove infected plants. Apply Imidacloprid to control whitefly.', spread:'Whitefly vector spreads rapidly. High risk.' },
    insect_holes: { disease:'Fruit Borer (Helicoverpa)', confidence:89, risk:'high', treatment:'Apply Indoxacarb 15.8EC @ 1ml/L. Use pheromone traps.', spread:'Moths spread to neighboring vegetable fields.' },
    stem_rot: { disease:'Bacterial Wilt', confidence:85, risk:'high', treatment:'No effective treatment. Uproot infected plants. Solarize soil.', spread:'Soil-borne. Spreads via water and tools.' },
    white_powder: { disease:'Powdery Mildew', confidence:82, risk:'medium', treatment:'Apply Hexaconazole 5EC @ 1ml/L or Sulfur WG.', spread:'Wind-spread spores. Moderate risk to nearby crops.' },
    orange_rust: { disease:'Septoria Leaf Spot', confidence:76, risk:'medium', treatment:'Apply Copper-based fungicide @ 3g/L.', spread:'Low to moderate spread.' },
  },
  Groundnut: {
    brown_lesions: { disease:'Early/Late Leaf Spot', confidence:89, risk:'high', treatment:'Apply Chlorothalonil 75WP or Mancozeb 75WP @ 2g/L.', spread:'Wind-spread spores. Alert neighboring groundnut fields.' },
    yellow_spots: { disease:'Rosette Disease (virus)', confidence:83, risk:'high', treatment:'No cure. Remove infected plants. Control aphid vector.', spread:'Aphid-transmitted. Can spread to entire crop.' },
    orange_rust: { disease:'Rust (Puccinia)', confidence:88, risk:'high', treatment:'Apply Propiconazole 25EC @ 1ml/L.', spread:'Wind-spread spores. Alert nearby farms.' },
    leaf_curl: { disease:'Peanut Bud Necrosis (PBNV)', confidence:86, risk:'high', treatment:'Remove infected plants. Apply Imidacloprid to control thrips.', spread:'Thrips-transmitted virus. Moderate spread risk.' },
    insect_holes: { disease:'Termite / White Grub', confidence:78, risk:'medium', treatment:'Apply Chlorpyrifos 20EC @ 2.5ml/L as soil drench.', spread:'Localized spread. Low risk to neighbors.' },
    stem_rot: { disease:'Collar Rot (Aspergillus)', confidence:82, risk:'high', treatment:'Seed treatment with Carbendazim + Thiram.', spread:'Soil-borne. Low direct spread.' },
    white_powder: { disease:'Powdery Mildew', confidence:77, risk:'medium', treatment:'Apply Sulfur 80WP @ 3g/L.', spread:'Low spread risk.' },
  },
  Sugarcane: {
    brown_lesions: { disease:'Red Rot Disease', confidence:90, risk:'critical', treatment:'Use certified disease-free sets. Destroy infected clumps.', spread:'Spreads via infected planting material and water.' },
    insect_holes: { disease:'Internode Borer', confidence:87, risk:'high', treatment:'Release Trichogramma egg parasitoid. Apply Carbaryl 50WP.', spread:'Moths spread to neighboring cane fields.' },
    leaf_curl: { disease:'Grassy Shoot Disease', confidence:84, risk:'high', treatment:'Use virus-free planting material. Rogue infected plants.', spread:'Mealybug-transmitted. Can spread rapidly.' },
    white_powder: { disease:'Smut Disease', confidence:86, risk:'high', treatment:'Use resistant varieties. Hot water treatment of sets.', spread:'Wind-spread spores. Alert all cane farmers nearby.' },
    yellow_spots: { disease:'Yellows (nutritional/virus)', confidence:75, risk:'medium', treatment:'Apply Fe/Zn foliar spray. Test soil for nutrient deficiency.', spread:'Low spread risk if nutritional.' },
    stem_rot: { disease:'Wilt Disease', confidence:81, risk:'high', treatment:'Improve drainage. Apply Carbendazim soil drench.', spread:'Soil-borne. Moderate spread via waterlogging.' },
    orange_rust: { disease:'Rust (Puccinia melanocephala)', confidence:79, risk:'medium', treatment:'Apply Propiconazole 25EC @ 1ml/L.', spread:'Wind-spread. Monitor after rainfall.' },
  },
}

export const CROP_FUTURES: Record<string, Record<string, any[]>> = {
  kharif: {
    red: [
      { name:'Turmeric', emoji:'🌿', profit_per_acre:24000, risk:'medium', color:'winner' },
      { name:'Maize', emoji:'🌽', profit_per_acre:16000, risk:'medium', color:'good' },
      { name:'Groundnut', emoji:'🥜', profit_per_acre:13000, risk:'low', color:'avg' },
    ],
    black: [
      { name:'Cotton', emoji:'☁️', profit_per_acre:22000, risk:'medium', color:'winner' },
      { name:'Soybean', emoji:'🫘', profit_per_acre:17000, risk:'low', color:'good' },
      { name:'Maize', emoji:'🌽', profit_per_acre:15000, risk:'medium', color:'avg' },
    ],
    sandy: [
      { name:'Watermelon', emoji:'🍉', profit_per_acre:28000, risk:'high', color:'winner' },
      { name:'Groundnut', emoji:'🥜', profit_per_acre:14000, risk:'low', color:'good' },
      { name:'Maize', emoji:'🌽', profit_per_acre:12000, risk:'medium', color:'avg' },
    ],
    alluvial: [
      { name:'Banana', emoji:'🍌', profit_per_acre:32000, risk:'high', color:'winner' },
      { name:'Sugarcane', emoji:'🍬', profit_per_acre:25000, risk:'medium', color:'good' },
      { name:'Rice', emoji:'🌾', profit_per_acre:18000, risk:'low', color:'avg' },
    ],
  },
  rabi: {
    red: [
      { name:'Tomato', emoji:'🍅', profit_per_acre:35000, risk:'high', color:'winner' },
      { name:'Potato', emoji:'🥔', profit_per_acre:22000, risk:'medium', color:'good' },
      { name:'Jowar', emoji:'🌾', profit_per_acre:9000, risk:'low', color:'avg' },
    ],
    black: [
      { name:'Chana', emoji:'🫘', profit_per_acre:18000, risk:'low', color:'winner' },
      { name:'Wheat', emoji:'🌾', profit_per_acre:14000, risk:'low', color:'good' },
      { name:'Sunflower', emoji:'🌻', profit_per_acre:16000, risk:'medium', color:'avg' },
    ],
    sandy: [
      { name:'Onion', emoji:'🧅', profit_per_acre:20000, risk:'high', color:'winner' },
      { name:'Groundnut', emoji:'🥜', profit_per_acre:15000, risk:'low', color:'good' },
      { name:'Watermelon', emoji:'🍉', profit_per_acre:25000, risk:'high', color:'avg' },
    ],
    alluvial: [
      { name:'Cabbage', emoji:'🥬', profit_per_acre:28000, risk:'medium', color:'winner' },
      { name:'Cauliflower', emoji:'🥦', profit_per_acre:24000, risk:'medium', color:'good' },
      { name:'Rice (IR)', emoji:'🌾', profit_per_acre:16000, risk:'low', color:'avg' },
    ],
  },
  summer: {
    red: [
      { name:'Watermelon', emoji:'🍉', profit_per_acre:30000, risk:'medium', color:'winner' },
      { name:'Brinjal', emoji:'🍆', profit_per_acre:22000, risk:'medium', color:'good' },
      { name:'Ladies Finger', emoji:'🫑', profit_per_acre:18000, risk:'low', color:'avg' },
    ],
    black: [
      { name:'Bitter Gourd', emoji:'🫑', profit_per_acre:19000, risk:'medium', color:'winner' },
      { name:'Sesame', emoji:'🪴', profit_per_acre:14000, risk:'low', color:'good' },
      { name:'Bhendi', emoji:'🌿', profit_per_acre:16000, risk:'low', color:'avg' },
    ],
    sandy: [
      { name:'Cucumber', emoji:'🥒', profit_per_acre:20000, risk:'medium', color:'winner' },
      { name:'Watermelon', emoji:'🍉', profit_per_acre:28000, risk:'high', color:'good' },
      { name:'Muskmelon', emoji:'🍈', profit_per_acre:22000, risk:'medium', color:'avg' },
    ],
    alluvial: [
      { name:'Banana', emoji:'🍌', profit_per_acre:30000, risk:'high', color:'winner' },
      { name:'Paddy (short)', emoji:'🌾', profit_per_acre:15000, risk:'low', color:'good' },
      { name:'Sugarcane', emoji:'🍬', profit_per_acre:26000, risk:'medium', color:'avg' },
    ],
  },
}

export const FEED_MESSAGES = [
  { type:'red', emoji:'🚨', name:'Ravi M.', loc:'Namakkal', crop:'Maize', msg:"Fall Armyworm spotted on 3 acres. Yellow patches and holes in leaves.", time:'2 min ago' },
  { type:'amber', emoji:'⚠️', name:'Murugan S.', loc:'Salem', crop:'Rice', msg:"Strange brown spots on paddy leaves after last week's rain. Is this blast disease?", time:'8 min ago' },
  { type:'green', emoji:'✅', name:'Krishnan P.', loc:'Coimbatore', crop:'Tomato', msg:"Received early warning alert yesterday. Applied fungicide immediately. Crop looks healthy!", time:'15 min ago' },
  { type:'amber', emoji:'📍', name:'Selvam R.', loc:'Erode', crop:'Cotton', msg:"Leaf curl symptoms on 20% of plants. Following AgriConnect recommendations now.", time:'22 min ago' },
  { type:'green', emoji:'💰', name:'Balan K.', loc:'Tiruchengode', crop:'Groundnut', msg:"Used Digital Twin to compare crops. Switched to turmeric this season. Profit up 40%!", time:'35 min ago' },
  { type:'red', emoji:'🦟', name:'Arjun T.', loc:'Dharmapuri', crop:'Cotton', msg:"Pink bollworm has devastated 2 acres. Reporting to help warn neighboring farms.", time:'1 hr ago' },
  { type:'green', emoji:'🤝', name:'Devi S.', loc:'Vellore', crop:'Maize', msg:"AgriConnect alert saved my entire crop last month. This system is truly amazing.", time:'1 hr ago' },
  { type:'amber', emoji:'🌡️', name:'Sundar N.', loc:'Tiruvannamalai', crop:'Rice', msg:"Very high humidity (87%). AgriConnect suggests blast preventive spray. Will do it today.", time:'2 hrs ago' },
  { type:'green', emoji:'📊', name:'Ganesan M.', loc:'Perambalur', crop:'Sugarcane', msg:"Internode borer detected early. Treated with Trichogramma. Much better now.", time:'3 hrs ago' },
  { type:'amber', emoji:'🧪', name:'Priya V.', loc:'Namakkal', crop:'Tomato', msg:"AgriConnect recommended crop switch from tomato to chili based on market data.", time:'4 hrs ago' },
]
