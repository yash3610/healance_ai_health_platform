import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '/assets/images/icon-about-info-1.svg',
    title: 'Patient-Centered Care',
    text: 'Putting you at the heart of everything we do. Our patient-centered approach ensures personalized.'
  },
  {
    icon: '/assets/images/icon-about-info-2.svg',
    title: 'Specialist Doctors',
    text: 'Putting you at the heart of everything we do. Our patient-centered approach ensures personalized.'
  },
  {
    icon: '/assets/images/icon-about-info-3.svg',
    title: '24 Hours Service',
    text: 'Putting you at the heart of everything we do. Our patient-centered approach ensures personalized.'
  }
];

export default function AboutShowcaseSection({ compact = false }) {
  return (
    <div className="about-showcase-grid">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
        <p className="about-showcase-kicker">
          <img src="/assets/images/icon-sub-heading.svg" alt="About" className="h-5 w-5" />
          <span>About Us</span>
        </p>
        <h2 className="about-showcase-title">Professionals dedicated to your health</h2>
        <p className="about-showcase-text">
          Our team of skilled professionals is committed to providing personalized, compassionate care. With a focus.
        </p>

        <div className="about-showcase-list">
          {features.map((item) => (
            <div key={item.title} className="about-showcase-item">
              <div className="about-showcase-icon">
                <img src={item.icon} alt={item.title} />
              </div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {!compact ? (
          <Link to="/about" className="btn-primary mt-8">
            view more about us
          </Link>
        ) : null}
      </motion.div>

      <motion.div
        className="about-showcase-visual"
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="about-main-image image-anime">
          <img src="/assets/images/about-img-1.jpg" alt="About" />
        </div>

        <div className="about-overlay-image image-anime">
          <img src="/assets/images/about-img-2.jpg" alt="Video Call" />
          <h3>video call support</h3>
        </div>

        <motion.div
          className="about-hours-card"
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: 3.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <h3>Opening hours</h3>
          <ul>
            <li><span>Mon To Fri</span> <strong>09:30 - 07:30</strong></li>
            <li><span>Saturday</span> <strong>10:30 - 5:00</strong></li>
            <li><span>Sunday</span> <strong>Closed</strong></li>
          </ul>
          <figure>
            <i className="fa-solid fa-clock" />
          </figure>
        </motion.div>
      </motion.div>
    </div>
  );
}
