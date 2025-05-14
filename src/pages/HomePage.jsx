import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  XMarkIcon,
  StopIcon,
} from "@heroicons/react/24/solid"; // İkonlar
import { InformationCircleIcon } from "@heroicons/react/24/outline"; // Hatırlatma ikonu
import {
  getDailyPlanForDate,
  getWorkoutPlanObject,
  getWorkoutExercises,
  formatSeconds,
} from "../utils/planUtils";

// Günlük Plan (2 Haftalık Döngü) - Yapısal Değişiklik
const dailyPlanSchedule = [
  // Hafta 1
  {
    dayIndex: 0,
    dayName: "Pazartesi",
    tasks: [
      "✅ Spor Günü",
      {
        type: "workout",
        name: "Full Body Antrenman",
        exercises: [
          { name: "Squat", sets: 3, reps: 10 },
          { name: "Diz üstü şınav", sets: 3, reps: 8 },
          { name: "Plank", sets: 3, duration: 20 }, // Süre saniye cinsinden
          { name: "Glute Bridge", sets: 3, reps: 15 },
        ],
      },
      "💧 2-2.5L su iç",
      "⚖️ Sabah tartıl",
      "🍽️ Yalnızca öğle ve akşam yemeği",
      "🚫 Atıştırmalık yok",
    ],
  },
  {
    dayIndex: 1,
    dayName: "Salı",
    tasks: [
      "❌ Dinlenme",
      "🚶‍♀️ Minimum 6.000 adım",
      "💧 Su takibi",
      "⚖️ Tartıl",
      "🧠 Günlük değerlendirme",
    ],
  },
  {
    dayIndex: 2,
    dayName: "Çarşamba",
    tasks: [
      "✅ Spor Günü",
      {
        type: "workout",
        name: "Üst Vücut Antrenmanı",
        exercises: [
          { name: "Shoulder Press (Dumbbell/Su Şişesi)", sets: 3, reps: 10 },
          { name: "Bent-over Row (Dumbbell/Su Şişesi)", sets: 3, reps: 8 },
          { name: "Wall Push-up", sets: 3, reps: 10 },
          { name: "Side Plank (Her Taraf)", sets: 3, duration: 15 },
        ],
      },
      "💧 Su iç, tartıl",
    ],
  },
  {
    dayIndex: 3,
    dayName: "Perşembe",
    tasks: [
      "❌ Dinlenme",
      "🚶‍♀️ Adım hedefi",
      "⚖️ Tartıl",
      "🧘 Hafif esneme önerilir",
    ],
  },
  {
    dayIndex: 4,
    dayName: "Cuma",
    tasks: ["❌ Dinlenme", "💧 Su, beslenme takibi", "⚖️ Tartıl"],
  },
  {
    dayIndex: 5,
    dayName: "Cumartesi",
    tasks: [
      "✅ Spor Günü",
      {
        type: "workout",
        name: "Alt Vücut Odaklı",
        exercises: [
          { name: "Lunge (Her Bacak)", sets: 3, reps: 12 },
          { name: "Calf Raise", sets: 3, reps: 15 },
          { name: "Glute Bridge", sets: 3, reps: 10 },
          { name: "Wall Sit", sets: 3, duration: 30 },
        ],
      },
      "💧 Su",
      "🛒 Alışveriş listesi çıkar",
    ],
  },
  {
    dayIndex: 6,
    dayName: "Pazar",
    tasks: [
      "🚶‍♀️ Yürüyüş + Dinlenme",
      "• 45 dk hafif tempolu yürüyüş",
      "• Hafif esneme",
      "⚖️ Tartıl",
      "📊 Haftalık değerlendirme",
    ],
  },
  // Hafta 2
  {
    dayIndex: 7,
    dayName: "Pazartesi",
    tasks: ["❌ Dinlenme", "💧 Su, adım takibi", "⚖️ Tartıl"],
  },
  {
    dayIndex: 8,
    dayName: "Salı",
    tasks: [
      "✅ Spor Günü",
      {
        type: "workout",
        name: "Full Body Antrenman",
        exercises: [
          { name: "Jumping Jack", sets: 3, reps: 10 }, // veya düşük tempo
          { name: "Squat", sets: 3, reps: 12 },
          { name: "Incline Push-up (Yatak vb.)", sets: 3, reps: 10 },
          { name: "Plank", sets: 3, duration: 30 },
        ],
      },
      "💧 Su",
      "🍽️ Öğün takibi",
    ],
  },
  {
    dayIndex: 9,
    dayName: "Çarşamba",
    tasks: ["❌ Dinlenme", "🚶‍♀️ 6.000+ adım", "⚖️ Tartıl"],
  },
  {
    dayIndex: 10,
    dayName: "Perşembe",
    tasks: [
      "✅ Spor Günü",
      {
        type: "workout",
        name: "Üst Vücut Odaklı",
        exercises: [
          { name: "Dumbbell Curl (varsa)", sets: 3, reps: 10 },
          { name: "Row (Eşya ile)", sets: 3, reps: 8 },
          { name: "Shoulder Tap", sets: 3, reps: 10 }, // Her taraf için toplam
          { name: "Side Plank (Her Taraf)", sets: 3, duration: 20 },
        ],
      },
      "💧 Su",
    ],
  },
  { dayIndex: 11, dayName: "Cuma", tasks: ["❌ Dinlenme", "⚖️ Tartıl"] },
  {
    dayIndex: 12,
    dayName: "Cumartesi",
    tasks: [
      "✅ Spor Günü",
      {
        type: "workout",
        name: "Bacak & Core",
        exercises: [
          { name: "Glute Bridge", sets: 3, reps: 15 },
          { name: "Lunge (Her Bacak)", sets: 3, reps: 12 },
          { name: "Leg Raise", sets: 3, reps: 10 },
          { name: "Wall Sit", sets: 3, duration: 30 },
        ],
      },
      "💧 Su, tartıl",
    ],
  },
  {
    dayIndex: 13,
    dayName: "Pazar",
    tasks: [
      "🚶‍♀️ Yürüyüş + Dinlenme",
      "• 45 dk hafif yürüyüş",
      "• Hafif esneme",
      "⚖️ Tartıl",
      "📊 Haftalık değerlendirme",
    ],
  },
];

