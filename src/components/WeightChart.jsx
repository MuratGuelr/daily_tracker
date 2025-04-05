import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Yardımcı fonksiyon: Tarihi YYYY-MM-DD formatına çevirir (StatsSummary'deki ile aynı)
const formatDate = (date) => {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

function WeightChart({ userId }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Son 30 güne ait *kilo girilmiş* verileri çekelim
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = formatDate(thirtyDaysAgo);

        const q = query(
          collection(db, "dailyEntries"),
          where("userId", "==", userId),
          where("date", ">=", thirtyDaysAgoStr),
          where("weight", ">", 0), // Sadece geçerli kilo verisi olanlar
          orderBy("date", "asc") // Tarihe göre artan sırada (grafik için daha iyi)
        );

        const querySnapshot = await getDocs(q);
        const entries = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Kilo verisinin null veya undefined olmadığından emin olalım (sorgu bunu yapıyor ama ekstra kontrol)
          if (data.weight !== null && data.weight !== undefined) {
            entries.push({ date: data.date, weight: data.weight });
          }
        });

        // Grafik için veriyi hazırla
        if (entries.length > 1) {
          // Grafik çizmek için en az 2 nokta lazım
          const labels = entries.map((entry) => entry.date);
          const dataPoints = entries.map((entry) => entry.weight);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "Kilo (kg)",
                data: dataPoints,
                fill: true, // Alanı doldurmayı deneyebiliriz
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.1)", // Hafif dolgu rengi
                tension: 0.2,
                pointBackgroundColor: "rgb(75, 192, 192)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(75, 192, 192)",
              },
            ],
          });
        } else {
          setChartData(null); // Yeterli veri yoksa grafik gösterme
        }
      } catch (err) {
        console.error("Error fetching chart data: ", err);
        setError("Grafik verileri alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center p-4 dark:text-gray-300">
        Kilo Grafiği Yükleniyor...
      </div>
    );
    return <div className="text-center p-4">Kilo Grafiği Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (!chartData) {
    return (
      <div className="mt-8 bg-gray-50 p-6 rounded shadow-md text-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Kilo Değişim Grafiği (Son 30 Gün)
        </h3>
        <p className="text-gray-500">
          Grafiği görmek için en az 2 farklı güne ait kilo verisi gereklidir.
        </p>
      </div>
    );
  }

  // Grafik Ayarları
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Kilo Değişimi (Son 30 Gün)",
      },
    },
    scales: {
      y: {
        beginAtZero: false, // Kilo genellikle 0'dan başlamaz
      },
    },
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow-md">
      <Line options={options} data={chartData} />
    </div>
  );
}

export default WeightChart;
