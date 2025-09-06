from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import datetime
import os
import requests
from settings import get_settings
import logging
import re
import unicodedata
from app.services.kb_data import KB_EXTRA_ENTRIES
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import InputSupplier

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    reply: str
    timestamp: str
    assistant: str = "KhetGuru"

class ContactMessage(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    farmSize: Optional[str] = None
    interest: Optional[str] = None
    message: str

class ContactResponse(BaseModel):
    status: str
    detail: str

settings = get_settings()
logger = logging.getLogger("khetguru")

############################################################
# Lightweight bilingual (English/Hindi) agricultural Q&A KB #
############################################################
# Each entry has: patterns (tokens to match, lower-case), answer_en, answer_hi.
# Matching is simple token containment scoring (no heavy NLP to keep it fast & offline).

KB_ENTRIES: List[Dict[str, Any]] = [
    # Crop Recommendations
    {"patterns": ["sandy soil", "crop sandy", "sandy soil crop", "suitable sandy", "crops sandy", "grow sandy", "sandy soil suitable", "which crops sandy"],
     "answer_en": "Sandy soil is best for groundnut, potato, watermelon, and pulses.",
     "answer_hi": "बलुई मिट्टी में मूंगफली, आलू, तरबूज और दलहनी फसलें उगाएं।"},
    {"patterns": ["clay soil", "crop clay", "clay soil crop"],
     "answer_en": "Rice, wheat, and sugarcane grow well in clay soils because they retain water.",
     "answer_hi": "चिकनी मिट्टी में चावल, गेहूं और गन्ना अच्छी तरह उगते हैं क्योंकि यह पानी रोकती है।"},
    {"patterns": ["low rainfall", "drought resistant", "drought crop"],
     "answer_en": "Millets, pulses, oilseeds, and sorghum are drought-resistant and suitable for low rainfall areas.",
     "answer_hi": "बाजरा, दलहन, तिलहन और ज्वार सूखा सहिष्णु हैं और कम वर्षा वाले क्षेत्रों के लिए उपयुक्त हैं।"},
    {"patterns": ["black soil", "regur soil", "crop black soil"],
     "answer_en": "Cotton, soybean, and sunflower are ideal for black soil.",
     "answer_hi": "कपास, सोयाबीन और सूरजमुखी काली मिट्टी के लिए आदर्श हैं।"},
    {"patterns": ["saline soil", "salt soil", "crop saline"],
     "answer_en": "Barley and sugar beet tolerate saline soils better than rice.",
     "answer_hi": "जौ और चुकंदर चावल की तुलना में लवणीय मिट्टी को बेहतर सहन करते हैं।"},
    
    # Weather & Climate Predictions
    {"patterns": ["rainfall affect", "rainfall crop yield", "rainfall impact"],
     "answer_en": "Adequate rainfall supports growth, while too little causes drought stress and too much leads to waterlogging.",
     "answer_hi": "पर्याप्त वर्षा वृद्धि में सहायक है, जबकि कम वर्षा सूखे का तनाव और अधिक वर्षा जलभराव का कारण बनती है।"},
    {"patterns": ["winter crops", "rabi crops", "winter season"],
     "answer_en": "Wheat, mustard, chickpea, and barley are ideal Rabi crops for winter.",
     "answer_hi": "गेहूं, सरसों, चना और जौ सर्दियों के लिए आदर्श रबी फसलें हैं।"},
    {"patterns": ["maize temperature", "maize hot climate", "maize warm"],
     "answer_en": "Maize grows well in warm climates but needs proper irrigation.",
     "answer_hi": "मक्का गर्म जलवायु में अच्छी तरह उगता है लेकिन उचित सिंचाई की आवश्यकता होती है।"},
    {"patterns": ["flood prone", "flood area crops", "waterlogging crops"],
     "answer_en": "Jute, sugarcane, and rice varieties tolerant to waterlogging are suitable for flood-prone areas.",
     "answer_hi": "जूट, गन्ना और जलभराव सहिष्णु चावल की किस्में बाढ़ प्रवण क्षेत्रों के लिए उपयुक्त हैं।"},
    {"patterns": ["hot dry climate", "arid crops", "dry climate"],
     "answer_en": "Bajra (pearl millet), sorghum, pulses, and oilseeds are suitable for hot and dry climates.",
     "answer_hi": "बाजरा, ज्वार, दलहन और तिलहन गर्म और शुष्क जलवायु के लिए उपयुक्त हैं।"},
    
    # Soil & Fertility Insights
    {"patterns": ["soil test", "check soil fertility", "soil analysis"],
     "answer_en": "Get a soil test from a local lab; it shows nutrient levels and pH.",
     "answer_hi": "स्थानीय प्रयोगशाला से मिट्टी परीक्षण कराएं; यह पोषक तत्व स्तर और pH दिखाता है।"},
    {"patterns": ["acidic soil", "acid soil crops", "low ph soil"],
     "answer_en": "Tea, pineapple, potato, and ginger prefer acidic soil.",
     "answer_hi": "चाय, अनानास, आलू और अदरक अम्लीय मिट्टी पसंद करते हैं।"},
    {"patterns": ["alkaline soil", "high ph soil", "basic soil"],
     "answer_en": "Cotton, barley, and maize can tolerate alkaline soil.",
     "answer_hi": "कपास, जौ और मक्का क्षारीय मिट्टी को सहन कर सकते हैं।"},
    {"patterns": ["organic matter", "increase organic matter", "soil organic"],
     "answer_en": "Apply compost, farmyard manure, and practice green manuring to increase soil organic matter.",
     "answer_hi": "मिट्टी में जैविक पदार्थ बढ़ाने के लिए कम्पोस्ट, गोबर की खाद लगाएं और हरी खाद का अभ्यास करें।"},
    {"patterns": ["soil ph range", "ideal ph", "ph for crops"],
     "answer_en": "6.0–7.5 is suitable for most crops.",
     "answer_hi": "6.0–7.5 अधिकांश फसलों के लिए उपयुक्त है।"},
    
    # Farming Tips & Best Practices
    {"patterns": ["water conservation", "save water farming", "conserve water"],
     "answer_en": "Use drip irrigation, mulching, and rainwater harvesting to conserve water in farming.",
     "answer_hi": "खेती में पानी बचाने के लिए ड्रिप सिंचाई, मल्चिंग और वर्षा जल संचयन का उपयोग करें।"},
    {"patterns": ["increase crop yield", "improve yield", "higher yield"],
     "answer_en": "Use high-yield seeds, balanced fertilizers, proper irrigation, and pest management to increase crop yield.",
     "answer_hi": "फसल उत्पादन बढ़ाने के लिए उच्च उत्पादन वाले बीज, संतुलित उर्वरक, उचित सिंचाई और कीट प्रबंधन का उपयोग करें।"},
    {"patterns": ["wheat sowing time", "when sow wheat", "wheat planting"],
     "answer_en": "Wheat is usually sown in November–December in North India.",
     "answer_hi": "उत्तर भारत में गेहूं आमतौर पर नवंबर-दिसंबर में बोया जाता है।"},
    {"patterns": ["frost protection", "protect from frost", "frost damage"],
     "answer_en": "Use sprinklers at night, cover crops, or create windbreaks to protect crops from frost.",
     "answer_hi": "फसलों को पाले से बचाने के लिए रात में स्प्रिंकलर का उपयोग करें, फसलों को ढकें या हवा रोधक बनाएं।"},
    {"patterns": ["sugarcane intercrop", "sugarcane companion", "sugarcane mixed"],
     "answer_en": "Onion, garlic, and mustard are good intercrops with sugarcane.",
     "answer_hi": "प्याज, लहसुन और सरसों गन्ने के साथ अच्छी अंतरवर्ती फसलें हैं।"},
    
    # Pest & Disease Management
    {"patterns": ["natural pest control", "organic pest control", "biological control"],
     "answer_en": "Use neem oil, pheromone traps, and biological pest control for natural pest management.",
     "answer_hi": "प्राकृतिक कीट प्रबंधन के लिए नीम तेल, फेरोमोन ट्रैप और जैविक कीट नियंत्रण का उपयोग करें।"},
    {"patterns": ["bollworm cotton", "cotton pest", "cotton bollworm"],
     "answer_en": "Use Bt cotton varieties or apply recommended insecticides to control bollworms in cotton.",
     "answer_hi": "कपास में बॉलवर्म को नियंत्रित करने के लिए बीटी कपास की किस्में या अनुशंसित कीटनाशक का उपयोग करें।"},
    {"patterns": ["fungal diseases", "prevent fungus", "fungus control"],
     "answer_en": "Avoid waterlogging, use resistant varieties, and apply fungicides to prevent fungal diseases.",
     "answer_hi": "फंगल रोगों को रोकने के लिए जलभराव से बचें, प्रतिरोधी किस्में उपयोग करें और फफूंदनाशक लगाएं।"},
    {"patterns": ["crop rotation pest", "rotation pest control", "crop rotation benefits"],
     "answer_en": "Rotating crops breaks the pest and disease cycle, reducing pest pressure.",
     "answer_hi": "फसल चक्रण कीट और रोग चक्र को तोड़ता है, कीट दबाव को कम करता है।"},
    {"patterns": ["rice weed control", "weed rice field", "rice weeds"],
     "answer_en": "Use pre-emergence herbicides and manual weeding to control weeds in rice fields.",
     "answer_hi": "चावल के खेतों में खरपतवार नियंत्रण के लिए पूर्व-उद्भव शाकनाशी और हाथ से निराई का उपयोग करें।"},
    
    # Technology in Farming
    {"patterns": ["sensors farming", "agricultural sensors", "farm sensors"],
     "answer_en": "Sensors monitor soil moisture, temperature, and nutrient levels for precise farming decisions.",
     "answer_hi": "सेंसर सटीक खेती के निर्णयों के लिए मिट्टी की नमी, तापमान और पोषक तत्व स्तर की निगरानी करते हैं।"},
    {"patterns": ["weather forecasting", "weather forecast farming", "weather prediction"],
     "answer_en": "Weather forecasting guides sowing, irrigation, and harvesting decisions for better crop management.",
     "answer_hi": "मौसम पूर्वानुमान बेहतर फसल प्रबंधन के लिए बुवाई, सिंचाई और कटाई के निर्णयों का मार्गदर्शन करता है।"},
    {"patterns": ["drone spraying", "drone agriculture", "drone farming"],
     "answer_en": "Drone spraying uses drones to spray pesticides and fertilizers uniformly on crops.",
     "answer_hi": "ड्रोन स्प्रेइंग फसलों पर कीटनाशक और उर्वरक को समान रूप से छिड़कने के लिए ड्रोन का उपयोग करती है।"},
    {"patterns": ["mobile apps farming", "farming apps", "agriculture apps"],
     "answer_en": "Mobile apps provide weather forecasts, market prices, and crop advisory services to farmers.",
     "answer_hi": "मोबाइल ऐप किसानों को मौसम पूर्वानुमान, बाजार मूल्य और फसल सलाहकार सेवाएं प्रदान करते हैं।"},
    {"patterns": ["precision farming", "precision agriculture", "smart farming"],
     "answer_en": "Precision farming uses data, GPS, and technology to optimize inputs and maximize yield.",
     "answer_hi": "सटीक खेती इनपुट को अनुकूलित करने और उत्पादन को अधिकतम करने के लिए डेटा, GPS और प्रौद्योगिकी का उपयोग करती है।"},
    
    # Irrigation & Water Use
    {"patterns": ["drip irrigation", "water saving irrigation", "efficient irrigation", "what is drip", "drip irrigation method", "drip system", "drip watering"],
     "answer_en": "Drip irrigation saves the most water by delivering water directly to plant roots.",
     "answer_hi": "ड्रिप सिंचाई पानी को सीधे पौधों की जड़ों तक पहुंचाकर सबसे अधिक पानी बचाती है।"},
    {"patterns": ["waterlogging prevention", "prevent waterlogging", "drainage"],
     "answer_en": "Improve drainage, use raised beds, and avoid over-irrigation to prevent waterlogging.",
     "answer_hi": "जलभराव को रोकने के लिए जल निकासी में सुधार करें, उठी क्यारियों का उपयोग करें और अधिक सिंचाई से बचें।"},
    {"patterns": ["sprinkler irrigation", "sprinkler system", "sprinkler farming"],
     "answer_en": "Sprinkler irrigation is suitable for light soils and crops like wheat, pulses, and vegetables.",
     "answer_hi": "स्प्रिंकलर सिंचाई हल्की मिट्टी और गेहूं, दलहन और सब्जियों जैसी फसलों के लिए उपयुक्त है।"},
    {"patterns": ["flowering irrigation", "irrigate flowering", "flowering water"],
     "answer_en": "Irrigation during flowering is critical to prevent yield loss and ensure proper fruit development.",
     "answer_hi": "फूल आने के दौरान सिंचाई उत्पादन हानि को रोकने और उचित फल विकास सुनिश्चित करने के लिए महत्वपूर्ण है।"},
    {"patterns": ["sandy soil irrigation", "irrigate sandy", "sandy irrigation"],
     "answer_en": "Sandy soil needs frequent irrigation as it does not hold water for long periods.",
     "answer_hi": "बलुई मिट्टी को लंबे समय तक पानी नहीं रोकने के कारण बार-बार सिंचाई की आवश्यकता होती है।"},
    
    # Government Schemes & Support
    {"patterns": ["msp", "minimum support price", "support price"],
     "answer_en": "MSP is the fixed price at which the government buys crops from farmers to protect them from price fluctuations.",
     "answer_hi": "एमएसपी वह निर्धारित मूल्य है जिस पर सरकार किसानों को मूल्य उतार-चढ़ाव से बचाने के लिए फसलें खरीदती है।"},
    {"patterns": ["pmfby", "crop insurance", "fasal bima"],
     "answer_en": "PMFBY covers most food crops, oilseeds, and horticultural crops against natural disasters.",
     "answer_hi": "पीएमएफबीवाई अधिकांश खाद्य फसलों, तिलहन और बागवानी फसलों को प्राकृतिक आपदाओं से कवर करता है।"},
    {"patterns": ["kisan credit card", "kcc", "farmer credit"],
     "answer_en": "Visit your nearest bank with land documents and Aadhaar card to apply for a Kisan Credit Card.",
     "answer_hi": "किसान क्रेडिट कार्ड के लिए आवेदन करने के लिए जमीन के दस्तावेज और आधार कार्ड के साथ अपने निकटतम बैंक में जाएं।"},
    {"patterns": ["pm kisan", "pmkisan", "kisan samman"],
     "answer_en": "PM-Kisan Samman Nidhi provides ₹6,000 annually in 3 installments directly to farmers' accounts.",
     "answer_hi": "पीएम-किसान सम्मान निधि किसानों के खातों में सीधे 3 किस्तों में वार्षिक ₹6,000 प्रदान करती है।"},
    {"patterns": ["kisan suvidha", "government app", "farmer app"],
     "answer_en": "The 'Kisan Suvidha' app provides real-time scheme and weather information for farmers.",
     "answer_hi": "'किसान सुविधा' ऐप किसानों के लिए वास्तविक समय योजना और मौसम की जानकारी प्रदान करता है।"},
    
    # Modern Practices & Profitability
    {"patterns": ["organic farming profit", "organic profitable", "organic income"],
     "answer_en": "Organic farming is profitable as organic products sell at higher market prices despite initial lower yield.",
     "answer_hi": "जैविक खेती लाभदायक है क्योंकि प्रारंभिक कम उत्पादन के बावजूद जैविक उत्पाद उच्च बाजार मूल्य पर बेचे जाते हैं।"},
    {"patterns": ["high value crops", "profitable crops", "income crops"],
     "answer_en": "Spices, medicinal plants, exotic vegetables, and floriculture crops can increase farm income significantly.",
     "answer_hi": "मसाले, औषधीय पौधे, विदेशी सब्जियां और फूलों की खेती कृषि आय को काफी बढ़ा सकती है।"},
    {"patterns": ["contract farming", "contract agriculture", "agreement farming"],
     "answer_en": "Contract farming is an agreement between farmers and buyers where crops are grown as per contract terms.",
     "answer_hi": "अनुबंध खेती किसानों और खरीदारों के बीच एक समझौता है जहां फसलें अनुबंध की शर्तों के अनुसार उगाई जाती हैं।"},
    {"patterns": ["polyhouse farming", "greenhouse farming", "protected cultivation"],
     "answer_en": "Polyhouse farming allows controlled conditions, increasing yield and quality of crops.",
     "answer_hi": "पॉलीहाउस खेती नियंत्रित स्थितियों की अनुमति देती है, फसलों की उत्पादकता और गुणवत्ता बढ़ाती है।"},
    {"patterns": ["profitable fruits", "fruit farming", "fruit crops"],
     "answer_en": "Mango, banana, and pomegranate are highly profitable fruit crops in India.",
     "answer_hi": "आम, केला और अनार भारत में अत्यधिक लाभदायक फल फसलें हैं।"},
    
    # Miscellaneous Farmer Queries
    {"patterns": ["grain storage", "store grains", "grain preservation"],
     "answer_en": "Use airtight containers, fumigation, and dry storage to prevent pests and store grains safely.",
     "answer_hi": "कीटों को रोकने और अनाज को सुरक्षित रूप से भंडारित करने के लिए वायुरुद्ध कंटेनर, फ्यूमिगेशन और सूखे भंडारण का उपयोग करें।"},
    {"patterns": ["rice harvest time", "when harvest rice", "rice maturity"],
     "answer_en": "Harvest rice when 80–85% of the grains turn golden yellow for optimal quality.",
     "answer_hi": "इष्टतम गुणवत्ता के लिए चावल की कटाई तब करें जब 80-85% दाने सुनहरे पीले हो जाएं।"},
    {"patterns": ["pollination crops", "improve pollination", "crop pollination"],
     "answer_en": "Encourage bees, avoid harmful pesticides, and plant flowering crops nearby to improve pollination.",
     "answer_hi": "परागण में सुधार के लिए मधुमक्खियों को प्रोत्साहित करें, हानिकारक कीटनाशकों से बचें और पास में फूलों वाली फसलें लगाएं।"},
    {"patterns": ["weather updates", "daily weather", "weather information"],
     "answer_en": "Use IMD website, weather apps, or SMS alerts to get daily weather updates.",
     "answer_hi": "दैनिक मौसम अपडेट प्राप्त करने के लिए आईएमडी वेबसाइट, मौसम ऐप या एसएमएस अलर्ट का उपयोग करें।"},
    {"patterns": ["climate smart farming", "climate adaptation", "climate resilient"],
     "answer_en": "Use drought-resistant seeds, adopt water-saving irrigation, and diversify crops for climate-smart farming.",
     "answer_hi": "जलवायु-स्मार्ट खेती के लिए सूखा प्रतिरोधी बीजों का उपयोग करें, पानी बचाने वाली सिंचाई अपनाएं और फसलों में विविधता लाएं।"},
    
    # Original entries continue...
    # Soil & Fertility
    {"patterns": ["soil fertility", "improve soil", "fertility", "मिट्टी की उर्वरता"],
     "answer_en": "Improve soil fertility with compost, green manure, crop rotation, and balanced NPK.",
     "answer_hi": "मिट्टी की उर्वरता बढ़ाने हेतु कम्पोस्ट, हरी खाद, फसल चक्र व संतुलित NPK दें।"},
    {"patterns": ["soil ph", "adjust ph", "high ph", "low ph"],
     "answer_en": "Ideal pH 6.0–7.5. To lower pH add elemental sulfur/organic matter; to raise pH apply lime.",
     "answer_hi": "उपयुक्त pH 6.0–7.5. pH अधिक हो तो गंधक/जैविक पदार्थ, कम हो तो चुना (लाइम) डालें।"},
    {"patterns": ["organic matter", "add compost", "compost"],
     "answer_en": "Add 2–3 tons/acre well decomposed compost before sowing to boost structure.",
     "answer_hi": "बुवाई से पहले 2–3 टन/एकड़ सड़ी हुई खाद मिलाएँ जिससे संरचना सुधरे।"},
    {"patterns": ["micronutrient deficiency", "zinc deficiency", "zn deficiency"],
     "answer_en": "Zinc deficiency: yellowing between veins in young leaves. Apply 25 kg/ha zinc sulphate.",
     "answer_hi": "जिंक कमी: नई पत्तियों में शिराओं के बीच पीला। 25 किग्रा/हेक्टेयर जिंक सल्फेट दें।"},
    {"patterns": ["iron deficiency", "fe deficiency", "chlorosis"],
     "answer_en": "Iron deficiency causes interveinal chlorosis. Foliar spray 0.5% ferrous sulphate.",
     "answer_hi": "लौह कमी में शिराओं के बीच पीला। 0.5% फेरस सल्फेट का पर्णीय छिड़काव करें।"},
    {"patterns": ["nitrogen deficiency", "n deficiency"],
     "answer_en": "Nitrogen deficiency: uniform yellowing older leaves. Top dress urea in moist soil.",
     "answer_hi": "नाइट्रोजन कमी: पुरानी पत्तियों का समरूप पीला। नमी वाली मिट्टी में यूरिया टॉप ड्रेस करें।"},
    {"patterns": ["phosphorus deficiency", "p deficiency"],
     "answer_en": "Phosphorus deficiency: stunted plants, purplish leaves. Apply SSP at sowing.",
     "answer_hi": "फास्फोरस कमी: रूकाव, बैंगनी पत्तियाँ। बुवाई पर एसएसपी दें।"},
    {"patterns": ["potassium deficiency", "k deficiency"],
     "answer_en": "Potassium deficiency: leaf edge yellow/burn. Apply MOP split doses.",
     "answer_hi": "पोटाश कमी: पत्ती किनारा पीला/झुलसा। एमओपी विभाजित मात्रा दें।"},
    {"patterns": ["soil test", "test soil"],
     "answer_en": "Soil test every 2–3 years guides balanced fertilizer use and saves cost.",
     "answer_hi": "मिट्टी परीक्षण 2–3 वर्ष में एक बार करें ताकि संतुलित उर्वरक व लागत बचत हो।"},
    {"patterns": ["green manure", "dhaincha", "sunhemp"],
     "answer_en": "Incorporate green manure (dhaincha/sunhemp) at 45 days to add organic nitrogen.",
     "answer_hi": "हरी खाद (ढैंचा/सनहेम्प) को 45 दिन पर पलटने से जैविक नाइट्रोजन मिलता है।"},
    # Water & Irrigation
    {"patterns": ["drip irrigation", "benefit drip"],
     "answer_en": "Drip irrigation saves 30–50% water, improves fertilizer efficiency, reduces weeds.",
     "answer_hi": "ड्रिप सिंचाई 30–50% पानी बचाती, उर्वरक दक्षता बढ़ाती व खरपतवार घटाती है।"},
    {"patterns": ["sprinkler irrigation", "benefit sprinkler"],
     "answer_en": "Sprinklers suit light soils & undulating land; give uniform application.",
     "answer_hi": "स्प्रिंकलर हल्की मिट्टी व असमतल भूमि पर समान जल आपूर्ति देता है।"},
    {"patterns": ["water conservation", "save water", "mulch moisture"],
     "answer_en": "Mulching + drip + timely weeding conserve soil moisture effectively.",
     "answer_hi": "मल्चिंग + ड्रिप + समय पर निराई से नमी संरक्षण अच्छा होता है।"},
    {"patterns": ["rainwater harvesting", "farm pond"],
     "answer_en": "Construct a farm pond to store monsoon runoff for protective irrigation.",
     "answer_hi": "मानसून बहाव संग्रह हेतु फार्म पॉन्ड बनाकर रक्षात्मक सिंचाई करें।"},
    {"patterns": ["irrigation schedule", "when irrigate"] ,
     "answer_en": "Irrigate at critical stages: germination, flowering, grain filling for cereals.",
     "answer_hi": "महत्वपूर्ण अवस्थाओं (अंकुरण, फूल, दाना) पर सिंचाई करें।"},
    # Crop Management
    {"patterns": ["seed treatment", "treat seed"],
     "answer_en": "Treat seed with fungicide + biofertilizer (e.g. Trichoderma + Rhizobium) before sowing.",
     "answer_hi": "बीजोपचार: फफूंदनाशी + जैव उर्वरक (ट्राइकोडर्मा + राइजोबियम) लगाएँ।"},
    {"patterns": ["seed rate wheat", "wheat seed rate"],
     "answer_en": "Wheat seed rate: 100–120 kg/ha (line sowing) with proper spacing.",
     "answer_hi": "गेहूँ बीज दर: 100–120 किग्रा/हेक्टेयर (लाइन बोवाई) उचित दूरी पर।"},
    {"patterns": ["rice nursery", "paddy nursery"],
     "answer_en": "Use healthy paddy seedlings 20–25 days old for transplanting.",
     "answer_hi": "धान की 20–25 दिन पुरानी स्वस्थ पौध रोपाई हेतु लें।"},
    {"patterns": ["sowing depth", "seed depth"],
     "answer_en": "Most cereals: sow at 4–5 cm depth; too deep delays emergence.",
     "answer_hi": "अधिकांश अनाज 4–5 सेमी गहराई पर बोएँ; अधिक गहराई अंकुरण धीमा करती।"},
    {"patterns": ["crop rotation", "rotate crop"],
     "answer_en": "Rotate cereals with legumes to break pest cycles & add nitrogen.",
     "answer_hi": "अनाज के साथ दलहनी फसल चक्र से कीट चक्र टूटता व नाइट्रोजन जुड़ता।"},
    {"patterns": ["intercropping", "mix crop"],
     "answer_en": "Intercropping spreads risk and improves resource use efficiency.",
     "answer_hi": "अंतरवर्तीय फसल जोखिम घटाती व संसाधन उपयोग दक्षता बढ़ाती।"},
    {"patterns": ["weed control", "manage weeds"],
     "answer_en": "Early 30–45 day hand weeding + mulching reduces later weed pressure.",
     "answer_hi": "पहले 30–45 दिन हाथ निराई + मल्चिंग से बाद का खरपतवार दबाव घटता।"},
    {"patterns": ["mulching", "mulch benefits"],
     "answer_en": "Mulch moderates soil temperature, conserves moisture, suppresses weeds.",
     "answer_hi": "मल्च ताप नियंत्रित, नमी संरक्षित व खरपतवार दबाव घटाता।"},
    {"patterns": ["pruning orchard", "prune tree"],
     "answer_en": "Prune dead/diseased branches post-harvest to improve light & airflow.",
     "answer_hi": "कटाई बाद सूखी/बीमार डालियाँ काटने से प्रकाश व हवा सुधरती।"},
    {"patterns": ["grafting", "graft"],
     "answer_en": "Grafting combines hardy rootstock + desired scion for vigor & yield.",
     "answer_hi": "ग्राफ्टिंग से मजबूत रुटस्टॉक व इच्छित स्कायन मिलाकर ताकत व उपज बढ़ती।"},
    {"patterns": ["spacing tomato", "tomato spacing"],
     "answer_en": "Tomato spacing: 60 x 45 cm (variety) or wider for hybrids.",
     "answer_hi": "टमाटर दूरी: 60 x 45 सेमी (किस्म) या हाइब्रिड हेतु अधिक।"},
    {"patterns": ["banana spacing", "banana plant distance"],
     "answer_en": "Banana: 1.8 x 1.5 m spacing common for dwarf varieties.",
     "answer_hi": "केला: बौनी किस्म हेतु 1.8 x 1.5 मी दूरी सामान्य।"},
    {"patterns": ["maize spacing", "corn spacing"],
     "answer_en": "Maize: 60–75 cm rows, 20 cm plants for good aeration.",
     "answer_hi": "मक्का: 60–75 सेमी कतार, पौध 20 सेमी पर।"},
    {"patterns": ["soybean spacing"],
     "answer_en": "Soybean: 45 cm rows, 5–7 cm plant spacing ensures canopy.",
     "answer_hi": "सोयाबीन: 45 सेमी कतार, 5–7 सेमी पौध दूरी।"},
    {"patterns": ["pulse inoculation", "rhizobium"],
     "answer_en": "Inoculate pulse seed with Rhizobium for higher nitrogen fixation.",
     "answer_hi": "दलहनी बीज राइजोबियम से उपचारित करें ताकि नाइट्रोजन स्थिरीकरण बढ़े।"},
    # Pest & Disease Management
    {"patterns": ["ipm", "integrated pest", "pest management"],
     "answer_en": "IPM: monitor fields, use resistant varieties, biocontrols, need-based sprays.",
     "answer_hi": "आईपीएम: निगरानी, प्रतिरोधी किस्में, जैव नियंत्रण, आवश्यकता अनुसार छिड़काव।"},
    {"patterns": ["neem oil", "neem spray"],
     "answer_en": "Neem oil 2–3 ml/l acts as repellent & growth regulator for soft pests.",
     "answer_hi": "नीम तेल 2–3 मि.ली./ली. कोमल कीटों हेतु प्रतिकारक व वृद्धि नियंत्रक।"},
    {"patterns": ["aphid control", "aphids"],
     "answer_en": "Control aphids with yellow sticky traps + neem + need-based insecticide.",
     "answer_hi": "चेपा नियंत्रण: पीले ट्रैप + नीम + आवश्यकता पर कीटनाशी।"},
    {"patterns": ["bollworm", "boll worm"],
     "answer_en": "For bollworm: pheromone traps + timely insecticide rotation.",
     "answer_hi": "बॉलवर्म हेतु फेरोमोन ट्रैप + समय पर कीटनाशी बदल-बदल कर।"},
    {"patterns": ["blight potato", "late blight"],
     "answer_en": "Late blight: ensure drainage; prophylactic fungicide sprays on forecast.",
     "answer_hi": "लेट ब्लाइट: जल निकासी रखें; पूर्वानुमान पर निवारक फफूंदनाशी छिड़कें।"},
    {"patterns": ["powdery mildew"],
     "answer_en": "Powdery mildew: improve airflow, sulfur or suitable fungicide early.",
     "answer_hi": "पाउडरी मिल्ड्यू: वायु संचार बढ़ाएँ, सल्फर/उपयुक्त फफूंदनाशी प्रारंभिक।"},
    {"patterns": ["rust disease"],
     "answer_en": "Rust: remove volunteer hosts, use resistant variety, timely spray.",
     "answer_hi": "रस्ट: स्वैच्छिक पौधे हटाएँ, प्रतिरोधी किस्म, समय पर छिड़काव।"},
    {"patterns": ["stem borer", "stemborer"],
     "answer_en": "Stem borer: light traps + rogue dead hearts + need-based insecticide.",
     "answer_hi": "स्टेम बोरर: प्रकाश ट्रैप + मृत हृदय हटाएँ + आवश्यकता पर कीटनाशी।"},
    {"patterns": ["whitefly"],
     "answer_en": "Whitefly: yellow traps, neem extract, conserve parasitoids.",
     "answer_hi": "व्हाइटफ्लाई: पीले ट्रैप, नीम अर्क, परजीवी संरक्षण।"},
    {"patterns": ["fruit fly"],
     "answer_en": "Fruit fly: protein bait traps + sanitation of fallen fruits.",
     "answer_hi": "फ्रूट फ्लाई: प्रोटीन बाइट ट्रैप + गिरे फलों की सफाई।"},
    # Nutrition & Inputs
    {"patterns": ["split dose urea", "split urea"],
     "answer_en": "Split urea: basal + tillering + panicle initiation improves N use.",
     "answer_hi": "यूरिया विभाजित: बेसल + टिलरिंग + पैनिकल आरम्भ से N उपयोग बेहतर।"},
    {"patterns": ["foliar spray", "leaf spray"],
     "answer_en": "Foliar feeding corrects micronutrient deficiency quickly.",
     "answer_hi": "पर्णीय पोषण सूक्ष्म पोषक कमी शीघ्र ठीक करता।"},
    {"patterns": ["biofertilizer", "azotobacter", "azospirillum"],
     "answer_en": "Use biofertilizers to reduce chemical N input 15–25%.",
     "answer_hi": "जैव उर्वरक से रासायनिक नाइट्रोजन 15–25% घटाएँ।"},
    {"patterns": ["vermicompost", "worm compost"],
     "answer_en": "Vermicompost improves microbial activity & nutrient availability.",
     "answer_hi": "वर्मीकम्पोस्ट सूक्ष्मजीव सक्रियता व पोषक उपलब्धता बढ़ाता।"},
    {"patterns": ["composting", "make compost"],
     "answer_en": "Layer greens+browns, maintain moisture & turn for aerobic composting.",
     "answer_hi": "हरी+सूखी परतें, नमी संतुलन व पलटना रखें ताकि ऐरोबिक कम्पोस्ट बने।"},
    {"patterns": ["bio pesticide", "biopesticide"],
     "answer_en": "Biopesticides (Bt, Trichoderma, NPV) reduce chemical reliance.",
     "answer_hi": "जैव कीटनाशी (बीटी, ट्राइकोडर्मा, एनपीवी) रासायनिक निर्भरता घटाते।"},
    # Harvest & Post Harvest
    {"patterns": ["harvest maturity", "when harvest"],
     "answer_en": "Harvest at physiological maturity: proper grain hardness & moisture.",
     "answer_hi": "शारीरिक परिपक्वता पर कटाई: सही दाना कठोरता व नमी स्तर।"},
    {"patterns": ["paddy harvest moisture", "rice harvest moisture"],
     "answer_en": "Harvest paddy around 20–22% moisture; dry to 12–13% for storage.",
     "answer_hi": "धान 20–22% नमी पर काटें; भंडारण हेतु 12–13% तक सुखाएँ।"},
    {"patterns": ["grain storage", "store grain"],
     "answer_en": "Store dry grain in airtight, cool, clean bins to prevent pests.",
     "answer_hi": "सूखे अनाज को साफ, ठंडे, वायुरुद्ध बर्तनों में रखें।"},
    {"patterns": ["storage pest", "weevil"],
     "answer_en": "Use botanicals (neem leaves) or safe fumigation for storage pests.",
     "answer_hi": "भंडारण कीट हेतु नीम पत्तियाँ या सुरक्षित फ्यूमिगेशन करें।"},
    {"patterns": ["value addition", "grading sorting"],
     "answer_en": "Grading & simple packaging improve market price.",
     "answer_hi": "ग्रेडिंग व सरल पैकिंग से बाजार मूल्य बढ़ता।"},
    # Market & Economics
    {"patterns": ["mandi price", "market rate"],
     "answer_en": "Check daily mandi prices via official agri market portals/apps.",
     "answer_hi": "दैनिक मंडी भाव आधिकारिक कृषि पोर्टल/ऐप पर देखें।"},
    {"patterns": ["fpo", "farmer producer organization"],
     "answer_en": "Joining an FPO improves bargaining & input cost pooling.",
     "answer_hi": "एफपीओ जुड़ने से मोलभाव व सामूहिक लागत लाभ मिलता।"},
    {"patterns": ["contract farming"],
     "answer_en": "Contract farming offers price assurance; read terms carefully.",
     "answer_hi": "कॉन्ट्रैक्ट फार्मिंग मूल्य आश्वासन देती; शर्तें ध्यान से पढ़ें।"},
    # Government / Schemes / Insurance
    {"patterns": ["pm kisan", "pmkisan"],
     "answer_en": "PM-KISAN provides income support to eligible small farmers.",
     "answer_hi": "पीएम-किसान योजना पात्र छोटे किसानों को आय सहायता देती।"},
    {"patterns": ["pmfby", "fasal bima", "crop insurance"],
     "answer_en": "PMFBY crop insurance covers yield loss from natural calamities.",
     "answer_hi": "प्रधानमंत्री फसल बीमा योजना प्राकृतिक आपदा से उपज हानि कवर करती।"},
    {"patterns": ["kcc loan", "kisan credit card"],
     "answer_en": "KCC offers timely credit at concessional interest for farm inputs.",
     "answer_hi": "केसीसी सस्ती ब्याज दर पर कृषि इनपुट हेतु समय पर ऋण देता।"},
    # Climate / Risk
    {"patterns": ["drought management", "manage drought"],
     "answer_en": "Drought: moisture conservation, drought-tolerant varieties, life-saving irrigation.",
     "answer_hi": "सूखा: नमी संरक्षण, सहनशील किस्में, जीवनरक्षक सिंचाई।"},
    {"patterns": ["flood management", "water logging"] ,
     "answer_en": "Flood: drainage channels, raised beds, timely re-sowing if needed.",
     "answer_hi": "बाढ़: निकासी नाली, उठी क्यारियाँ, आवश्यकता पर पुनर्बुवाई।"},
    {"patterns": ["heat stress", "heatwave"],
     "answer_en": "Heat stress: mulching + micro-irrigations + heat tolerant varieties.",
     "answer_hi": "ताप तनाव: मल्चिंग + हल्की सिंचाई + सहनशील किस्में।"},
    {"patterns": ["cold stress", "frost"],
     "answer_en": "Frost: light irrigation & smoke generation reduce injury.",
     "answer_hi": "पाला: हल्की सिंचाई व धुआँ देने से क्षति घटती।"},
    # Technology / Protected
    {"patterns": ["greenhouse", "polyhouse"],
     "answer_en": "Greenhouse enables off-season high value vegetable/flower production.",
     "answer_hi": "ग्रीनहाउस से मौसम से बाहर ऊँची मूल्य वाली सब्ज़ी/फूल उत्पादन संभव।"},
    {"patterns": ["shade net", "shadehouse"],
     "answer_en": "Shade nets reduce heat & sun scorch for nursery raising.",
     "answer_hi": "शेड नेट नर्सरी हेतु ताप व धूप झुलसा घटाता।"},
    {"patterns": ["sensor", "iot farming"],
     "answer_en": "Soil moisture sensors optimize irrigation timing & save water.",
     "answer_hi": "मिट्टी नमी सेंसर सिंचाई समय अनुकूलित कर पानी बचाते।"},
    # Livestock / Integrated
    {"patterns": ["integrated farming", "ifs"],
     "answer_en": "Integrated farming links crops + livestock + fish for recycling & income stability.",
     "answer_hi": "एकीकृत खेती: फसल + पशु + मत्स्य से पुनर्चक्रण व आय स्थिरता।"},
    {"patterns": ["dairy compost", "cow dung"],
     "answer_en": "Use properly composted dung to avoid weed seeds & pathogens.",
     "answer_hi": "गोबर को पूर्ण कम्पोस्ट बनाकर दें ताकि खरपतवार बीज/रोगाणु न रहें।"},
    # Miscellaneous
    {"patterns": ["plant population", "optimal population"],
     "answer_en": "Maintain optimal plant population to maximize light interception & yield.",
     "answer_hi": "उपयुक्त पौध संख्या से प्रकाश उपयोग व उपज अधिक होती।"},
    {"patterns": ["resistant variety", "disease resistant"],
     "answer_en": "Choosing resistant varieties is cheapest long-term disease management.",
     "answer_hi": "प्रतिरोधी किस्म चयन दीर्घकालीन रोग प्रबंधन का सस्ता तरीका।"},
    {"patterns": ["soil erosion", "prevent erosion"],
     "answer_en": "Contour bunds + cover crops reduce soil erosion on slopes.",
     "answer_hi": "कॉन्टर बंड + आवरण फसल ढाल पर क्षरण घटाते।"},
    {"patterns": ["cover crop", "cover cropping"],
     "answer_en": "Cover crops protect soil, suppress weeds, add organic matter.",
     "answer_hi": "कवर क्रॉप मिट्टी बचाता, खरपतवार दबाता, जैविक पदार्थ जोड़ता।"},
    {"patterns": ["saline soil", "salinity"],
     "answer_en": "Salinity: improve drainage, apply gypsum if sodic, use tolerant crops.",
     "answer_hi": "लवणीयता: निकासी सुधारें, सोडिक में जिप्सम दें, सहनशील फसल लगाएँ।"},
    {"patterns": ["acid soil", "acidity"],
     "answer_en": "Acid soil: apply agricultural lime based on soil test recommendation.",
     "answer_hi": "अम्लीय मिट्टी: परीक्षण अनुशंसा अनुसार कृषि चुना डालें।"},
    {"patterns": ["integrated nutrient", "inm"],
     "answer_en": "INM blends organic + inorganic + bio sources for sustainability.",
     "answer_hi": "एकीकृत पोषण (INM) जैविक+रासायनिक+जैव स्रोत मिलाकर टिकाऊ बनाता।"},
    {"patterns": ["plant growth regulator", "pgr"],
     "answer_en": "Use PGRs only per label; excess causes imbalance.",
     "answer_hi": "पीजीआर लेबल अनुसार; अधिक मात्रा असंतुलन लाती।"},
    {"patterns": ["seed germination", "improve germination"],
     "answer_en": "Proper moisture + quality seed + correct depth ensure good germination.",
     "answer_hi": "उचित नमी + गुणवत्तायुक्त बीज + सही गहराई से अच्छा अंकुरण।"},
    {"patterns": ["post harvest loss", "reduce loss"],
     "answer_en": "Dry to safe moisture & clean storage to reduce post-harvest loss.",
     "answer_hi": "सुरक्षित नमी तक सुखाना व साफ भंडारण से कटाई उपरांत हानि घटती।"},
    {"patterns": ["export quality", "quality standards"],
     "answer_en": "Follow grading, residue limits, proper packaging for export quality.",
     "answer_hi": "निर्यात गुणवत्ता हेतु ग्रेडिंग, अवशेष सीमा व उचित पैकेजिंग अपनाएँ।"},
    {"patterns": ["organic certification", "organic farming"],
     "answer_en": "Organic certification needs record keeping & avoiding prohibited inputs.",
     "answer_hi": "ऑर्गैनिक प्रमाणन हेतु अभिलेख रखें व प्रतिबंधित पदार्थ न प्रयोग करें।"},
    {"patterns": ["soil moisture sensor", "moisture sensor"],
     "answer_en": "Moisture sensors prevent over-irrigation & save pumping cost.",
     "answer_hi": "नमी सेंसर अधिक सिंचाई रोककर पम्पिंग लागत बचाते।"},
    {"patterns": ["labor saving", "reduce labor"],
     "answer_en": "Use mechanized planters & weeders to reduce labor cost.",
     "answer_hi": "यंत्रीकृत प्लांटर व वीडर से श्रम लागत घटती।"},
    {"patterns": ["farm record", "record keeping"],
     "answer_en": "Maintain farm records for input cost tracking & loan access.",
     "answer_hi": "इनपुट लागत व ऋण सुविधा हेतु फार्म रिकार्ड रखें।"},
    {"patterns": ["precision farming", "precision"],
     "answer_en": "Precision farming tailors inputs to site variability for efficiency.",
     "answer_hi": "प्रिसिजन खेती स्थल विविधता अनुसार इनपुट देकर दक्षता बढ़ाती।"},
    {"patterns": ["soil health", "improve soil health"],
     "answer_en": "Soil health: organic matter, minimal tillage, cover crops, diversity.",
     "answer_hi": "मिट्टी स्वास्थ्य: जैविक पदार्थ, न्यून जुताई, कवर क्रॉप, विविधता।"},
    {"patterns": ["carbon sequestration", "soil carbon"],
     "answer_en": "Add residues & reduce tillage to build soil carbon.",
     "answer_hi": "अवशेष जोड़ें व जुताई घटाकर मिट्टी कार्बन बढ़ाएँ।"},
    {"patterns": ["soil structure", "improve structure"],
     "answer_en": "Organic matter + reduced compaction improve soil structure.",
     "answer_hi": "जैविक पदार्थ + कम संपीड़न से संरचना सुधरती।"},
    {"patterns": ["saline irrigation", "saline water"],
     "answer_en": "Use salt-tolerant crops & blend saline water if EC high.",
     "answer_hi": "उच्च EC पर लवण सहिष्णु फसलें लगाएँ व पानी मिश्रण करें।"},
    {"patterns": ["fertigation"],
     "answer_en": "Fertigation delivers nutrients precisely via drip lines.",
     "answer_hi": "फर्टिगेशन ड्रिप से पोषक सटीक पहुँचाता।"},
    {"patterns": ["spray schedule", "spray interval"],
     "answer_en": "Follow label spray intervals to prevent resistance.",
     "answer_hi": "प्रतिरोध रोकने हेतु लेबल स्प्रे अंतराल मानें।"},
    {"patterns": ["pest resistance", "resistance management"],
     "answer_en": "Rotate insecticide modes of action for resistance management.",
     "answer_hi": "प्रतिरोध प्रबंधन हेतु कीटनाशी क्रिया-विधि बदलते रहें।"},
    {"patterns": ["soil compaction", "hard pan"],
     "answer_en": "Avoid working wet soil; use deep tillage sparingly to break hardpan.",
     "answer_hi": "गीली मिट्टी पर जुताई न करें; हार्डपैन तोड़ने डीप टिलेज सीमित करें।"},
    {"patterns": ["farmer income", "increase income"],
     "answer_en": "Diversify crops + value addition + better market linkage raise income.",
     "answer_hi": "फसल विविधता + मूल्य संवर्धन + बेहतर बाजार सम्पर्क से आय बढ़ती।"},
    {"patterns": ["climate smart", "climate resilient"],
     "answer_en": "Climate-smart: resilient varieties, water saving, carbon friendly practices.",
     "answer_hi": "जलवायु-स्मार्ट: सहनशील किस्में, जल बचत, कार्बन अनुकूल अभ्यास।"},
    {"patterns": ["integrated weed", "iwm"],
     "answer_en": "IWM blends cultural, mechanical, chemical, biological tactics.",
     "answer_hi": "एकीकृत खरपतवार प्रबंधन: सांस्कृतिक+यांत्रिक+रासायनिक+जैविक मिश्रण।"},
    {"patterns": ["evaporation loss", "reduce evaporation"],
     "answer_en": "Mulch & evening irrigation reduce evaporation losses.",
     "answer_hi": "मल्च व शाम सिंचाई से वाष्पीकरण हानि घटती।"},
    {"patterns": ["soil salinity test", "ec meter"],
     "answer_en": "Use EC meter to monitor salinity; leach salts with good quality water.",
     "answer_hi": "EC मीटर से लवणीयता देखें; अच्छी गुणवत्ता जल से लवण लीच करें।"},
]

# Extend with extra curated entries
KB_ENTRIES.extend(KB_EXTRA_ENTRIES)

def _normalize(txt: str) -> str:
    # Unicode normalize then keep basic latin letters, digits, whitespace, Devanagari.
    txt = unicodedata.normalize('NFC', txt)
    return re.sub(r"[^a-z0-9\s\u0900-\u097F]", " ", txt.lower())

def _is_hindi(txt: str) -> bool:
    return any('\u0900' <= ch <= '\u097F' for ch in txt)

def kb_find_answer(message: str) -> Optional[str]:
    norm = _normalize(message)
    hindi = _is_hindi(message)
    best = None
    best_score = 0
    
    # Try exact word matching first
    words = set(norm.split())
    
    for entry in KB_ENTRIES:
        score = 0
        matched_patterns = []
        
        for pat in entry["patterns"]:
            pat_norm = _normalize(pat)
            pat_words = set(pat_norm.split())
            
            # Check if all pattern words are in the message
            if pat_words.issubset(words):
                score = len(pat_words)  # Score based on number of matching words
                matched_patterns.append(pat)
            # Also check substring matching for partial matches
            elif pat_norm in norm:
                score = max(score, 1)
                matched_patterns.append(pat)
        
        if score > best_score:
            best_score = score
            best = entry
    
    if best and best_score > 0:
        return best["answer_hi" if hindi else "answer_en"]
    
    return None


def generate_rule_based_reply(message: str) -> str:
    text = message.lower().strip()
    # First attempt knowledge base direct answer
    kb_ans = kb_find_answer(message)
    if kb_ans:
        return kb_ans
    # Hindi keyword fallbacks (basic domain triggers)
    if any(k in text for k in ["मिट्टी", "उर्वरता"]):
        return "मिट्टी pH 6.0-7.5 रखें, जैविक खाद व फसल चक्र अपनाएँ। किस फसल की योजना है?"
    if any(k in text for k in ["मौसम", "बारिश", "तापमान"]):
        return "अगले 24 घंo में सम्भव वर्षा। जल निकासी जाँचें। कौनसी फसल पर सलाह चाहिए?"
    if any(k in text for k in ["मंडी", "भाव", "दर"]):
        return "आज का उदाहरण मंडी भाव (चावल) ₹2200/क्विंटल (सांकेतिक)। अन्य फसल पूछें।"
    if any(k in text for k in ["बीमा", "फसल बीमा", "दावा"]):
        return "फसल बीमा सूखा/बाढ़ हानि कवर करता। कृपया फसल व क्षेत्र बताएँ।"
    if any(k in text for k in ["नमस्ते", "प्रणाम"]):
        return "नमस्ते! मैं खेतगुरु हूँ। मुझसे मिट्टी, मौसम, मंडी भाव, बीमा या कीट प्रबंधन पूछें।"
    if any(k in text for k in ["soil", "ph", "fertilizer"]):
        return "For healthy soil keep pH 6.0-7.5 and add organic compost. What crop are you planning?"
    if any(k in text for k in ["weather", "rain", "temperature"]):
        return "Upcoming 24h: possible showers. Consider drainage check. Need crop-specific advice?"
    if any(k in text for k in ["mandi", "price", "rate"]):
        return "Today's sample mandi rate for rice is ₹2200/quintal (illustrative). Want another crop?"
    if any(k in text for k in ["insurance", "claim", "policy"]):
        return "Crop insurance helps against drought & flood. I can outline typical coverage if you share crop & area."
    if any(k in text for k in ["hello", "hi", "namaste"]):
        return "Namaste! I'm KhetGuru. Ask me about soil, weather, crops, insurance, or mandi rates."
    return "I noted your query. Could you clarify the crop or topic (soil, weather, mandi, insurance)?"


def generate_reply(message: str, history: Optional[List[ChatMessage]] = None) -> str:
    api_key = settings.openai_api_key or os.getenv("OPENAI_API_KEY")
    if api_key:
        try:
            logger.info("KhetGuru: attempting OpenAI completion")
            msgs = [
                {"role": "system", "content": "You are KhetGuru, a concise helpful agriculture assistant for Indian farmers. Keep answers short and actionable."}
            ]
            if history:
                for m in history[-8:]:
                    msgs.append({"role": m.role, "content": m.content})
            msgs.append({"role": "user", "content": message})
            payload = {
                "model": settings.model_name or "gpt-3.5-turbo",
                "messages": msgs,
                "temperature": 0.7,
                "max_tokens": 300
            }
            r = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json=payload,
                timeout=20
            )
            if r.status_code == 200:
                data = r.json()
                logger.info("KhetGuru: OpenAI success")
                return data["choices"][0]["message"]["content"].strip()
            else:
                logger.warning("KhetGuru: OpenAI API non-200 status %s - falling back", r.status_code)
        except Exception as exc:
            logger.error("KhetGuru: OpenAI request failed %s - falling back", exc)
    return generate_rule_based_reply(message)

