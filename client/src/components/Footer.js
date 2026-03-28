import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="bg-indigo-800 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-amber-400 font-semibold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {['Home','About','Programs','Get Involved','Login'].map(l => (
                <li key={l}><Link to={`/${l.toLowerCase().replace(' ','-')}`} className="hover:text-white transition">{l}</Link></li>
              ))}
              <li><Link to="/privacy" className="text-amber-300 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms"   className="text-amber-300 hover:text-white transition">Terms Of Use</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-amber-400 font-semibold text-base mb-4">Enquiries</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>CSR & Donor: <a href="mailto:csr@muditaalliance.org" className="text-amber-300 hover:text-white">csr@muditaalliance.org</a></li>
              <li>Scholarship: <a href="mailto:scholarships@muditaalliance.org" className="text-amber-300 hover:text-white">scholarships@muditaalliance.org</a></li>
              <li>Mentoring: <a href="mailto:mentoring@muditaalliance.org" className="text-amber-300 hover:text-white">mentoring@muditaalliance.org</a></li>
              <li>General: <a href="mailto:mudita@muditaalliance.org" className="text-amber-300 hover:text-white">mudita@muditaalliance.org</a></li>
              <li>Alumni: <a href="mailto:alumnirelations@muditaalliance.org" className="text-amber-300 hover:text-white">alumnirelations@muditaalliance.org</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-amber-400 font-semibold text-base mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {[['Instagram','https://instagram.com'],['Facebook','https://facebook.com'],
                ['LinkedIn','https://linkedin.com'],['YouTube','https://youtube.com']].map(([n,u]) => (
                <li key={n}><a href={u} target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">{n}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-amber-400 font-semibold text-base mb-4">Office</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              K-901 Marvel Diva, Next to Seasons Mall,<br />
              Magarpatta City, Hadapsar,<br />
              Pune, Maharashtra 411028, India<br /><br />
              Phone: <a href="tel:+919766172334" className="text-amber-300">+91 97661 72334</a><br />
              Email: <a href="mailto:mudita@muditaalliance.org" className="text-amber-300">mudita@muditaalliance.org</a>
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-3 px-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400">
        <span>Copyright © 2025 Mudita – An Alliance For Giving</span>
        <span>Designed &amp; maintained by JK</span>
      </div>
    </footer>
  );
}
