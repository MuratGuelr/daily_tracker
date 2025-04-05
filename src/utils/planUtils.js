// Ortak Planlama Verileri ve Fonksiyonları

export const dailyPlanSchedule = [
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
          { name: "Plank", sets: 3, duration: 20 },
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
          { name: "Jumping Jack", sets: 3, reps: 10 },
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
          { name: "Shoulder Tap", sets: 3, reps: 10 },
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

// !!! BU TARİHİ KESİNLİKLE DOĞRU GİRİN !!!
export const startDate = new Date("2024-04-08");

export function getDailyPlanForDate(targetDate) {
  // Hedef tarihi ve başlangıç tarihini logla (Mevcut loglar kalsın)
  const targetDateStr =
    targetDate instanceof Date
      ? targetDate.toISOString().split("T")[0]
      : "Invalid Date";
  console.log(
    `planUtils: Calculating plan for date: ${targetDateStr} (received as ${targetDate})`
  );
  const startDateStr =
    startDate instanceof Date
      ? startDate.toISOString().split("T")[0]
      : "Invalid Start Date";
  console.log(`planUtils: Using start date: ${startDateStr}`);

  if (
    !(targetDate instanceof Date) ||
    !(startDate instanceof Date) ||
    isNaN(targetDate) ||
    isNaN(startDate)
  ) {
    console.error("planUtils: Invalid date provided to getDailyPlanForDate");
    return { dayName: "Hata", tasks: ["Geçersiz tarih."] };
  }

  // --- Farkı UTC olarak hesapla ---
  // Saat, dakika, saniye farklarını yok saymak için tarihleri UTC gece yarısına ayarla
  const targetUTC = Date.UTC(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth(),
    targetDate.getUTCDate()
  );
  const startUTC = Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate()
  );

  const diffTime = Math.abs(targetUTC - startUTC); // Milisaniye farkı
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Tam gün farkı
  // --- Hesaplama Sonu ---

  const dayIndex = diffDays % 14; // 14 günlük döngü
  console.log(
    `planUtils: targetUTC=${targetUTC}, startUTC=${startUTC}, diffTime=${diffTime}, diffDays=${diffDays}, calculated dayIndex=${dayIndex}`
  );

  const currentPlan = dailyPlanSchedule.find((p) => p.dayIndex === dayIndex);
  console.log(
    `planUtils: Found plan object for index ${dayIndex}:`,
    currentPlan ? JSON.stringify(currentPlan, null, 2) : null
  );

  return currentPlan || { dayName: "Bilinmeyen", tasks: ["Program dışı gün."] };
}

export function getWorkoutPlanObject(plan) {
  // Gelen planı logla
  console.log(
    `planUtils: getWorkoutPlanObject received plan:`,
    plan ? JSON.stringify(plan, null, 2) : null
  );
  if (!plan || !Array.isArray(plan.tasks)) {
    console.warn(
      "planUtils: getWorkoutPlanObject received invalid or taskless plan."
    );
    return null;
  }
  const workoutTask = plan.tasks.find(
    (task) => typeof task === "object" && task.type === "workout"
  );
  // Bulunan workout görevini logla
  console.log(
    `planUtils: workoutTask found by find:`,
    workoutTask ? JSON.stringify(workoutTask, null, 2) : null
  );
  return workoutTask || null;
}

export function getWorkoutExercises(workoutPlanObject) {
  return workoutPlanObject?.exercises || [];
}

export const formatSeconds = (totalSeconds) => {
  if (totalSeconds === null || totalSeconds === undefined || totalSeconds < 0)
    return "?sn"; // Geçersiz durumlar
  if (totalSeconds === 0) return "0sn"; // Sıfır durumu
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  let result = "";
  if (minutes > 0) {
    result += `${minutes}dk `;
  }
  if (seconds > 0 || minutes === 0) {
    // Saniye 0 olsa bile dk yoksa göster
    result += `${seconds}sn`;
  }
  return result.trim();
};

export const groupWorkoutProgress = (progressData, workoutPlanObj) => {
  // Girdileri logla
  console.log(
    `planUtils: groupWorkoutProgress received progressData:`,
    progressData ? JSON.stringify(progressData) : "null/undefined"
  );
  console.log(
    `planUtils: groupWorkoutProgress received workoutPlanObj:`,
    workoutPlanObj ? JSON.stringify(workoutPlanObj) : "null"
  );

  if (
    !progressData ||
    progressData.length === 0 ||
    !workoutPlanObj?.exercises || // exercises array'ini doğrudan kontrol et
    workoutPlanObj.exercises.length === 0 // exercises array'i boş mu?
  ) {
    console.warn(
      "planUtils: groupWorkoutProgress returning [] due to invalid inputs or empty exercises."
    );
    return [];
  }

  const exercises = workoutPlanObj.exercises;
  console.log(
    `planUtils: groupWorkoutProgress - Exercises from plan:`,
    JSON.stringify(exercises)
  ); // Planın egzersizlerini logla
  const grouped = {};

  progressData.forEach((item, index) => {
    console.log(
      `planUtils: groupWorkoutProgress - Processing item ${index}:`,
      JSON.stringify(item)
    ); // Her adımı logla
    // Güvenlik kontrolü: item null değilse ve gerekli alanlar varsa
    if (item && item.exerciseIndex != null && item.set != null) {
      // exerciseIndex'in geçerli aralıkta olduğundan emin ol
      if (item.exerciseIndex < 0 || item.exerciseIndex >= exercises.length) {
        console.warn(
          `planUtils: groupWorkoutProgress - Invalid exerciseIndex ${item.exerciseIndex} for item ${index}. Skipping.`
        );
        return; // Bu adımı atla
      }

      const exerciseName =
        exercises[item.exerciseIndex]?.name ||
        `Egzersiz ${item.exerciseIndex + 1}`;
      console.log(
        `planUtils: groupWorkoutProgress - Found exercise name: "${exerciseName}" for index ${item.exerciseIndex}`
      ); // Bulunan adı logla

      if (!grouped[exerciseName]) {
        grouped[exerciseName] = { sets: [], totalDuration: 0 };
      }
      // duration null ise 0 kabul et
      const duration = item.duration ?? 0;
      const setData = { set: item.set, duration: duration };
      grouped[exerciseName].sets.push(setData);
      grouped[exerciseName].totalDuration += duration;
      console.log(
        `planUtils: groupWorkoutProgress - Added set ${item.set} (${duration}s) to "${exerciseName}". New total: ${grouped[exerciseName].totalDuration}s`
      ); // Eklenen seti logla
    } else {
      console.warn(
        `planUtils: groupWorkoutProgress - Invalid item structure at index ${index}:`,
        JSON.stringify(item)
      ); // Geçersiz yapıyı logla
    }
  });

  const result = Object.entries(grouped).map(([name, data]) => ({
    name,
    sets: data.sets.sort((a, b) => a.set - b.set),
    totalDuration: data.totalDuration,
  }));

  // Fonksiyondan dönmeden hemen önce sonucu logla
  console.log(
    `planUtils: groupWorkoutProgress computed result:`,
    JSON.stringify(result)
  );
  return result;
};