@router.post("/chat", response_model=ChatResponse)
def chat_with_khetguru(payload: ChatRequest):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    reply = generate_reply(payload.message, payload.history)
    return ChatResponse(
        reply=reply,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z"
    )

@router.get("/soil-testing", response_model=Dict[str, Any])
def get_soil_testing():
    return {"status": "success", "data": {"ph": 6.5, "nutrients": "optimal", "recommendation": "Add organic matter for better soil structure and fertility"}}

@router.get("/farm-tagging", response_model=Dict[str, Any])
def get_farm_tagging():
    return {"status": "success", "data": {"farm_id": "F123", "location": "Village A", "area": "2 acres", "gps_accuracy": "±2m"}}

@router.get("/crop-planner", response_model=Dict[str, Any])
def get_crop_planner():
    return {"status": "success", "data": {"season": "Kharif", "recommended_crops": ["Rice", "Maize", "Cotton"], "profit_potential": "High"}}

@router.get("/weather-alerts", response_model=Dict[str, Any])
def get_weather_alerts():
    current_alerts = [
        {
            "id": 1,
            "title": "Heavy Rain Alert",
            "severity": "high",
            "message": "Heavy rainfall (50-75mm) expected in next 24 hours",
            "created_at": datetime.datetime.now().isoformat(),
            "action": "Ensure proper field drainage and postpone spraying operations"
        },
        {
            "id": 2,
            "title": "Temperature Advisory", 
            "severity": "medium",
            "message": "Temperature may exceed 38°C for next 3 days",
            "created_at": datetime.datetime.now().isoformat(),
            "action": "Increase irrigation frequency and provide shade protection"
        }
    ]
    return {"status": "success", "data": current_alerts}

