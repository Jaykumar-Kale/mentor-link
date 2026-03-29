import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const TEAM = [
  {
    name: "Ripple Mirchandani",
    role: "Founder Trustee",
    img: "https://muditaalliance.org/wp-content/uploads/2025/03/Katyayani-Balasubramanian-02.jpg",
    bio: "An experienced Chartered Accountant by profession with a passion for strategy, risk management, and governance. She brought her experience from PwC Pune to WNS Global Services and now to Mudita — the project that makes her truly feel she has found her calling.",
  },
  {
    name: "Katyayani Balasubramanian",
    role: "Founder Trustee",
    img: "https://muditaalliance.org/wp-content/uploads/2025/02/Katyayani-Balasubramanian.webp",
    bio: "A Market Research professional who found her calling in the pursuit of the happiness of giving. From public opinion polling in Washington DC to philanthropy in Pune, Katya has been key in writing the first ISB report on Indian Philanthropy.",
  },
  {
    name: "Madhav Chavan",
    role: "Programme Coordinator",
    img: "https://muditaalliance.org/wp-content/uploads/2025/02/Madhav-Chavan.webp",
    bio: "A qualified social worker with an MSW from Karve Institute of Social Sciences. Extensive experience at Safe Kids Foundation of India and iTeach, Pune. Supports all 3 programme verticals — Education, Healthcare, and Annadaan.",
  },
  {
    name: "Anjali Amolekar",
    role: "Digital Media & Communication",
    img: "https://muditaalliance.org/wp-content/uploads/2025/02/Anjali-Amolekar.webp",
    bio: "A B.Com graduate with a keen eye for detail and excellent communication skills. Anjali brings a fresh perspective to digital media efforts and teaches life skills to children through storytelling.",
  },
  {
    name: "Samir Aksekar",
    role: "Advisor",
    img: "https://muditaalliance.org/wp-content/uploads/2025/02/Samir-Aksekar.webp",
    bio: "Senior corporate leader with 20+ years in Asia Pacific, leading cybersecurity teams at JPMorgan, IBM, Tata Digital, and EQT as Director of Cybersecurity for APAC portfolio companies.",
  },
  {
    name: "Anjali Nirmal",
    role: "Accountant",
    img: "",
    bio: "Experienced accountant with 36 years of expertise ensuring complete financial transparency and accountability in all Mudita operations.",
  },
];

const TIMELINE = [
  {
    year: "2016",
    month: "December",
    event:
      "Mudita – Alliance for Giving is registered as a public charitable trust under the Bombay Public Trust Act of 1950.",
  },
  {
    year: "2017",
    month: "April",
    event:
      "First project: distributing uniforms and school shoes for students with special needs.",
  },
  {
    year: "2018",
    month: "June",
    event:
      "Support begins for first scholarship candidate Sheetal, an aspiring BSc Nursing student.",
  },
  {
    year: "2020",
    month: "March",
    event:
      "As COVID hit, Mudita-backed Annadaan adopted migrant labourer camps for 8 weeks through crowdfunding.",
  },
  {
    year: "2021",
    month: "January",
    event:
      "Supported first eye care patients. June: Sheetal graduated — a personal, collective triumph!",
  },
  {
    year: "2022",
    month: "March",
    event:
      "Hit milestone of 50 scholarship students. Signed as charity partners with Tata Mumbai Marathon.",
  },
  {
    year: "2023",
    month: "March",
    event:
      "Scholarship student rolls grew 5x to 250 students. First workshop on Power of Confidence conducted.",
  },
  {
    year: "2024",
    month: "Ongoing",
    event:
      "Scholarship count reaches 350 and growing. MentorLink platform launched for structured mentorship.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <div style={{ paddingTop: "72px" }}>
        {/* Hero */}
        <div
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#1e1b4b 0%,#3730a3 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white">
            <p className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-3">
              Who We Are
            </p>
            <h1
              className="text-5xl font-bold mb-5"
              style={{ fontFamily: "Fraunces,serif" }}
            >
              About Mudita
            </h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto leading-relaxed">
              From the shared philanthropic dream of two passionate women, to a
              name synonymous with spreading joy — this is the Mudita story.
            </p>
          </div>
          <div
            className="absolute bottom-0 left-0 right-0 h-16"
            style={{
              background: "linear-gradient(to bottom, transparent, white)",
            }}
          />
        </div>

        {/* Mission / Vision */}
        <section className="section max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://muditaalliance.org/wp-content/uploads/2025/02/About-Us-Mudita.webp"
                alt="Mudita team"
                className="w-full rounded-3xl shadow-xl object-cover"
                style={{ height: "440px" }}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80";
                }}
              />
            </div>
            <div>
              <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">
                Our Mission
              </p>
              <h2
                className="text-3xl font-bold text-gray-900 mb-5"
                style={{ fontFamily: "Fraunces,serif" }}
              >
                Doing Good Feels Good
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                At Mudita, we believe that the world runs on joy. Our vision to
                enable individuals, enhance potential and thereby empower
                communities is based on the very belief that there is no greater
                joy than contributing to the joy of another.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Joining hands with Mudita means allying with a team that
                inspires trust via complete, unhindered transparency, enabling
                you to see the exact impact you're having in the lives you've
                committed to change.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { v: "350+", l: "Scholars" },
                  { v: "₹2Cr+", l: "Scholarships" },
                  { v: "8+", l: "Years of Impact" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="text-center bg-indigo-50 rounded-2xl p-4"
                  >
                    <p
                      className="text-2xl font-bold text-indigo-700"
                      style={{ fontFamily: "Fraunces,serif" }}
                    >
                      {s.v}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey Timeline */}
        <section id="work" className="section bg-gray-50 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">
                Our Journey
              </p>
              <h2
                className="text-4xl font-bold text-gray-900"
                style={{ fontFamily: "Fraunces,serif" }}
              >
                The Mudita Story
              </h2>
            </div>
            <div className="space-y-8">
              {TIMELINE.map((t, i) => (
                <div key={i} className="timeline-item pb-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {t.year}
                      </span>
                      <span className="text-amber-500 font-semibold text-sm">
                        {t.month}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {t.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="section max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">
              The People Behind It All
            </p>
            <h2
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: "Fraunces,serif" }}
            >
              Meet Our Team
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((m) => (
              <div key={m.name} className="card text-center group">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-indigo-50 shadow-md">
                  <img
                    src={
                      m.img ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=3730a3&color=fff&size=96`
                    }
                    alt={m.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=3730a3&color=fff&size=96`;
                    }}
                  />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{m.name}</h3>
                <p className="text-amber-500 font-semibold text-sm mb-3">
                  {m.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="section-sm px-6"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#3730a3)" }}
        >
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "Fraunces,serif" }}
            >
              Join the Mudita Family
            </h2>
            <p className="text-indigo-200 mb-8">
              Whether you give, volunteer, or mentor — every contribution
              creates ripples of joy.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/get-involved" className="btn-amber">
                Get Involved
              </Link>
              <Link
                to="/programmes"
                className="btn-outline"
                style={{ borderColor: "white", color: "white" }}
              >
                Our Programmes
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
