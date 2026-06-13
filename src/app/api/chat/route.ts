import { NextRequest, NextResponse } from 'next/server'

const LANG_MAP: Record<string, string> = {
  en: 'English', ta: 'Tamil', hi: 'Hindi', te: 'Telugu', kn: 'Kannada'
}

// Comprehensive topic-specific fallbacks in all 5 languages
const FALLBACKS: Record<string, Record<string, string>> = {
  pest: {
    en: `Here's how to treat common crop pests:\n\n🐛 **Fall Armyworm (Maize)**\n→ Spray Emamectin Benzoate 0.4g/L in evenings. Apply inside leaf whorls. Use Beauveria bassiana biopesticide.\n\n🐛 **Bollworm (Cotton)**\n→ Apply Chlorpyrifos 2ml/L. Install 5 pheromone traps/acre. Scout twice a week.\n\n🐛 **Whitefly (Cotton/Tomato)**\n→ Spray Imidacloprid 0.3ml/L. Use yellow sticky traps. Remove heavily infested leaves.\n\n🐛 **Aphids (Any crop)**\n→ Spray neem oil 5ml/L or Dimethoate 1.5ml/L. Natural enemies like ladybirds help.\n\n⚠️ Always spray in early morning or evening. Wear protective gear.`,
    ta: `பொதுவான பயிர் பூச்சிகளை கட்டுப்படுத்துவது எப்படி:\n\n🐛 **வீழ்ச்சி இராணுவப்புழு (மக்காச்சோளம்)**\n→ மாலையில் Emamectin Benzoate 0.4g/L தெளிக்கவும். இலை சுருளுக்குள் செலுத்தவும்.\n\n🐛 **பருத்தி காய்ப்புழு**\n→ Chlorpyrifos 2ml/L தெளிக்கவும். ஏக்கருக்கு 5 pheromone பொறிகள் வைக்கவும்.\n\n🐛 **வெள்ளை ஈ**\n→ Imidacloprid 0.3ml/L தெளிக்கவும். மஞ்சள் நிற ஒட்டும் அட்டைகள் பயன்படுத்தவும்.\n\n⚠️ காலையில் அல்லது மாலையில் மட்டும் தெளிக்கவும்.`,
    hi: `सामान्य फसल कीटों का उपचार:\n\n🐛 **फॉल आर्मीवर्म (मक्का)**\n→ शाम को Emamectin Benzoate 0.4g/L स्प्रे करें। पत्ते के अंदर डालें।\n\n🐛 **बॉलवर्म (कपास)**\n→ Chlorpyrifos 2ml/L लगाएं। प्रति एकड़ 5 pheromone ट्रैप लगाएं।\n\n🐛 **सफेद मक्खी**\n→ Imidacloprid 0.3ml/L स्प्रे करें। पीले चिपचिपे कार्ड लगाएं।\n\n⚠️ हमेशा सुबह या शाम को स्प्रे करें।`,
    te: `సాధారణ పంట పురుగుల నివారణ:\n\n🐛 **ఫాల్ ఆర్మీవర్మ్ (మొక్కజొన్న)**\n→ సాయంత్రం Emamectin Benzoate 0.4g/L పిచికారి చేయండి. ఆకు సుడిలో వేయండి.\n\n🐛 **బాల్వర్మ్ (పత్తి)**\n→ Chlorpyrifos 2ml/L వాడండి. ఎకరాకు 5 pheromone ఉచ్చులు వేయండి.\n\n🐛 **తెల్ల దోమ**\n→ Imidacloprid 0.3ml/L పిచికారి చేయండి. పసుపు అంటుకునే కార్డులు వాడండి.\n\n⚠️ ఉదయం లేదా సాయంత్రం మాత్రమే పిచికారి చేయండి.`,
    kn: `ಸಾಮಾನ್ಯ ಬೆಳೆ ಕೀಟ ನಿಯಂತ್ರಣ:\n\n🐛 **ಫಾಲ್ ಆರ್ಮಿವರ್ಮ್ (ಮೆಕ್ಕೆ ಜೋಳ)**\n→ ಸಂಜೆ Emamectin Benzoate 0.4g/L ಸಿಂಪಡಿಸಿ. ಎಲೆ ಸುರುಳಿಯೊಳಗೆ ಹಾಕಿ.\n\n🐛 **ಬಾಲ್‌ವರ್ಮ್ (ಹತ್ತಿ)**\n→ Chlorpyrifos 2ml/L ಹಾಕಿ. ಎಕರೆಗೆ 5 pheromone ಬಲೆಗಳು.\n\n🐛 **ಬಿಳಿ ನೊಣ**\n→ Imidacloprid 0.3ml/L ಸಿಂಪಡಿಸಿ. ಹಳದಿ ಅಂಟು ಕಾರ್ಡ್ ಬಳಸಿ.\n\n⚠️ ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ಮಾತ್ರ ಸಿಂಪಡಿಸಿ.`
  },
  disease: {
    en: `Common crop disease treatments:\n\n🍂 **Early/Late Blight (Tomato, Potato)**\n→ Spray Mancozeb 2.5g/L or Metalaxyl+Mancozeb every 7 days. Remove infected leaves. Avoid wet foliage.\n\n🍂 **Leaf Rust (Wheat)**\n→ Apply Propiconazole 1ml/L at first sign. Use resistant varieties next season.\n\n🍂 **Rice Blast / Leaf Blight**\n→ Spray Tricyclazole 0.6g/L. Drain field for 3–4 days. Avoid excess nitrogen.\n\n🍂 **Powdery Mildew (Tomato, Chilli)**\n→ Spray Wettable Sulphur 3g/L or Hexaconazole 1ml/L.\n\n💡 Early detection is key — check plants every 3–4 days.`,
    ta: `பொதுவான பயிர் நோய் சிகிச்சை:\n\n🍂 **ஆரம்ப/தாமத கருகல் (தக்காளி, உருளை)**\n→ 7 நாளுக்கு ஒருமுறை Mancozeb 2.5g/L அல்லது Metalaxyl+Mancozeb தெளிக்கவும்.\n\n🍂 **கோதுமை துரு நோய்**\n→ Propiconazole 1ml/L தெளிக்கவும். நோய் தாங்கும் ரகம் பயன்படுத்தவும்.\n\n🍂 **நெல் பட்டை கருகல்**\n→ Tricyclazole 0.6g/L தெளிக்கவும். வயலை 3-4 நாள் உலர விடவும்.\n\n💡 3-4 நாட்களுக்கு ஒருமுறை பயிரை கவனிக்கவும்.`,
    hi: `सामान्य फसल रोग उपचार:\n\n🍂 **अगेती/पछेती झुलसा (टमाटर, आलू)**\n→ हर 7 दिन Mancozeb 2.5g/L या Metalaxyl+Mancozeb स्प्रे करें।\n\n🍂 **गेहूं का रतुआ**\n→ Propiconazole 1ml/L लगाएं। रोग प्रतिरोधी किस्म अगले सीजन में लगाएं।\n\n🍂 **धान का पत्ता झुलसा**\n→ Tricyclazole 0.6g/L स्प्रे करें। खेत 3-4 दिन सुखाएं।\n\n💡 हर 3-4 दिन फसल की जांच करें।`,
    te: `సాధారణ పంట వ్యాధి చికిత్స:\n\n🍂 **తొలి/ఆలస్య తెగులు (టమాటో, బంగాళాదుంప)**\n→ 7 రోజులకు ఒకసారి Mancozeb 2.5g/L లేదా Metalaxyl+Mancozeb పిచికారి చేయండి.\n\n🍂 **గోధుమ తుప్పు**\n→ Propiconazole 1ml/L వాడండి. తదుపరి సీజన్‌లో నిరోధక రకాలు వాడండి.\n\n🍂 **వరి ఆకు తెగులు**\n→ Tricyclazole 0.6g/L పిచికారి. పొలాన్ని 3-4 రోజులు ఆరనివ్వండి.\n\n💡 3-4 రోజులకు ఒకసారి పంటను పరీక్షించండి.`,
    kn: `ಸಾಮಾನ್ಯ ಬೆಳೆ ರೋಗ ಚಿಕಿತ್ಸೆ:\n\n🍂 **ಮೊದಲ/ತಡ ಒಣಗು (ಟೊಮೆಟೊ, ಆಲೂ)**\n→ 7 ದಿನಕ್ಕೊಮ್ಮೆ Mancozeb 2.5g/L ಅಥವಾ Metalaxyl+Mancozeb ಸಿಂಪಡಿಸಿ.\n\n🍂 **ಗೋಧಿ ತುಕ್ಕು**\n→ Propiconazole 1ml/L ಹಾಕಿ. ನಿರೋಧಕ ತಳಿ ಮುಂದಿನ ಸೀಜನ್‌ನಲ್ಲಿ ಬಳಸಿ.\n\n🍂 **ಭತ್ತದ ಎಲೆ ಸುಡು**\n→ Tricyclazole 0.6g/L ಸಿಂಪಡಿಸಿ. ಹೊಲ 3-4 ದಿನ ಒಣಗಿಸಿ.\n\n💡 3-4 ದಿನಕ್ಕೊಮ್ಮೆ ಬೆಳೆ ಪರೀಕ್ಷಿಸಿ.`
  },
  fertilizer: {
    en: `Fertilizer guide for Indian crops (per acre):\n\n🌽 **Maize**\nBasal: Urea 65kg + SSP 155kg + MOP 33kg\nTop dress at 30 days: Urea 65kg\nTop dress at 50 days: Urea 65kg\n\n🍅 **Tomato**\nBasal: DAP 50kg + MOP 50kg\nAt flowering: Foliar spray 00:52:34 @ 5g/L\nAt fruiting: MOP 25kg top dress\n\n🌾 **Wheat**\nBasal: Urea 65kg + DAP 50kg\nAt tillering: Urea 65kg top dress\n\n🥜 **Groundnut**\nBasal: SSP 100kg + Gypsum 100kg\nNo heavy nitrogen — it fixes its own.\n\n🌿 **Rice**\nBasal: Urea 40kg + SSP 100kg\nAt tillering: Urea 40kg\nAt panicle: Urea 25kg + MOP 25kg\n\n💡 Always test soil before applying. Over-fertilising wastes money and damages soil.`,
    ta: `இந்திய பயிர்களுக்கான உர அட்டவணை (ஏக்கருக்கு):\n\n🌽 **மக்காச்சோளம்**\nஅடி உரம்: யூரியா 65கி + SSP 155கி + MOP 33கி\n30 நாளில்: யூரியா 65கி\n50 நாளில்: யூரியா 65கி\n\n🍅 **தக்காளி**\nஅடி உரம்: DAP 50கி + MOP 50கி\nபூக்கும் போது: 00:52:34 5g/L தெளிக்கவும்\n\n🌾 **கோதுமை**\nஅடி உரம்: யூரியா 65கி + DAP 50கி\nமலர்கட்டு நிலையில்: யூரியா 65கி\n\n💡 உரம் போடுவதற்கு முன்பு மண் பரிசோதனை செய்யுங்கள்.`,
    hi: `भारतीय फसलों के लिए उर्वरक (प्रति एकड़):\n\n🌽 **मक्का**\nबेसल: यूरिया 65कि + SSP 155कि + MOP 33कि\n30 दिन पर: यूरिया 65कि\n50 दिन पर: यूरिया 65कि\n\n🍅 **टमाटर**\nबेसल: DAP 50कि + MOP 50कि\nफूल आने पर: 00:52:34 5g/L छिड़काव\n\n🌾 **गेहूं**\nबेसल: यूरिया 65कि + DAP 50कि\nकल्लों पर: यूरिया 65कि\n\n💡 खाद डालने से पहले मिट्टी परीक्षण जरूर करें।`,
    te: `భారతీయ పంటలకు ఎరువు వేళాపట్టిక (ఎకరాకు):\n\n🌽 **మొక్కజొన్న**\nబేసల్: యూరియా 65కి + SSP 155కి + MOP 33కి\n30 రోజులకు: యూరియా 65కి\n50 రోజులకు: యూరియా 65కి\n\n🍅 **టమాటో**\nబేసల్: DAP 50కి + MOP 50కి\nపూత సమయంలో: 00:52:34 5g/L పిచికారి\n\n🌾 **గోధుమ**\nబేసల్: యూరియా 65కి + DAP 50కి\nవేరు దశలో: యూరియా 65కి\n\n💡 ఎరువు వేయడానికి ముందు మట్టి పరీక్ష చేయండి.`,
    kn: `ಭಾರತೀಯ ಬೆಳೆಗಳಿಗೆ ಗೊಬ್ಬರ (ಎಕರೆಗೆ):\n\n🌽 **ಮೆಕ್ಕೆ ಜೋಳ**\nಮೂಲ: ಯೂರಿಯಾ 65ಕಿ + SSP 155ಕಿ + MOP 33ಕಿ\n30 ದಿನಕ್ಕೆ: ಯೂರಿಯಾ 65ಕಿ\n50 ದಿನಕ್ಕೆ: ಯೂರಿಯಾ 65ಕಿ\n\n🍅 **ಟೊಮೆಟೊ**\nಮೂಲ: DAP 50ಕಿ + MOP 50ಕಿ\nಹೂ ಬಿಡುವಾಗ: 00:52:34 5g/L ಸಿಂಪಡಿಸಿ\n\n💡 ಗೊಬ್ಬರ ಹಾಕುವ ಮೊದಲು ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿ.`
  },
  irrigation: {
    en: `Irrigation guide for Indian farms:\n\n💧 **When to irrigate**\n• Rice: Keep 5cm water. Drain 3 days before harvest.\n• Wheat: Critical at tillering (21d), jointing (45d), flowering (65d)\n• Maize: Every 10–12 days. Critical at tasseling & grain fill.\n• Tomato: Every 3–4 days. Drip irrigation preferred.\n• Cotton: Every 10–15 days. Stop 3 weeks before picking.\n\n💧 **Water saving tips**\n• Drip irrigation saves 40–60% water vs flood\n• Irrigate before 9am or after 5pm (less evaporation)\n• Mulching reduces water need by 25%\n• Check soil moisture 6 inches deep before irrigating\n\n💧 **Signs of water stress**\n• Leaf wilting in morning = severe stress\n• Curling leaves = moderate stress\n• Yellow lower leaves = overwatering`,
    ta: `நீர் மேலாண்மை வழிகாட்டி:\n\n💧 **எப்போது நீர்ப்பாசனம் செய்வது**\n• நெல்: 5செமீ நீர் வைக்கவும். அறுவடைக்கு 3 நாள் முன்பு வடிகட்டவும்.\n• கோதுமை: 21, 45, 65 நாட்களில் தண்ணீர் கட்டாயம்.\n• மக்காச்சோளம்: 10-12 நாட்களுக்கு ஒருமுறை.\n• தக்காளி: 3-4 நாட்களுக்கு ஒருமுறை. சொட்டு நீர்ப்பாசனம் சிறந்தது.\n\n💧 **நீர் சேமிக்கும் வழிகள்**\n• சொட்டு நீர்ப்பாசனம் 40-60% நீர் சேமிக்கும்\n• காலை 9 முன்பு அல்லது மாலை 5 பிறகு நீர்ப்பாசனம் செய்யவும்\n• மல்ச்சிங் 25% நீர் தேவையை குறைக்கும்`,
    hi: `सिंचाई मार्गदर्शिका:\n\n💧 **कब सिंचाई करें**\n• धान: 5cm पानी रखें। कटाई से 3 दिन पहले सुखाएं।\n• गेहूं: 21, 45, 65 दिन पर सिंचाई जरूरी।\n• मक्का: हर 10-12 दिन। बाली निकलते समय ध्यान दें।\n• टमाटर: हर 3-4 दिन। ड्रिप सिंचाई बेहतर।\n\n💧 **पानी बचाने के उपाय**\n• ड्रिप सिंचाई 40-60% पानी बचाती है\n• सुबह 9 से पहले या शाम 5 के बाद सिंचाई करें\n• मल्चिंग से 25% पानी की बचत`,
    te: `నీటి సేద్య మార్గదర్శి:\n\n💧 **ఎప్పుడు నీరు పోయాలి**\n• వరి: 5సెమీ నీరు ఉంచండి. పంట కోతకు 3 రోజుల ముందు ఆపండి.\n• గోధుమ: 21, 45, 65 రోజులలో తప్పనిసరి.\n• మొక్కజొన్న: 10-12 రోజులకు ఒకసారి.\n• టమాటో: 3-4 రోజులకు ఒకసారి. డ్రిప్ మంచిది.\n\n💧 **నీరు ఆదా చేయడానికి**\n• డ్రిప్ ఇరిగేషన్ 40-60% నీరు ఆదా చేస్తుంది\n• ఉదయం 9కి ముందు లేదా సాయంత్రం 5 తర్వాత నీరు పోయండి`,
    kn: `ನೀರಾವರಿ ಮಾರ್ಗದರ್ಶಿ:\n\n💧 **ಯಾವಾಗ ನೀರು ಹಾಯಿಸಬೇಕು**\n• ಭತ್ತ: 5ಸೆಂ.ಮೀ ನೀರು ಇರಿಸಿ. ಕೊಯ್ಲಿಗೆ 3 ದಿನ ಮೊದಲು ಬರಿದು ಮಾಡಿ.\n• ಗೋಧಿ: 21, 45, 65 ದಿನಗಳಲ್ಲಿ ಕಡ್ಡಾಯ.\n• ಮೆಕ್ಕೆ ಜೋಳ: 10-12 ದಿನಕ್ಕೊಮ್ಮೆ.\n• ಟೊಮೆಟೊ: 3-4 ದಿನಕ್ಕೊಮ್ಮೆ. ಹನಿ ನೀರಾವರಿ ಉತ್ತಮ.\n\n💧 **ನೀರು ಉಳಿಸಲು**\n• ಹನಿ ನೀರಾವರಿ 40-60% ನೀರು ಉಳಿಸುತ್ತದೆ`
  },
  soil: {
    en: `Soil health improvement guide:\n\n🌱 **Improving soil fertility**\n• Add FYM (Farm Yard Manure) 5 tons/acre before sowing\n• Green manuring: Grow Dhaincha or Sunhemp and plough in\n• Vermicompost 2 tons/acre improves water retention\n• Crop rotation: Legumes → Cereals → Vegetables\n\n🌱 **Soil pH correction**\n• Acidic soil (pH < 6): Add lime 200–400kg/acre\n• Alkaline soil (pH > 8): Add Gypsum 200kg/acre + Sulphur 50kg/acre\n• Ideal pH: 6.0–7.0 for most crops\n\n🌱 **Sandy soil improvement**\n• Add clay soil or coir pith compost\n• Mulch heavily to retain moisture\n• Micro-irrigation is essential\n\n🌱 **Signs of poor soil**\n• Hard crust after rain = compacted soil\n• Yellow leaves despite fertiliser = pH problem\n• Poor germination = low organic matter`,
    ta: `மண் ஆரோக்கியம் மேம்படுத்துவது:\n\n🌱 **மண் வளம் அதிகரிக்க**\n• விதைப்பதற்கு முன்பு ஏக்கருக்கு 5 டன் கொட்டகை எரு இடவும்\n• பச்சை உரம்: Dhaincha அல்லது Sunhemp வளர்த்து உழவும்\n• Vermicompost 2 டன்/ஏக்கர் நீர் தேக்கலை மேம்படுத்தும்\n\n🌱 **மண் pH சரிசெய்தல்**\n• அமில மண் (pH < 6): சுண்ணாம்பு 200-400கி/ஏக்கர்\n• காரமான மண் (pH > 8): ஜிப்சம் 200கி + கந்தகம் 50கி\n• சிறந்த pH: 6.0-7.0`,
    hi: `मिट्टी स्वास्थ्य सुधार:\n\n🌱 **मिट्टी उर्वरता बढ़ाना**\n• बुवाई से पहले 5 टन/एकड़ FYM डालें\n• हरी खाद: ढैंचा या सनई उगाकर जोतें\n• Vermicompost 2 टन/एकड़ से नमी बनी रहती है\n\n🌱 **pH सुधार**\n• अम्लीय मिट्टी (pH < 6): 200-400kg/एकड़ चूना\n• क्षारीय मिट्टी (pH > 8): जिप्सम 200kg + सल्फर 50kg\n• आदर्श pH: 6.0-7.0`,
    te: `మట్టి ఆరోగ్యం మెరుగుపరచడం:\n\n🌱 **మట్టి సారం పెంచడానికి**\n• విత్తనాలు వేయడానికి ముందు ఎకరాకు 5 టన్నుల పశువుల పేడ వేయండి\n• పచ్చిరొట్ట: Dhaincha పెంచి దున్నండి\n• Vermicompost 2 టన్నులు/ఎకరం తేమ నిలుపుతుంది\n\n🌱 **pH సరిచేయడం**\n• ఆమ్ల మట్టి (pH < 6): సున్నం 200-400కి/ఎకరం\n• క్షార మట్టి (pH > 8): జిప్సమ్ 200కి + సల్ఫర్ 50కి`,
    kn: `ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಸುಧಾರಣೆ:\n\n🌱 **ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು**\n• ಬಿತ್ತನೆ ಮೊದಲು ಎಕರೆಗೆ 5 ಟನ್ FYM ಹಾಕಿ\n• ಹಸಿರು ಗೊಬ್ಬರ: ಧೈಂಚಾ ಬೆಳೆದು ಉಳಿ\n• Vermicompost 2 ಟನ್/ಎಕರೆ ತೇವಾಂಶ ಉಳಿಸುತ್ತದೆ\n\n🌱 **pH ಸರಿಪಡಿಸಲು**\n• ಆಮ್ಲೀಯ ಮಣ್ಣು (pH < 6): ಸುಣ್ಣ 200-400ಕಿ/ಎಕರೆ\n• ಕ್ಷಾರೀಯ ಮಣ್ಣು (pH > 8): ಜಿಪ್ಸಮ್ 200ಕಿ + ಗಂಧಕ 50ಕಿ`
  },
  crop_recommend: {
    en: `Best crops based on Indian farm conditions:\n\n☀️ **Kharif (June–Oct)**\n• Black/Loamy soil + canal: Rice, Sugarcane, Cotton\n• Any soil + borewell: Maize, Turmeric, Groundnut\n• Sandy soil + rainwater: Groundnut, Maize\n\n❄️ **Rabi (Nov–Mar)**\n• Loamy + good water: Wheat, Tomato\n• Any soil: Groundnut, Chickpea\n\n🌤️ **Zaid (Mar–Jun)**\n• With irrigation: Tomato, Cucumber, Watermelon\n• Limited water: Maize, Groundnut\n\n💰 **Profit ranking (per acre)**\n1. Turmeric – ₹3–5 lakh\n2. Tomato – ₹2–4 lakh\n3. Cotton – ₹80K–1.2 lakh\n4. Maize – ₹40–60K\n5. Groundnut – ₹50–80K\n\n💡 Use the Farm Advisor tab for a personalised recommendation.`,
    ta: `பயிர் பரிந்துரை:\n\n☀️ **காரிஃப் (ஜூன்–அக்.)**\n• கருப்பு மண் + கால்வாய்: நெல், கரும்பு, பருத்தி\n• எந்த மண்ணும் + போர்வெல்: மக்காச்சோளம், மஞ்சள், வேர்க்கடலை\n• மணல் மண் + மழை: வேர்க்கடலை, மக்காச்சோளம்\n\n❄️ **ரபி (நவ்–மார்)**\n• நல்ல மண் + நீர்: கோதுமை, தக்காளி\n• எந்த மண்ணும்: வேர்க்கடலை\n\n💰 **லாப வரிசை (ஏக்கருக்கு)**\n1. மஞ்சள் – ₹3-5 லட்சம்\n2. தக்காளி – ₹2-4 லட்சம்\n3. பருத்தி – ₹80K-1.2 லட்சம்`,
    hi: `फसल सिफारिश:\n\n☀️ **खरीफ (जून–अक्टू)**\n• काली/दोमट + नहर: चावल, गन्ना, कपास\n• किसी भी मिट्टी + बोरवेल: मक्का, हल्दी, मूंगफली\n• रेतीली + बारिश: मूंगफली, मक्का\n\n❄️ **रबी (नव–मार्च)**\n• अच्छी मिट्टी + पानी: गेहूं, टमाटर\n• किसी भी मिट्टी: मूंगफली, चना\n\n💰 **मुनाफा (प्रति एकड़)**\n1. हल्दी – ₹3-5 लाख\n2. टमाटर – ₹2-4 लाख\n3. कपास – ₹80K-1.2 लाख`,
    te: `పంట సిఫారసు:\n\n☀️ **ఖరీఫ్ (జూన్–అక్టో)**\n• నల్ల/లోమీ మట్టి + కాలువ: వరి, చెరుకు, పత్తి\n• ఏ మట్టైనా + బోర్వెల్: మొక్కజొన్న, పసుపు, వేరుశనగ\n• ఇసుక మట్టి + వర్షం: వేరుశనగ, మొక్కజొన్న\n\n❄️ **రబీ (నవ–మార్చి)**\n• మంచి నేల + నీరు: గోధుమ, టమాటో\n\n💰 **లాభాల క్రమం (ఎకరాకు)**\n1. పసుపు – ₹3-5 లక్షలు\n2. టమాటో – ₹2-4 లక్షలు\n3. పత్తి – ₹80K-1.2 లక్షలు`,
    kn: `ಬೆಳೆ ಶಿಫಾರಸು:\n\n☀️ **ಖರೀಫ್ (ಜೂನ್–ಅಕ್ಟೋ)**\n• ಕಪ್ಪು/ಲೋಮಿ + ಕಾಲುವೆ: ಭತ್ತ, ಕಬ್ಬು, ಹತ್ತಿ\n• ಯಾವ ಮಣ್ಣೂ + ಕೊಳವೆಬಾವಿ: ಮೆಕ್ಕೆ ಜೋಳ, ಅರಿಶಿನ, ಕಡಲೆ\n• ಮರಳು + ಮಳೆ: ಕಡಲೆ, ಮೆಕ್ಕೆ ಜೋಳ\n\n💰 **ಲಾಭದ ಕ್ರಮ (ಎಕರೆಗೆ)**\n1. ಅರಿಶಿನ – ₹3-5 ಲಕ್ಷ\n2. ಟೊಮೆಟೊ – ₹2-4 ಲಕ್ಷ\n3. ಹತ್ತಿ – ₹80K-1.2 ಲಕ್ಷ`
  }
}

