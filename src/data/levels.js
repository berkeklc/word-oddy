export const levels = {
    en: [
        {
            id: 1,
            title: "The Awakening",
            story: "Your journey begins in the Whispering Woods. The ancient lantern flickers...",
            words: [
                { id: 'w1', clue: "Opposite of dark", answer: "LIGHT", order: 1, challengeType: "typing" },
                { id: 'w2', clue: "Burning flame", answer: "FIRE", order: 2, challengeType: "typing" },
                { id: 'w3', clue: "To walk on", answer: "PATH", order: 3, challengeType: "typing" }
            ]
        },
        {
            id: 2,
            title: "Echoes of the Past",
            story: "Voices from the past guide your way. Listen closely.",
            words: [
                { id: 'w1', clue: "Not quiet", answer: "LOUD", order: 1, challengeType: "typing" },
                { id: 'w2', clue: "Spoken words", answer: "VOICE", order: 2, challengeType: "typing" },
                { id: 'w3', clue: "Repeated sound", answer: "ECHO", order: 3, challengeType: "typing" },
                { id: 'w4', clue: "Musical sound", answer: "SONG", order: 4, challengeType: "typing" }
            ]
        },
        {
            id: 3,
            title: "The Scramble",
            story: "A chaotic wind has scattered the letters! Restore order.",
            words: [
                { id: 'w1', clue: "Mixed up 'TCA'", answer: "CAT", order: 1, challengeType: "scramble" },
                { id: 'w2', clue: "Unscramble 'DGO'", answer: "DOG", order: 2, challengeType: "scramble" },
                { id: 'w3', clue: "Fix 'BRID'", answer: "BIRD", order: 3, challengeType: "scramble" },
                { id: 'w4', clue: "Sort 'HSFI'", answer: "FISH", order: 4, challengeType: "scramble" },
                { id: 'w5', clue: "Arrange 'LION'", answer: "LION", order: 5, challengeType: "scramble" }
            ]
        },
        {
            id: 4,
            title: "Lost Letters",
            story: "Some runes have faded with time. Fill in the blanks.",
            words: [
                { id: 'w1', clue: "G_EEN (Color)", answer: "GREEN", order: 1, challengeType: "missing" },
                { id: 'w2', clue: "AP_LE (Fruit)", answer: "APPLE", order: 2, challengeType: "missing" },
                { id: 'w3', clue: "H_PPY (Emotion)", answer: "HAPPY", order: 3, challengeType: "missing" },
                { id: 'w4', clue: "W_RLD (Planet)", answer: "WORLD", order: 4, challengeType: "missing" },
                { id: 'w5', clue: "FR_END (Pal)", answer: "FRIEND", order: 5, challengeType: "missing" }
            ]
        },
        {
            id: 5,
            title: "Shadow Realm",
            story: "The fog is thick here. Use your Vision Shard to see clearly.",
            words: [
                { id: 'w1', clue: "Hard to see", answer: "FOG", order: 1, challengeType: "hidden" },
                { id: 'w2', clue: "Dark time", answer: "NIGHT", order: 2, challengeType: "hidden" },
                { id: 'w3', clue: "Scary dream", answer: "NIGHTMARE", order: 3, challengeType: "hidden" },
                { id: 'w4', clue: "Not visible", answer: "INVISIBLE", order: 4, challengeType: "hidden" },
                { id: 'w5', clue: "Secret place", answer: "HIDEOUT", order: 5, challengeType: "hidden" }
            ]
        },
        {
            id: 6,
            title: "Time Trial",
            story: "The sands of time are slipping away! Hurry!",
            words: [
                { id: 'w1', clue: "Tick Tock", answer: "CLOCK", order: 1, challengeType: "timed", timeLimit: 10 },
                { id: 'w2', clue: "Run fast", answer: "SPRINT", order: 2, challengeType: "timed", timeLimit: 8 },
                { id: 'w3', clue: "Do it now", answer: "QUICK", order: 3, challengeType: "timed", timeLimit: 8 },
                { id: 'w4', clue: "High speed", answer: "FAST", order: 4, challengeType: "timed", timeLimit: 5 },
                { id: 'w5', clue: "Finish line", answer: "END", order: 5, challengeType: "timed", timeLimit: 5 }
            ]
        },
        {
            id: 7,
            title: "Master of Words",
            story: "You have mastered the basics. Now, face the ultimate test.",
            words: [
                { id: 'w1', clue: "Unscramble 'PUZLE'", answer: "PUZZLE", order: 1, challengeType: "scramble" },
                { id: 'w2', clue: "M_STERY", answer: "MYSTERY", order: 2, challengeType: "missing" },
                { id: 'w3', clue: "Hidden Gem", answer: "DIAMOND", order: 3, challengeType: "hidden" },
                { id: 'w4', clue: "Speedy Animal", answer: "CHEETAH", order: 4, challengeType: "timed", timeLimit: 10 },
                { id: 'w5', clue: "Final Boss", answer: "VICTORY", order: 5, challengeType: "typing" }
            ]
        },
        {
            id: 8,
            title: "The Elements",
            story: "Nature's forces surround you. Can you name them?",
            words: [
                { id: 'w1', clue: "Flowing liquid", answer: "WATER", order: 1, challengeType: "typing" },
                { id: 'w2', clue: "Solid ground", answer: "EARTH", order: 2, challengeType: "typing" },
                { id: 'w3', clue: "Invisible breath", answer: "WIND", order: 3, challengeType: "typing" },
                { id: 'w4', clue: "Hot plasma", answer: "FIRE", order: 4, challengeType: "typing" },
                { id: 'w5', clue: "Cold crystal", answer: "ICE", order: 5, challengeType: "typing" }
            ]
        },
        {
            id: 9,
            title: "Space Odyssey",
            story: "Look up to the stars. What do you see?",
            words: [
                { id: 'w1', clue: "Night light", answer: "MOON", order: 1, challengeType: "scramble" },
                { id: 'w2', clue: "Burning star", answer: "SUN", order: 2, challengeType: "scramble" },
                { id: 'w3', clue: "Shooting rock", answer: "METEOR", order: 3, challengeType: "scramble" },
                { id: 'w4', clue: "Our home", answer: "EARTH", order: 4, challengeType: "scramble" },
                { id: 'w5', clue: "Red planet", answer: "MARS", order: 5, challengeType: "scramble" }
            ]
        },
        {
            id: 10,
            title: "Ancient Myths",
            story: "Legends of old come to life.",
            words: [
                { id: 'w1', clue: "Fire bird", answer: "PHOENIX", order: 1, challengeType: "missing" },
                { id: 'w2', clue: "Flying lizard", answer: "DRAGON", order: 2, challengeType: "missing" },
                { id: 'w3', clue: "Horse with horn", answer: "UNICORN", order: 3, challengeType: "missing" },
                { id: 'w4', clue: "Big foot", answer: "YETI", order: 4, challengeType: "missing" },
                { id: 'w5', clue: "Sea monster", answer: "KRAKEN", order: 5, challengeType: "missing" }
            ]
        }
    ],
    tr: [
        {
            id: 1,
            title: "Uyanış",
            story: "Yolculuğun Fısıltılı Orman'da başlıyor. Antik fener titriyor...",
            words: [
                { id: 'w1', clue: "Karanlığın zıttı", answer: "IŞIK", order: 1, challengeType: "typing" },
                { id: 'w2', clue: "Yanan alev", answer: "ATEŞ", order: 2, challengeType: "typing" },
                { id: 'w3', clue: "Üzerinde yürünür", answer: "YOL", order: 3, challengeType: "typing" }
            ]
        },
        {
            id: 2,
            title: "Geçmişin Yankıları",
            story: "Geçmişten gelen sesler sana yol gösteriyor. İyi dinle.",
            words: [
                { id: 'w1', clue: "Sessiz değil", answer: "GÜRÜLTÜ", order: 1, challengeType: "typing" },
                { id: 'w2', clue: "Konuşulan sözler", answer: "SES", order: 2, challengeType: "typing" },
                { id: 'w3', clue: "Tekrar eden ses", answer: "YANKI", order: 3, challengeType: "typing" },
                { id: 'w4', clue: "Müzikal ses", answer: "ŞARKI", order: 4, challengeType: "typing" }
            ]
        },
        {
            id: 3,
            title: "Karışıklık",
            story: "Kaotik bir rüzgar harfleri dağıttı! Düzeni sağla.",
            words: [
                { id: 'w1', clue: "'EDİK' karışık", answer: "KEDİ", order: 1, challengeType: "scramble" },
                { id: 'w2', clue: "'PEKÖK' düzelt", answer: "KÖPEK", order: 2, challengeType: "scramble" },
                { id: 'w3', clue: "'ŞUK' düzenle", answer: "KUŞ", order: 3, challengeType: "scramble" },
                { id: 'w4', clue: "'LIKBA' sırala", answer: "BALIK", order: 4, challengeType: "scramble" },
                { id: 'w5', clue: "'LANAS' çöz", answer: "ASLAN", order: 5, challengeType: "scramble" }
            ]
        },
        {
            id: 4,
            title: "Kayıp Harfler",
            story: "Bazı harfler zamanla silinmiş. Boşlukları doldur.",
            words: [
                { id: 'w1', clue: "YE_İL (Renk)", answer: "YEŞİL", order: 1, challengeType: "missing" },
                { id: 'w2', clue: "EL_A (Meyve)", answer: "ELMA", order: 2, challengeType: "missing" },
                { id: 'w3', clue: "MU_LU (Duygu)", answer: "MUTLU", order: 3, challengeType: "missing" },
                { id: 'w4', clue: "DÜN_A (Gezegen)", answer: "DÜNYA", order: 4, challengeType: "missing" },
                { id: 'w5', clue: "AR_ADAŞ (Dost)", answer: "ARKADAŞ", order: 5, challengeType: "missing" }
            ]
        },
        {
            id: 5,
            title: "Gölge Diyarı",
            story: "Sis burada çok yoğun. Görmek için Vizyon Parçası'nı kullan.",
            words: [
                { id: 'w1', clue: "Görmesi zor", answer: "SİS", order: 1, challengeType: "hidden" },
                { id: 'w2', clue: "Karanlık zaman", answer: "GECE", order: 2, challengeType: "hidden" },
                { id: 'w3', clue: "Korkunç rüya", answer: "KABUS", order: 3, challengeType: "hidden" },
                { id: 'w4', clue: "Görünmez", answer: "GÖRÜNMEZ", order: 4, challengeType: "hidden" },
                { id: 'w5', clue: "Gizli yer", answer: "SAKLANBAÇ", order: 5, challengeType: "hidden" }
            ]
        },
        {
            id: 6,
            title: "Zaman Yarışı",
            story: "Zaman akıp gidiyor! Acele et!",
            words: [
                { id: 'w1', clue: "Tik Tak", answer: "SAAT", order: 1, challengeType: "timed", timeLimit: 10 },
                { id: 'w2', clue: "Hızlı koş", answer: "KOŞU", order: 2, challengeType: "timed", timeLimit: 8 },
                { id: 'w3', clue: "Hemen yap", answer: "ÇABUK", order: 3, challengeType: "timed", timeLimit: 8 },
                { id: 'w4', clue: "Yüksek sürat", answer: "HIZLI", order: 4, challengeType: "timed", timeLimit: 5 },
                { id: 'w5', clue: "Bitiş çizgisi", answer: "SON", order: 5, challengeType: "timed", timeLimit: 5 }
            ]
        },
        {
            id: 7,
            title: "Kelime Ustası",
            story: "Temelleri öğrendin. Şimdi nihai testle yüzleş.",
            words: [
                { id: 'w1', clue: "'MACABUL' karışık", answer: "BULMACA", order: 1, challengeType: "scramble" },
                { id: 'w2', clue: "G_ZEM", answer: "GİZEM", order: 2, challengeType: "missing" },
                { id: 'w3', clue: "Değerli Taş", answer: "ELMAS", order: 3, challengeType: "hidden" },
                { id: 'w4', clue: "Hızlı Hayvan", answer: "ÇİTA", order: 4, challengeType: "timed", timeLimit: 10 },
                { id: 'w5', clue: "Son Patron", answer: "ZAFER", order: 5, challengeType: "typing" }
            ]
        },
        {
            id: 8,
            title: "Elementler",
            story: "Doğanın güçleri etrafını sarıyor. Onları isimlendirebilir misin?",
            words: [
                { id: 'w1', clue: "Akışkan sıvı", answer: "SU", order: 1, challengeType: "typing" },
                { id: 'w2', clue: "Katı zemin", answer: "TOPRAK", order: 2, challengeType: "typing" },
                { id: 'w3', clue: "Görünmez nefes", answer: "RÜZGAR", order: 3, challengeType: "typing" },
                { id: 'w4', clue: "Sıcak plazma", answer: "ATEŞ", order: 4, challengeType: "typing" },
                { id: 'w5', clue: "Soğuk kristal", answer: "BUZ", order: 5, challengeType: "typing" }
            ]
        },
        {
            id: 9,
            title: "Uzay Macerası",
            story: "Yıldızlara bak. Ne görüyorsun?",
            words: [
                { id: 'w1', clue: "Gece lambası", answer: "AY", order: 1, challengeType: "scramble" },
                { id: 'w2', clue: "Yanan yıldız", answer: "GÜNEŞ", order: 2, challengeType: "scramble" },
                { id: 'w3', clue: "Kayan kaya", answer: "METEOR", order: 3, challengeType: "scramble" },
                { id: 'w4', clue: "Evimiz", answer: "DÜNYA", order: 4, challengeType: "scramble" },
                { id: 'w5', clue: "Kızıl gezegen", answer: "MARS", order: 5, challengeType: "scramble" }
            ]
        },
        {
            id: 10,
            title: "Antik Efsaneler",
            story: "Eski efsaneler canlanıyor.",
            words: [
                { id: 'w1', clue: "Ateş kuşu", answer: "ZÜMRÜDÜANKA", order: 1, challengeType: "missing" },
                { id: 'w2', clue: "Uçan kertenkele", answer: "EJDERHA", order: 2, challengeType: "missing" },
                { id: 'w3', clue: "Boynuzlu at", answer: "TEKBOYNUZ", order: 3, challengeType: "missing" },
                { id: 'w4', clue: "Koca ayak", answer: "YETİ", order: 4, challengeType: "missing" },
                { id: 'w5', clue: "Deniz canavarı", answer: "KRAKEN", order: 5, challengeType: "missing" }
            ]
        }
    ]
};
