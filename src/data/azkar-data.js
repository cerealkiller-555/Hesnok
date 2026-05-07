const AZKAR_DATA = {
    defaultCustomDuas: [
        "اللهم إني أسألك العفو والعافية في الدنيا والآخرة",
        "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار"
    ],
    tabs: [
        { id: "morning", label: "الصباح", labelEn: "Morning", icon: "Sun", color: "from-amber-400 to-orange-500" },
        { id: "evening", label: "المساء", labelEn: "Evening", icon: "Moon", color: "from-indigo-500 to-purple-600" },
        { id: "sleeping", label: "النوم", labelEn: "Sleep", icon: "Moon", color: "from-slate-700 to-slate-900" },
        { id: "prayer_azkar", label: "بعد الصلاة", labelEn: "After Prayer", icon: "BookOpen", color: "from-emerald-500 to-teal-600" },
        { id: "jawami", label: "جوامع الدعاء", labelEn: "Prophet's Duas", icon: "Heart", color: "from-rose-500 to-pink-600" },
        { id: "prayer", label: "المواقيت", labelEn: "Prayer Times", icon: "Clock", color: "from-blue-500 to-cyan-500" },
        { id: "custom", label: "أدعيتي", labelEn: "My Duas", icon: "Heart", color: "from-rose-400 to-pink-600" },
        { id: "settings", label: "الإعدادات", labelEn: "Settings", icon: "Settings", color: "from-slate-500 to-slate-700" }
    ],
    azkar: {
        morning: [
            { id: 1, title: "آية الكرسي", text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ", count: 1, source: "الحاكم وابن حبان", sourceEn: "Al-Hakim and Ibn Hibban", benefit: "من قالها حين يصبح أجير من الجن حتى يمسي", benefitEn: "Whoever says it in the morning is protected from jinn until evening." },
            { id: 2, text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ", count: 1, source: "أحمد", sourceEn: "Ahmad" },
            { id: 3, text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3, source: "أصحاب السنن", sourceEn: "Authors of the Sunan", benefit: "من قالها حين يصبح وحين يمسي كان حقاً على الله أن يرضيه", benefitEn: "Whoever says it in the morning and evening, it is a right upon Allah to please him." },
            { id: 4, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا", count: 1, source: "ابن ماجه", sourceEn: "Ibn Majah" },
            { id: 5, text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1, source: "أصحاب السنن عدا النسائي", sourceEn: "Authors of the Sunan except Al-Nasa'i" },
            { id: 6, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, source: "البزار والطبراني في الدعاء", sourceEn: "Al-Bazzar and Al-Tabarani" },
            { id: 7, text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ أَبَدًا", count: 1, source: "البزار", sourceEn: "Al-Bazzar" },
            { id: 8, title: "سيد الاستغفار", text: "اللَّهُمَّ أَنْتَ رَبِّي، لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", count: 1, source: "البخاري", sourceEn: "Al-Bukhari", benefit: "من قالها موقناً بها حين يصبح فمات من يومه دخل الجنة", benefitEn: "Whoever says it with certainty in the morning and dies that day will enter Paradise." },
            { id: 9, text: "اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ", count: 1, source: "الترمذي", sourceEn: "Al-Tirmidhi" },
            { id: 10, text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ النَّارِ وَعَذَابِ الْقَبْرِ", count: 1, source: "مسلم", sourceEn: "Muslim" },
            { id: 11, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، وَاحْفَظْنِي مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي", count: 1, source: "أبو داود وابن ماجه", sourceEn: "Abu Dawud and Ibn Majah", benefit: "دعاء للحفظ والعافية الشاملة", benefitEn: "Supplication for comprehensive protection and well-being." },
            { id: 12, text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3, source: "أصحاب السنن عدا النسائي", sourceEn: "Authors of the Sunan except Al-Nasa'i", benefit: "لم يضره شيء", benefitEn: "Nothing will harm him." },
            { id: 13, text: "سُبْحَانَ اللَّهِ عَدَدَ خَلْقِهِ، سُبْحَانَ اللَّهِ رِضَا نَفْسِهِ، سُبْحَانَ اللَّهِ زِنَةَ عَرْشِهِ، سُبْحَانَ اللَّهِ مِدَادَ كَلِمَاتِهِ", count: 3, source: "مسلم", sourceEn: "Muslim" },
            { id: 14, text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ", count: 3, source: "أبو داود", sourceEn: "Abu Dawud" },
            { id: 15, title: "الإخلاص والمعوذتين", text: "قُلْ هُوَ اللَّهُ أَحَدٌ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ", count: 3, source: "الترمذي", sourceEn: "Al-Tirmidhi", benefit: "من قالها ثلاث مرات حين يصبح وحين يمسي تكفيه من كل شيء", benefitEn: "Whoever says it three times in the morning and evening, it will suffice him from everything." },
            { id: 16, text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7, source: "أبو داود", sourceEn: "Abu Dawud", benefit: "كفاه الله ما أهمه من أمر الدنيا والآخرة", benefitEn: "Allah will suffice him in whatever concerns him of this world and the Hereafter." },
            { id: 17, text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ، أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ، وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", count: 4, source: "أبو داود والترمذي", sourceEn: "Abu Dawud and Al-Tirmidhi", benefit: "من قالها أعتقه الله من النار", benefitEn: "Whoever says it, Allah will free him from the Fire." },
            { id: 18, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, source: "ابن حبان", sourceEn: "Ibn Hibban" },
            { id: 19, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, source: "مسلم", sourceEn: "Muslim", benefit: "حطت خطاياه وإن كانت مثل زبد البحر", benefitEn: "His sins will be erased even if they are like the foam of the sea." },
            { id: 20, text: "أَسْتَغْفِرُ اللَّهَ", count: 100, source: "ابن أبي شيبة", sourceEn: "Ibn Abi Shaybah" },
            { id: 21, text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 100, source: "الترمذي", sourceEn: "Al-Tirmidhi" }
        ],
        evening: [
            { id: 1, title: "آية الكرسي", text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ", count: 1, source: "الحاكم وابن حبان", sourceEn: "Al-Hakim and Ibn Hibban", benefit: "من قالها حين يمسي أجير من الجن حتى يصبح", benefitEn: "Whoever says it in the evening is protected from jinn until morning." },
            { id: 2, text: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ", count: 1, source: "أحمد", sourceEn: "Ahmad" },
            { id: 3, text: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3, source: "أصحاب السنن", sourceEn: "Authors of the Sunan", benefit: "من قالها حين يصبح وحين يمسي كان حقاً على الله أن يرضيه", benefitEn: "Whoever says it in the morning and evening, it is a right upon Allah to please him." },
            { id: 4, text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1, source: "أصحاب السنن عدا النسائي", sourceEn: "Authors of the Sunan except Al-Nasa'i" },
            { id: 5, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, source: "البزار والطبراني في الدعاء", sourceEn: "Al-Bazzar and Al-Tabarani" },
            { id: 6, text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ أَبَدًا", count: 1, source: "البزار", sourceEn: "Al-Bazzar" },
            { id: 7, title: "سيد الاستغفار", text: "اللَّهُمَّ أَنْتَ رَبِّي، لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", count: 1, source: "البخاري", sourceEn: "Al-Bukhari", benefit: "من قالها موقناً بها حين يمسي فمات من ليلته دخل الجنة", benefitEn: "Whoever says it with certainty in the evening and dies that night will enter Paradise." },
            { id: 8, text: "اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ", count: 1, source: "الترمذي", sourceEn: "Al-Tirmidhi" },
            { id: 9, text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرِ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، وَأَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ", count: 1, source: "مسلم", sourceEn: "Muslim" },
            { id: 10, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، وَاحْفَظْنِي مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي", count: 1, source: "أبو داود وابن ماجه", sourceEn: "Abu Dawud and Ibn Majah", benefit: "دعاء للحفظ والعافية الشاملة", benefitEn: "Supplication for comprehensive protection and well-being." },
            { id: 11, text: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3, source: "أصحاب السنن عدا النسائي", sourceEn: "Authors of the Sunan except Al-Nasa'i", benefit: "لم يضره شيء", benefitEn: "Nothing will harm him." },
            { id: 12, text: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3, source: "مسلم", sourceEn: "Muslim", benefit: "لم تضره حمة تلك الليلة", benefitEn: "He will not be harmed by any sting that night." },
            { id: 13, text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ", count: 3, source: "أبو داود", sourceEn: "Abu Dawud" },
            { id: 14, title: "الإخلاص والمعوذتين", text: "قُلْ هُوَ اللَّهُ أَحَدٌ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ", count: 3, source: "الترمذي", sourceEn: "Al-Tirmidhi", benefit: "من قالها ثلاث مرات حين يصبح وحين يمسي تكفيه من كل شيء", benefitEn: "Whoever says it three times in the morning and evening, it will suffice him from everything." },
            { id: 15, text: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", count: 7, source: "أبو داود", sourceEn: "Abu Dawud", benefit: "كفاه الله ما أهمه من أمر الدنيا والآخرة", benefitEn: "Allah will suffice him in whatever concerns him of this world and the Hereafter." },
            { id: 16, text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ، أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ، وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", count: 4, source: "أبو داود والترمذي", sourceEn: "Abu Dawud and Al-Tirmidhi", benefit: "من قالها أعتقه الله من النار", benefitEn: "Whoever says it, Allah will free him from the Fire." },
            { id: 17, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, source: "ابن حبان", sourceEn: "Ibn Hibban" },
            { id: 18, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, source: "مسلم", sourceEn: "Muslim", benefit: "حطت خطاياه وإن كانت مثل زبد البحر", benefitEn: "His sins will be erased even if they are like the foam of the sea." },
            { id: 19, text: "أَسْتَغْفِرُ اللَّهَ", count: 100, source: "ابن أبي شيبة", sourceEn: "Ibn Abi Shaybah" },
            { id: 20, text: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 100, source: "الترمذي", sourceEn: "Al-Tirmidhi" }
        ],
        sleeping: [
            {
                id: 1,
                title: "باسمك ربي",
                text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
                count: 1,
                benefit: "الحفظ عند النوم",
                benefitEn: "Protection during sleep",
                source: "البخاري",
                sourceEn: "Al-Bukhari"
            },
            {
                id: 2,
                title: "اللهم خلقت نفسي",
                text: "اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا لَكَ مَمَاتُهَا وَمَحْيَاهَا إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا",
                count: 1,
                benefit: "دعاء النوم",
                benefitEn: "Sleep supplication",
                source: "مسلم",
                sourceEn: "Muslim"
            },
            {
                id: 3,
                title: "آية الكرسي",
                text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَؤُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
                count: 1,
                benefit: "من قرأها عند النوم حفظه الله ولم يقربه شيطان حتى يصبح",
                benefitEn: "Whoever reads it when sleeping, Allah will protect him and no devil will approach him until morning.",
                source: "البخاري",
                sourceEn: "Al-Bukhari"
            },
            {
                id: 4,
                title: "الإخلاص والمعوذتين",
                text: "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ قُلْ هُوَ اللَّهُ أَحَدٌ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ...",
                count: 3,
                benefit: "سنة النبي ﷺ عند النوم؛ يجمع كفيه وينفث فيهما ويقرأ السور الثلاث ثم يمسح بهما جسده.",
                benefitEn: "Sunnah of the Prophet ﷺ before sleeping; blowing into the hands, reading the three surahs, and wiping the body.",
                source: "البخاري",
                sourceEn: "Al-Bukhari"
            },
            {
                id: 5,
                text: "سُبْحَانَ اللَّهِ",
                count: 33,
                benefit: "علمها النبي ﷺ لفاطمة وعلي رضي الله عنهما عند النوم، وهي خير لهما من خادم.",
                benefitEn: "Taught by the Prophet ﷺ to Fatimah and Ali before sleeping, better for them than a servant.",
                source: "البخاري ومسلم",
                sourceEn: "Al-Bukhari and Muslim"
            },
            {
                id: 6,
                text: "الْحَمْدُ لِلَّهِ",
                count: 33,
                benefit: "خير من خادم عند النوم",
                benefitEn: "Better than a servant when sleeping.",
                source: "البخاري ومسلم",
                sourceEn: "Al-Bukhari and Muslim"
            },
            {
                id: 7,
                text: "اللَّهُ أَكْبَرُ",
                count: 34,
                benefit: "التكبير 34 عند النوم، لتكون مائة بالتمام وهي خير من خادم",
                benefitEn: "Saying Allahu Akbar 34 times when sleeping, better than a servant.",
                source: "البخاري ومسلم",
                sourceEn: "Al-Bukhari and Muslim"
            }
        ],
        prayerAzkar: [
            { id: 1, text: "أَسْتَغْفِرُ اللَّهَ", count: 3, benefit: "سنة النبي ﷺ بعد التسليم مباشرة للرجال والنساء", benefitEn: "Sunnah of the Prophet ﷺ immediately after the tasleem.", source: "مسلم", sourceEn: "Muslim" },
            { id: 2, text: "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", count: 1, benefit: "سنة بعد الاستغفار مباشرة", benefitEn: "Sunnah immediately after seeking forgiveness.", source: "مسلم", sourceEn: "Muslim" },
            { id: 3, text: "لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 3, benefit: "تقال مرة أو ثلاثاً والثلاث أفضل", benefitEn: "Said once or three times (three is better).", source: "البخاري ومسلم", sourceEn: "Al-Bukhari and Muslim" },
            { id: 4, text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ، وَلَهُ الْفَضْلُ، وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ", count: 1, benefit: "سنة للجميع المصلين بعد الفريضة", benefitEn: "Sunnah for all worshippers after the obligatory prayer.", source: "مسلم", sourceEn: "Muslim" },
            { id: 5, text: "لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, benefit: "زيادة تقال بعد صلاتي الفجر والمغرب فقط", benefitEn: "An addition said only after Fajr and Maghrib prayers.", source: "الترمذي", sourceEn: "Al-Tirmidhi" },
            { id: 6, title: "آية الكرسي", text: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...", count: 1, benefit: "من قرأها دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت", benefitEn: "Whoever reads it after every obligatory prayer, nothing prevents him from entering Paradise except death.", source: "النسائي", sourceEn: "Al-Nasa'i" },
            { id: 7, title: "الإخلاص والمعوذتين", text: "قُلْ هُوَ اللَّهُ أَحَدٌ ... قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ... قُلْ أَعُوذُ بِرَبِّ النَّاسِ", count: 1, benefit: "تقرأ مرة بعد الظهر والعصر والعشاء، وثلاث مرات بعد الفجر والمغرب", benefitEn: "Read once after Dhuhr, Asr, Isha, and three times after Fajr and Maghrib.", source: "أبو داود", sourceEn: "Abu Dawud" },
            { id: 8, text: "سُبْحَانَ اللَّهِ", count: 33, benefit: "مغفرة الخطايا", benefitEn: "Forgiveness of sins.", source: "مسلم", sourceEn: "Muslim" },
            { id: 9, text: "الْحَمْدُ لِلَّهِ", count: 33, benefit: "مغفرة الخطايا", benefitEn: "Forgiveness of sins.", source: "مسلم", sourceEn: "Muslim" },
            { id: 10, text: "اللَّهُ أَكْبَرُ", count: 33, benefit: "مغفرة الخطايا", benefitEn: "Forgiveness of sins.", source: "مسلم", sourceEn: "Muslim" },
            { id: 11, text: "لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, benefit: "تختم بها المئة، وتغفر الخطايا وإن كانت كزبد البحر", benefitEn: "Completes the hundred, and sins are forgiven even if they are like the foam of the sea.", source: "مسلم", sourceEn: "Muslim" }
        ],
        jawami: [
            {
                id: 1,
                title: "سؤال الخير كله",
                text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ عَبْدُكَ وَنَبِيُّكَ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا عَاذَ بِهِ عَبْدُكَ وَنَبِيُّكَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَسْأَلُكَ أَنْ تَجْعَلَ كُلَّ قَضَاءٍ قَضَيْتَهُ لِي خَيْرًا",
                count: 1,
                benefit: "من أجمع الأدعية النبوية للخير كله (ابن باز)",
                benefitEn: "One of the most comprehensive prophetic supplications for all good.",
                source: "ابن ماجه وأحمد (صححه الألباني)",
                sourceEn: "Ibn Majah and Ahmad"
            },
            {
                id: 2,
                title: "مغفرة الذنوب",
                text: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ",
                count: 1,
                benefit: "دعاء جامع للمغفرة الشاملة",
                benefitEn: "A comprehensive supplication for complete forgiveness.",
                source: "مسلم",
                sourceEn: "Muslim"
            },
            {
                id: 3,
                title: "الاستعاذة من الهم والحزن",
                text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
                count: 1,
                benefit: "التعوذ من ثمانية أشياء تعيق المسلم في حياته ودينه",
                benefitEn: "Seeking refuge from eight things that hinder a Muslim in life and religion.",
                source: "البخاري",
                sourceEn: "Al-Bukhari"
            },
            {
                id: 4,
                title: "خير الدنيا والآخرة",
                text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
                count: 1,
                benefit: "كان أكثر دعاء النبي ﷺ",
                benefitEn: "This was the most frequent supplication of the Prophet ﷺ.",
                source: "البخاري ومسلم",
                sourceEn: "Al-Bukhari and Muslim"
            },
            {
                id: 5,
                title: "الثبات على الدين",
                text: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
                count: 1,
                benefit: "كان النبي ﷺ يُكثر من هذا الدعاء",
                benefitEn: "The Prophet ﷺ used to say this supplication frequently.",
                source: "الترمذي",
                sourceEn: "Al-Tirmidhi"
            }
        ]
    }
};
export default AZKAR_DATA;
