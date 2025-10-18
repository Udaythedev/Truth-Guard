import React, { useEffect, useState } from "react";
import StatsWidget from "../components/StatsWidget";
import NewsCard from "../components/NewsCard";
import axios from "axios";

const Dashboard = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomArticle, setRandomArticle] = useState(null);
  const [showRandomModal, setShowRandomModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch news
        const resNews = await axios.get("https://truth-guard-89p9.onrender.com/api/trending");
        setTrendingNews(resNews.data);

        // Build stats with real numbers
        const statsData = [
          { title: "Verified Claims", value: resNews.data.length, icon: "✅", bgColor: "bg-green-100" },
          { title: "Trending Today", value: resNews.data.length, icon: "🔥", bgColor: "bg-red-100" },
          { title: "New Users", value: 320, icon: "👤", bgColor: "bg-blue-100" }, // placeholder
          { title: "Fact Checks Completed", value: 980, icon: "📊", bgColor: "bg-yellow-100" } // placeholder
        ];
        setStats(statsData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const fetchRandomArticle = async () => {
    try {
      const res = await axios.get("https://truth-guard-89p9.onrender.com/api/random");
      setRandomArticle(res.data);
      setShowRandomModal(true);
    } catch (err) {
      console.error("Error fetching random article:", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen space-y-6">
      {/* Header with Random Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <button
          onClick={fetchRandomArticle}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
        >
          🎲 Random Article
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatsWidget key={idx} {...stat} />
        ))}
      </div>

      {/* Trending News Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Trending News</h2>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Loading news...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingNews.map((news, idx) => (
              <NewsCard key={idx} {...news} />
            ))}
          </div>
        )}
      </div>

      {/* Random Article Modal */}
      {showRandomModal && randomArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setShowRandomModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              🎲 Random Article
            </h2>
            <NewsCard
              title={randomArticle.title}
              source={randomArticle.source}
              summary={randomArticle.summary}
              category={randomArticle.category}
            />
            <button
              onClick={fetchRandomArticle}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Get Another Random Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
