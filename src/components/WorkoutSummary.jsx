import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  ClockIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import {
  getDailyPlanForDate,
  getWorkoutPlanObject,
  formatSeconds,
  groupWorkoutProgress,
} from "../utils/planUtils";

// --- Component ---
function WorkoutSummary({ userId }) {
  const [workoutEntries, setWorkoutEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setWorkoutEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    // Sadece workoutProgress içeren kayıtları getir
    const q = query(
      collection(db, "dailyEntries"),
      where("userId", "==", userId),
      where("workoutProgress", "!=", null),
      orderBy("workoutProgress"),
      orderBy("date", "desc")
    );

    console.log("WorkoutSummary: Subscribing to Firestore...");

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        console.log(
          `WorkoutSummary: Snapshot received, ${querySnapshot.size} docs found.`
        );
        const entriesData = [];
        querySnapshot.forEach((doc) => {
          console.log("WorkoutSummary: Processing doc:", doc.id, doc.data());
          const data = doc.data();
          // Daha basit kontrol: Sadece workoutProgress array mi ve boş değil mi?
          if (
            Array.isArray(data.workoutProgress) &&
            data.workoutProgress.length > 0
          ) {
            // Güvenlik için içeriğin obje olup olmadığını da kontrol edebiliriz (opsiyonel)
            if (data.workoutProgress.every((p) => p && typeof p === "object")) {
              entriesData.push({ id: doc.id, ...data });
            } else {
              console.warn(
                "WorkoutSummary: Skipped doc due to invalid content in workoutProgress:",
                doc.id,
                data.workoutProgress
              );
            }
          } else {
            console.warn(
              "WorkoutSummary: Skipped doc due to missing/empty workoutProgress:",
              doc.id,
              data.workoutProgress
            );
          }
        });
        console.log("WorkoutSummary: Setting workout entries:", entriesData);
        setWorkoutEntries(entriesData);
        setLoading(false);
      },
      (err) => {
        console.error("WorkoutSummary: Error fetching workout entries: ", err);
        if (err.code === "failed-precondition") {
          setError(
            "Antrenman verilerini getirmek için Firestore index'i oluşturulması gerekebilir. Konsolu kontrol edin."
          );
        } else {
          setError(
            "Antrenman verileri alınırken bir hata oluştu: " + err.message
          );
        }
        setLoading(false);
      }
    );

    // Cleanup function
    return () => {
      console.log("WorkoutSummary: Unsubscribing from Firestore.");
      unsubscribe();
    };
  }, [userId]);

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="text-center p-4 dark:text-gray-300">
        Antrenman Özeti Yükleniyor...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (workoutEntries.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Antrenman Özeti
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Kaydedilmiş detaylı antrenman verisi bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Antrenman Detayları Geçmişi
      </h2>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        {" "}
        {/* Biraz daha yükseklik */}
        {workoutEntries.map((entry) => {
          // --- Tarih Oluşturmayı Değiştir ---
          const [year, month, day] = entry.date.split("-").map(Number);
          // new Date(Date.UTC(...)) kullanarak saat diliminden bağımsız hale getir
          const entryDate = new Date(Date.UTC(year, month - 1, day)); // Ay 0'dan başlar (0=Ocak)
          // --- Değişiklik Sonu ---

          console.log(
            "WorkoutSummary RENDER: Processing entry in map:",
            entry.id,
            entry.date,
            "Created UTC Date:",
            entryDate.toISOString()
          ); // Logu güncelle

          const entryPlan = getDailyPlanForDate(entryDate);
          const entryWorkoutPlanObj = getWorkoutPlanObject(entryPlan);
          const groupedProgress = groupWorkoutProgress(
            entry.workoutProgress,
            entryWorkoutPlanObj
          );
          console.log(
            `WorkoutSummary RENDER: groupedProgress result for ${entry.id}:`,
            JSON.stringify(groupedProgress)
          );

          return (
            <div
              key={entry.id}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600/50"
            >
              {/* Tarih ve Toplam Süre Başlığı */}
              <div className="flex flex-wrap justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-gray-600/50">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mr-4">
                  {entry.date} - {entry.workoutPerformed || "Antrenman"}
                </h3>
                {entry.workoutDuration != null && ( // 0dk olabilir, o yüzden null kontrolü
                  <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    <ClockIcon className="h-4 w-4" />
                    <span>
                      Toplam Süre: {formatSeconds(entry.workoutDuration)}
                    </span>
                  </div>
                )}
              </div>

              {/* Egzersiz Detayları */}
              {groupedProgress && groupedProgress.length > 0 ? (
                <div className="space-y-3">
                  {groupedProgress.map((exerciseData, idx) => (
                    <div
                      key={exerciseData.name + idx} // Aynı egzersiz farklı günlerde olabilir, index ekleyelim
                      className="text-sm" // Font boyutunu biraz büyüttük
                    >
                      {/* Egzersiz Adı ve Toplam Süresi */}
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {exerciseData.name}:
                        </span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          {" "}
                          {/* Süre daha belirgin */}
                          {formatSeconds(exerciseData.totalDuration)}
                        </span>
                      </div>
                      {/* Set Detayları */}
                      <div className="pl-2 text-xs text-gray-500 dark:text-gray-400">
                        {exerciseData.sets
                          .map(
                            (s) =>
                              `Set ${s.set} (${
                                s.duration != null
                                  ? formatSeconds(s.duration)
                                  : "?"
                              })`
                          ) // Süre null olabilir mi?
                          .join(" / ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Eğer workoutProgress varsa ama gruplanamadıysa mesaj göster
                entry.workoutProgress &&
                entry.workoutProgress.length > 0 && (
                  <p className="text-xs text-gray-400 italic">
                    Antrenman detayı işlenemedi.
                  </p>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorkoutSummary;
