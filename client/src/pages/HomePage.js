import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return count;
}

const STATS = [
  { value: 350, suffix: '+', label: 'Scholarships Granted', prefix: '' },
  { value: 2, suffix: ' Cr+', label: 'Value of Scholarships', prefix: '₹' },
  { value: 14.5, suffix: 'L+', label: 'Meals Supported', prefix: '' },
  { value: 7000, suffix: '+', label: 'Eye Screenings Done', prefix: '' },
];

const TESTIMONIALS = [
  {
    quote: "When you come to Mudita, the support isn't just financial. They truly care about your growth.",
    name: 'Deepali',
    role: 'Mudita Scholar & Volunteer',
    avatar: 'D',
  },
  {
    quote: "Mudita's transparency, clear communication, and demonstrated impact make them a standout partner.",
    name: 'Meenakshi Kaul',
    role: 'VP, Ziff Davis Performance Marketing',
    avatar: 'M',
  },
  {
    quote: "Their cautious and rigorous selection process translates to resolving real issues for the truly deserving.",
    name: 'Harish Thadaney',
    role: 'Donor',
    avatar: 'H',
  },
  {
    quote: "Through Mudita, we supported two young women in higher education. Watching them succeed has been inspiring.",
    name: 'Devika Naik Sharma',
    role: 'Donor',
    avatar: 'DN',
  },
];

const PROGRAMS = [
  {
    icon: '🎓',
    title: 'College Scholarships',
    desc: 'Funding higher education for bright students from underserved backgrounds in STEM fields across Maharashtra.',
    color: 'bg-indigo-50 border-indigo-200',
    iconBg: 'bg-indigo-100',
    link: '/programmes#scholarships',
  },
  {
    icon: '🏥',
    title: 'Medical Support',
    desc: 'Cancer treatment support and free eye care screenings for underprivileged patients and children.',
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-100',
    link: '/programmes#medical',
  },
  {
    icon: '🍱',
    title: 'Annadaan Programme',
    desc: 'Monthly dry ration distribution to senior citizens, individuals with disabilities, and underserved communities.',
    color: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    link: '/programmes#annadaan',
  },
  {
    icon: '🤝',
    title: 'Mentorship (MentorLink)',
    desc: 'Connecting scholars with industry mentors for career guidance, soft skills, and professional development.',
    color: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
    link: '/login',
  },
];

