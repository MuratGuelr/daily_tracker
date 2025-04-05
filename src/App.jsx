import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom"; // React Router componentlerini import et
import { db, auth } from "./firebaseConfig"; // auth'u import et
import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  query, // Firestore sorgusu için
  where, // Firestore sorgusu için
  orderBy, // Firestore sorgusu için
  onSnapshot, // Firestore dinleme için
} from "firebase/firestore";
import {
  GoogleAuthProvider, // Google sağlayıcısını import et
  signInWithPopup, // Popup ile giriş için
  signOut, // Çıkış yapmak için
  onAuthStateChanged, // Kullanıcı durumu değişikliklerini dinlemek için
} from "firebase/auth"; // Auth fonksiyonlarını import et
import SummaryDisplay from "./components/SummaryDisplay"; // Yeni componenti import et
import StatsSummary from "./components/StatsSummary"; // Yeni componenti import et
import WeightChart from "./components/WeightChart"; // Yeni grafik componentini import et
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid"; // Örnek ikonlar için (npm install @heroicons/react)

// Sayfa componentlerini import et (henüz oluşturulmadıysa varsayalım)
import HomePage from "./pages/HomePage";
import SummaryPage from "./pages/SummaryPage";

function App() {
  const [user, setUser] = useState(null); // Giriş yapan kullanıcıyı tutacak state
  // Form alanları için state'leri tanımlayalım
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Bugünün tarihi
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [exerciseDone, setExerciseDone] = useState(false);
  const [exercises, setExercises] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [snacksEaten, setSnacksEaten] = useState(false);
  const [snacksDetails, setSnacksDetails] = useState("");
  const [water, setWater] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Yükleme durumu için state
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Auth yükleme durumu
  const [editingEntryId, setEditingEntryId] = useState(null); // Hangi kaydın düzenlendiğini tutar (ID)
  const navigate = useNavigate(); // Yönlendirme için hook
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); // Temayı local storage'dan al veya varsayılan 'light' yap

  // Kullanıcı giriş durumunu dinle
  useEffect(() => {
    setIsAuthLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Kullanıcı varsa state'i güncelle, yoksa null yap
      setIsAuthLoading(false); // Auth durumu belli oldu, yüklemeyi bitir
      if (!currentUser) {
        // Kullanıcı çıkış yaptıysa düzenleme modunu iptal et
        cancelEdit();
      }
      // console.log("Auth state changed, user:", currentUser);
    });
    // Component kaldırıldığında listener'ı temizle
    return () => unsubscribe();
  }, []); // Sadece component mount edildiğinde çalışır

  // Tema değiştiğinde local storage'ı ve html class'ını güncelle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme); // Seçimi kaydet
  }, [theme]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Google ile Giriş Fonksiyonu
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Giriş başarılı olunca ana sayfaya yönlendir (opsiyonel)
      // navigate('/');
    } catch (error) {
      console.error("Google ile giriş hatası:", error);
      alert("Google ile giriş yapılamadı: " + error.message);
    }
  };

  // Çıkış Yapma Fonksiyonu
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Çıkış yapınca giriş sayfasına veya ana sayfaya yönlendir
      navigate("/"); // Ana sayfaya dönelim
    } catch (error) {
      console.error("Çıkış yapma hatası:", error);
      alert("Çıkış yapılamadı: " + error.message);
    }
  };

  // Formu temizle ve düzenleme modunu sıfırla
  const resetForm = (resetDate = false) => {
    if (resetDate) {
      setDate(new Date().toISOString().split("T")[0]);
    }
    setWeight("");
    setSteps("");
    setExerciseDone(false);
    setExercises("");
    setLunch("");
    setDinner("");
    setSnacksEaten(false);
    setSnacksDetails("");
    setWater("");
    setEvaluation("");
    setEditingEntryId(null); // Düzenleme modunu kapat
  };

  // Düzenleme modunu iptal et
  const cancelEdit = () => {
    resetForm(true); // Formu ve tarihi sıfırla
  };

  // Seçilen kaydı forma yükle (SummaryDisplay'den çağrılacak)
  const loadEntryForEdit = (entry) => {
    if (!entry) return;
    setEditingEntryId(entry.id); // Düzenleme moduna girildiğini belirt
    setDate(entry.date); // Tarihi de yükle
    setWeight(entry.weight?.toString() || ""); // null ise boş string
    setSteps(entry.steps?.toString() || "");
    setExerciseDone(entry.exerciseDone || false);
    setExercises(entry.exercises || "");
    setLunch(entry.lunch || "");
    setDinner(entry.dinner || "");
    setSnacksEaten(entry.snacksEaten || false);
    setSnacksDetails(entry.snacksDetails || "");
    setWater(entry.water?.toString() || "");
    setEvaluation(entry.evaluation || "");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Formun olduğu yere git
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      // Kullanıcı giriş yapmamışsa kaydetme
      alert("Lütfen önce giriş yapın.");
      return;
    }
    setIsLoading(true);

    // Kaydedilecek veriyi hazırla
    const dailyData = {
      userId: user.uid, // Kullanıcı ID'sini ekle
      date: date,
      weight: weight ? parseFloat(weight) : null,
      steps: steps ? parseInt(steps, 10) : null,
      exerciseDone: exerciseDone,
      exercises: exerciseDone ? exercises : "",
      lunch: lunch,
      dinner: dinner,
      snacksEaten: snacksEaten,
      snacksDetails: snacksEaten ? snacksDetails : "",
      water: water ? parseFloat(water) : null,
      evaluation: evaluation,
      updatedAt: serverTimestamp(), // Güncelleme zamanını ekleyelim
    };

    try {
      // Belge ID'si düzenleme modunda ise mevcut ID, değilse yeni ID (userId_date)
      // Ancak tarih değiştirilebildiği için, ID'nin hep userID_date olması daha tutarlı.
      // Eğer kullanıcı tarihi değiştirirse, eski kaydı silip yenisini oluşturmak gibi düşünülebilir,
      // veya ID olarak Firestore'un otomatik ID'sini kullanıp tarihi sadece bir alan olarak tutabiliriz.
      // Şimdilik en basit yöntem: ID = user.uid + "_" + date
      // Eğer düzenlemede tarihi değiştirirseniz, yeni bir kayıt oluşur, eskisini ayrıca silmeniz gerekir.
      // Daha gelişmiş senaryo için ID'yi sabit tutmak gerekir (örn: Firestore otomatik ID).
      // Biz şimdiki ID yapısıyla (user.uid + "_" + date) devam edelim.
      // Eğer düzenlemede tarihi değiştirirseniz, yeni bir kayıt oluşur, eskisini ayrıca silmeniz gerekir.
      // Daha gelişmiş senaryo için ID'yi sabit tutmak gerekir (örn: Firestore otomatik ID).
      // Biz şimdiki ID yapısıyla (user.uid + "_" + date) devam edelim.
      const docId = `${user.uid}_${date}`;

      const docRef = doc(db, "dailyEntries", docId);
      // setDoc: Belge yoksa oluşturur, varsa üzerine yazar (merge olmadan)
      // İstersen { merge: true } ekleyerek sadece değişen alanları güncelleyebilirsin
      await setDoc(docRef, dailyData /*, { merge: true } */);

      alert(
        `Günlük ${
          editingEntryId ? "başarıyla güncellendi" : "başarıyla kaydedildi"
        }!`
      );
      resetForm(true); // Formu ve tarihi sıfırla
    } catch (error) {
      console.error("Error saving document: ", error);
      alert(
        "Veri kaydedilirken/güncellenirken bir hata oluştu: " + error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auth yüklenirken boş bir şey göster
  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        Yükleniyor...
      </div>
    );
  }

  return (
    // TODO: Dark theme için class'ı dinamik hale getir (Adım 5'te yapılacak)
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center max-w-4xl">
          <Link
            to="/"
            className="text-xl font-bold text-indigo-600 dark:text-indigo-400"
          >
            Günlük Takip
          </Link>
          <div className="flex items-center space-x-4">
            {user && (
              <Link
                to="/summary"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Özetlerim
              </Link>
            )}
            {/* Tema Değiştirme Butonu */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Google ile Giriş Yap
              </button>
            )}
            {/* TODO: Dark mode toggle butonu buraya eklenebilir (Adım 5) */}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 max-w-4xl mt-4">
        <Routes>
          {/* Ana Sayfa Rotası */}
          <Route
            path="/"
            element={
              user ? (
                <HomePage user={user} /> // Giriş yapıldıysa formu göster
              ) : (
                <LoginPage onLogin={signInWithGoogle} /> // Giriş yapılmadıysa giriş ekranını göster
              )
            }
          />
          {/* Özet Sayfası Rotası (Sadece giriş yapmış kullanıcılar erişebilir) */}
          <Route
            path="/summary"
            element={
              user ? (
                <SummaryPage user={user} />
              ) : (
                <Navigate to="/" replace /> // Giriş yapmamışsa ana sayfaya yönlendir
              )
            }
          />
          {/* Diğer rotalar veya 404 sayfası buraya eklenebilir */}
          <Route path="*" element={<Navigate to="/" replace />} />{" "}
          {/* Bulunamayanları anasayfaya yönlendir */}
        </Routes>
      </main>
    </div>
  );
}

// Basit bir giriş sayfası component'i
function LoginPage({ onLogin }) {
  return (
    <div className="text-center mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Giriş Yap
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Günlük kayıtlarınızı görmek ve eklemek için lütfen Google hesabınızla
        giriş yapın.
      </p>
      <button
        onClick={onLogin}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
      >
        {/* Google ikonu eklenebilir */}
        <span>Google ile Giriş Yap</span>
      </button>
    </div>
  );
}

export default App;
