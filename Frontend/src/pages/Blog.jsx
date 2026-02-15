import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogs = [
  {
    id: 1,
    title: "AI in Healthcare: The Next Frontier",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1576091160550-21733e99db29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "How artificial intelligence is transforming diagnosis, treatment, and patient care globally.",
    author: "Dr. Sarah Chen",
    date: "Oct 12, 2023"
  },
  {
    id: 2,
    title: "5 Simple Habits for Heart Health",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "Cardiologists share the most effective daily habits to keep your heart strong and healthy.",
    author: "Dr. James Wilson",
    date: "Oct 10, 2023"
  },
  {
    id: 3,
    title: "Understanding Diabetes Prevention",
    category: "Prevention",
    image: "https://images.unsplash.com/photo-1559757609-f3109038c656?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "Early warning signs and lifestyle changes that can help prevent Type 2 diabetes.",
    author: "Emma Thompson, RD",
    date: "Oct 08, 2023"
  },
  {
    id: 4,
    title: "The Science of Sleep and Recovery",
    category: "Lifestyle",
    image: "https://images.unsplash.com/photo-1541781777621-af13943727dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "Why sleep is crucial for your body's recovery and how to improve your sleep quality.",
    author: "Dr. Michael Ross",
    date: "Oct 05, 2023"
  }
];

const Blog = () => {
  return (
    <div className="pt-20 pb-20 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Health & Wellness Journal</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Expert insights, latest research, and practical tips for a healthier life.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {blogs.map((blog) => (
            <article key={blog.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-slate-100 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {blog.category}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center text-sm text-slate-500 mb-4 gap-4">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" /> {blog.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" /> {blog.date}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 hover:text-primary-600 transition-colors">
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </h2>
                <p className="text-slate-600 mb-6 flex-1">
                  {blog.excerpt}
                </p>
                <Link 
                  to={`/blog/${blog.id}`} 
                  className="inline-flex items-center font-semibold text-primary-600 hover:text-primary-700"
                >
                  Read Article <ArrowRight size={16} className="ml-2" />
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
