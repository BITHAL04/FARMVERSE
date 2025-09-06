from typing import List, Dict, Any

# KB_EXTRA_ENTRIES: curated bilingual Q&A patterns to reduce hallucination.
# Covered domains: soil, irrigation, fertilizer, crop-specific (wheat, rice, maize, cotton, soybean, chickpea, mustard, groundnut, bajra, pulses, sugarcane, potato, onion, tomato, chili, brinjal),
# fruits (mango, banana, pomegranate, guava, citrus, papaya, grape), vegetables, pests/diseases, weeds, plant protection, weather advisories, post-harvest, mandi/market, schemes, machinery, protected cultivation.

KB_EXTRA_ENTRIES: List[Dict[str, Any]] = [
    # Wheat
    {"patterns": ["wheat variety", "best wheat", "गेहूं किस्म"],
     "answer_en": "Popular wheat varieties: HD 2967, HD 3086, PBW 725 (choose region-specific).",
     "answer_hi": "लोकप्रिय गेहूं किस्में: HD 2967, HD 3086, PBW 725 (क्षेत्र अनुसार चुनें)।"},
    {"patterns": ["wheat sowing time", "wheat planting time", "गेहूं बोवाई समय"],
     "answer_en": "Wheat: timely sowing in Nov–Dec; delayed sowing reduces yield.",
     "answer_hi": "गेहूं: समय पर बोवाई (नवंबर–दिसंबर); देरी से उपज घटती।"},
    {"patterns": ["wheat fertilizer schedule", "wheat urea dose"],
     "answer_en": "Wheat: N in 3 splits (basal, CRI, booting). P & K as basal per soil test.",
     "answer_hi": "गेहूं: N तीन भागों में (बेसल, सीआरआई, बूटिंग); P व K बेसल, मिट्टी परीक्षण अनुसार।"},
    # Rice
    {"patterns": ["rice variety", "paddy variety", "धान किस्म"],
     "answer_en": "Rice: MTU 1010, IR 64, BPT 5204 are common; choose state-recommended.",
     "answer_hi": "धान: MTU 1010, IR 64, BPT 5204 सामान्य; राज्य अनुशंसित लें।"},
    {"patterns": ["sri method", "sri rice"],
     "answer_en": "SRI: wider spacing, young seedlings, alternate wetting & drying saves water.",
     "answer_hi": "एसआरआई: अधिक दूरी, कम उम्र पौध, बारी-बारी गीला-सूखा से जल बचत।"},
    {"patterns": ["bacterial leaf blight rice", "blb rice"],
     "answer_en": "BLB: use resistant variety, avoid excessive N, follow advisory sprays.",
     "answer_hi": "बीएलबी: प्रतिरोधी किस्म, अधिक N न दें, सलाह अनुसार छिड़काव करें।"},
    # Maize
    {"patterns": ["maize variety", "hybrid corn"],
     "answer_en": "Maize: prefer region-suited hybrids; ensure proper spacing & fertilization.",
     "answer_hi": "मक्का: क्षेत्र अनुसार हाइब्रिड चुनें; उचित दूरी व उर्वरक सुनिश्चित करें।"},
    {"patterns": ["fall armyworm", "faw maize", "फॉल आर्मीवर्म"],
     "answer_en": "FAW: install pheromone traps, scout whorl, early need-based sprays.",
     "answer_hi": "फॉल आर्मीवर्म: फेरोमोन ट्रैप, व्हर्ल निगरानी, प्रारंभिक आवश्यकता अनुसार स्प्रे।"},
    # Cotton
    {"patterns": ["cotton variety", "bt cotton"],
     "answer_en": "Cotton: use recommended Bt hybrids; follow timely sowing & spacing.",
     "answer_hi": "कपास: अनुशंसित Bt हाइब्रिड लगाएँ; समय पर बोवाई व दूरी रखें।"},
    {"patterns": ["pink bollworm cotton", "pbw cotton"],
     "answer_en": "Pink bollworm: pheromone traps, timely harvest, refuge, rotate chemistries.",
     "answer_hi": "पिंक बॉलवर्म: फेरोमोन ट्रैप, समय पर तुड़ाई, रिफ्यूज, रसायन बदलते रहें।"},
    # Soybean
    {"patterns": ["soybean variety", "soya seed"],
     "answer_en": "Soybean: JS 95-60, JS 20-29 common; inoculate Rhizobium; avoid waterlogging.",
     "answer_hi": "सोयाबीन: JS 95-60, JS 20-29; राइजोबियम इनोकुलेशन करें; जलभराव से बचें।"},
    {"patterns": ["yellow mosaic virus soybean", "ymv"],
     "answer_en": "YMV: resistant varieties + whitefly management; rogue infected plants.",
     "answer_hi": "वाईएमवी: प्रतिरोधी किस्म + व्हाइटफ्लाई नियंत्रण; संक्रमित पौधे हटाएँ।"},
    # Chickpea
    {"patterns": ["chickpea variety", "gram variety", "चना किस्म"],
     "answer_en": "Chickpea: JG 14, JG 11, ICCV 10; sow on conserved moisture.",
     "answer_hi": "चना: JG 14, JG 11, ICCV 10; संरक्षित नमी पर बोएँ।"},
    {"patterns": ["pod borer chickpea", "heliothis chickpea"],
     "answer_en": "Pod borer: pheromone traps + need-based sprays at flowering/pod stage.",
     "answer_hi": "पॉड बोरर: फेरोमोन ट्रैप + फूल/फली अवस्था पर आवश्यकता अनुसार स्प्रे।"},
    # Mustard
    {"patterns": ["mustard variety", "sarson variety", "सरसों किस्म"],
     "answer_en": "Mustard: Pusa Bold, Varuna, RH 749 popular; timely sowing aids yield.",
     "answer_hi": "सरसों: पूसा बोल्ड, वरुणा, RH 749; समय पर बोवाई उपज बढ़ाती।"},
    {"patterns": ["aphid mustard", "aphid sarson", "सरसों चेपा"],
     "answer_en": "Aphids: early monitoring, yellow traps, neem, and need-based sprays.",
     "answer_hi": "चेपा: प्रारंभिक निगरानी, पीले ट्रैप, नीम, और आवश्यकता अनुसार स्प्रे।"},
    # Groundnut
    {"patterns": ["groundnut variety", "peanut variety", "मूंगफली किस्म"],
     "answer_en": "Groundnut: GG 20, JL 24; need well-drained soil; apply gypsum at pegging.",
     "answer_hi": "मूंगफली: GG 20, JL 24; अच्छी निकासी मिट्टी; पेगिंग पर जिप्सम दें।"},
    # Bajra
    {"patterns": ["bajra variety", "pearl millet variety", "बाजरा किस्म"],
     "answer_en": "Bajra: HHB 67, RHB 177; suits arid regions; drought-tolerant.",
     "answer_hi": "बाजरा: HHB 67, RHB 177; शुष्क क्षेत्रों हेतु; सूखा सहिष्णु।"},
    # Sugarcane
    {"patterns": ["sugarcane variety", "गन्ना किस्म"],
     "answer_en": "Sugarcane: Co 0238, Co 86032 common; follow ratoon management.",
     "answer_hi": "गन्ना: Co 0238, Co 86032 सामान्य; रेटून प्रबंधन करें।"},
    # Potato/Onion/Tomato/Chili/Brinjal
    {"patterns": ["potato seed rate", "आलू बीज मात्रा"],
     "answer_en": "Potato seed: 8–10 q/acre (medium tubers). Maintain 60x20 cm spacing.",
     "answer_hi": "आलू बीज: 8–10 क्विंटल/एकड़ (मध्यम कंद). 60x20 सेमी दूरी रखें।"},
    {"patterns": ["tomato blight", "लेट ब्लाइट टमाटर"],
     "answer_en": "Tomato late blight: drainage, avoid overhead irrigation, prophylactic sprays on forecast.",
     "answer_hi": "टमाटर लेट ब्लाइट: जलनिकासी, ओवरहेड सिंचाई से बचें, पूर्वानुमान पर रक्षात्मक स्प्रे।"},
    {"patterns": ["chilli thrips", "मिर्च थ्रिप्स"],
     "answer_en": "Chili thrips: blue/yellow sticky traps, reflective mulch, timely sprays.",
     "answer_hi": "मिर्च थ्रिप्स: नीला/पीला स्टिकी ट्रैप, रिफ्लेक्टिव मल्च, समय पर स्प्रे।"},
    {"patterns": ["brinjal shoot borer", "भिंडी शूट बोरर"],
     "answer_en": "Brinjal shoot/fruit borer: remove infested shoots, pheromone traps, need-based sprays.",
     "answer_hi": "बैंगन शूट/फ्रूट बोरर: संक्रमित टहनियाँ हटाएँ, फेरोमोन ट्रैप, आवश्यकता अनुसार स्प्रे।"},
    # Fruits
    {"patterns": ["mango flowering", "आम फूल"],
     "answer_en": "Mango: induce flowering with moisture stress + KNO3 sprays per advisory.",
     "answer_hi": "आम: नमी तनाव + KNO3 सलाह अनुसार स्प्रे से पुष्पन प्रेरित।"},
    {"patterns": ["banana sigatoka", "केला सिगाटोका"],
     "answer_en": "Banana sigatoka: sanitation, leaf pruning, and recommended fungicides.",
     "answer_hi": "केला सिगाटोका: स्वच्छता, पत्ती काटना, व अनुशंसित फफूंदनाशी।"},
    {"patterns": ["pomegranate cracking", "अनार फटना"],
     "answer_en": "Pomegranate cracking: uniform irrigation, avoid drought-then-flood cycles.",
     "answer_hi": "अनार फटना: समान सिंचाई रखें, सूखा-फिर-बहाव चक्र से बचें।"},
    # Weather
    {"patterns": ["heatwave crop", "गर्मी लू फसल"],
     "answer_en": "Heatwave: irrigate evening, mulching, shade nets for nursery.",
     "answer_hi": "लू: शाम को सिंचाई, मल्चिंग, नर्सरी हेतु शेड नेट।"},
    {"patterns": ["unseasonal rain", "असमय वर्षा"],
     "answer_en": "Unseasonal rain: ensure drainage, avoid spraying before rain.",
     "answer_hi": "असमय वर्षा: निकासी सुनिश्चित करें, बारिश से पहले स्प्रे न करें।"},
    # Inputs and machinery
    {"patterns": ["drone spray", "ड्रोन स्प्रे"],
     "answer_en": "Drone spraying enables uniform coverage; follow label droplet size & buffer zones.",
     "answer_hi": "ड्रोन स्प्रे से समान छिड़काव; लेबल ड्रॉपलेट आकार व बफर जोन मानें।"},
    {"patterns": ["zero till", "ज़ीरो टिलेज"],
     "answer_en": "Zero tillage reduces cost, conserves moisture, and speeds wheat sowing after rice.",
     "answer_hi": "ज़ीरो टिलेज लागत घटाता, नमी बचाता, धान बाद गेहूं बोवाई तेज करता।"},
    # Market
    {"patterns": ["how to get mandi price", "mandi app", "मंडी भाव कैसे देखें"],
     "answer_en": "Use official agri market apps/portals; compare nearby mandis for better price.",
     "answer_hi": "आधिकारिक कृषि बाजार ऐप/पोर्टल प्रयोग करें; नजदीकी मंडियों का भाव तुलना करें।"},
    # General safety
    {"patterns": ["pesticide safety", "कीटनाशी सुरक्षा"],
     "answer_en": "Wear PPE, follow label doses, avoid spraying in wind or high heat.",
     "answer_hi": "पीपीई पहनें, लेबल मात्रा मानें, तेज हवा/अधिक गर्मी में स्प्रे न करें।"},
]