function detectTopic(q: string): keyof typeof FALLBACKS {
  const l = q.toLowerCase()
  if (/pest|insect|worm|bug|armyworm|bollworm|aphid|whitefly|பூச்சி|कीट|పురుగు|ಕೀಟ/.test(l)) return 'pest'
  if (/disease|blight|rust|mold|rot|fungus|நோய்|रोग|వ్యాధి|ರೋಗ/.test(l)) return 'disease'
  if (/fertil|urea|npk|dap|manure|compost|உரம்|खाद|ఎరువు|ಗೊಬ್ಬರ/.test(l)) return 'fertilizer'
  if (/water|irrigat|drip|rain|drought|நீர்|सिंचाई|నీరు|ನೀರು/.test(l)) return 'irrigation'
  if (/soil|mitti|clay|loam|sandy|மண்|मिट्टी|మట్టి|ಮಣ್ಣು/.test(l)) return 'soil'
  if (/plant|crop|grow|sow|season|yield|பயிர்|फसल|పంట|ಬೆಳೆ/.test(l)) return 'crop_recommend'
  return 'crop_recommend'
}

export async function POST(req: NextRequest) {
  try {
    const { question, language = 'en', farmContext } = await req.json()
    const lang = LANG_MAP[language] ? language : 'en'

    // Build farm context string if provided
    const contextStr = farmContext
      ? `\n\nFarmer's farm details: Crop: ${farmContext.currentCrop || 'unknown'}, Soil: ${farmContext.soilType || 'unknown'}, Water: ${farmContext.waterSource || 'unknown'}, Farm size: ${farmContext.farmSize || 'unknown'} acres, Location: ${farmContext.district || 'India'}.`
      : ''

    // Try Google Gemini first (free tier available)
    const geminiKey = process.env.GEMINI_API_KEY
    if (geminiKey && geminiKey !== 'your-gemini-key') {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{
                  text: `You are AgriMind AI, an expert agricultural assistant specifically for Indian farmers. You MUST respond ENTIRELY in ${LANG_MAP[lang]} language only. Be practical, give specific quantities, timings, and product names relevant to India. Never give vague answers.${contextStr}`
                }]
              },
              contents: [{ parts: [{ text: question }] }],
              generationConfig: { maxOutputTokens: 600, temperature: 0.3 }
            }),
            signal: AbortSignal.timeout(10000),
          }
        )
        if (res.ok) {
          const data = await res.json()
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) return NextResponse.json({ response: text, source: 'gemini' })
        }
      } catch { /* fall through */ }
    }

    // Try OpenAI as secondary
    const openaiKey = process.env.OPENAI_API_KEY
    if (openaiKey && openaiKey !== 'sk-xxx') {
      try {
        const { default: OpenAI } = await import('openai')
        const openai = new OpenAI({ apiKey: openaiKey })
        const res = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: `You are AgriMind AI for Indian farmers. Respond ENTIRELY in ${LANG_MAP[lang]}. Be specific with quantities and product names.${contextStr}` },
            { role: 'user', content: question }
          ],
          max_tokens: 600,
        })
        return NextResponse.json({ response: res.choices[0].message.content, source: 'openai' })
      } catch { /* fall through */ }
    }

    // Smart topic-specific fallback
    const topic = detectTopic(question)
    const response = FALLBACKS[topic][lang] || FALLBACKS[topic]['en']
    return NextResponse.json({ response, source: 'fallback' })

  } catch {
    return NextResponse.json({ response: FALLBACKS.crop_recommend.en, source: 'fallback' })
  }
}
