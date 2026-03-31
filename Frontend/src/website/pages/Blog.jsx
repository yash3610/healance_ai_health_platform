import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogs = [
  {
    id: 1,
    title: "AI in Healthcare: The Next Frontier",
    category: "Technology",
    image: "https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "How artificial intelligence is transforming diagnosis, treatment, and patient care globally.",
    author: "Dr. Sarah Chen",
    date: "Oct 12, 2023"
  },
  {
    id: 2,
    title: "5 Simple Habits for Heart Health",
    category: "Wellness",
    image: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Cardiologists share the most effective daily habits to keep your heart strong and healthy.",
    author: "Dr. James Wilson",
    date: "Oct 10, 2023"
  },
  {
    id: 3,
    title: "Understanding Diabetes Prevention",
    category: "Prevention",
    image: "https://images.pexels.com/photos/6942083/pexels-photo-6942083.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Early warning signs and lifestyle changes that can help prevent Type 2 diabetes.",
    author: "Emma Thompson, RD",
    date: "Oct 08, 2023"
  },
  {
    id: 4,
    title: "The Science of Sleep and Recovery",
    category: "Lifestyle",
    image: "https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Why sleep is crucial for your body's recovery and how to improve your sleep quality.",
    author: "Dr. Michael Ross",
    date: "Oct 05, 2023"
  },
  {
    id: 5,
    title: "Mental Health in the Digital Age",
    category: "Mental Health",
    image: "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Managing anxiety, stress, and digital burnout in our always-connected world.",
    author: "Dr. Lisa Martinez",
    date: "Oct 03, 2023"
  },
  {
    id: 6,
    title: "Nutrition Myths Debunked by Science",
    category: "Nutrition",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "We separate fact from fiction on popular diet trends and nutritional beliefs.",
    author: "Dr. Robert Kim, PhD",
    date: "Sep 28, 2023"
  },
  {
    id: 7,
    title: "Exercise for Every Age Group",
    category: "Fitness",
    image: "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Tailored workout routines for children, adults, and seniors to stay active and healthy.",
    author: "Coach Amanda Lee",
    date: "Sep 25, 2023"
  },
  {
    id: 8,
    title: "Yoga and Meditation for Beginners",
    category: "Mindfulness",
    image: "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "A complete guide to starting your mindfulness journey with simple practices.",
    author: "Priya Sharma",
    date: "Sep 22, 2023"
  },
  {
    id: 9,
    title: "Hydration: More Than Just Water",
    category: "Wellness",
    image: "https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Understanding electrolytes, optimal hydration levels, and signs of dehydration.",
    author: "Dr. Emily Watson",
    date: "Sep 18, 2023"
  },
  {
    id: 10,
    title: "Boosting Your Immune System Naturally",
    category: "Prevention",
    image: "https://images.pexels.com/photos/5945848/pexels-photo-5945848.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Foods, supplements, and lifestyle habits that strengthen your body's defenses.",
    author: "Dr. David Park",
    date: "Sep 15, 2023"
  },
  {
    id: 11,
    title: "Managing Chronic Pain Effectively",
    category: "Health",
    image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Modern approaches to pain management without over-reliance on medication.",
    author: "Dr. Karen Hughes",
    date: "Sep 12, 2023"
  },
  {
    id: 12,
    title: "The Power of Walking 10,000 Steps",
    category: "Fitness",
    image: "https://images.pexels.com/photos/4149027/pexels-photo-4149027.jpeg?auto=compress&cs=tinysrgb&w=800",
    excerpt: "Why daily walking is one of the most underrated exercises for overall health.",
    author: "Coach Mike Johnson",
    date: "Sep 08, 2023"
  }
];

const Blog = () => {
  return (
    <div className="pt-20 pb-16 sm:pb-20 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 py-10 sm:py-16 mb-8 sm:mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Health & Wellness Journal</h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Expert insights, latest research, and practical tips for a healthier life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-100 flex flex-col">
              <div className="relative h-48 sm:h-64 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {blog.category}
                </div>
              </div>
              <div className="p-4 sm:p-8 flex-1 flex flex-col">
                <div className="flex flex-wrap items-center text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4 gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <User size={14} className="mr-1" /> {blog.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" /> {blog.date}
                  </div>
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3 hover:text-primary-600 transition-colors">
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </h2>
                <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 flex-1">
                  {blog.excerpt}
                </p>
                <Link 
                  to={`/blog/${blog.id}`} 
                  className="inline-flex items-center font-semibold text-sm sm:text-base text-primary-600 hover:text-primary-700"
                >
                  Read Article <ArrowRight size={14} className="ml-1 sm:ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