function StatCard({ value, suffix, label, prefix, start }) {
  const isDecimal = !Number.isInteger(value);
  const intVal = isDecimal ? Math.floor(value) : value;
  const count = useCounter(intVal, 2200, start);
  return (
    <div className="text-center">
      <p className="text-4xl lg:text-5xl font-bold text-amber-400" style={{fontFamily:'Fraunces,serif'}}>
        {prefix}{isDecimal ? `${count}.5` : count}{suffix}
      </p>
      <p className="text-indigo-200 text-sm mt-2 font-medium">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{paddingTop:'72px'}}>
        <div className="absolute inset-0">
          <img
            src="https://muditaalliance.org/wp-content/uploads/2025/02/Mudita-Img-02.webp"
            alt="Mudita students"
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display='none'; }}
          />
          <div className="absolute inset-0" style={{background:'linear-gradient(135deg,rgba(30,27,75,0.88) 0%,rgba(55,48,163,0.7) 50%,rgba(30,27,75,0.5) 100%)'}}/>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold text-amber-300 mb-6 border border-white/20">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/>
              Mudita – An Alliance for Giving
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={{fontFamily:'Fraunces,serif'}}>
              Doing Good<br/>
              <span style={{color:'#f59e0b'}}>Feels Good.</span>
            </h1>
            <p className="text-lg text-indigo-200 leading-relaxed mb-8 max-w-xl">
              College Scholarships · Medical Treatment · Annadaan · Mentorship.
              Together we unlock the potential of every deserving individual.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/get-involved#donate" className="btn-amber">Donate Now</Link>
              <Link to="/programmes" className="btn-outline" style={{borderColor:'white',color:'white'}}>
                Our Programmes
              </Link>
              <Link to="/login" className="btn-indigo">MentorLink Portal</Link>
            </div>
          </div>

          {/* Hero stat preview */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { n:'350+', l:'Scholarships Granted', icon:'🎓', bg:'bg-white/10' },
              { n:'₹2 Cr+', l:'Value of Scholarships', icon:'💰', bg:'bg-amber-500/20' },
              { n:'7,000+', l:'Eye Screenings Done', icon:'👁️', bg:'bg-white/10' },
              { n:'14.5L+', l:'Meals Supported', icon:'🍱', bg:'bg-indigo-500/20' },
            ].map(s => (
              <div key={s.l} className={`${s.bg} backdrop-blur-sm rounded-2xl p-5 border border-white/20 text-white`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-2xl font-bold text-amber-300" style={{fontFamily:'Fraunces,serif'}}>{s.n}</p>
                <p className="text-xs text-indigo-200 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-xs font-medium">Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* ─── IMPACT STATS ─── */}
      <section ref={statsRef} style={{background:'linear-gradient(135deg,#1e1b4b 0%,#3730a3 100%)'}} className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-amber-400 font-semibold text-sm uppercase tracking-widest mb-2">The Mudita Impact</p>
          <h2 className="text-center text-white text-3xl font-bold mb-12" style={{fontFamily:'Fraunces,serif'}}>
            Numbers that speak for themselves
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(s => <StatCard key={s.label} {...s} start={statsVisible}/>)}
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─── */}
      <section className="section max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">Our Story</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight" style={{fontFamily:'Fraunces,serif'}}>
              From a shared dream to a name synonymous with spreading joy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Mudita, we believe that the world runs on joy. Our vision to enable individuals,
              enhance potential and thereby empower communities is based on the very belief that
              there is no greater joy than contributing to the joy of another.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Founded in December 2016 by two passionate women — Ripple Mirchandani and
              Katyayani Balasubramanian — Mudita has grown from a small trust into a movement
              that touches hundreds of lives every year.
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="btn-indigo">Our Full Story</Link>
              <Link to="/get-involved" className="btn-outline">Get Involved</Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://muditaalliance.org/wp-content/uploads/2025/02/About-Us-Mudita.webp"
              alt="Mudita team"
              className="w-full rounded-3xl shadow-2xl object-cover"
              style={{height:'460px'}}
              onError={e => {
                e.target.src='https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80';
              }}
            />
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-amber-500 text-white rounded-2xl p-5 shadow-xl">
              <p className="text-3xl font-bold" style={{fontFamily:'Fraunces,serif'}}>2016</p>
              <p className="text-xs font-semibold text-amber-100">Founded</p>
            </div>
            <div className="absolute -top-4 -right-4 bg-indigo-700 text-white rounded-2xl p-4 shadow-xl">
              <p className="text-2xl font-bold" style={{fontFamily:'Fraunces,serif'}}>350+</p>
              <p className="text-xs font-semibold text-indigo-200">Scholars</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROGRAMMES ─── */}
      <section className="section bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">What We Do</p>
            <h2 className="text-4xl font-bold text-gray-900" style={{fontFamily:'Fraunces,serif'}}>Our Programmes</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Four pillars of impact — education, healthcare, nutrition, and mentorship.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROGRAMS.map(p => (
              <Link key={p.title} to={p.link}
                className={`block border rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 ${p.color}`}>
                <div className={`w-14 h-14 ${p.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                  {p.icon}
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
                <p className="text-indigo-600 font-semibold text-xs mt-4">Learn more →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MENTORLINK FEATURE ─── */}
      <section className="section max-w-7xl mx-auto px-6">
        <div className="rounded-3xl overflow-hidden" style={{background:'linear-gradient(135deg,#1e1b4b 0%,#3730a3 100%)'}}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-10 lg:p-14 text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-amber-300 text-sm font-bold mb-6 border border-white/20">
                🔗 NEW · MentorLink Platform
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-5" style={{fontFamily:'Fraunces,serif'}}>
                Structured Mentorship<br/>
                <span style={{color:'#f59e0b'}}>for Every Scholar</span>
              </h2>
              <p className="text-indigo-200 leading-relaxed mb-8 text-base">
                MentorLink connects our scholarship students with volunteer professionals from
                partner companies. Through structured sessions, learning modules, and our
                smart matching algorithm, every student gets a mentor who truly understands
                their needs.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon:'🤖', label:'Auto Matching Algorithm' },
                  { icon:'📅', label:'Session Scheduling' },
                  { icon:'📚', label:'Learning Modules' },
                  { icon:'📊', label:'Progress Tracking' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                    <span className="text-xl">{f.icon}</span>
                    <span className="text-sm font-semibold text-indigo-200">{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Link to="/login" className="btn-amber">Login to MentorLink</Link>
                <Link to="/register" className="btn-outline" style={{borderColor:'white',color:'white'}}>Become a Mentor</Link>
              </div>
            </div>
            <div className="relative hidden lg:flex items-end justify-center p-8">
              <img
                src="https://muditaalliance.org/wp-content/uploads/2025/02/OurProgrammes-mudita.webp"
                alt="mentorship"
                className="rounded-2xl object-cover w-full shadow-2xl"
                style={{maxHeight:'420px'}}
                onError={e=>{e.target.src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80';}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="section bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">What They Say</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-12" style={{fontFamily:'Fraunces,serif'}}>Voices of Mudita</h2>

          <div className="relative bg-white rounded-3xl shadow-lg p-8 lg:p-12 min-h-52 flex flex-col justify-center">
            <div className="text-5xl text-amber-200 mb-4" style={{fontFamily:'Georgia,serif'}}>"</div>
            <p className="text-xl text-gray-700 leading-relaxed mb-6 italic" style={{fontFamily:'Fraunces,serif'}}>
              {TESTIMONIALS[activeTestimonial].quote}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-sm">
                {TESTIMONIALS[activeTestimonial].avatar}
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">{TESTIMONIALS[activeTestimonial].name}</p>
                <p className="text-sm text-gray-500">{TESTIMONIALS[activeTestimonial].role}</p>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)}
                className={`rounded-full transition-all ${i === activeTestimonial ? 'w-8 h-2.5 bg-indigo-700' : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'}`}/>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section-sm px-6" style={{background:'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)'}}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{fontFamily:'Fraunces,serif'}}>
            With as little as ₹500, you can feel the joy of making a difference.
          </h2>
          <p className="text-amber-100 mb-8 text-lg">
            All donations are tax deductible under Section 80(G) of the Income Tax Act, 1961.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-involved#donate"
              className="bg-white text-amber-600 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition shadow-lg text-sm">
              Donate Today
            </Link>
            <Link to="/get-involved#volunteer"
              className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition text-sm">
              Volunteer with Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
