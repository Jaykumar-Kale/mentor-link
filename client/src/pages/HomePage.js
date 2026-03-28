import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STATS = [
  { number: '350+',   label: 'Scholarships granted' },
  { number: '₹2 Cr+', label: 'Total value of scholarships' },
  { number: '14.5L+', label: 'Eye-screenings conducted for free' },
  { number: '7,000+', label: 'Cataract surgeries conducted' },
  { number: '₹28L+',  label: 'Value of cancer support' },
];

const PROGRAMS = [
  { title: 'Scholarship Program', desc: 'Financial assistance for deserving students from underserved backgrounds.', icon: '🎓' },
  { title: 'Mentorship Program',  desc: 'One-on-one mentoring connecting students with industry professionals.', icon: '🤝' },
  { title: 'Skill Development',   desc: 'Workshops and training to enhance soft skills and career readiness.', icon: '🚀' },
  { title: 'Eye Care Initiative', desc: 'Free eye screenings and cataract surgeries for the underprivileged.', icon: '👁️' },
];

export default function HomePage() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden bg-gray-900">
        <img
          src="/hero-bg.jpg"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          onError={e => { e.target.style.display='none'; }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-8 py-16 text-white">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
            Mudita Alliance Funds Higher Education And Skill Development For Bright Students From Underserved Backgrounds.
          </h1>
          <div className="w-16 h-1 bg-amber-400 rounded mb-6" />
          <p className="text-lg text-gray-200 mb-8">
            Collaborate To Enable Individuals, Enhance Their Potential &amp; Empower Our Communities Towards a Sustainable Future.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/login" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded transition text-sm">
              DONATE
            </Link>
            <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded transition text-sm">
              APPLY NOW
            </Link>
            <Link to="/login" className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-6 py-3 rounded transition text-sm">
              LOGIN
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-indigo-800 py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center text-white">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-amber-400">{s.number}</p>
              <p className="text-xs text-gray-300 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Mentorship */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-indigo-800 mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
            MentorLink – Mentorship Program
          </h2>
          <div className="w-16 h-1 bg-amber-400 rounded mx-auto mb-6" />
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            MentorLink connects first-generation college students with experienced professionals who
            volunteer their time to guide the next generation. Through structured sessions, learning
            modules, and personalised support, we bridge the gap between talent and opportunity.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { title:'For Mentees', desc:'Get matched with a mentor, access learning modules, schedule sessions, and track your progress through the program.', color:'bg-amber-50 border-amber-200' },
              { title:'For Mentors', desc:'Register as a volunteer mentor, get matched with motivated students, and guide them through career and personal development.', color:'bg-indigo-50 border-indigo-200' },
              { title:'For NGOs',    desc:'Deploy MentorLink as a white-label platform for your organisation with your own branding, mentor pool, and student cohort.', color:'bg-green-50 border-green-200' },
            ].map(c => (
              <div key={c.title} className={`border rounded-xl p-5 ${c.color}`}>
                <h3 className="font-bold text-indigo-800 text-lg mb-2">{c.title}</h3>
                <p className="text-gray-600 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/login" className="inline-block bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-8 py-3 rounded transition">
              Join the Program
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-indigo-800 mb-3" style={{ fontFamily: 'Poppins,sans-serif' }}>Our Programs</h2>
            <div className="w-16 h-1 bg-amber-400 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map(p => (
              <div key={p.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-indigo-800 text-lg mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-400 py-14 px-6 text-center">
        <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Poppins,sans-serif' }}>
          Ready to make a difference?
        </h2>
        <p className="text-white text-lg mb-8 max-w-xl mx-auto">
          Whether you want to mentor, get mentored, or support us — we have a place for you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="bg-white text-amber-500 font-bold px-8 py-3 rounded hover:bg-gray-100 transition">
            Register as Mentor
          </Link>
          <Link to="/login" className="bg-indigo-700 text-white font-bold px-8 py-3 rounded hover:bg-indigo-800 transition">
            Student Login
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