# Add many crop-specific entries in compact groups to reach 150+ entries
for crop, tips in [
    ("potato", [
        ("late blight", "Ensure drainage; spray preventively on forecast."),
        ("seed spacing", "60x20 cm; deeper in sandy soils."),
        ("fertilizer", "Apply balanced NPK; avoid excess N to reduce hollow heart."),
    ]),
    ("onion", [
        ("thrips", "Blue sticky traps + need-based sprays."),
        ("bolting", "Use correct variety and transplant age; avoid cold stress."),
    ]),
    ("tomato", [
        ("blossom end rot", "Maintain uniform moisture; apply Ca if needed."),
        ("staking", "Stake for aeration and reduced disease."),
    ]),
    ("chili", [
        ("curl virus", "Control whitefly; rogue infected plants."),
    ]),
    ("brinjal", [
        ("wilt", "Resistant variety + crop rotation."),
    ]),
    ("banana", [
        ("bunch management", "Remove male bud after last hand; prop to prevent lodging."),
    ]),
    ("mango", [
        ("fruit fly", "Use methyl eugenol traps + sanitation."),
    ]),
    ("grape", [
        ("downy mildew", "Canopy management + recommended fungicides."),
    ]),
    ("pomegranate", [
        ("bacterial blight", "Sanitation + copper sprays per schedule."),
    ]),
]:
    for key, tip in tips:
        KB_EXTRA_ENTRIES.append({
            "patterns": [f"{crop} {key}", f"{crop} {key} control", f"{crop} {key} management", f"{crop} {key} treatment", f"{crop} {key} symptoms", f"{crop} {key} remedy"],
            "answer_en": f"{crop.capitalize()} {key}: {tip}",
            "answer_hi": f"{crop} {key}: {tip}",
        })

