import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      {/* Main footer */}
      <div style={{background:'#1e1b4b'}} className="text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Logo + description */}
          <div className="flex flex-col lg:flex-row gap-12 mb-12">
            <div className="lg:w-80 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="https://muditaalliance.org/wp-content/uploads/2025/02/Mudita-Footer-logo.webp"
                  alt="Mudita"
                  className="h-14 object-contain"
                  onError={e => { e.target.src = 'https://ui-avatars.com/api/?name=Mudita&background=3730a3&color=fff&size=56'; }}
                />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Mudita – An Alliance for Giving. We collaborate to enable individuals,
                enhance their potential, and empower communities towards a sustainable future.
              </p>
              <div className="flex gap-4 mt-5">
                {[
                  { name:'Facebook', url:'https://www.facebook.com/share/14qj1CX9hM/', icon:'f' },
                  { name:'Instagram', url:'https://www.instagram.com/mudita_ngo', icon:'in' },
                  { name:'YouTube', url:'https://www.youtube.com/@mudita-anallianceforgiving5388', icon:'▶' },
                ].map(s => (
                  <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
                    className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-xs text-gray-400 hover:text-white hover:border-amber-400 transition">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">About Us</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Our Story', to: '/' },
                    { label: 'About Us', to: '/about' },
                    { label: 'Our Team', to: '/about#team' },
                    { label: 'Our Work', to: '/about#work' },
                  ].map(l => (
                    <li key={l.label}><Link to={l.to} className="text-gray-400 hover:text-white text-sm transition">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">Programmes</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'College Scholarships', to: '/programmes#scholarships' },
                    { label: 'Medical Support', to: '/programmes#medical' },
                    { label: 'Annadaan', to: '/programmes#annadaan' },
                    { label: 'Mentorship', to: '/login' },
                  ].map(l => (
                    <li key={l.label}><Link to={l.to} className="text-gray-400 hover:text-white text-sm transition">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">Get Involved</h4>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Donate', to: '/get-involved#donate' },
                    { label: 'Volunteer', to: '/get-involved#volunteer' },
                    { label: 'Apply for Scholarship', to: '/get-involved#apply' },
                    { label: 'Become a Mentor', to: '/register' },
                  ].map(l => (
                    <li key={l.label}><Link to={l.to} className="text-gray-400 hover:text-white text-sm transition">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-amber-400 font-bold text-sm uppercase tracking-wider mb-4">Contact</h4>
                <ul className="space-y-2.5 text-sm text-gray-400">
                  <li><a href="mailto:mudita@muditaalliance.org" className="hover:text-white transition">mudita@muditaalliance.org</a></li>
                  <li><a href="mailto:mentoring@muditaalliance.org" className="hover:text-white transition">mentoring@muditaalliance.org</a></li>
                  <li><a href="tel:+919766172334" className="hover:text-white transition">+91 97661 72334</a></li>
                  <li className="text-gray-500 text-xs leading-relaxed pt-1">
                    K-901 Marvel Diva, Magarpatta City,<br/>Hadapsar, Pune 411028
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© 2025 Mudita – An Alliance for Giving. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-300 text-xs transition">Terms of Use</Link>
              <span className="text-gray-600 text-xs">Designed by Jaykumar Kale</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