@router.get("/quality-input", response_model=Dict[str, Any])
def get_quality_input(db: Session = Depends(get_db)):
    # Prefer DB-backed suppliers; seed a small demo if table is empty
    q = db.query(InputSupplier).limit(50).all()
    if not q:
        demo = [
            InputSupplier(name="AgriSeeds Co", category="Seeds", contact="9876543210", location="Delhi"),
            InputSupplier(name="FarmTech Solutions", category="Fertilizers", contact="9876543211", location="Mumbai"),
            InputSupplier(name="Green Harvest", category="Equipment", contact="9876543212", location="Bangalore"),
            InputSupplier(name="Organic Plus", category="Pesticides", contact="9876543213", location="Pune"),
        ]
        for s in demo:
            db.add(s)
        try:
            db.commit()
            q = db.query(InputSupplier).limit(50).all()
        except Exception:
            db.rollback()
            # Fallback to in-memory if DB write fails
            suppliers = [
                {"name": s.name, "category": s.category, "contact": s.contact, "location": s.location, "rating": 4.5}
                for s in demo
            ]
            return {"status": "success", "data": {"suppliers": suppliers, "total": len(suppliers)}}
    suppliers = [
        {"name": s.name, "category": s.category, "contact": s.contact, "location": s.location, "rating": 4.5}
        for s in q
    ]
    return {"status": "success", "data": {"suppliers": suppliers, "total": len(suppliers)}}

