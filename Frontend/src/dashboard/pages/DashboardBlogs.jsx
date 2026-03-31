import React, { useState } from 'react';
import { Search, Filter, Clock, ArrowRight, TrendingUp, Bookmark } from 'lucide-react';
import Button from '../../shared/ui/Button';

const blogPosts = [
  {
    id: 1,
    title: "Understanding Your AI Health Score",
    category: "Platform Guide",
    image: "https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Learn how our algorithms calculate your daily health metrics and what they mean for your longevity.",
    readTime: "5 min read",
    isPopular: true
  },
  {
    id: 2,
    title: "5 Foods to Boost Heart Health",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Cardiologist-approved superfoods that you should include in your diet starting today.",
    readTime: "3 min read",
    isPopular: false
  },
  {
    id: 3,
    title: "The Science of Sleep Cycles",
    category: "Wellness",
    image: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Why deep sleep matters more than duration, and how to optimize your bedroom for rest.",
    readTime: "7 min read",
    isPopular: true
  },
  {
    id: 4,
    title: "Managing Stress with Mindfulness",
    category: "Mental Health",
    image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Simple breathing exercises you can do at your desk to lower cortisol levels instantly.",
    readTime: "4 min read",
    isPopular: false
  },
  {
    id: 5,
    title: "New Feature: Body Explorer",
    category: "Product Update",
    image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Explore our new interactive 3D body map to understand your symptoms better.",
    readTime: "2 min read",
    isPopular: false
  },
  {
    id: 6,
    title: "Walking Your Way to Better Health",
    category: "Fitness",
    image: "https://images.pexels.com/photos/4149027/pexels-photo-4149027.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Discover why 10,000 steps a day can transform your cardiovascular health.",
    readTime: "4 min read",
    isPopular: true
  },
  {
    id: 7,
    title: "Hydration: The Overlooked Essential",
    category: "Wellness",
    image: "https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "How proper hydration affects energy, focus, and overall body function.",
    readTime: "3 min read",
    isPopular: false
  },
  {
    id: 8,
    title: "Building Immunity Naturally",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/5945848/pexels-photo-5945848.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Foods and habits that strengthen your immune system for year-round health.",
    readTime: "5 min read",
    isPopular: true
  }
];

const categories = ["All", "Platform Guide", "Nutrition", "Wellness", "Mental Health", "Product Update", "Fitness"];

const DashboardBlogs = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Health Knowledge Base</h2>
          <p className="text-sm sm:text-base text-slate-600">Curated articles to help you live healthier.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none w-full sm:w-auto cursor-pointer"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Content Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700">
                  {post.category}
                </span>
              </div>
              <div className="p-4 sm:p-5 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center pt-3 sm:pt-4 border-t border-slate-50 mt-auto">
                  <span className="text-[10px] sm:text-xs text-slate-400 flex items-center">
                    <Clock size={12} className="mr-1" /> {post.readTime}
                  </span>
                  <button className="text-xs sm:text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center">
                    Read <ArrowRight size={14} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar - Popular & Trending */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-primary-500" />
              <h3 className="font-bold text-sm sm:text-base text-slate-800">Trending Now</h3>
            </div>
            <div className="space-y-4">
              {blogPosts.filter(p => p.isPopular).map(post => (
                <div key={post.id} className="flex gap-3 group cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={post.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h4>
                    <span className="text-xs text-slate-500 mt-1 block">{post.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg">
            <Bookmark className="text-primary-400 mb-4" size={24} />
            <h3 className="font-bold text-lg mb-2">Saved Articles</h3>
            <p className="text-slate-400 text-sm mb-4">You haven't saved any articles yet. Bookmark posts to read them later.</p>
            <Button size="sm" variant="outline" className="w-full border-slate-600 hover:bg-slate-800">
              View Bookmarks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBlogs;
