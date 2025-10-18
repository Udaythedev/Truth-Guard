import React, { useEffect, useState } from "react";
import StatsWidget from "../components/StatsWidget";
import NewsCard from "../components/NewsCard";
import axios from "axios";

const Trending = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [randomArticle, setRandomArticle] = useState(null);
  const [showRandomModal, setShowRandomModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const newsRes = await axios.get("https://truth-guard-89p9.onrender.com/api/trending");
        setTrendingNews(newsRes.data);

        const catRes = await axios.get("https://truth-guard-89p9.onrender.com/api/categories");
        setCategories(catRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredNews = trendingNews.filter(
    (item) => filter === "All" || item.category === filter
  );

  const fetchRandomArticle = async () => {
    try {
      const res = await axios.get("https://truth-guard-89p9.onrender.com/api/random");
      setRandomArticle(res.data);
      setShowRandomModal(true);
    } catch (err) {
      console.error("Error fetching random article:", err);
    }
  };

  // Stats based on categories
const statsData = [
  { title: "Total Trending News", value: trendingNews.length, icon: "📊", bgColor: "bg-blue-100" },
  { title: "Politics", value: trendingNews.filter(n => n.category === "Politics").length, icon: "🗳️", bgColor: "bg-red-100" },
  { title: "Health", value: trendingNews.filter(n => n.category === "Health").length, icon: "❤️", bgColor: "bg-green-100" },
  { title: "Tech", value: trendingNews.filter(n => n.category === "Tech").length, icon: "💻", bgColor: "bg-yellow-100" },
  { title: "Entertainment", value: trendingNews.filter(n => n.category === "Entertainment").length, icon: "🎬", bgColor: "bg-purple-100" },
];


  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Trending Topics</h1>
        <button
          onClick={fetchRandomArticle}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
        >
          🎲 Random Article
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsData.map((stat, idx) => (
          <StatsWidget key={idx} {...stat} />
        ))}
      </div>

      {/* Category Filters */}
      <div className="flex gap-4 overflow-x-auto py-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Cards */}
      {loading ? (
        <p>Loading trending news...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              source={news.source}
              summary={news.summary}
              category={news.category}
            />
          ))}
        </div>
      )}

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

export default Trending;
