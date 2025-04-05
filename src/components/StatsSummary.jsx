import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import {
  ChartBarIcon,
  ScaleIcon,
  FireIcon,
  BoltIcon,
  CakeIcon,
  CalendarDaysIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

// Yardımcı fonksiyon: Tarihi YYYY-MM-DD formatına çevirir
const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

// İstatistik kartı için component
function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  colorClass = "text-indigo-600 dark:text-indigo-400",
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow transition-shadow hover:shadow-md">
      <div
        className={`mb-2 p-2 bg-indigo-100 dark:bg-gray-800 rounded-full ${colorClass}`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </div>
      <div className={`text-xl font-bold ${colorClass}`}>
        {value} {unit}
      </div>
    </div>
  );
}

function StatsSummary({ userId }) {
  const [stats, setStats] = useState({
    totalEntries: 0,
    avgSteps: 0,
    avgWater: 0,
    avgTotalCalories: 0,
    workoutDaysCount: 0,
    last7DaysWorkoutPercentage: 0,
    weightChange: null,
    snackDaysPercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchAndCalculateStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = formatDate(thirtyDaysAgo);

        const q = query(
          collection(db, "dailyEntries"),
          where("userId", "==", userId),
          where("date", ">=", thirtyDaysAgoStr),
          orderBy("date", "desc")
        );

        const querySnapshot = await getDocs(q);
        const entries = [];
        querySnapshot.forEach((doc) => {
          entries.push({ id: doc.id, ...doc.data() });
        });

        if (entries.length === 0) {
          setStats({
            totalEntries: 0,
            avgSteps: 0,
            avgWater: 0,
            avgTotalCalories: 0,
            workoutDaysCount: 0,
            last7DaysWorkoutPercentage: 0,
            weightChange: null,
            snackDaysPercentage: 0,
          });
          setLoading(false);
          return;
        }

        const totalEntries = entries.length;
        let totalSteps = 0,
          stepsCount = 0;
        let totalWater = 0,
          waterCount = 0;
        let totalCaloriesSum = 0,
          caloriesCount = 0;
        let workoutDaysCount = 0;
        let snackDaysCount = 0;
        let firstWeightEntry = null,
          lastWeightEntry = null;
        let workoutDaysLast7 = 0;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoStr = formatDate(sevenDaysAgo);

        entries.reverse();

        entries.forEach((entry) => {
          if (entry.steps) {
            totalSteps += entry.steps;
            stepsCount++;
          }
          if (entry.water) {
            totalWater += entry.water;
            waterCount++;
          }
          if (
            entry.workoutPerformed &&
            entry.workoutPerformed !== "None" &&
            entry.workoutPerformed !== "Rest Activity"
          ) {
            workoutDaysCount++;
            if (entry.date >= sevenDaysAgoStr) {
              workoutDaysLast7++;
            }
          }
          if (entry.snackCalories && entry.snackCalories > 0) {
            snackDaysCount++;
          }
          if (
            entry.totalCalories !== null &&
            entry.totalCalories !== undefined
          ) {
            totalCaloriesSum += entry.totalCalories;
            caloriesCount++;
          }
          if (entry.weight !== null && entry.weight !== undefined) {
            if (!firstWeightEntry) {
              firstWeightEntry = { date: entry.date, weight: entry.weight };
            }
            lastWeightEntry = { date: entry.date, weight: entry.weight };
          }
        });

        const avgSteps =
          stepsCount > 0 ? Math.round(totalSteps / stepsCount) : 0;
        const avgWater =
          waterCount > 0 ? (totalWater / waterCount).toFixed(1) : 0;
        const avgTotalCalories =
          caloriesCount > 0 ? Math.round(totalCaloriesSum / caloriesCount) : 0;
        const snackDaysPercentage =
          totalEntries > 0
            ? Math.round((snackDaysCount / totalEntries) * 100)
            : 0;
        const entriesInLast7Days = entries.filter(
          (e) => e.date >= sevenDaysAgoStr
        ).length;
        const last7DaysWorkoutPercentage =
          entriesInLast7Days > 0
            ? Math.round((workoutDaysLast7 / entriesInLast7Days) * 100)
            : 0;

        let weightChange = null;
        if (
          firstWeightEntry &&
          lastWeightEntry &&
          firstWeightEntry.date !== lastWeightEntry.date
        ) {
          const change = (
            lastWeightEntry.weight - firstWeightEntry.weight
          ).toFixed(1);
          weightChange = {
            start: firstWeightEntry.weight.toFixed(1),
            end: lastWeightEntry.weight.toFixed(1),
            change: parseFloat(change),
          };
        } else if (firstWeightEntry) {
          weightChange = {
            start: firstWeightEntry.weight.toFixed(1),
            end: firstWeightEntry.weight.toFixed(1),
            change: 0,
          };
        }

        setStats({
          totalEntries,
          avgSteps,
          avgWater,
          avgTotalCalories,
          workoutDaysCount,
          last7DaysWorkoutPercentage,
          weightChange,
          snackDaysPercentage,
        });
      } catch (err) {
        console.error("Error fetching stats: ", err);
        setError("İstatistikler alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center p-4 dark:text-gray-300">
        İstatistikler Yükleniyor...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (stats.totalEntries === 0) {
    return (
      <div className="mt-8 bg-blue-50 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-300">
          Özet İstatistikler (Son 30 Gün)
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Henüz bu periyoda ait bir kayıt bulunmuyor. Özetleri görmek için
          lütfen veri girişi yapın.
        </p>
      </div>
    );
  }

  const weightChangeColor =
    stats.weightChange?.change > 0
      ? "text-red-600 dark:text-red-400"
      : stats.weightChange?.change < 0
      ? "text-green-600 dark:text-green-400"
      : "text-indigo-600 dark:text-indigo-400";

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
        Son 30 Günün Özeti
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ChartBarIcon}
          label="Ort. Adım"
          value={stats.avgSteps}
          unit=""
        />
        <StatCard
          icon={BeakerIcon}
          label="Ort. Su"
          value={stats.avgWater}
          unit="L"
        />
        <StatCard
          icon={FireIcon}
          label="Ort. Kalori"
          value={stats.avgTotalCalories}
          unit="kcal"
        />
        <StatCard
          icon={BoltIcon}
          label="Spor % (7 Gün)"
          value={stats.last7DaysWorkoutPercentage}
          unit="%"
        />
        <StatCard
          icon={CakeIcon}
          label="Atıştırma %"
          value={stats.snackDaysPercentage}
          unit="%"
        />
        {stats.weightChange && (
          <StatCard
            icon={ScaleIcon}
            label="Kilo Değişimi"
            value={`${stats.weightChange.change > 0 ? "+" : ""}${
              stats.weightChange.change
            }`}
            unit="kg"
            colorClass={weightChangeColor}
          />
        )}
        <StatCard
          icon={CalendarDaysIcon}
          label="Kayıtlı Gün"
          value={stats.totalEntries}
          unit=""
        />
      </div>
    </div>
  );
}

export default StatsSummary;
