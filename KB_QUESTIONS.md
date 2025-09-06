# Chatbot Knowledge Base — Added Questions

This lists the predefined question patterns added in `app/services/kb_data.py` (bilingual EN/HI). Patterns act like intents and are matched after normalization.

## Explicit patterns
- wheat variety | best wheat | गेहूं किस्म
- wheat sowing time | wheat planting time | गेहूं बोवाई समय
- wheat fertilizer schedule | wheat urea dose
- rice variety | paddy variety | धान किस्म
- sri method | sri rice
- bacterial leaf blight rice | blb rice
- maize variety | hybrid corn
- fall armyworm | faw maize | फॉल आर्मीवर्म
- cotton variety | bt cotton
- pink bollworm cotton | pbw cotton
- soybean variety | soya seed
- yellow mosaic virus soybean | ymv
- chickpea variety | gram variety | चना किस्म
- pod borer chickpea | heliothis chickpea
- mustard variety | sarson variety | सरसों किस्म
- aphid mustard | aphid sarson | सरसों चेपा
- groundnut variety | peanut variety | मूंगफली किस्म
- bajra variety | pearl millet variety | बाजरा किस्म
- sugarcane variety | गन्ना किस्म
- potato seed rate | आलू बीज मात्रा
- tomato blight | लेट ब्लाइट टमाटर
- chilli thrips | मिर्च थ्रिप्स
- brinjal shoot borer | भिंडी शूट बोरर
- mango flowering | आम फूल
- banana sigatoka | केला सिगाटोका
- pomegranate cracking | अनार फटना
- heatwave crop | गर्मी लू फसल
- unseasonal rain | असमय वर्षा
- drone spray | ड्रोन स्प्रे
- zero till | ज़ीरो टिलेज
- how to get mandi price | mandi app | मंडी भाव कैसे देखें
- pesticide safety | कीटनाशी सुरक्षा

## Programmatically generated crop patterns
For each item "{crop} {key}" the following 6 patterns are generated:
- {crop} {key}
- {crop} {key} control
- {crop} {key} management
- {crop} {key} treatment
- {crop} {key} symptoms
- {crop} {key} remedy

- potato — late blight, seed spacing, fertilizer
- onion — thrips, bolting
- tomato — blossom end rot, staking
- chili — curl virus
- brinjal — wilt
- banana — bunch management
- mango — fruit fly
- grape — downy mildew
- pomegranate — bacterial blight

## State-wise prompts (3 per state)
For each state: "{STATE} rainfall", "{STATE} weather", "{STATE} sowing time"

- Rajasthan
- Punjab
- Haryana
- Maharashtra
- MP
- UP
- Bihar
- Gujarat
- Karnataka
- AP
- TN
- WB

Notes:
- The above are the added entries in `kb_data.py`. They are merged with the base KB in `api/features_routes.py`.
- Matching is case-insensitive and supports Devanagari Hindi.
