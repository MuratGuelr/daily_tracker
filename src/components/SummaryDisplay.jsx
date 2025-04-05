import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  TrashIcon,
  FireIcon,
  ChartBarIcon,
  ScaleIcon,
  BoltIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import {
  getDailyPlanForDate,
  getWorkoutPlanObject,
  formatSeconds,
  groupWorkoutProgress,
} from "../utils/planUtils";

// Helper to format individual calorie values for the breakdown string
const formatBreakdownValue = (value) => {
  if (value === null || value === undefined) {
    // Girilmemiş değerler için '?' gösterelim (daha kısa)
    return "?";
  }
  // Girilmişse (0 dahil) sayıyı döndürelim
  return value;
};

function SummaryDisplay({ userId }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setEntries([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const q = query(
      collection(db, "dailyEntries"),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const entriesData = [];
        querySnapshot.forEach((doc) => {
          entriesData.push({ id: doc.id, ...doc.data() });
        });
        setEntries(entriesData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching documents: ", err);
        setError("Veriler alınırken bir hata oluştu.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (entryId) => {
    if (!window.confirm("Bu kaydı silmek istediğinizden emin misiniz?")) {
      return;
    }
    try {
      const docRef = doc(db, "dailyEntries", entryId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Kayıt silinirken bir hata oluştu: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4 dark:text-gray-300">
        Geçmiş Kayıtlar Yükleniyor...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!userId) {
    return null;
  }

  if (entries.length === 0) {
    return (
      <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Geçmiş Kayıtlar
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Henüz kaydedilmiş bir gün yok.
        </p>
      </div>
    );
  }

  const getWorkoutDisplay = (workoutPerformed) => {
    if (!workoutPerformed || workoutPerformed === "None") {
      return {
        icon: null,
        text: "Yapılmadı",
        color: "text-gray-500 dark:text-gray-400",
      };
    }
    if (workoutPerformed === "Rest Activity") {
      return {
        icon: BoltIcon,
        text: "Hafif Aktivite",
        color: "text-yellow-600 dark:text-yellow-400",
      };
    }
    return {
      icon: BoltIcon,
      text: workoutPerformed,
      color: "text-green-600 dark:text-green-400",
    };
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Geçmiş Kayıtlar
      </h2>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {entries.map((entry) => {
          const [year, month, day] = entry.date.split("-").map(Number);
          const entryDate = new Date(Date.UTC(year, month - 1, day));
          console.log(
            "SummaryDisplay RENDER: Processing entry in map:",
            entry.id,
            entry.date,
            "Created UTC Date:",
            entryDate.toISOString()
          );

          const workoutDisplay = getWorkoutDisplay(entry.workoutPerformed);
          const entryPlan = getDailyPlanForDate(entryDate);
          const entryWorkoutPlanObj = getWorkoutPlanObject(entryPlan);
          const groupedProgress = groupWorkoutProgress(
            entry.workoutProgress,
            entryWorkoutPlanObj
          );

          // Kalori bölümünün gösterilip gösterilmeyeceğini belirle
          // totalCalories bir sayı ise (0 dahil) göster
          const showCalories = typeof entry.totalCalories === "number";

          // Kalori dökümü için değerleri hazırla
          const lunchStr = formatBreakdownValue(entry.lunchCalories);
          const dinnerStr = formatBreakdownValue(entry.dinnerCalories);
          const snackStr = formatBreakdownValue(entry.snackCalories);
          // Döküm metnini oluştur
          const breakdownText = `(Ö:${lunchStr} A:${dinnerStr} At:${snackStr})`;

          return (
            <div
              key={entry.id}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600/50 transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {entry.date}
                </h3>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700"
                  aria-label="Kaydı Sil"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
                {entry.weight !== null && entry.weight !== undefined && (
                  <div className="flex items-center space-x-2">
                    <ScaleIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span>{entry.weight} kg</span>
                  </div>
                )}
                {entry.steps !== null && entry.steps !== undefined && (
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span>{entry.steps} adım</span>
                  </div>
                )}
                {showCalories && (
                  <div className="flex items-center space-x-2">
                    <FireIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span>{entry.totalCalories} kcal</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {breakdownText}
                    </span>
                  </div>
                )}
                {entry.water !== null && entry.water !== undefined && (
                  <div className="flex items-center space-x-2">
                    <BeakerIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span>{entry.water} L</span>
                  </div>
                )}
                <div
                  className={`flex items-center space-x-2 ${workoutDisplay.color}`}
                >
                  {workoutDisplay.icon && (
                    <workoutDisplay.icon className="h-4 w-4" />
                  )}
                  <span>{workoutDisplay.text}</span>
                </div>
                {entry.workoutDuration !== null &&
                  entry.workoutDuration !== undefined && (
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                      <ClockIcon className="h-4 w-4" />
                      <span>
                        Toplam Süre: {formatSeconds(entry.workoutDuration)}
                      </span>
                    </div>
                  )}
              </div>

              {groupedProgress.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600/50">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                    <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />{" "}
                    Antrenman Detayları:
                  </h4>
                  <div className="space-y-2">
                    {groupedProgress.map((exerciseData) => (
                      <div
                        key={exerciseData.name}
                        className="text-xs text-gray-600 dark:text-gray-300"
                      >
                        <div>
                          <span className="font-medium">
                            {exerciseData.name}:
                          </span>
                          <span className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                            {formatSeconds(exerciseData.totalDuration)}
                          </span>
                        </div>
                        <div className="pl-4 text-gray-500 dark:text-gray-400">
                          {exerciseData.sets
                            .map(
                              (s) =>
                                `Set ${s.set} (${
                                  s.duration != null
                                    ? formatSeconds(s.duration)
                                    : "?"
                                })`
                            )
                            .join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.evaluation && (
                <p className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600/50 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Not:</span> {entry.evaluation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SummaryDisplay;
