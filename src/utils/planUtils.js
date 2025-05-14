// Ortak Planlama Verileri ve Fonksiyonları

export const dailyPlanSchedule = [
  // PAZARTESİ: TÜM VÜCUT GÜÇ A (Temel Kuvvet)
  {
    dayIndex: 0,
    dayName: "Pazartesi",
    tasks: [
      "🏋️ TÜM VÜCUT GÜÇ A",
      {
        type: "workout",
        name: "TÜM VÜCUT GÜÇ A (Temel Kuvvet)",
        exercises: [
          { name: "Squat", sets: 3, reps: 15 },
          { name: "Şınav", sets: 3, reps: 10 }, // AMRAP Hedef 10-15
          { name: "Walking Lunge (Her Bacak)", sets: 3, reps: 10 },
          { name: "Plank", sets: 3, duration: 45 },
          { name: "Glute Bridge (Kalça Köprüsü)", sets: 3, reps: 15 },
        ],
      },
      "💧 Bol su iç (en az 2.5-3 litre)",
      "🥩 Antrenman sonrası protein ve kompleks karbonhidrat alımına dikkat et.",
    ],
  },
  // SALI: AKTİF DİNLENME veya HAFİF KARDİYO
  {
    dayIndex: 1,
    dayName: "Salı",
    tasks: [
      "🚶‍♀️ AKTİF DİNLENME / HAFİF KARDİYO (20-30 dk)",
      "• Hafif tempolu yürüyüş",
      "• VEYA Kapsamlı esneme ve mobilite",
      "💧 Su takibi",
    ],
  },
  // ÇARŞAMBA: TÜM VÜCUT GÜÇ B
  {
    dayIndex: 2,
    dayName: "Çarşamba",
    tasks: [
      "🏋️ TÜM VÜCUT GÜÇ B",
      {
        type: "workout",
        name: "TÜM VÜCUT GÜÇ B (Farklı Açılar ve Dayanıklılık)",
        exercises: [
          { name: "Wall Sit (Duvarda Sandalye Duruşu)", sets: 3, duration: 45 },
          { name: "Incline Push-up (Eğimli Şınav)", sets: 3, reps: 12 },
          {
            name: "Reverse Lunge (Geriye Hamle - Her Bacak)",
            sets: 3,
            reps: 10,
          },
          { name: "Superman", sets: 3, reps: 15 },
          { name: "Mekik", sets: 3, reps: 20 },
        ],
      },
      "💧 Bol su iç",
    ],
  },
  // PERŞEMBE: AKTİF DİNLENME veya HAFİF KARDİYO
  {
    dayIndex: 3,
    dayName: "Perşembe",
    tasks: [
      "🚶‍♀️ AKTİF DİNLENME / HAFİF KARDİYO (20-30 dk)",
      "• Salı günkü seçeneklerden biri",
      "💧 Su takibi",
    ],
  },
  // CUMA: TÜM VÜCUT GÜÇ C
  {
    dayIndex: 4,
    dayName: "Cuma",
    tasks: [
      "🏋️ TÜM VÜCUT GÜÇ C",
      {
        type: "workout",
        name: "TÜM VÜCUT GÜÇ C (Patlayıcılık ve Üst Vücut Çeşitliliği)",
        exercises: [
          { name: "Jump Squat", sets: 3, reps: 10 },
          { name: "Pike Push-up (Omuz odaklı)", sets: 3, reps: 8 }, // AMRAP Hedef 8-12
          { name: "Side Lunge (Yan Hamle - Her Bacak)", sets: 3, reps: 10 },
          { name: "Bird-Dog (Her Taraf)", sets: 3, reps: 10 },
          { name: "Plank to Push-up (Toplam)", sets: 3, reps: 12 }, // Her kolla 6-8
        ],
      },
      "💧 Bol su iç",
    ],
  },
  // CUMARTESİ: DAHA UZUN KARDİYO veya AKTİF YAŞAM
  {
    dayIndex: 5,
    dayName: "Cumartesi",
    tasks: [
      "🏃‍♂️ UZUN KARDİYO / HIIT / AKTİF YAŞAM (30-45 dk)",
      // HIIT Antrenmanını örnek olarak ekleyelim
      {
        type: "workout",
        name: "HIIT Antrenmanı",
        exercises: [
          { name: "Jumping Jacks", sets: 4, duration: 40 }, // 40sn yap / 20sn dinlen şeklinde 4-5 tur
          { name: "High Knees (Diz Çekme)", sets: 4, duration: 40 },
          { name: "Burpee (veya Yarım Burpee)", sets: 4, duration: 40 },
          { name: "Mountain Climbers (Dağ Tırmanışı)", sets: 4, duration: 40 },
        ],
        notes:
          "Her hareket sonrası 20 saniye dinlenme. Tüm hareketler bitince 1 tur tamamlanır. Toplam 4-5 tur.",
      },
      "• VEYA 30-45 dk tempolu yürüyüş/koşu",
      "• VEYA Sevdiğin bir aktif yaşam etkinliği",
    ],
  },
  // PAZAR: TAM DİNLENME
  {
    dayIndex: 6,
    dayName: "Pazar",
    tasks: [
      "🛌 TAM DİNLENME",
      "• Hafif esneme yapabilirsin",
      "💧 Bol su içmeye devam et",
      "😴 Kaliteli ve yeterli uyu",
    ],
  },
];