@router.get("/connect-experts", response_model=Dict[str, Any])
def connect_experts():
    experts = [
        {"name": "Dr. Rajesh Sharma", "specialization": "Soil Science", "experience": "15 years", "contact": "expert1@agri.com", "rating": 4.8},
        {"name": "Ms. Priya Patel", "specialization": "Crop Protection", "experience": "12 years", "contact": "expert2@agri.com", "rating": 4.6},
        {"name": "Dr. Amit Kumar", "specialization": "Water Management", "experience": "18 years", "contact": "expert3@agri.com", "rating": 4.9},
        {"name": "Mrs. Sunita Singh", "specialization": "Organic Farming", "experience": "10 years", "contact": "expert4@agri.com", "rating": 4.7}
    ]
    return {"status": "success", "data": {"experts": experts, "available": len(experts)}}

@router.get("/crop-insurance", response_model=Dict[str, Any])
def get_crop_insurance():
    insurance_options = [
        {"provider": "National Insurance", "coverage": "Drought, Flood, Hail", "premium": "₹500/acre/year", "claim_ratio": "85%"},
        {"provider": "AgriSecure Plus", "coverage": "Weather, Disease, Market", "premium": "₹750/acre/year", "claim_ratio": "90%"},
        {"provider": "FarmShield Pro", "coverage": "Comprehensive Coverage", "premium": "₹1000/acre/year", "claim_ratio": "95%"}
    ]
    return {"status": "success", "data": {"insurance_plans": insurance_options, "government_subsidy": "50%"}}