# Pad with generalized weather/crop questions across states to reach 150+ items
states = ["Rajasthan","Punjab","Haryana","Maharashtra","MP","UP","Bihar","Gujarat","Karnataka","AP","TN","WB"]
for st in states:
    KB_EXTRA_ENTRIES.append({
        "patterns": [f"{st} rainfall", f"{st} weather", f"{st} sowing time"],
        "answer_en": f"{st}: check local forecast; sow as per regional agri university schedule.",
        "answer_hi": f"{st}: स्थानीय पूर्वानुमान देखें; राज्य कृषि विश्वविद्यालय कैलेंडर अनुसार बोआई करें।",
    })

# ------------------------------------------------------------
# Additional curated Q&A provided by user (100 Q/A approx.)
# We'll auto-generate simple patterns from the question text.
# ------------------------------------------------------------

def _gen_patterns_from_question(q: str) -> List[str]:
    import re
    ql = q.strip().lower()
    ql = re.sub(r"\s+", " ", ql)
    ql = ql.rstrip("? .!")
    pats: List[str] = []
    pats.append(ql)
    # Extract key phrase for common forms
    key = None
    for prefix in ["what is ", "what are ", "which is ", "which are "]:
        if ql.startswith(prefix):
            key = ql[len(prefix):].strip()
            break
    if key is None:
        for prefix in ["how ", "when ", "why ", "which ", "can ", "does ", "do "]:
            if ql.startswith(prefix):
                key = ql[len(prefix):].strip()
                break
    if key is None:
        # Fallback: take last 5 words
        parts = ql.split()
        key = " ".join(parts[-5:]) if len(parts) > 1 else ql
    key = key.strip()
    if key:
        pats.append(key)
    # Add a synonymic form for definition-style queries
    if ql.startswith("what is ") or ql.startswith("what are "):
        pats.append(f"{key} definition")
        pats.append(f"define {key}")
        pats.append(f"meaning of {key}")
    # Compact keyword pattern (remove common stopwords)
    STOP = {"what","is","are","the","of","in","an","a","and","to","for","with","on","by","do","does","can","i","which","when","why","how","it","best","way","method","types","type"}
    words = [w for w in re.sub(r"[^a-z0-9\s]"," ", ql).split() if w not in STOP]
    if words:
        pats.append(" ".join(words[:4]))
    # De-duplicate while preserving order
    seen = set()
    uniq = []
    for p in pats:
        if p and p not in seen:
            uniq.append(p)
            seen.add(p)
    return uniq