// !!! BU TARİHİ KESİNLİKLE DOĞRU GİRİN !!!
// Programınız 8 Temmuz 2024 Pazartesi başladıysa:
export const startDate = new Date(2024, 6, 8); // Aylar 0-indexli olduğu için Temmuz = 6
console.log(
  "planUtils.js dosyası yüklendi, startDate =",
  startDate.toISOString()
);

// VEYA
// export const startDate = new Date('2024-07-08T00:00:00'); // Saat, dk, sn sıfırlanmış

// ÖNCEKİ YANLIŞ KULLANIM (SİLİN VEYA YORUM SATIRINA ALIN):
// const today = new Date();
// export const startDate = new Date(
//   today.getFullYear(),
//   today.getMonth(),
//   today.getDate()
// );

export function getDailyPlanForDate(targetDate) {
  // Tarihleri kontrol et
  console.log("getDailyPlanForDate: Gelen tarih (ham):", targetDate);
  if (!(targetDate instanceof Date) || isNaN(targetDate.getTime())) {
    console.error("getDailyPlanForDate: Geçersiz tarih değeri:", targetDate);
    return { dayName: "Hata", tasks: ["Geçersiz tarih."] };
  }

  console.log("getDailyPlanForDate: Gelen tarih:", targetDate.toISOString());
  console.log(
    "getDailyPlanForDate: Program başlangıç tarihi:",
    startDate.toISOString()
  );

  // ISO formatına dönüştür (sadece görsel log)
  const targetDateStr = targetDate.toISOString().split("T")[0];
  console.log(
    `planUtils: Calculating plan for date: ${targetDateStr} (received as ${targetDate})`
  );

  const startDateStr = startDate.toISOString().split("T")[0];
  console.log(`planUtils: Using start date: ${startDateStr}`);

  // Hata kontrolü
  if (isNaN(targetDate) || isNaN(startDate)) {
    console.error("planUtils: Invalid date provided to getDailyPlanForDate");
    return { dayName: "Hata", tasks: ["Geçersiz tarih."] };
  }

  // ÇÖZÜM 1: Doğrudan JavaScript'in getDay() metodunu kullanarak günü belirleyelim
  // JavaScript'te getDay(): 0=Pazar, 1=Pazartesi, ... 6=Cumartesi
  // Bizim planımızda dayIndex: 0=Pazartesi, 1=Salı, ... 6=Pazar

  // Hedef tarihin JS gün indeksini al (0-6)
  const jsWeekDay = targetDate.getDay(); // 0=Pazar, 1=Pazartesi, ... 6=Cumartesi

  // JS gün indeksini bizim plan indeksine çevir (0=Pazartesi, ... 6=Pazar)
  // Pazar(0) → Pazar(6), Pazartesi(1) → Pazartesi(0), ...
  let dayIndex;
  if (jsWeekDay === 0) {
    dayIndex = 6; // Pazar
  } else {
    dayIndex = jsWeekDay - 1; // Diğer günler
  }

  console.log(
    "getDailyPlanForDate: Gün hesaplama (JavaScript'in gün indeksi):"
  );
  console.log(
    `- JavaScript Day of Week: ${jsWeekDay} (0=Pazar, 1=Pazartesi, ..., 6=Cumartesi)`
  );
  console.log(
    `- Bizim Plan İndeksimiz: ${dayIndex} (0=Pazartesi, 1=Salı, ..., 6=Pazar)`
  );

  console.log("getDailyPlanForDate: Hesaplanan gün indeksi ve karşılığı:");
  console.log(`- Calculated dayIndex: ${dayIndex}`);
  console.log(
    `- Calculated day: ${
      dailyPlanSchedule[dayIndex]?.dayName || "Bilinmeyen gün"
    }`
  );

  // Plan objesini bul
  const currentPlan = dailyPlanSchedule.find((p) => p.dayIndex === dayIndex);
  console.log(
    `planUtils: Found plan object for index ${dayIndex}:`,
    currentPlan ? JSON.stringify(currentPlan, null, 2) : null
  );

  return currentPlan || { dayName: "Bilinmeyen", tasks: ["Program dışı gün."] };
}

