import ServiceCategory from "./ServiceCategory";
import { Shield, Users, Clock, CheckCircle, Award, Wrench } from "lucide-react";

const plumbingServicesData = {
  name: "Plumbing Services",
  description: "Expert plumbing solutions for all your water and drainage needs. From leaky taps to complete bathroom installations, our certified plumbers deliver reliable service.",
  icon: "🔧",
  benefits: [
    "Certified and experienced plumbers",
    "24/7 emergency plumbing service", 
    "Quality pipes and fittings",
    "Leak detection technology",
    "Comprehensive service warranty"
  ],
  popularServices: [
    {
      id: 1,
      title: "Tap & Faucet Repair",
      description: "Repair and replacement of leaky taps, faucets, and water fixtures",
      workers: 920,
      avgRating: 4.8,
      avgPrice: "₹150-400",
      availability: "Same day",
      features: ["Leak repairs", "Faucet replacement", "Valve repairs", "Water pressure fixes"]
    },
    {
      id: 2,
      title: "Toilet Installation & Repair",
      description: "Complete toilet installation, repair, and maintenance services",
      workers: 680,
      avgRating: 4.7,
      avgPrice: "₹300-1200",
      availability: "Same day",
      features: ["Toilet installation", "Flush repairs", "Seat replacement", "Pipe connections"]
    },
    {
      id: 3,
      title: "Pipe Installation",
      description: "New pipe installation and replacement for water supply and drainage",
      workers: 750,
      avgRating: 4.9,
      avgPrice: "₹100-300/ft",
      availability: "Next day",
      features: ["PVC pipes", "Copper pipes", "Leak-proof joints", "Pressure testing"]
    },
    {
      id: 4,
      title: "Drain Cleaning",
      description: "Professional drain cleaning and blockage removal services",
      workers: 540,
      avgRating: 4.6,
      avgPrice: "₹200-800",
      availability: "Same day",
      features: ["Drain unclogging", "Pipe cleaning", "Sewer line cleaning", "Preventive maintenance"]
    },
    {
      id: 5,
      title: "Water Heater Service",
      description: "Installation, repair, and maintenance of water heaters and geysers",
      workers: 420,
      avgRating: 4.8,
      avgPrice: "₹300-1500",
      availability: "Same day",
      features: ["Geyser installation", "Heating repairs", "Thermostat fixes", "Element replacement"]
    },
    {
      id: 6,
      title: "Bathroom Fitting",
      description: "Complete bathroom fitting and sanitary ware installation",
      workers: 320,
      avgRating: 4.9,
      avgPrice: "₹2000-8000",
      availability: "2-3 days",
      features: ["Sanitary installation", "Shower fitting", "Basin installation", "Pipe connections"]
    }
  ],
  whyChooseUs: [
    {
      icon: Wrench,
      title: "Expert Plumbers",
      description: "Certified plumbers with years of experience in residential and commercial plumbing solutions."
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "24/7 emergency service with same-day availability for urgent plumbing issues and leaks."
    },
    {
      icon: CheckCircle,
      title: "Quality Assurance",
      description: "We use high-quality pipes, fittings, and tools to ensure long-lasting plumbing solutions."
    }
  ],
  howItWorks: [
    {
      step: "1",
      title: "Report Issue",
      description: "Book online or call our 24/7 helpline for plumbing issues"
    },
    {
      step: "2",
      title: "Quick Diagnosis",
      description: "Expert plumber diagnoses the problem accurately"
    },
    {
      step: "3",
      title: "Professional Repair",
      description: "Quality repair work with appropriate tools and materials"
    },
    {
      step: "4",
      title: "Testing & Cleanup",
      description: "Thorough testing and cleanup after service completion"
    }
  ],
  faqs: [
    {
      question: "Do you provide 24/7 emergency plumbing services?",
      answer: "Yes, we provide round-the-clock emergency plumbing services for urgent issues like burst pipes, major leaks, and blocked drains."
    },
    {
      question: "What types of pipes do you use for installations?",
      answer: "We use high-quality PVC, CPVC, and copper pipes based on your requirements and local building codes. All materials are ISI certified."
    },
    {
      question: "How quickly can you respond to a plumbing emergency?",
      answer: "Our emergency response time is typically 30-60 minutes in major cities, depending on your location and traffic conditions."
    },
    {
      question: "Do you provide warranty on plumbing work?",
      answer: "Yes, we provide warranty on our workmanship ranging from 3 months to 1 year, and manufacturer warranty on all materials used."
    },
    {
      question: "Can you handle both minor repairs and major installations?",
      answer: "Absolutely! We handle everything from minor tap repairs to complete bathroom plumbing installations and water line replacements."
    },
    {
      question: "Do you provide water pressure solutions?",
      answer: "Yes, we diagnose and fix water pressure issues, install pressure pumps, and optimize your water supply system for better flow."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash, all major credit/debit cards, UPI, and digital wallet payments for your convenience."
    }
  ]
};

export default function PlumbingServices() {
  return <ServiceCategory category={plumbingServicesData} />;
}