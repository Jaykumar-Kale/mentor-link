import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const DONATE_AMOUNTS = ['500','1000','2500','5000','10000'];

export default function GetInvolvedPage() {
  const [donateAmt, setDonateAmt] = useState('');
  const [customAmt, setCustomAmt] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [contactForm, setContactForm] = useState({ name:'',email:'',phone:'',message:'' });
  const [sending, setSending] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState({ name:'',email:'',phone:'',occupation:'',qualification:'',message:'' });
  const [volunteerSent, setVolunteerSent] = useState(false);

  const handleDonate = e => {
    e.preventDefault();
    const amount = customAmt || donateAmt;
    if (!amount) { toast.error('Please select or enter an amount'); return; }
    setShowQR(true);
  };

  const handleContact = async e => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you soon.');
    setContactForm({ name:'',email:'',phone:'',message:'' });
    setSending(false);
  };

  const handleVolunteer = async e => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setVolunteerSent(true);
    toast.success('Thank you for volunteering! We will reach out soon.');
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div style={{paddingTop:'72px'}}>
        {/* Hero */}
        <div className="relative" style={{background:'linear-gradient(135deg,#1e1b4b 0%,#3730a3 100%)'}}>
          <img
            src="https://muditaalliance.org/wp-content/uploads/2025/02/Get-Involved.jpg"
            alt="Get Involved"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative max-w-7xl mx-auto px-6 py-20 text-center text-white">
            <p className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-3">Join Us</p>
            <h1 className="text-5xl font-bold mb-5" style={{fontFamily:'Fraunces,serif'}}>Get Involved</h1>
            <p className="text-indigo-200 text-lg max-w-2xl mx-auto">
              Help Mudita help others. Whether you donate, volunteer, or mentor — every action creates ripples of joy.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <a href="#donate" className="btn-amber">Donate Now</a>
              <a href="#volunteer" className="btn-outline" style={{borderColor:'white',color:'white'}}>Volunteer</a>
              <a href="#apply" className="btn-outline" style={{borderColor:'rgba(255,255,255,0.5)',color:'white'}}>Apply for Aid</a>
            </div>
          </div>
        </div>

        {/* ─── DONATE ─── */}
        <section id="donate" className="section max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">Support Us</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5" style={{fontFamily:'Fraunces,serif'}}>
                Make a Donation
              </h2>
              <p className="text-gray-600 mb-3">
                When you help Mudita help those in need, you join thousands who have discovered that doing good feels good.
              </p>
              <p className="text-gray-600 mb-8 text-sm">
                All donations are <strong>tax deductible under Section 80(G)</strong> of the Income Tax Act, 1961.
              </p>

              {!showQR ? (
                <form onSubmit={handleDonate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount (₹)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {DONATE_AMOUNTS.map(a => (
                        <button key={a} type="button" onClick={() => { setDonateAmt(a); setCustomAmt(''); }}
                          className={`py-3 rounded-xl font-bold text-sm border-2 transition ${
                            donateAmt === a && !customAmt
                              ? 'border-indigo-700 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                          }`}>
                          ₹{Number(a).toLocaleString()}
                        </button>
                      ))}
                      <input
                        type="number"
                        placeholder="Custom amount"
                        value={customAmt}
                        onChange={e => { setCustomAmt(e.target.value); setDonateAmt(''); }}
                        className="form-input col-span-3"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-amber w-full text-center py-4 text-base">
                    Donate ₹{(customAmt || donateAmt) ? Number(customAmt || donateAmt).toLocaleString() : '—'}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    After clicking, you'll be shown UPI/bank details for transfer.
                  </p>
                </form>
              ) : (
                <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-200 text-center">
                  <h3 className="font-bold text-indigo-800 text-xl mb-2">Thank you! 🙏</h3>
                  <p className="text-gray-600 text-sm mb-5">Please transfer ₹{Number(customAmt||donateAmt).toLocaleString()} via:</p>
                  <div className="bg-white rounded-xl p-5 border border-gray-200 text-left space-y-2 text-sm mb-5">
                    <p><span className="font-semibold text-gray-700">UPI ID:</span> mudita@muditaalliance.org</p>
                    <p><span className="font-semibold text-gray-700">Bank:</span> HDFC Bank</p>
                    <p><span className="font-semibold text-gray-700">Account Name:</span> Mudita Alliance For Giving</p>
                    <p><span className="font-semibold text-gray-700">Contact:</span> +91 97661 72334</p>
                  </div>
                  <button onClick={() => setShowQR(false)} className="text-sm text-indigo-600 hover:underline">← Change amount</button>
                </div>
              )}
            </div>

            {/* Why donate */}
            <div className="space-y-5">
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-indigo-800 mb-3">With ₹500, you can...</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><span className="text-amber-500">🎓</span>Contribute to a student's monthly scholarship</li>
                  <li className="flex items-center gap-2"><span className="text-amber-500">👁️</span>Fund an eye screening for a child</li>
                  <li className="flex items-center gap-2"><span className="text-amber-500">🍱</span>Provide rations for a senior citizen for a week</li>
                </ul>
              </div>
              <div className="card">
                <h3 className="font-bold text-gray-800 mb-3">Your impact is transparent</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  At Mudita, we believe in complete transparency. Every rupee donated is tracked and
                  reported. Our monthly newsletter keeps every donor informed about exactly how
                  their contribution is changing lives.
                </p>
              </div>
              <div className="card">
                <h3 className="font-bold text-gray-800 mb-2">Tax Benefits</h3>
                <p className="text-gray-500 text-sm">
                  Mudita holds CSR-1 certification. All donations are 80(G) tax deductible.
                  Receipts provided within 7 working days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── VOLUNTEER ─── */}
        <section id="volunteer" className="section bg-gray-50 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">Help Us Help Others</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{fontFamily:'Fraunces,serif'}}>Volunteer with Us</h2>
              <p className="text-gray-500">Doing good is hard work. We're always looking for a helping hand.</p>
            </div>
            {!volunteerSent ? (
              <form onSubmit={handleVolunteer} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name *</label>
                    <input required className="form-input" value={volunteerForm.name}
                      onChange={e=>setVolunteerForm({...volunteerForm,name:e.target.value})} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
                    <input type="email" required className="form-input" value={volunteerForm.email}
                      onChange={e=>setVolunteerForm({...volunteerForm,email:e.target.value})} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                    <input className="form-input" value={volunteerForm.phone}
                      onChange={e=>setVolunteerForm({...volunteerForm,phone:e.target.value})} placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Current Occupation</label>
                    <select className="form-input" value={volunteerForm.occupation}
                      onChange={e=>setVolunteerForm({...volunteerForm,occupation:e.target.value})}>
                      <option value="">Select</option>
                      <option>Student</option><option>Employed</option><option>Homemaker</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Highest Qualification</label>
                    <select className="form-input" value={volunteerForm.qualification}
                      onChange={e=>setVolunteerForm({...volunteerForm,qualification:e.target.value})}>
                      <option value="">Select</option>
                      <option>School student</option><option>College student</option><option>Graduate</option><option>Post Graduate</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">How would you like to help?</label>
                    <textarea className="form-input" rows={3} value={volunteerForm.message}
                      onChange={e=>setVolunteerForm({...volunteerForm,message:e.target.value})}
                      placeholder="Tell us your skills and how you'd like to contribute..." />
                  </div>
                </div>
                <button type="submit" className="btn-indigo w-full text-center py-3">Submit Volunteer Application</button>
              </form>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-12 text-center">
                <div className="text-5xl mb-4">🙏</div>
                <h3 className="font-bold text-green-800 text-xl mb-2">Thank you for volunteering!</h3>
                <p className="text-green-700">We'll reach out to you at {volunteerForm.email} within a few days.</p>
              </div>
            )}

            {/* Mentor CTA */}
            <div className="mt-8 bg-indigo-700 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div>
                <h3 className="font-bold text-lg">Want to mentor a Mudita scholar?</h3>
                <p className="text-indigo-200 text-sm mt-1">Join MentorLink as a volunteer mentor and guide a student's career.</p>
              </div>
              <Link to="/register" className="btn-amber flex-shrink-0">Become a Mentor</Link>
            </div>
          </div>
        </section>

        {/* ─── APPLY FOR AID ─── */}
        <section id="apply" className="section max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">Need Help?</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{fontFamily:'Fraunces,serif'}}>Apply for Support</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              We pride ourselves on our ability to bring together those who need help and those who can.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="card text-center hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Apply for Scholarship</h3>
              <p className="text-gray-500 text-sm mb-5">Bright students from underserved backgrounds studying STEM in Maharashtra.</p>
              <a href="mailto:scholarships@muditaalliance.org" className="btn-indigo text-sm">Apply via Email</a>
            </div>
            <div className="card text-center hover:shadow-lg transition cursor-pointer">
              <div className="text-4xl mb-3">🏥</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">Apply for Medical Aid</h3>
              <p className="text-gray-500 text-sm mb-5">Cancer treatment support and eye care for underprivileged patients.</p>
              <a href="https://muditaalliance.org/wp-content/uploads/2025/03/Application-form-for-the-LKT-medical-aid.docx.pdf"
                target="_blank" rel="noreferrer" className="btn-outline text-sm">Download Form</a>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" className="section bg-gray-50 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-3">Reach Out</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{fontFamily:'Fraunces,serif'}}>Let's Talk</h2>
              <p className="text-gray-500">If you need help, or can help — reach out to us here.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">General Enquiries</p>
                  <a href="mailto:mudita@muditaalliance.org" className="font-semibold text-indigo-700 hover:underline">mudita@muditaalliance.org</a>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Mentoring Programme</p>
                  <a href="mailto:mentoring@muditaalliance.org" className="font-semibold text-indigo-700 hover:underline">mentoring@muditaalliance.org</a>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">CSR & Donor Relations</p>
                  <a href="mailto:csr@muditaalliance.org" className="font-semibold text-indigo-700 hover:underline">csr@muditaalliance.org</a>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <a href="tel:+919766172334" className="font-semibold text-indigo-700">+91 97661 72334</a>
                </div>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Office Address</p>
                  <p className="text-sm text-gray-700">K-901 Marvel Diva, Next to Seasons Mall,<br/>Magarpatta City, Hadapsar, Pune 411028</p>
                </div>
              </div>
              <form onSubmit={handleContact} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Name *</label>
                  <input required className="form-input" value={contactForm.name}
                    onChange={e=>setContactForm({...contactForm,name:e.target.value})} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Email *</label>
                  <input type="email" required className="form-input" value={contactForm.email}
                    onChange={e=>setContactForm({...contactForm,email:e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                  <input className="form-input" value={contactForm.phone}
                    onChange={e=>setContactForm({...contactForm,phone:e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Message *</label>
                  <textarea required rows={4} className="form-input" value={contactForm.message}
                    onChange={e=>setContactForm({...contactForm,message:e.target.value})}
                    placeholder="How can we help you?" />
                </div>
                <button type="submit" disabled={sending} className="btn-indigo w-full text-center py-3 disabled:opacity-60">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