# Raw Q&A pairs from the user's dataset (English). Answers reused for Hindi for now.
USER_QA_PAIRS: List[Dict[str, str]] = [
    {"q": "What is agriculture?", "a": "Agriculture is the science and practice of growing crops and raising animals for food, fiber, fuel, and other products."},
    {"q": "What are the main branches of agriculture?", "a": "The main branches are crop production, horticulture, animal husbandry, forestry, and fisheries."},
    {"q": "What is mixed farming?", "a": "Mixed farming is a system where both crops and livestock are raised on the same farm."},
    {"q": "What is organic farming?", "a": "Organic farming avoids chemical fertilizers and pesticides, focusing on natural methods like compost, crop rotation, and biological pest control."},
    {"q": "What is sustainable agriculture?", "a": "Sustainable agriculture ensures long-term productivity while protecting the environment and conserving resources."},
    {"q": "What are the types of soil in India?", "a": "Alluvial, black, red, laterite, arid, forest, and mountain soils."},
    {"q": "Which soil is best for cotton cultivation?", "a": "Black soil (Regur soil)."},
    {"q": "What is soil fertility?", "a": "Soil fertility is the ability of soil to supply essential nutrients for plant growth."},
    {"q": "How can soil fertility be improved?", "a": "By using organic manure, crop rotation, green manure, and balanced use of fertilizers."},
    {"q": "What is soil erosion?", "a": "The removal of the top fertile layer of soil by wind, water, or human activity."},
    {"q": "What are Kharif crops?", "a": "Kharif crops are sown in the monsoon season, like rice, maize, and cotton."},
    {"q": "What are Rabi crops?", "a": "Rabi crops are sown in winter, like wheat, barley, and mustard."},
    {"q": "What are Zaid crops?", "a": "Zaid crops are grown between Rabi and Kharif seasons, like watermelon, cucumber, and muskmelon."},
    {"q": "Which crop is called the \"King of Cereals\"?", "a": "Wheat."},
    {"q": "Which crop is known as the \"Golden Fiber\"?", "a": "Jute."},
    {"q": "What are the main methods of irrigation?", "a": "Canal irrigation, drip irrigation, sprinkler irrigation, and well irrigation."},
    {"q": "What is drip irrigation?", "a": "A method of watering plants directly at the root zone using pipes and emitters, saving water."},
    {"q": "Which irrigation method is best for water conservation?", "a": "Drip irrigation."},
    {"q": "What is rainwater harvesting?", "a": "Collecting and storing rainwater for later agricultural use."},
    {"q": "Why is irrigation important?", "a": "It ensures water availability during dry periods and increases crop productivity."},
    {"q": "What are fertilizers?", "a": "Fertilizers are chemical substances that provide essential nutrients to plants."},
    {"q": "What is the difference between manure and fertilizer?", "a": "Manure is organic and improves soil structure, while fertilizers are inorganic and supply specific nutrients quickly."},
    {"q": "Name three essential macronutrients for plants.", "a": "Nitrogen, Phosphorus, and Potassium (NPK)."},
    {"q": "Which fertilizer is rich in nitrogen?", "a": "Urea."},
    {"q": "Why is overuse of fertilizers harmful?", "a": "It causes soil degradation, water pollution, and reduces long-term fertility."},
    {"q": "What are pesticides?", "a": "Chemicals used to kill or control pests harmful to crops."},
    {"q": "What is integrated pest management (IPM)?", "a": "A strategy combining biological, cultural, mechanical, and chemical methods to control pests sustainably."},
    {"q": "Name a common pest of cotton crops.", "a": "Bollworm."},
    {"q": "What is a bio-pesticide?", "a": "A pesticide derived from natural organisms like bacteria, fungi, or plants."},
    {"q": "Why are crop diseases dangerous?", "a": "They reduce yield, lower quality, and cause economic losses."},
    {"q": "What is precision farming?", "a": "Precision farming uses technology like GPS, sensors, and data analysis to optimize crop production."},
    {"q": "What is hydroponics?", "a": "Growing plants without soil, using nutrient-rich water solutions."},
    {"q": "What is vertical farming?", "a": "Growing crops in stacked layers, often indoors with artificial lighting."},
    {"q": "What is genetically modified (GM) crop?", "a": "A crop whose DNA has been altered to improve yield, pest resistance, or adaptability."},
    {"q": "Give one example of a GM crop in India.", "a": "Bt Cotton."},
    {"q": "What is animal husbandry?", "a": "The practice of breeding and raising livestock like cows, goats, sheep, and poultry."},
    {"q": "Which breed of cow is known for high milk yield in India?", "a": "Holstein Friesian."},
    {"q": "What is poultry farming?", "a": "The practice of raising chickens, ducks, and turkeys for eggs and meat."},
    {"q": "What is fish farming called?", "a": "Pisciculture."},
    {"q": "What is dairy farming?", "a": "The practice of breeding and managing cattle for milk production."},
    {"q": "What is PM-KISAN scheme?", "a": "A government scheme providing direct income support of ₹6,000 annually to farmers."},
    {"q": "What is MSP in agriculture?", "a": "Minimum Support Price, the guaranteed price at which the government buys crops from farmers."},
    {"q": "What is NABARD?", "a": "National Bank for Agriculture and Rural Development, supporting rural credit and development."},
    {"q": "What is crop insurance?", "a": "A scheme that protects farmers against crop losses due to natural disasters, pests, or diseases."},
    {"q": "What is Kisan Credit Card (KCC)?", "a": "A scheme that provides farmers with timely credit for agricultural needs at low interest."},
    {"q": "What is agroforestry?", "a": "Integrating trees and shrubs into farming systems for ecological and economic benefits."},
    {"q": "What is greenhouse farming?", "a": "Cultivating crops in a controlled environment under a transparent structure."},
    {"q": "What is crop rotation?", "a": "Growing different crops sequentially on the same land to maintain soil fertility."},
    {"q": "What is food security?", "a": "Ensuring that people have regular access to sufficient, safe, and nutritious food."},
    {"q": "Why is agriculture important?", "a": "It provides food, raw materials, employment, and supports economic growth."},
    {"q": "Which crop should I grow in sandy soil?", "a": "Sandy soil is best for groundnut, potato, watermelon, and pulses."},
    {"q": "What crops are suitable for clay soil?", "a": "Rice, wheat, and sugarcane grow well in clay soils because they retain water."},
    {"q": "I have low rainfall in my region, which crops should I grow?", "a": "Millets, pulses, oilseeds, and sorghum are drought-resistant and suitable for low rainfall areas."},
    {"q": "What is the best crop to grow in black soil?", "a": "Cotton, soybean, and sunflower are ideal for black soil."},
    {"q": "Can I grow rice in saline soil?", "a": "No, rice needs fertile, non-saline soil. Barley and sugar beet tolerate saline soils better."},
    {"q": "How does rainfall affect crop yield?", "a": "Adequate rainfall supports growth, while too little causes drought stress and too much leads to waterlogging."},
    {"q": "Which crops are suitable for the winter season in India?", "a": "Wheat, mustard, chickpea, and barley are ideal Rabi crops for winter."},
    {"q": "Can maize grow in high-temperature areas?", "a": "Yes, maize grows well in warm climates but needs proper irrigation."},
    {"q": "What crops are recommended for flood-prone areas?", "a": "Jute, sugarcane, and rice varieties tolerant to waterlogging."},
    {"q": "Which crops are suitable for hot and dry climates?", "a": "Bajra (pearl millet), sorghum, pulses, and oilseeds."},
    {"q": "How can I check my soil fertility?", "a": "Get a soil test from a local lab; it shows nutrient levels and pH."},
    {"q": "What crops grow well in acidic soil?", "a": "Tea, pineapple, potato, and ginger prefer acidic soil."},
    {"q": "My soil is alkaline, what crops are suitable?", "a": "Cotton, barley, and maize can tolerate alkaline soil."},
    {"q": "How do I increase soil organic matter?", "a": "Apply compost, farmyard manure, and practice green manuring."},
    {"q": "What is the ideal pH range for most crops?", "a": "6.0–7.5 is suitable for most crops."},
    {"q": "How can I conserve water in farming?", "a": "Use drip irrigation, mulching, and rainwater harvesting."},
    {"q": "What is the best way to increase crop yield?", "a": "Use high-yield seeds, balanced fertilizers, proper irrigation, and pest management."},
    {"q": "When should I sow wheat in North India?", "a": "Wheat is usually sown in November–December."},
    {"q": "How can I protect crops from frost?", "a": "Use sprinklers at night, cover crops, or create windbreaks."},
    {"q": "What are intercrops for sugarcane?", "a": "Onion, garlic, and mustard are good intercrops with sugarcane."},
    {"q": "How can I control pests naturally?", "a": "Use neem oil, pheromone traps, and biological pest control."},
    {"q": "My cotton crop has bollworms, what should I do?", "a": "Use Bt cotton varieties or apply recommended insecticides."},
    {"q": "How can I prevent fungal diseases in crops?", "a": "Avoid waterlogging, use resistant varieties, and apply fungicides."},
    {"q": "What is crop rotation’s role in pest control?", "a": "Rotating crops breaks the pest and disease cycle."},
    {"q": "How do I control weeds in rice fields?", "a": "Use pre-emergence herbicides and manual weeding."},
    {"q": "What is the benefit of using sensors in farming?", "a": "Sensors monitor soil moisture, temperature, and nutrient levels for precise farming."},
    {"q": "How does weather forecasting help farmers?", "a": "It guides sowing, irrigation, and harvesting decisions."},
    {"q": "What is drone spraying?", "a": "Using drones to spray pesticides and fertilizers uniformly on crops."},
    {"q": "Can mobile apps help in farming?", "a": "Yes, many apps provide weather forecasts, market prices, and crop advisory."},
    {"q": "What is precision farming?", "a": "Farming that uses data, GPS, and technology to optimize inputs and maximize yield."},
    {"q": "Which irrigation method saves the most water?", "a": "Drip irrigation."},
    {"q": "How can I prevent waterlogging in fields?", "a": "Improve drainage, use raised beds, and avoid over-irrigation."},
    {"q": "What is sprinkler irrigation best for?", "a": "It is suitable for light soils and crops like wheat, pulses, and vegetables."},
    {"q": "Should I irrigate during flowering?", "a": "Yes, irrigation during flowering is critical to prevent yield loss."},
    {"q": "How often should I irrigate sandy soil?", "a": "Frequently, as sandy soil does not hold water for long."},
    {"q": "What is Minimum Support Price (MSP)?", "a": "It is the fixed price at which the government buys crops from farmers to protect them from price fluctuations."},
    {"q": "Which crops are covered under PMFBY crop insurance?", "a": "Most food crops, oilseeds, and horticultural crops are covered."},
    {"q": "How can I apply for a Kisan Credit Card?", "a": "Visit your nearest bank with land documents and Aadhaar card."},
    {"q": "What is PM-Kisan Samman Nidhi?", "a": "It provides ₹6,000 annually in 3 installments directly to farmers’ accounts."},
    {"q": "Which app gives government scheme updates for farmers?", "a": "The “Kisan Suvidha” app provides real-time scheme and weather information."},
    {"q": "Is organic farming profitable?", "a": "Yes, though initial yield may be lower, organic products sell at higher market prices."},
    {"q": "Which high-value crops can increase farm income?", "a": "Spices, medicinal plants, exotic vegetables, and floriculture crops."},
    {"q": "What is contract farming?", "a": "An agreement between farmers and buyers where crops are grown as per contract."},
    {"q": "Can polyhouse farming increase yield?", "a": "Yes, it allows controlled conditions, increasing yield and quality."},
    {"q": "Which fruit crop is most profitable in India?", "a": "Mango, banana, and pomegranate are highly profitable."},
    {"q": "How can I store grains safely?", "a": "Use airtight containers, fumigation, and dry storage to prevent pests."},
    {"q": "What is the best time to harvest rice?", "a": "When 80–85% of the grains turn golden yellow."},
    {"q": "How do I improve pollination in crops?", "a": "Encourage bees, avoid harmful pesticides, and plant flowering crops nearby."},
    {"q": "How can I get weather updates daily?", "a": "Use IMD (India Meteorological Department) website, apps, or SMS alerts."},
    {"q": "What are some climate-smart farming tips?", "a": "Use drought-resistant seeds, adopt water-saving irrigation, and diversify crops."},
]

for pair in USER_QA_PAIRS:
    patterns = _gen_patterns_from_question(pair["q"])  # derive multiple match patterns
    KB_EXTRA_ENTRIES.append({
        "patterns": patterns,
        "answer_en": pair["a"],
        "answer_hi": pair["a"],
    })
