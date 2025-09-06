import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      common: {
        appName: 'Farmverse',
        getStarted: 'Get Started',
        continueIn: 'Continue in',
        chooseLanguage: 'Choose your language',
        english: 'English',
        hindi: 'Hindi',
      },
      hero: {
        titleTop: 'The Future of Agriculture',
        titleBottom: 'Starts Today',
        subtitle: 'Revolutionizing farming with sustainable technology, data-driven insights, and precision agriculture for a greener tomorrow.',
        exploreSolutions: 'Explore Our Solutions',
        takeQuiz: '🌾 Take Quiz Challenge'
      },
      nav: {
        home: 'Home',
        about: 'About',
        solutions: 'Solutions',
        quiz: 'Quiz',
        impact: 'Impact',
        contact: 'Contact',
      },
      challenges: {
        titleTop: 'Challenges of Conventional Farming',
        titleBottom: 'in the Modern Era',
        subtitle: 'Understanding the critical issues facing agriculture today helps us build better solutions for tomorrow.',
        items: [
          {
            title: 'Inefficient Water Use',
            description: 'Traditional irrigation systems waste up to 60% of water through inefficient distribution and poor timing.',
            impact: '60% water waste'
          },
          {
            title: 'Excessive Pesticide Dependency',
            description: 'Over-reliance on chemical pesticides damages soil health and creates environmental concerns.',
            impact: '40% soil degradation'
          },
          {
            title: 'Lack of Real-Time Data',
            description: 'Farmers struggle without access to real-time weather, soil, and crop health information.',
            impact: '30% yield loss'
          },
          {
            title: 'Farmer Suicides & Mental Health',
            description: 'Alarming numbers show thousands of farmers lost to suicide; we must prioritize mental health and support systems in agriculture.',
            impact: 'Severe social & economic impact'
          }
        ],
        quizCtaTitle: 'Test Your Farming Knowledge! 🌾',
        quizCtaDescription: 'Think you know how to solve these farming challenges? Take our comprehensive quiz to test your knowledge and learn proven solutions!',
        metrics: {
          categories: 'Categories',
          questions: 'Questions',
          instant: 'Instant',
          results: 'Results'
        },
        startQuiz: '🚀 Start Quiz Challenge',
        tagline: 'Challenge yourself and compete with fellow farmers!'
      },
      solutionsPage: {
        titleTop: 'Sustainable Farming Solutions',
        titleBottom: 'We Offer',
        subtitle: 'Cutting-edge technology meets sustainable agriculture to create smarter, more efficient farming practices.',
        items: [
          {
            title: 'IoT Field Monitoring',
            description: 'Smart sensors provide real-time soil moisture, temperature, and nutrient data for optimal crop management.',
            benefit: '50% water savings'
          },
          {
            title: 'Drone & Satellite Mapping',
            description: 'Aerial imagery and mapping technology for precise crop monitoring, field analysis, and yield optimization.',
            benefit: '40% better planning'
          },
          {
            title: 'AI-Powered Analytics',
            description: 'Machine learning algorithms predict optimal planting times, crop diseases, and harvest schedules.',
            benefit: '35% yield increase'
          },
          {
            title: 'Precision Agriculture',
            description: 'Variable rate application technology ensures optimal use of seeds, fertilizers, and pesticides.',
            benefit: '25% cost reduction'
          }
        ],
        ctaTitle: 'Ready to Transform Your Farm?',
        ctaSubtitle: 'Join thousands of farmers already using our technology to increase yields and reduce environmental impact.',
        startTrial: 'Start Free Trial',
        scheduleConsult: 'Schedule Consultation'
      },
      stats: {
        labels: {
          waterSaved: 'Water Saved',
          higherYields: 'Higher Yields',
          farmsTransformed: 'Farms Transformed',
          costReduction: 'Cost Reduction'
        }
      },
      farmer: {
        title: 'Farmer of the Week Spotlight',
        subtitle: 'Celebrating our top performers and most dedicated learners. Join the community and see your name in the spotlight! 🌟',
        labels: {
          quizzes: 'Quizzes',
          avgScore: 'Avg Score',
          dayStreak: 'Day Streak',
          totalPoints: 'Total Points',
          latestQuizScore: 'Latest Quiz Score',
          communityTitle: 'Community Achievements This Week',
          communitySubtitle: "Together we're building the most knowledgeable farming community",
          quizzesTaken: 'Quizzes Taken',
          averageScore: 'Average Score',
          activeFarmers: 'Active Farmers',
          dayStreaks: 'Day Streaks',
          readyTitle: 'Ready to Join the Spotlight? 🌟',
          readySubtitle: 'Take the farming quiz, build your streak, and compete with fellow farmers!',
          takeQuizNow: 'Take Quiz Now',
          viewLeaderboard: 'View Leaderboard',
          weeklyChallenge: "🌱 This Week's Challenge",
          weeklyChallengeDesc: 'Complete 5 quizzes with 90%+ score to earn the "Knowledge Master" badge!',
          weeklyChallengeStats: '5 Quizzes • 90%+ Score',
          viewChallenge: 'View Challenge Details'
        },
        achievements: {
          quizChampion: 'Quiz Champion',
          consistentLearner: 'Most Consistent Learner',
          communityContributor: 'Community Contributor',
          desc1: 'Consistently scores above 95% and helps other farmers learn',
          desc2: 'Takes quizzes daily and maintains excellent learning habits',
          desc3: 'Shares farming tips and encourages fellow farmers to participate'
        }
      },
      dashboard: {
        titleTop: 'Live Field Monitoring',
        titleBottom: 'Real-Time Data Feed',
        subtitle: 'Watch our AI-powered drones and IoT sensors collect and analyze field data in real-time',
        alert: 'Alert',
        alertsToday: 'Alert{{count, plural, one {} other {s}}} Today - Immediate Attention Required',
        soilMoisture: 'Soil Moisture',
        temperature: 'Temperature',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        activeDrones: 'Active Drones',
        areasScanned: 'Areas Scanned',
        fieldHealthAnalysis: 'Field Health Analysis',
        cropHealthScore: 'Crop Health Score',
        irrigationEfficiency: 'Irrigation Efficiency',
        pestDetection: 'Pest Detection',
        lowRisk: 'Low Risk',
        todaysActivity: "Today's Activity",
        flightHours: 'Flight Hours',
        dataPointsCollected: 'Data Points Collected',
        imagesCaptured: 'Images Captured',
        analysisComplete: 'Analysis Complete',
        status: {
          optimal: 'optimal',
          active: 'active',
          complete: 'complete',
          moderate: 'moderate',
          high: 'high',
          low: 'low'
        }
      }
    }
  },
  hi: {
    translation: {
      common: {
        appName: 'Farmverse',
        getStarted: 'शुरू करें',
        continueIn: 'जारी रखें',
        chooseLanguage: 'अपनी भाषा चुनें',
        english: 'अंग्रेज़ी',
        hindi: 'हिन्दी',
      },
      hero: {
        titleTop: 'कृषि का भविष्य',
        titleBottom: 'आज से शुरू होता है',
        subtitle: 'सतत तकनीक, डेटा-आधारित अंतर्दृष्टि और प्रिसिजन एग्रीकल्चर के साथ हम खेती में हरियाली भविष्य ला रहे हैं।',
        exploreSolutions: 'हमारे समाधान देखें',
        takeQuiz: '🌾 क्विज़ चुनौती लें'
      },
      nav: {
        home: 'होम',
        about: 'हमारे बारे में',
        solutions: 'समाधान',
        quiz: 'प्रश्नोत्तरी',
        impact: 'प्रभाव',
        contact: 'संपर्क',
      },
      challenges: {
        titleTop: 'पारंपरिक खेती की चुनौतियाँ',
        titleBottom: 'आधुनिक युग में',
        subtitle: 'कृषि के सामने आने वाली महत्वपूर्ण समस्याओं को समझना हमें बेहतर समाधान बनाने में मदद करता है।',
        items: [
          {
            title: 'अप्रभावी जल उपयोग',
            description: 'पारंपरिक सिंचाई प्रणालियाँ गलत वितरण और समय के कारण 60% तक पानी बर्बाद करती हैं।',
            impact: '60% पानी की बर्बादी'
          },
          {
            title: 'कीटनाशकों पर अत्यधिक निर्भरता',
            description: 'रासायनिक कीटनाशकों पर अधिक निर्भरता मिट्टी के स्वास्थ्य को नुकसान पहुंचाती है और पर्यावरणीय चिंताएँ पैदा करती है।',
            impact: '40% मिट्टी का क्षरण'
          },
          {
            title: 'रियल-टाइम डेटा की कमी',
            description: 'मौसम, मिट्टी और फसल स्वास्थ्य की वास्तविक समय की जानकारी न होने से किसान संघर्ष करते हैं।',
            impact: '30% उपज में कमी'
          },
          {
            title: 'किसान आत्महत्या और मानसिक स्वास्थ्य',
            description: 'चिंताजनक आँकड़े बताते हैं कि हज़ारों किसान आत्महत्या से खो गए; हमें कृषि में मानसिक स्वास्थ्य और समर्थन प्रणाली को प्राथमिकता देनी चाहिए।',
            impact: 'गंभीर सामाजिक और आर्थिक प्रभाव'
          }
        ],
        quizCtaTitle: 'अपना कृषि ज्ञान परखें! 🌾',
        quizCtaDescription: 'क्या आपको लगता है कि आप इन कृषि चुनौतियों को हल करना जानते हैं? अपना ज्ञान परखने और सिद्ध समाधानों को सीखने के लिए हमारा व्यापक क्विज़ लें!',
        metrics: {
          categories: 'श्रेणियाँ',
          questions: 'प्रश्न',
          instant: 'तुरंत',
          results: 'परिणाम'
        },
        startQuiz: '🚀 क्विज़ चुनौती शुरू करें',
        tagline: 'खुद को चुनौती दें और साथी किसानों के साथ प्रतिस्पर्धा करें!'
      },
      solutionsPage: {
        titleTop: 'सतत खेती के समाधान',
        titleBottom: 'हम प्रदान करते हैं',
        subtitle: 'अत्याधुनिक तकनीक और सतत कृषि मिलकर अधिक स्मार्ट और कुशल खेती के तरीके बनाते हैं।',
        items: [
          {
            title: 'IoT फील्ड मॉनिटरिंग',
            description: 'स्मार्ट सेंसर वास्तविक समय में मिट्टी की नमी, तापमान और पोषक तत्वों का डेटा प्रदान करते हैं।',
            benefit: '50% पानी की बचत'
          },
          {
            title: 'ड्रोन और सैटेलाइट मैपिंग',
            description: 'फसल निगरानी, क्षेत्र विश्लेषण और उपज अनुकूलन के लिए हवाई इमेजरी और मैपिंग तकनीक।',
            benefit: '40% बेहतर योजना'
          },
          {
            title: 'एआई-संचालित विश्लेषण',
            description: 'मशीन लर्निंग एल्गोरिद्म सर्वोत्तम बुवाई समय, फसल रोग और कटाई कार्यक्रम की भविष्यवाणी करते हैं।',
            benefit: '35% उपज वृद्धि'
          },
          {
            title: 'प्रिसिजन एग्रीकल्चर',
            description: 'वैरिएबल रेट एप्लीकेशन तकनीक बीज, उर्वरक और कीटनाशकों के इष्टतम उपयोग को सुनिश्चित करती है।',
            benefit: '25% लागत में कमी'
          }
        ],
        ctaTitle: 'क्या आप अपने खेत को बदलने के लिए तैयार हैं?',
        ctaSubtitle: 'हज़ारों किसान पहले से ही हमारी तकनीक का उपयोग कर रहे हैं ताकि उपज बढ़े और पर्यावरणीय प्रभाव कम हो।',
        startTrial: 'मुफ़्त ट्रायल शुरू करें',
        scheduleConsult: 'परामर्श शेड्यूल करें'
      },
      stats: {
        labels: {
          waterSaved: 'जल की बचत',
          higherYields: 'उच्च उपज',
          farmsTransformed: 'परिवर्तित खेत',
          costReduction: 'लागत में कमी'
        }
      },
      farmer: {
        title: 'सप्ताह के किसान पर प्रकाश',
        subtitle: 'हमारे शीर्ष प्रदर्शनकर्ताओं और सबसे समर्पित शिक्षार्थियों का सम्मान। समुदाय से जुड़ें और अपना नाम स्पॉटलाइट में देखें! 🌟',
        labels: {
          quizzes: 'क्विज़',
          avgScore: 'औसत स्कोर',
          dayStreak: 'दिनों की श्रृंखला',
          totalPoints: 'कुल अंक',
          latestQuizScore: 'ताज़ा क्विज़ स्कोर',
          communityTitle: 'इस सप्ताह की सामुदायिक उपलब्धियाँ',
          communitySubtitle: 'मिलकर हम सबसे जानकार कृषि समुदाय बना रहे हैं',
          quizzesTaken: 'किए गए क्विज़',
          averageScore: 'औसत स्कोर',
          activeFarmers: 'सक्रिय किसान',
          dayStreaks: 'दिनों की श्रृंखला',
          readyTitle: 'स्पॉटलाइट से जुड़ने के लिए तैयार? 🌟',
          readySubtitle: 'कृषि क्विज़ लें, अपनी श्रृंखला बनाएं और साथी किसानों के साथ प्रतिस्पर्धा करें!',
          takeQuizNow: 'अभी क्विज़ लें',
          viewLeaderboard: 'लीडरबोर्ड देखें',
          weeklyChallenge: '🌱 इस सप्ताह की चुनौती',
          weeklyChallengeDesc: '90%+ स्कोर के साथ 5 क्विज़ पूरे करें और "नॉलेज मास्टर" बैज पाएं!',
          weeklyChallengeStats: '5 क्विज़ • 90%+ स्कोर',
          viewChallenge: 'चुनौती विवरण देखें'
        },
        achievements: {
          quizChampion: 'क्विज़ चैंपियन',
          consistentLearner: 'सबसे सुसंगत शिक्षार्थी',
          communityContributor: 'समुदाय योगदानकर्ता',
          desc1: 'लगातार 95% से अधिक स्कोर करते हैं और अन्य किसानों की मदद करते हैं',
          desc2: 'रोज़ाना क्विज़ लेते हैं और उत्कृष्ट सीखने की आदत बनाए रखते हैं',
          desc3: 'खेती के टिप्स साझा करते हैं और साथी किसानों को भाग लेने के लिए प्रोत्साहित करते हैं'
        }
      },
      dashboard: {
        titleTop: 'लाइव फील्ड मॉनिटरिंग',
        titleBottom: 'रियल-टाइम डेटा फ़ीड',
        subtitle: 'देखें कैसे हमारे AI-संचालित ड्रोन और IoT सेंसर वास्तविक समय में डेटा एकत्र और विश्लेषण करते हैं',
        alert: 'चेतावनी',
        alertsToday: 'आज {{count}} चेतावनी{{count, plural, one {} other {याँ}}} - तुरंत ध्यान दें',
        soilMoisture: 'मिट्टी की नमी',
        temperature: 'तापमान',
        humidity: 'आर्द्रता',
        windSpeed: 'पवन गति',
        activeDrones: 'सक्रिय ड्रोन',
        areasScanned: 'स्कैन किया गया क्षेत्र',
        fieldHealthAnalysis: 'क्षेत्र स्वास्थ्य विश्लेषण',
        cropHealthScore: 'फसल स्वास्थ्य स्कोर',
        irrigationEfficiency: 'सिंचाई दक्षता',
        pestDetection: 'कीट पहचान',
        lowRisk: 'कम जोखिम',
        todaysActivity: 'आज की गतिविधि',
        flightHours: 'उड़ान घंटे',
        dataPointsCollected: 'एकत्रित डेटा बिंदु',
        imagesCaptured: 'कैप्चर की गई छवियाँ',
        analysisComplete: 'विश्लेषण पूर्ण',
        status: {
          optimal: 'उत्तम',
          active: 'सक्रिय',
          complete: 'पूर्ण',
          moderate: 'मध्यम',
          high: 'उच्च',
          low: 'कम'
        }
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  })

export default i18n