// Referans bir başlangıç tarihi (örneğin ilk Pazartesi) - BU TANIMLAMA ARTIK KULLANILMIYOR
// utils/planUtils.js dosyasındaki export const startDate değişkeni kullanılıyor
// !!! ÖNEMLİ: BU TARİHİ KENDİ PROGRAMINIZIN BAŞLADIĞI İLK PAZARTESİ GÜNÜ İLE DEĞİŞTİRİN !!!
// Örneğin, programınız 15 Nisan 2024 Pazartesi başladıysa: new Date('2024-04-15')
// const startDate = new Date("2024-04-08"); // Program başlangıç tarihini buraya YYYY-AA-GG formatında girin

function HomePage({ user }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true); // Günün verisini yükleme durumu

  // Form verileri için state'ler
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const [date, setDate] = useState(todayStr); // Tarih (genellikle bugünü kullanacağız)
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [workoutPerformed, setWorkoutPerformed] = useState(""); // 'Planned', 'Custom', 'Rest', 'None'
  const [lunchCalories, setLunchCalories] = useState("");
  const [dinnerCalories, setDinnerCalories] = useState("");
  const [snackCalories, setSnackCalories] = useState("");
  const [water, setWater] = useState("");
  const [evaluation, setEvaluation] = useState("");

  // Timer State'leri
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerStatus, setTimerStatus] = useState("stopped"); // 'stopped', 'running', 'paused'
  const [elapsedTime, setElapsedTime] = useState(0); // Toplam süre (saniye)
  const [timerIntervalId, setTimerIntervalId] = useState(null);
  const [workoutDuration, setWorkoutDuration] = useState(null); // Tamamlanan toplam süre (dakika)

  // Antrenman Takip State'leri
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutProgress, setWorkoutProgress] = useState([]); // { exerciseIndex: number, set: number, duration: number }
  const [currentSetStartTime, setCurrentSetStartTime] = useState(null); // Mevcut setin başlangıç zamanı (timestamp)
  const [pauseStartTime, setPauseStartTime] = useState(null); // Duraklatma başlangıç zamanı

  // Set bitirme animasyonu için state'ler
  const [showSetCompletedAnimation, setShowSetCompletedAnimation] =
    useState(false);
  const [lastCompletedSet, setLastCompletedSet] = useState(null);
  const [highlightSetNumber, setHighlightSetNumber] = useState(false);

  // Onun yerine bunları useEffect içine veya doğrudan kullanıldığı yere taşıyın
  const [todayPlan, setTodayPlan] = useState(null);
  const [workoutPlanObject, setWorkoutPlanObject] = useState(null);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [plannedWorkoutName, setPlannedWorkoutName] = useState("Aktivite Yok");

  useEffect(() => {
    // Bugün değişkenini oluştur
    const today = new Date();
    console.log("HomePage: Today Date Object:", today);
    console.log("HomePage: Today ISO String:", today.toISOString());
    console.log("HomePage: Today Locale String:", today.toLocaleString());
    console.log("HomePage: Today Weekday:", today.getDay()); // 0-6 (Pazar-Cumartesi)

    // Günün programını çek
    const plan = getDailyPlanForDate(today); // utils'den
    console.log("HomePage: Received plan from getDailyPlanForDate:", plan);
    console.log("HomePage: The day should be:", plan.dayName);

    const workoutObj = getWorkoutPlanObject(plan); // utils'den
    const exercises = getWorkoutExercises(workoutObj); // utils'den

    setTodayPlan(plan);
    setWorkoutPlanObject(workoutObj);
    setWorkoutExercises(exercises);
    setPlannedWorkoutName(workoutObj?.name || "Aktivite Yok");

    const loadDataForToday = async () => {
      if (!user) return;
      setIsDataLoading(true);
      const docId = `${user.uid}_${todayStr}`;
      const docRef = doc(db, "dailyEntries", docId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWeight(data.weight?.toString() || "");
          setSteps(data.steps?.toString() || "");
          setWorkoutPerformed(data.workoutPerformed || "");
          setLunchCalories(data.lunchCalories?.toString() || "");
          setDinnerCalories(data.dinnerCalories?.toString() || "");
          setSnackCalories(data.snackCalories?.toString() || "");
          setWater(data.water?.toString() || "");
          setEvaluation(data.evaluation || "");
          setWorkoutDuration(data.workoutDuration || null); // Kayıtlı süreyi yükle
        } else {
          // Eğer veri yoksa formu sıfırla (opsiyonel, state'ler zaten başlangıçta boş)
          // resetForm(); // Gerekirse
        }
      } catch (error) {
        console.error("Bugünün verisi yüklenirken hata:", error);
        // Hata durumunda kullanıcıya bilgi verilebilir
      } finally {
        setIsDataLoading(false);
      }
    };
    loadDataForToday();
  }, [user, todayStr]); // Kullanıcı veya gün değiştiğinde yükle

  // Adımların Tanımı
  const stepsConfig = [
    {
      id: "weight",
      label: "Bugünkü kilonuz (kg)?",
      type: "number",
      value: weight,
      setter: setWeight,
      placeholder: "Örn: 75.5",
    },
    {
      id: "steps",
      label: "Bugünkü adım sayınız?",
      type: "number",
      value: steps,
      setter: setSteps,
      placeholder: "Örn: 6500",
    },
    {
      id: "workout",
      label: `Bugün spor (${plannedWorkoutName})?`,
      type: "workout",
      value: workoutPerformed,
      setter: setWorkoutPerformed,
      options: [
        // Planlanan antrenman seçeneği (eğer dinlenme değilse)
        ...(plannedWorkoutName !== "Dinlenme" &&
        plannedWorkoutName !== "Aktivite Yok"
          ? [
              {
                label: `✅ Evet, ${plannedWorkoutName} yaptım`,
                value: plannedWorkoutName,
              },
            ]
          : []),
        // Her zaman özel antrenman seçeneği
        { label: "🤸 Başka bir spor yaptım", value: "Custom" },
        // Eğer planlanan dinlenme DEĞİLSE "yapmadım" seçeneği
        ...(plannedWorkoutName !== "Dinlenme"
          ? [{ label: "❌ Hayır, yapmadım", value: "None" }]
          : []),
        // Eğer planlanan dinlenme veya aktivite yok İSE "hafif aktivite" seçeneği
        ...(plannedWorkoutName === "Dinlenme" ||
        plannedWorkoutName === "Aktivite Yok"
          ? [
              {
                label: "🚶‍♀️ Sadece yürüdüm/hafif aktivite",
                value: "Rest Activity",
              },
            ]
          : []),
      ],
      // Detayları göstermek için plandan alabiliriz ama butonlar karmaşıklaşabilir. Şimdilik kaldırdım.
      // details: todayPlan.tasks.find(t => t.includes('🏋️') || t.includes('🚶‍♀️')) || ''
    },
    {
      id: "lunchCalories",
      label: "Öğle yemeği (kcal)?",
      type: "number",
      value: lunchCalories,
      setter: setLunchCalories,
      placeholder: "Örn: 600",
    },
    {
      id: "dinnerCalories",
      label: "Akşam yemeği (kcal)?",
      type: "number",
      value: dinnerCalories,
      setter: setDinnerCalories,
      placeholder: "Örn: 800",
    },
    {
      id: "snackCalories",
      label: "Atıştırmalıklar (toplam kcal)?",
      type: "number",
      value: snackCalories,
      setter: setSnackCalories,
      placeholder: "Örn: 250",
    },
    {
      id: "water",
      label: "Ne kadar su içtiniz (L)?",
      type: "number",
      value: water,
      setter: setWater,
      placeholder: "Örn: 2.5",
      step: "0.1",
    },
    {
      id: "evaluation",
      label: "Gününüz nasıl geçti?",
      type: "textarea",
      value: evaluation,
      setter: setEvaluation,
      placeholder: "Kısaca not alın...",
    },
  ];

  const totalSteps = stepsConfig.length;

  // Toplam süreyi güncelleyen useEffect
  useEffect(() => {
    let intervalId = null;
    if (timerStatus === "running") {
      intervalId = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
      setTimerIntervalId(intervalId);
    } else {
      clearInterval(timerIntervalId);
    }
    return () => clearInterval(timerIntervalId);
  }, [timerStatus]);

  const startTimer = () => {
    setElapsedTime(0);
    setWorkoutDuration(null);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setWorkoutProgress([]); // Önceki ilerlemeyi sıfırla
    setCurrentSetStartTime(Date.now()); // İlk setin başlangıç zamanı
    setPauseStartTime(null);
    setTimerStatus("running");
    setIsTimerModalOpen(true);
  };

  const pauseTimer = () => {
    if (timerStatus === "running") {
      setPauseStartTime(Date.now()); // Duraklama başlangıcını kaydet
      setTimerStatus("paused");
    }
  };

  const resumeTimer = () => {
    if (timerStatus === "paused" && pauseStartTime) {
      const pauseDuration = Date.now() - pauseStartTime;
      // Mevcut setin başlangıç zamanını duraklama süresi kadar ileri al
      setCurrentSetStartTime((prevStartTime) =>
        prevStartTime ? prevStartTime + pauseDuration : Date.now()
      );
      setPauseStartTime(null); // Duraklama başlangıcını sıfırla
      setTimerStatus("running");
    }
  };

  // --- SET BİTİRME VE İLERLEME ---
  const handleFinishSet = () => {
    if (!currentSetStartTime || timerStatus !== "running") return; // Zamanlayıcı çalışmıyorsa veya set başlamamışsa bir şey yapma

    // Buton dalgalanma (ripple) efekti - Düğmeye tıklama animasyonu
    const buttons = document.querySelectorAll(".set-btn-ripple");
    buttons.forEach((btn) => {
      btn.classList.remove("animate-ripple");
      // Zorunlu yeniden akış, animasyonu tekrar tetiklemek için
      void btn.offsetWidth;
      btn.classList.add("animate-ripple");
    });

    const setEndTime = Date.now();
    const setDuration = Math.round((setEndTime - currentSetStartTime) / 1000); // Saniye cinsinden süre

    // Yeni ilerleme verisini oluştur
    const newProgress = {
      exerciseIndex: currentExerciseIndex,
      set: currentSet,
      duration: setDuration,
    };
    setWorkoutProgress((prev) => [...prev, newProgress]); // İlerlemeyi kaydet

    // Animasyon state'lerini ayarla
    setLastCompletedSet(currentSet);
    setShowSetCompletedAnimation(true);

    // 1.5 saniye sonra animasyonu kapat
    setTimeout(() => {
      setShowSetCompletedAnimation(false);
    }, 1500);

    const currentExercise = workoutExercises[currentExerciseIndex];

    // Bir sonraki sete veya egzersize geç
    if (currentSet < currentExercise.sets) {
      // Sonraki set
      setCurrentSet((prev) => prev + 1);
      setCurrentSetStartTime(Date.now()); // Yeni setin başlangıç zamanını kaydet

      // Set numarasını vurgula
      setHighlightSetNumber(true);
      setTimeout(() => {
        setHighlightSetNumber(false);
      }, 1000);
    } else {
      // Egzersizin son setiydi, sonraki egzersize geç
      if (currentExerciseIndex < workoutExercises.length - 1) {
        // Sonraki egzersiz
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1); // Seti 1'e sıfırla
        setCurrentSetStartTime(Date.now()); // Yeni egzersizin ilk setinin başlangıcı

        // Set numarasını vurgula
        setHighlightSetNumber(true);
        setTimeout(() => {
          setHighlightSetNumber(false);
        }, 1000);
      } else {
        // Tüm antrenman bitti! Zamanlayıcıyı durdur ve kaydetme işlemine geç
        stopAndSaveTimer();
      }
    }
  };
  // --- /SET BİTİRME VE İLERLEME ---

  const stopAndSaveTimer = async () => {
    const finalElapsedTime = elapsedTime; // Toplam saniye
    setTimerStatus("stopped");
    setIsTimerModalOpen(false);
    // Dakikaya çevirme işlemini kaldırıyoruz.
    // const durationInMinutes = Math.round(finalElapsedTime / 60);
    // setWorkoutDuration(durationInMinutes); // State'i sildik

    setIsLoading(true);
    // Save total duration in SECONDS directly
    const saveSuccess = await saveCurrentState({
      workoutDuration: finalElapsedTime, // Saniyeyi kaydet
      workoutProgress: workoutProgress,
    });

    if (saveSuccess && currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
    setIsLoading(false);
    // Reset timer visually if needed
    // setElapsedTime(0);
  };

  const cancelTimer = () => {
    setTimerStatus("stopped");
    setIsTimerModalOpen(false);
    setElapsedTime(0);
    // setWorkoutDuration(null); // State'i sildik
    setWorkoutProgress([]);
  };

  // Geçen süreyi MM:SS formatında göstermek için
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // --- Hareket Navigasyon Fonksiyonları ---
  const handleNextExercise = () => {
    if (currentExerciseIndex < workoutExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1); // Yeni harekette seti sıfırla
    }
  };

  const handlePreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setCurrentSet(1); // Önceki harekette seti sıfırla
    }
  };
  // --- /Hareket Navigasyon Fonksiyonları ---

  // --- YENİ KAYDETME FONKSİYONU ---
  const saveCurrentState = async (dataToSave = {}) => {
    if (!user) return false;

    const currentData = {
      weight: weight ? parseFloat(weight) : null,
      steps: steps ? parseInt(steps, 10) : null,
      workoutPerformed: workoutPerformed || null,
      lunchCalories: lunchCalories ? parseInt(lunchCalories, 10) : null,
      dinnerCalories: dinnerCalories ? parseInt(dinnerCalories, 10) : null,
      snackCalories: snackCalories ? parseInt(snackCalories, 10) : null,
      water: water ? parseFloat(water) : null,
      evaluation: evaluation || null,
    };

    // Add progress only if passed
    if (dataToSave.workoutProgress !== undefined) {
      // Check existence
      currentData.workoutProgress = dataToSave.workoutProgress;
    }
    // Add duration (seconds or null) only if passed
    if (dataToSave.workoutDuration !== undefined) {
      // Check existence
      currentData.workoutDuration = dataToSave.workoutDuration;
    } else {
      // Ensure duration is not accidentally carried over if not specified
      // If editing, might need to fetch existing duration first if not overwriting
      // For simplicity now, assume if not passed, it shouldn't be saved/updated here.
      // Let merge handle not overwriting if field is absent in finalData
    }

    currentData.totalCalories =
      (currentData.lunchCalories || 0) +
      (currentData.dinnerCalories || 0) +
      (currentData.snackCalories || 0);

    // Prepare final data, potentially excluding duration/progress if not in dataToSave
    const finalData = {
      ...currentData, // contains duration/progress IF they were in dataToSave
      userId: user.uid,
      date: date,
      updatedAt: serverTimestamp(),
    };

    const docId = `${user.uid}_${date}`;
    const docRef = doc(db, "dailyEntries", docId);

    try {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        finalData.createdAt = serverTimestamp();
      }
      // Use merge:true to only update provided fields
      await setDoc(docRef, finalData, { merge: true });
      console.log("Data saved/merged:", finalData); // Log what was saved
      return true;
    } catch (error) {
      console.error("Veri kaydedilirken hata (adım): ", error);
      alert("Veri kaydedilirken bir hata oluştu: " + error.message);
      return false;
    }
  };
  // --- /YENİ KAYDETME FONKSİYONU ---

  const handleNext = async () => {
    // async yapıldı
    if (currentStep >= totalSteps - 1) return; // Son adımdaysa bir şey yapma

    // Workout adımında timer açıldıysa veya süre kaydedildiyse normal ilerle
    const currentStepId = stepsConfig[currentStep].id;
    if (
      currentStepId === "workout" &&
      workoutPerformed === plannedWorkoutName &&
      !workoutDuration
    ) {
      // Eğer planlanan antrenman seçildi ama timer başlatılmadıysa/bitirilmediyse,
      // kullanıcıya timer'ı başlatmasını söyleyebilir veya direkt başlatabiliriz.
      // Şimdilik ilerlemeyi engellemeyelim, kullanıcı timer'ı sonra da başlatabilir
      // veya manuel süre girebilir (bu özellik eklenirse).
      // Ya da timer'ı burada başlatmaya zorlayabiliriz:
      // if (!isTimerModalOpen) { startTimer(); return; }
      alert(
        "Lütfen antrenman zamanlayıcısını başlatın veya antrenmanı tamamlayın."
      );
      return;
    }

    setIsLoading(true);
    const saveSuccess = await saveCurrentState();
    if (saveSuccess) {
      setCurrentStep(currentStep + 1);
    }
    setIsLoading(false);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Geri giderken otomatik kaydetme yapmıyoruz,
      // kullanıcı ileri gittiğinde veya bitirdiğinde son durum kaydedilecek.
    }
  };

  const handleWorkoutSelect = async (value) => {
    setWorkoutPerformed(value);

    if (value !== plannedWorkoutName) {
      // Clear timer state visually
      setElapsedTime(0);
      setTimerStatus("stopped");
      setWorkoutProgress([]);

      // Save null duration and empty progress
      setIsLoading(true);
      const saveSuccess = await saveCurrentState({
        workoutPerformed: value,
        workoutDuration: null, // Explicitly nullify duration
        workoutProgress: [], // Explicitly empty progress
      });
      if (saveSuccess && currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Just save the current form state using merge, rely on previous saves for duration/progress
    const saveSuccess = await saveCurrentState(); // Don't pass duration/progress here
    if (saveSuccess) {
      alert(`Günlük başarıyla kaydedildi/güncellendi!`);
      setCurrentStep(0); // Başa dön
      // Timer state'lerini sıfırla (görsel)
      setElapsedTime(0);
      setTimerStatus("stopped");
      setWorkoutProgress([]); // İlerlemeyi de sıfırla
    }
    setIsLoading(false);
  };

  const currentStepConfig = stepsConfig[currentStep];
  const currentExercise = workoutExercises[currentExerciseIndex]; // Modal için mevcut egzersiz

  // Helper function to generate image filename from exercise name
  const getExerciseImageFilename = (exerciseName) => {
    if (!exerciseName) return null;

    // Function to convert Turkish chars to ASCII equivalents and simplify name
    const normalizeText = (text) => {
      return text
        .normalize("NFD") // Decompose combined letters
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritic marks
        .replace(/ı/g, "i")
        .replace(/İ/g, "I")
        .replace(/ş/g, "s")
        .replace(/Ş/g, "S")
        .replace(/ğ/g, "g")
        .replace(/Ğ/g, "G")
        .replace(/ü/g, "u")
        .replace(/Ü/g, "U")
        .replace(/ö/g, "o")
        .replace(/Ö/g, "O")
        .replace(/ç/g, "c")
        .replace(/Ç/g, "C");
    };

    let processedName = exerciseName
      .toLowerCase()
      .replace(/\((.*?)\)/g, "") // Parantez içini ve parantezleri kaldır
      .trim(); // Başta ve sonda olabilecek boşlukları kaldır

    let baseName = normalizeText(processedName)
      .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
      .replace(/[^a-z0-9-]/g, "") // Kalan özel karakterleri kaldır (tire hariç)
      .replace(/-+$/, ""); // Sondaki tireleri temizle

    if (!baseName) return null;

    const customMatches = {
      // Pazartesi
      sinav: "diz-ustu-sinav", // 'şınav' normalize edilince 'sinav' olur
      "walking-lunge": "lunge-her-bacak",
      "glute-bridge-kalca-koprusu": "glute-bridge",
      // Çarşamba
      "wall-sit-duvarda-sandalye-durusu": "wall-sit",
      "incline-push-up-egimli-sinav": "incline-push-up",
      "reverse-lunge-geriye-hamle": "lunge-her-bacak",
      mekik: "mekik",
      superman: "superman",
      // Cuma
      "jump-squat": "jump-squat",
      "pike-push-up-omuz-odakli": "pike-push-up",
      "side-lunge-yan-hamle": "side-lunge",
      "bird-dog-her-taraf": "bird-dog",
      "plank-to-push-up-toplam": "plank-to-push-up",
      // Cumartesi (HIIT)
      "jumping-jacks": "jumping-jack",
      "high-knees-diz-cekme": "high-knees",
      "burpee-veya-yarim-burpee": "burpee",
      "mountain-climbers-dag-tirmanisi": "mountain-climbers",
      // Genel
      squat: "squat",
      plank: "plank",
    };

    if (customMatches[baseName]) {
      baseName = customMatches[baseName];
    }
    return `${baseName}.gif`;
  };

  // Mevcut egzersiz için resmi optimize edilmiş şekilde oluşturalım
  const ExerciseImage = React.useMemo(() => {
    if (!currentExercise || !currentExercise.name) return null;

    const filename = getExerciseImageFilename(currentExercise.name);
    if (!filename) return null;

    const imageUrl = `/images/${filename}`;

    return (
      <>
        <img
          src={imageUrl}
          alt={currentExercise.name}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            e.target.style.display = "none";
            const placeholder = e.target.nextSibling;
            if (placeholder) placeholder.style.display = "block";
          }}
        />
        {/* Placeholder text, initially hidden */}
        <span style={{ display: "none" }}>Resim Yüklenemedi</span>
      </>
    );
  }, [currentExercise?.name]); // Sadece egzersiz adı değiştiğinde yeniden oluştur

  if (isDataLoading) {
    return (
      <div className="text-center p-8 dark:text-gray-300">
        Günün verileri yükleniyor...
      </div>
    );
  }

  return (
    // Ana konteyneri grid yapısına çevirelim (geniş ekranlar için)
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Adım Adım Form (Ortada veya solda) */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-2 text-gray-800 dark:text-gray-200">
          Bugün ({date})
        </h2>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-600 dark:bg-indigo-400 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Adım İçeriği */}
        <div className="mb-6 min-h-[150px] flex flex-col justify-center">
          {" "}
          {/* Dikeyde ortalamak için flex */}
          <label
            htmlFor={currentStepConfig.id}
            className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 text-center"
          >
            {currentStepConfig.label}
          </label>
          {currentStepConfig.type === "number" && (
            <input
              type="number"
              id={currentStepConfig.id}
              value={currentStepConfig.value}
              onChange={(e) => currentStepConfig.setter(e.target.value)}
              step={currentStepConfig.step || "1"}
              min="0"
              placeholder={currentStepConfig.placeholder}
              className="mt-1 block w-full max-w-xs mx-auto p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center"
            />
          )}
          {currentStepConfig.type === "textarea" && (
            <textarea
              id={currentStepConfig.id}
              value={currentStepConfig.value}
              onChange={(e) => currentStepConfig.setter(e.target.value)}
              rows={3}
              placeholder={currentStepConfig.placeholder}
              className="mt-1 block w-full max-w-md mx-auto p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          )}
          {currentStepConfig.type === "workout" && (
            <div className="space-y-3 flex flex-col items-center">
              {currentStepConfig.options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleWorkoutSelect(option.value)}
                  className={`w-full sm:w-3/4 text-left p-3 rounded-md border ${
                    workoutPerformed === option.value
                      ? "bg-indigo-100 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500 dark:ring-indigo-400"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  } text-gray-900 dark:text-gray-100 transition-colors`}
                >
                  {option.label}
                </button>
              ))}
              {/* Zamanlayıcı Başlat Butonu (Planlanan seçildiyse ve timer açık değilse göster) */}
              {workoutPerformed === plannedWorkoutName &&
                !isTimerModalOpen &&
                workoutPlanObject && (
                  <button
                    type="button"
                    onClick={startTimer}
                    disabled={isLoading}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Antrenmanı Başlat
                  </button>
                )}
            </div>
          )}
        </div>

        {/* Navigasyon Butonları */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Geri
          </button>
          {currentStep < totalSteps - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={
                isLoading ||
                (currentStepConfig.type === "workout" &&
                  workoutPerformed === plannedWorkoutName &&
                  !isTimerModalOpen &&
                  workoutPlanObject &&
                  (!workoutProgress || workoutProgress.length === 0))
              }
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                currentStepConfig.type === "workout" &&
                workoutPerformed === plannedWorkoutName &&
                !isTimerModalOpen &&
                workoutPlanObject &&
                (!workoutProgress || workoutProgress.length === 0)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50`}
            >
              {isLoading ? "Kaydediliyor..." : "İleri"}
              {!isLoading && <ArrowRightIcon className="h-5 w-5 ml-2" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Kaydediliyor..." : "Günü Bitir"}
              {!isLoading && <CheckIcon className="h-5 w-5 ml-2" />}
            </button>
          )}
        </div>
      </div>

      {/* Günlük Plan Hatırlatıcı (Render Mantığı Düzeltildi) */}
      <div className="md:col-span-1 bg-blue-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-center mb-4 text-blue-800 dark:text-blue-200 flex items-center justify-center">
          <InformationCircleIcon className="h-6 w-6 mr-2" /> Bugünün Planı (
          {todayPlan?.dayName})
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {todayPlan?.tasks.map((task, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="flex-shrink-0 text-blue-500 dark:text-blue-400 mt-1">
                •
              </span>
              {/* Task'ın tipini kontrol et */}
              <span>
                {typeof task === "string"
                  ? task // Eğer string ise doğrudan göster
                  : task.type === "workout"
                  ? `🏋️ ${task.name}` // Eğer workout objesi ise ismini göster
                  : "Bilinmeyen görev tipi"}{" "}
                {/* Diğer obje tipleri için (varsa) */}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Timer Modal --- */}
      {isTimerModalOpen && currentExercise && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            {" "}
            {/* Maksimum yükseklik */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {plannedWorkoutName}
              </h3>
              <button
                onClick={cancelTimer}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="text-center mb-4 p-4 bg-indigo-50 dark:bg-gray-700 rounded flex-shrink-0 relative overflow-hidden">
              <p className="text-sm text-indigo-500 dark:text-indigo-300 font-medium">
                Hareket {currentExerciseIndex + 1} / {workoutExercises.length}
              </p>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {currentExercise.name}
              </h4>
              <p className="text-lg text-gray-700 dark:text-gray-300 mt-1">
                Hedef: {currentExercise.sets} Set x{" "}
                {currentExercise.reps
                  ? `${currentExercise.reps} Tekrar`
                  : `${currentExercise.duration} sn`}
              </p>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                Set{" "}
                <span
                  className={`${
                    highlightSetNumber
                      ? "inline-block transition-all duration-300 transform scale-150 text-green-500 dark:text-green-400"
                      : ""
                  }`}
                >
                  {currentSet}
                </span>{" "}
                / {currentExercise.sets}
              </p>

              {/* Set tamamlandı animasyonu - Koşullu olarak görünür */}
              {showSetCompletedAnimation && (
                <div className="absolute inset-0 bg-green-400 bg-opacity-30 dark:bg-green-500 dark:bg-opacity-20 flex items-center justify-center animate-pulse">
                  <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-lg transform transition-all duration-300 scale-in animate-bounce">
                    <p className="text-green-600 dark:text-green-400 font-bold flex items-center">
                      <CheckIcon className="h-5 w-5 mr-1" />
                      Set {lastCompletedSet} Tamamlandı!
                    </p>
                  </div>
                </div>
              )}

              {/* ----- GÖRSEL ALANI ----- */}
              <div className="mt-4 h-48 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden">
                {ExerciseImage}
              </div>
              {/* ------------------------- */}
            </div>
            <div className="text-center text-4xl font-mono font-bold text-gray-900 dark:text-gray-100 my-3 flex-shrink-0">
              Toplam Süre: {formatSeconds(elapsedTime)}
            </div>
            {/* Ana Kontrol Butonları (Durdur/Devam/Bitir) */}
            <div className="flex justify-center items-center space-x-4 mb-4 flex-shrink-0">
              {timerStatus === "running" && (
                <button
                  type="button"
                  onClick={pauseTimer}
                  className="p-3 bg-yellow-500 text-white rounded-full shadow hover:bg-yellow-600"
                >
                  {" "}
                  <PauseIcon className="h-6 w-6" />{" "}
                </button>
              )}
              {timerStatus === "paused" && (
                <button
                  type="button"
                  onClick={resumeTimer}
                  className="p-3 bg-blue-500 text-white rounded-full shadow hover:bg-blue-600"
                >
                  {" "}
                  <PlayIcon className="h-6 w-6" />{" "}
                </button>
              )}
              <button
                type="button"
                onClick={stopAndSaveTimer}
                className="p-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700"
                title="Antrenmanı Bitir ve Kaydet"
              >
                {" "}
                <StopIcon className="h-6 w-6" />{" "}
              </button>
            </div>
            {/* Set Tamamlama Butonu */}
            <div className="mb-4 flex-shrink-0">
              <button
                type="button"
                onClick={handleFinishSet}
                disabled={timerStatus !== "running"} // Sadece zamanlayıcı çalışırken aktif
                className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg active:shadow-sm relative"
              >
                <span className="relative z-10">
                  Seti Bitir
                  <CheckIcon className="h-5 w-5 ml-2 inline-block" />
                </span>
                <span className="absolute inset-0 rounded-md overflow-hidden">
                  <span className="absolute inset-0 transform scale-0 rounded-md bg-white bg-opacity-20 origin-center transition-transform set-btn-ripple"></span>
                </span>
              </button>
            </div>
            {/* İlerleme Geçmişi (Opsiyonel) */}
            {/*
            <div className="flex-grow overflow-y-auto text-xs border-t dark:border-gray-700 pt-2">
              <h5 className="font-medium text-gray-500 dark:text-gray-400 mb-1">Tamamlanan Setler:</h5>
               <ul className="space-y-1">
                  {workoutProgress.map((p, i) => (
                      <li key={i} className="text-gray-600 dark:text-gray-300">
                          {workoutExercises[p.exerciseIndex]?.name} - Set {p.set}: {p.duration} sn
                      </li>
                  ))}
               </ul>
            </div>
            */}
          </div>
        </div>
      )}
      {/* --- /Timer Modal --- */}
    </div>
  );
}

export default HomePage;