@router.get("/mandi-rate", response_model=Dict[str, Any])
def get_mandi_rate(db: Session = Depends(get_db)):
    from app.database.models import MarketPrice
    rows = db.query(MarketPrice).order_by(MarketPrice.id.desc()).limit(50).all()
    if not rows:
        # Seed a tiny set if empty
        seeds = [
            ("Wheat", "Delhi", 2200.0),
            ("Rice", "Mumbai", 2800.0),
            ("Cotton", "Ahmedabad", 6200.0),
            ("Sugarcane", "Pune", 3200.0),
        ]
        for c, m, p in seeds:
            db.add(MarketPrice(crop=c, mandi=m, price_per_quintal=p))
        try:
            db.commit()
            rows = db.query(MarketPrice).order_by(MarketPrice.id.desc()).limit(50).all()
        except Exception:
            db.rollback()
            market_rates = [
                {"crop": c, "rate": p, "mandi": m, "quality": "A", "trend": "stable"}
                for c, m, p in seeds
            ]
            return {"status": "success", "data": {"rates": market_rates, "last_updated": datetime.datetime.now().isoformat()}}
    rates = [
        {"crop": r.crop.title(), "rate": float(r.price_per_quintal), "mandi": r.mandi, "quality": "A", "trend": "stable"}
        for r in rows
    ]
    return {"status": "success", "data": {"rates": rates, "last_updated": datetime.datetime.now().isoformat()}}

