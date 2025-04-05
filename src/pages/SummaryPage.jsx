import React from "react";
import StatsSummary from "../components/StatsSummary";
import WeightChart from "../components/WeightChart";
import SummaryDisplay from "../components/SummaryDisplay";
import WorkoutSummary from "../components/WorkoutSummary";

// Bu component App.jsx'ten 'user' prop'unu alır
function SummaryPage({ user }) {
  // Düzenleme fonksiyonu artık burada değil.
  // SummaryDisplay'e onEditClick prop'unu göndermeyeceğiz.

  return (
    <div className="space-y-10">
      {/* TODO: Dark theme stilleri (Adım 6) */}
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
        Özetlerim
      </h1>

      {/* İstatistikler Bölümü */}
      <section aria-labelledby="stats-title">
        {/* Görünmez başlık (erişilebilirlik için) veya görünür başlık */}
        {/* <h2 id="stats-title" className="sr-only">İstatistikler</h2> */}
        <StatsSummary userId={user.uid} />
      </section>

      {/* Kilo Grafiği Bölümü */}
      <section aria-labelledby="weight-chart-title">
        {/* <h2 id="weight-chart-title" className="sr-only">Kilo Grafiği</h2> */}
        <WeightChart userId={user.uid} />
      </section>

      {/* Antrenman Özeti Bölümü (Yeni) */}
      <section aria-labelledby="workout-summary-title">
        <WorkoutSummary userId={user.uid} />
      </section>

      {/* Geçmiş Kayıtlar Bölümü (Genel) */}
      <section aria-labelledby="history-title">
        {/* <h2 id="history-title" className="sr-only">Geçmiş Kayıtlar</h2> */}
        {/* SummaryDisplay artık genel kayıtları gösterecek */}
        <SummaryDisplay userId={user.uid} />
      </section>
    </div>
  );
}

export default SummaryPage;