export function getWorkoutPlanObject(plan) {
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
    return "?sn";
  if (totalSeconds === 0) return "0sn";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  let result = "";
  if (minutes > 0) {
    result += `${minutes}dk `;
  }
  if (seconds > 0 || minutes === 0) {
    result += `${seconds}sn`;
  }
  return result.trim();
};

export const groupWorkoutProgress = (progressData, workoutPlanObj) => {
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
    !workoutPlanObj?.exercises ||
    workoutPlanObj.exercises.length === 0
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
  );
  const grouped = {};

  progressData.forEach((item, index) => {
    console.log(
      `planUtils: groupWorkoutProgress - Processing item ${index}:`,
      JSON.stringify(item)
    );
    if (item && item.exerciseIndex != null && item.set != null) {
      if (item.exerciseIndex < 0 || item.exerciseIndex >= exercises.length) {
        console.warn(
          `planUtils: groupWorkoutProgress - Invalid exerciseIndex ${item.exerciseIndex} for item ${index}. Skipping.`
        );
        return;
      }
      const exerciseName =
        exercises[item.exerciseIndex]?.name ||
        `Egzersiz ${item.exerciseIndex + 1}`;
      console.log(
        `planUtils: groupWorkoutProgress - Found exercise name: "${exerciseName}" for index ${item.exerciseIndex}`
      );

      if (!grouped[exerciseName]) {
        grouped[exerciseName] = { sets: [], totalDuration: 0 };
      }
      const duration = item.duration ?? 0;
      const setData = { set: item.set, duration: duration };
      grouped[exerciseName].sets.push(setData);
      grouped[exerciseName].totalDuration += duration;
      console.log(
        `planUtils: groupWorkoutProgress - Added set ${item.set} (${duration}s) to "${exerciseName}". New total: ${grouped[exerciseName].totalDuration}s`
      );
    } else {
      console.warn(
        `planUtils: groupWorkoutProgress - Invalid item structure at index ${index}:`,
        JSON.stringify(item)
      );
    }
  });

  const result = Object.entries(grouped).map(([name, data]) => ({
    name,
    sets: data.sets.sort((a, b) => a.set - b.set),
    totalDuration: data.totalDuration,
  }));
  console.log(
    `planUtils: groupWorkoutProgress computed result:`,
    JSON.stringify(result)
  );
  return result;
};