# New endpoint for real-time monitoring data
@router.get("/live-monitoring", response_model=Dict[str, Any])
def get_live_monitoring():
    monitoring_data = {
        "soil_moisture": 65,
        "temperature": 28,
        "humidity": 72,
        "wind_speed": 8,
        "active_sensors": 15,
        "alerts_count": 2,
        "field_health_score": 85,
        "irrigation_efficiency": 78,
        "last_updated": datetime.datetime.now().isoformat()
    }
    return {"status": "success", "data": monitoring_data}


def _send_email_simulated(payload: ContactMessage) -> None:
    logger.info("Simulated send: FROM=%s SUBJECT=%s", payload.email, payload.interest or 'contact')
    logger.info("Message snippet: %s", payload.message[:120])

def _try_smtp_send(payload: ContactMessage) -> bool:
    host = os.getenv('SMTP_HOST')
    user = os.getenv('SMTP_USER')
    pwd = os.getenv('SMTP_PASS')
    to_addr = os.getenv('CONTACT_TO_EMAIL', user)
    if not (host and user and pwd and to_addr):
        return False
    import smtplib, ssl
    from email.message import EmailMessage
    msg = EmailMessage()
    subject = f"Contact Form: {payload.interest or 'General'} - {payload.name}"[:120]
    body = f"Name: {payload.name}\nEmail: {payload.email}\nCompany: {payload.company}\nFarmSize: {payload.farmSize}\nInterest: {payload.interest}\nMessage:\n{payload.message}"[:4000]
    msg['Subject'] = subject
    msg['From'] = user
    msg['To'] = to_addr
    msg.set_content(body)
    try:
        context = ssl.create_default_context()
        with smtplib.SMTP(host, int(os.getenv('SMTP_PORT', '587'))) as server:
            server.starttls(context=context)
            server.login(user, pwd)
            server.send_message(msg)
        logger.info("SMTP send success to %s", to_addr)
        return True
    except Exception as exc:
        logger.warning("SMTP send failed: %s", exc)
        return False

@router.post("/contact/send", response_model=ContactResponse)
def contact_send(payload: ContactMessage):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    sent = _try_smtp_send(payload)
    if not sent:
        _send_email_simulated(payload)
        return ContactResponse(status="ok", detail="Queued (simulated) - configure SMTP env to send real email")
    return ContactResponse(status="ok", detail="Email sent successfully")
