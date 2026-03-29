import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

const STEPS = [
  {
    n: "1",
    title: "Document Check",
    desc: "Aadhar card, income certificate, marks sheet, college prospectus/fee challan, and parental death certificate if applicable. We pride ourselves on transparency and ease of process.",
  },
  {
    n: "2",
    title: "Interview",
    desc: "Candidates go through a qualifying and final round of interviews to assess academic capability and the student's drive to keep shining.",
  },
  {
    n: "3",
    title: "Disbursement",
    desc: "Once approved, funds are paid directly into the college account. No exceptions. Complete transparency.",
  },
  {
    n: "4",
    title: "After Programme",
    desc: "We engage students through online talk-series on life skills, financial literacy, communication, body language, and workshops with CSR donors and domain experts.",
  },
];

export default function ProgrammesPage() {
  return (
    <div className="bg-white">
      <Navbar />
      <div style={{ paddingTop: "72px" }}>
        {/* Hero */}
        <div
          className="relative"
          style={{
            background: "linear-gradient(135deg,#1e1b4b 0%,#3730a3 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-20 text-center text-white">
            <p className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-3">
              What We Do
            </p>
            <h1
              className="text-5xl font-bold mb-5"
              style={{ fontFamily: "Fraunces,serif" }}
            >
              Our Programmes
            </h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Three pillars of impact — Education, Healthcare, Nutrition — and
              now, Mentorship.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <a href="#scholarships" className="btn-amber">
                Scholarships
              </a>
              <a
                href="#medical"
                className="btn-outline"
                style={{ borderColor: "white", color: "white" }}
              >
                Medical Support
              </a>
              <a
                href="#annadaan"
                className="btn-outline"
                style={{ borderColor: "rgba(255,255,255,0.5)", color: "white" }}
              >
                Annadaan
              </a>
            </div>
          </div>
        </div>

        {/* ─── SCHOLARSHIP ─── */}
        <section id="scholarships" className="section max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-indigo-100 text-indigo-700 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                Education
              </div>
              <h2
                className="text-4xl font-bold text-gray-900 mb-5"
                style={{ fontFamily: "Fraunces,serif" }}
              >
                Mudita College Scholarship
              </h2>
              <p
                className="text-xl text-gray-500 italic mb-5"
                style={{ fontFamily: "Fraunces,serif" }}
              >
                "Imagine what we can do as a nation when we unlock the potential
                of over a billion people?"
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                The Mudita College Scholarship programme was created with the
                strong belief in the transformative power of education to change
                lives and communities. Through a painstakingly careful selection
                process, we identify students with genuine potential and a real
                thirst for creating impact.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                In March 2022, we supported 20 students. By March 2024, that
                number had risen to
                <strong> 350</strong>, and growing ever faster. Each student is
                in a STEM field, studying in Maharashtra.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/get-involved#apply" className="btn-indigo">
                  Apply for Scholarship
                </Link>
                <Link to="/get-involved#donate" className="btn-outline">
                  Support a Student
                </Link>
              </div>
            </div>
            <div>
              <img
                src="https://muditaalliance.org/wp-content/uploads/2025/02/OurProgrammes-mudita-02.webp"
                alt="Scholarship programme"
                className="w-full rounded-3xl shadow-xl object-cover"
                style={{ height: "420px" }}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80";
                }}
              />
            </div>
          </div>

          {/* Scholarship Process */}
          <div className="mt-16">
            <h3
              className="text-2xl font-bold text-gray-900 text-center mb-10"
              style={{ fontFamily: "Fraunces,serif" }}
            >
              Our Scholarship Process
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100"
                >
                  <div className="w-10 h-10 bg-indigo-700 text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">
                    {s.n}
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">{s.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── MEDICAL ─── */}
        <section id="medical" className="section bg-rose-50 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <img
                  src="https://muditaalliance.org/wp-content/uploads/2025/02/OurProgrammes-mudita-03.webp"
                  alt="Medical support"
                  className="w-full rounded-3xl shadow-xl object-cover"
                  style={{ height: "420px" }}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80";
                  }}
                />
              </div>
              <div>
                <div className="inline-block bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                  Healthcare
                </div>
                <h2
                  className="text-4xl font-bold text-gray-900 mb-5"
                  style={{ fontFamily: "Fraunces,serif" }}
                >
                  Mudita Medical Support Programme
                </h2>
                <p
                  className="text-xl text-gray-500 italic mb-5"
                  style={{ fontFamily: "Fraunces,serif" }}
                >
                  "It's hard to even imagine the pure joy of getting your
                  failing eyesight back."
                </p>
                <div className="space-y-5 text-gray-600 text-sm leading-relaxed">
                  <div className="bg-white rounded-xl p-5 border border-rose-100">
                    <h4 className="font-bold text-gray-800 mb-2">
                      Cancer Treatment Support
                    </h4>
                    <p>
                      Support extended to adults with young dependents (≤10
                      years old) and paediatric patients. Cases reviewed by our
                      consulting panel of doctors. We cover treatment and
                      diagnostic test costs.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-rose-100">
                    <h4 className="font-bold text-gray-800 mb-2">
                      Eye Care Support
                    </h4>
                    <p>
                      Eye camps at school level — over 7,000 students screened
                      in Pune. Free prescriptive glasses for those who need
                      them. Cataract screening for the elderly with subsidised
                      surgery costs.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Link to="/get-involved#donate" className="btn-indigo">
                    Help a Patient
                  </Link>
                  <a
                    href="https://muditaalliance.org/wp-content/uploads/2025/03/Application-form-for-the-LKT-medical-aid.docx.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline"
                  >
                    Apply for Medical Aid
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
{/* Icons = 🩺, 👁️ */}
        {/* ─── ANNADAAN ─── */}
        <section id="annadaan" className="section max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-amber-100 text-amber-700 font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                Nutrition
              </div>
              <h2
                className="text-4xl font-bold text-gray-900 mb-5"
                style={{ fontFamily: "Fraunces,serif" }}
              >
                Mudita Annadaan Programme
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                A monthly food distribution programme sending dry rations to
                ensure a balanced nutritional diet for under-reached communities
                in Pune. We focus on serving senior citizens and residential
                centres housing individuals with physical or mental challenges.
              </p>
              <div className="space-y-3 text-sm text-gray-600 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  <span>
                    Partnering with SCHOOL's Vriddha Mitra Programme for urban
                    slum senior citizens
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  <span>
                    Supporting Asha Gram, Satara and Dnyangangotri Residential
                    School for Mentally Disabled
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5">✓</span>
                  <span>
                    Laughter clubs, physiotherapy, and movement sessions for
                    senior communities since 2024
                  </span>
                </div>
              </div>
              <Link to="/get-involved#donate" className="btn-amber">
                Feed Those in Need
              </Link>
            </div>
            <div className="space-y-4">
              <img
                src="https://muditaalliance.org/wp-content/uploads/2025/02/OurProgrammes-mudita-04.webp"
                alt="Annadaan"
                className="w-full rounded-3xl shadow-xl object-cover"
                style={{ height: "260px" }}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80";
                }}
              />
              <img
                src="https://muditaalliance.org/wp-content/uploads/2025/02/OurProgrammes-mudita-05.webp"
                alt="Annadaan"
                className="w-full rounded-3xl shadow-xl object-cover"
                style={{ height: "160px" }}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80";
                }}
              />
            </div>
          </div>
        </section>

        {/* ─── MENTORLINK ─── */}
        <section
          className="section-sm px-6"
          style={{ background: "linear-gradient(135deg,#1e1b4b,#3730a3)" }}
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-amber-300 text-sm font-bold mb-5 border border-white/20">
              NEW · Mentor-Link Platform
            </div>
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "Fraunces,serif" }}
            >
              Now adding Mentorship to our toolkit
            </h2>
            <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
              MentorLink connects our scholarship students with industry
              professionals for structured, measurable mentoring — from career
              development to communication skills.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="btn-amber">
                Access MentorLink
              </Link>
              <Link
                to="/register"
                className="btn-outline"
                style={{ borderColor: "white", color: "white" }}
              >
                Become a Mentor
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
