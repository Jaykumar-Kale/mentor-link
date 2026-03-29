import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../utils/api";
import toast from "react-hot-toast";

const RATING_QUESTIONS = [
  {
    key: "careerDevelopment",
    label:
      "Career development: Your ability to set short & long term career goals and effective techniques to achieve them",
  },
  {
    key: "interpersonalSkills",
    label:
      "Interpersonal skills: Comfort in interacting and dealing with people of different types and perspectives",
  },
  {
    key: "communicationSkills",
    label:
      "Communication Skills: Making effective communication (verbal, non-verbal) with anyone",
  },
  {
    key: "etiquette",
    label:
      "Etiquette: Appropriately behave and conduct oneself in a formal setting",
  },
  {
    key: "problemSolving",
    label:
      "Problem Solving and Decision Making: Your ability to solve any problems and make effective decisions",
  },
  {
    key: "timeManagement",
    label:
      "Time and Stress Management: Your ability to effectively manage stress and time",
  },
];

const EMOJIS = ["", "😠", "😕", "😐", "😊", "😄"];
const EMOJI_LABELS = [
  "",
  "1:bad",
  "2:better",
  "3:good",
  "4:Very good",
  "5:Excellent",
];

export default function NeedAnalysis() {
  const [submitted, setSubmitted] = useState(false);
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    expectations: "",
    ratings: {
      careerDevelopment: 0,
      interpersonalSkills: 0,
      communicationSkills: 0,
      etiquette: 0,
      problemSolving: 0,
      timeManagement: 0,
    },
    willMentorshipHelp: "",
    specificNeeds: "",
    willingToContact: "",
    preferredLanguage: [],
  });

  useEffect(() => {
    api
      .get("/need-analysis/me")
      .then((r) => {
        if (r.data.submitted) {
          setSubmitted(true);
          setExisting(r.data.form);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const setRating = (key, val) =>
    setForm((f) => ({ ...f, ratings: { ...f.ratings, [key]: val } }));

  const toggleLang = (lang) => {
    const arr = form.preferredLanguage;
    setForm((f) => ({
      ...f,
      preferredLanguage: arr.includes(lang)
        ? arr.filter((l) => l !== lang)
        : [...arr, lang],
    }));
  };

  const wordCount = (str) => str.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = RATING_QUESTIONS.find((q) => !form.ratings[q.key]);
    if (missing) {
      toast.error("Please rate all 6 areas");
      return;
    }
    if (!form.expectations) {
      toast.error("Please fill in your expectations");
      return;
    }
    setSaving(true);
    try {
      await api.post("/need-analysis", form);
      toast.success("Need analysis submitted successfully!");
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-gray-400">⏳ Loading...</div>
      </DashboardLayout>
    );

  if (submitted && existing) {
    return (
      <DashboardLayout>
        <div className="page-header">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "Poppins,sans-serif" }}
          >
            Need Analysis Form
          </h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-3">
            <span className="text-3xl">✅</span>
            <div>
              <p className="font-bold text-green-800">Form already submitted</p>
              <p className="text-sm text-green-700 mt-0.5">
                Submitted on{" "}
                {new Date(existing.submittedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                Your Expectations
              </p>
              <p className="text-gray-700">{existing.expectations}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                Self Ratings (1-5)
              </p>
              <div className="space-y-2">
                {RATING_QUESTIONS.map((q) => (
                  <div
                    key={q.key}
                    className="flex items-center justify-between py-2 border-b border-gray-50"
                  >
                    <p className="text-sm text-gray-600 flex-1 pr-4">
                      {q.label}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-xl">
                        {EMOJIS[existing.ratings[q.key] || 0]}
                      </span>
                      <span className="font-bold text-indigo-700 w-4 text-center">
                        {existing.ratings[q.key]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {existing.specificNeeds && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Specific Learning Needs
                </p>
                <p className="text-gray-700">{existing.specificNeeds}</p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "Poppins,sans-serif" }}
        >
          Need Analysis Form
        </h1>
        <p className="mt-2 max-w-2xl mx-auto text-sm">
          This is a Mandatory Need Analysis form that will help your Mentor
          better understand your needs and plan your Mentoring sessions
          accordingly
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Rating scale legend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <p className="font-semibold text-gray-700 mb-3 text-center">
            Please rate yourself between 1-5 for each question
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="text-center">
                <div className="text-3xl">{EMOJIS[n]}</div>
                <p className="text-xs text-gray-500 mt-1">{EMOJI_LABELS[n]}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Q1 Expectations */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <label className="block font-semibold text-gray-800 mb-2">
              1. What are your expectations from the Mentorship program?{" "}
              <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Please keep the word limit to 50
            </p>
            <textarea
              value={form.expectations}
              onChange={(e) =>
                setForm({ ...form, expectations: e.target.value })
              }
              rows={4}
              placeholder="Write your expectations here..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <p
              className={`text-xs mt-1 text-right ${wordCount(form.expectations) > 50 ? "text-red-500" : "text-gray-400"}`}
            >
              {wordCount(form.expectations)}/50 words
            </p>
          </div>

          {/* Q2 Ratings */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="font-semibold text-gray-800 mb-4">
              2. Please rate your understanding & knowledge of the following
              topics on a scale of 1-5 <span className="text-red-500">*</span>
            </p>
            <div className="space-y-5">
              {RATING_QUESTIONS.map((q) => (
                <div key={q.key}>
                  <p className="text-sm text-gray-700 mb-2">{q.label}</p>
                  <div className="flex gap-3 flex-wrap">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setRating(q.key, n)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition min-w-14 ${
                          form.ratings[q.key] === n
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-100 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl">{EMOJIS[n]}</span>
                        <span className="text-xs font-semibold text-gray-600">
                          {n}
                        </span>
                      </button>
                    ))}
                  </div>
                  {form.ratings[q.key] > 0 && (
                    <p className="text-xs text-indigo-600 mt-1">
                      Selected: {EMOJI_LABELS[form.ratings[q.key]]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Q3 Will mentorship help */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <label className="block font-semibold text-gray-800 mb-3">
              3. Do you think the Mentorship program will help you build upon
              your soft skills? <span className="text-red-500">*</span>
            </label>
            <select
              value={form.willMentorshipHelp}
              onChange={(e) =>
                setForm({ ...form, willMentorshipHelp: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select a value</option>
              <option value="Definitely Yes">Definitely Yes</option>
              <option value="Yes">Yes</option>
              <option value="Maybe">Maybe</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </div>

          {/* Q4 Specific needs */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <label className="block font-semibold text-gray-800 mb-2">
              4. Mention any specific learning need where you seek Mentor's
              support <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Please keep the word limit to 50
            </p>
            <textarea
              value={form.specificNeeds}
              onChange={(e) =>
                setForm({ ...form, specificNeeds: e.target.value })
              }
              rows={3}
              placeholder="Any specific area where you need guidance..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <p
              className={`text-xs mt-1 text-right ${wordCount(form.specificNeeds) > 50 ? "text-red-500" : "text-gray-400"}`}
            >
              {wordCount(form.specificNeeds)}/50 words
            </p>
          </div>

          {/* Q5 Preferred language */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <label className="block font-semibold text-gray-800 mb-3">
              5. Preferred language for sessions
            </label>
            <div className="flex flex-wrap gap-3">
              {["English", "Marathi", "Hindi", "Others"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLang(lang)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition ${
                    form.preferredLanguage.includes(lang)
                      ? "bg-indigo-700 text-white border-indigo-700"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Q6 Willing to contact */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <label className="block font-semibold text-gray-800 mb-3">
              6. Are you willing to initiate and maintain contact with your
              Mentor, at least 2 times a month?{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={form.willingToContact}
              onChange={(e) =>
                setForm({ ...form, willingToContact: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select a value</option>
              <option value="Yes, definitely">Yes, definitely</option>
              <option value="Yes">Yes</option>
              <option value="I will try">I will try</option>
              <option value="Not sure">Not sure</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-4 rounded-xl transition disabled:opacity-60 text-base"
          >
            {saving ? "Submitting..." : "Submit Need Analysis Form"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
