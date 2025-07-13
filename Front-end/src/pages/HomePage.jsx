import { useEffect, useState } from "react";
import MapComponent from "../components/Map";
import "../styles/HomePage.css";

const sliderImages = [
  "/images/image-1.jpg",
  "/images/image-2.jpg",
  "/images/image-3.jpg",
  "/images/image-4.jpg",
  "/images/image-5.jpg",
  "/images/image-6.jpg",
  "/images/image-7.jpg",
  "/images/image-8.jpg",
  "/images/image-9.jpg",
  "/images/image-10.jpg",
];

const services = [
  {
    name: "Manicure & Pedicure",
    icon: "❤️",
    slug: "manicure-pedicure",
    description: "Pamper your hands and feet with our signature mani-pedi combo.",
    link: "/booking?service=manicure-pedicure",
  },
  {
    name: "Acrylic & Gel Nails",
    icon: "❤️",
    slug: "acrylic-gel",
    description: "Long-lasting beauty with our stunning acrylic and gel nail treatments.",
    link: "/booking?service=acrylic-gel",
  },
  {
    name: "Nail Art & Design",
    icon: "❤️",
    slug: "nail-art",
    description: "Creative, custom nail art to suit every mood or occasion.",
    link: "/booking?service=nail-art",
  },
  {
    name: "Facials & Skin Treatments",
    icon: "🧖‍♀️",
    slug: "facials",
    description: "Glow with our rejuvenating facials tailored to your skin type.",
    link: "/booking?service=facials",
  },
  {
    name: "Massage Therapy",
    icon: "💆‍♀️",
    slug: "massage",
    description: "Relax, unwind, and de-stress with our full-body massages.",
    link: "/booking?service=massage",
  },
  {
    name: "Professional Makeup",
    icon: "💄",
    slug: "makeup",
    description: "Get glam for any event with professional-grade makeup.",
    link: "/booking?service=makeup",
  },
  {
    name: "Waxing & Threading",
    icon: "🫼",
    slug: "waxing",
    description: "Smooth, clean results for face, legs, arms and more.",
    link: "/booking?service=waxing",
  },
  {
    name: "Body Scrubs & Spa Packages",
    icon: "🌸",
    slug: "body-scrub",
    description: "Full-body rejuvenation with exfoliating scrubs and luxury packages.",
    link: "/booking?service=body-scrub",
  },
  {
    name: "Hair Cutting & Styling",
    icon: "💇‍♀️",
    slug: "hair-cut",
    description: "From trims to full styles — tailored to your perfect look.",
    link: "/booking?service=hair-cut",
  },
  {
    name: "Barbering & Beard Grooming",
    icon: "💇‍♂️",
    slug: "barber",
    description: "Precision cuts and beard treatments for the modern gent.",
    link: "/booking?service=barber",
  },
  {
    name: "Hair Coloring & Highlights",
    icon: "🎨",
    slug: "hair-color",
    description: "Add vibrancy, depth or a whole new color to your hair.",
    link: "/booking?service=hair-color",
  },
  {
    name: "Deep Conditioning & Hair Treatments",
    icon: "💆‍♀️",
    slug: "deep-conditioning",
    description: "Restore and protect your hair with nourishing treatments.",
    link: "/booking?service=deep-conditioning",
  },
];

function ServiceModalContent({ service }) {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadedImages = [];
    for (let i = 1; i <= 3; i++) {
      loadedImages.push(`/images/${service.slug}/image-${i}.jpg`);
    }
    setImages(loadedImages);

    const slider = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadedImages.length);
    }, 2500);

    return () => clearInterval(slider);
  }, [service.slug]);

  return (
    <div>
      <h3>{service.icon} {service.name}</h3>
      <div className="modal-slider">
        <img src={images[index]} alt={`${service.name} slide`} />
      </div>
      <p>{service.description}</p>
      <a href={service.link} className="booking-link">Book Now</a>
    </div>
  );
}

function HomePage() {
  const [current, setCurrent] = useState(0);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliderImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Glamour Beauty & Spa 💅✨</h1>
      <p>Indulge in modern luxury. Nails, beauty, and relaxation — all in one place.</p>

      <div className="slider">
        <img src={sliderImages[current]} alt="Spa Showcase" />
        <div className="slider-caption">Your sanctuary of beauty and wellness</div>
      </div>

      <h2>Our Services</h2>
      <ul className="service-list">
        {services.map((service) => (
          <li key={service.name} onClick={() => setSelectedService(service)}>
            {service.icon} {service.name}
          </li>
        ))}
      </ul>

      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <ServiceModalContent service={selectedService} />
            <button onClick={() => setSelectedService(null)} className="close-button">Close</button>
          </div>
        </div>
      )}

      <h2>Visit Us</h2>
      <p>Your relaxation destination awaits.</p>
      <div className="map-section">
        <MapComponent />
      </div>
    </div>
  );
}

export default HomePage;
