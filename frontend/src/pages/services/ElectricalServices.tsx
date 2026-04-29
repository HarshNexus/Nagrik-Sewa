import ServiceCategory from "./ServiceCategory";
import { Shield, Users, Clock, CheckCircle, Award, Zap } from "lucide-react";

const electricalServicesData = {
  name: "Electrical Services",
  description: "Safe and reliable electrical services by licensed electricians. From installations to repairs, we ensure your electrical systems are secure and efficient.",
  icon: "⚡",
  benefits: [
    "Licensed and certified electricians",
    "24/7 emergency service available", 
    "Safety compliance guaranteed",
    "Quality electrical components",
    "Comprehensive warranty coverage"
  ],
  popularServices: [
    {
      id: 1,
      title: "Electrical Wiring",
      description: "Complete electrical wiring installation and rewiring services",
      workers: 650,
      avgRating: 4.9,
      avgPrice: "₹80-150/point",
      availability: "Same day",
      features: ["New installations", "Rewiring", "Safety certification", "Quality materials"]
    },
    {
      id: 2,
      title: "Switch & Socket Installation",
      description: "Installation and replacement of switches, sockets, and electrical outlets",
      workers: 480,
      avgRating: 4.8,
      avgPrice: "₹150-300/point",
      availability: "Same day",
      features: ["Modular switches", "USB sockets", "Dimmer switches", "Safety testing"]
    },
    {
      id: 3,
      title: "Fan Installation",
      description: "Ceiling fan, exhaust fan, and table fan installation services",
      workers: 720,
      avgRating: 4.7,
      avgPrice: "₹200-500",
      availability: "Same day",
      features: ["Ceiling fans", "Exhaust fans", "Designer fans", "Speed regulators"]
    },
    {
      id: 4,
      title: "Light Fixture Installation",
      description: "Installation of chandeliers, LED lights, and decorative lighting",
      workers: 540,
      avgRating: 4.8,
      avgPrice: "₹150-800",
      availability: "Same day",
      features: ["LED installations", "Chandeliers", "Decorative lighting", "Smart lighting"]
    },
    {
      id: 5,
      title: "Electrical Panel Upgrade",
      description: "MCB panel installation and electrical panel upgrades",
      workers: 320,
      avgRating: 4.9,
      avgPrice: "₹2000-8000",
      availability: "Next day",
      features: ["MCB panels", "Safety upgrades", "Load balancing", "Circuit protection"]
    },
    {
      id: 6,
      title: "Electrical Troubleshooting",
      description: "Emergency electrical repairs and troubleshooting services",
      workers: 580,
      avgRating: 4.6,
      avgPrice: "₹200-600",
      availability: "24/7 Emergency",
      features: ["Emergency repairs", "Fault diagnosis", "Power outage fixes", "Safety inspections"]
    }
  ],
  whyChooseUs: [
    {
      icon: Zap,
      title: "Licensed Electricians",
      description: "All our electricians are licensed, certified, and trained in latest electrical safety standards."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "We prioritize safety with proper testing, quality materials, and compliance with electrical codes."
    },
    {
      icon: Clock,
      title: "24/7 Emergency Service",
      description: "Round-the-clock emergency electrical services for urgent repairs and power issues."
    }
  ],
  howItWorks: [
    {
      step: "1",
      title: "Book Service",
      description: "Schedule electrical service online or call for emergency"
    },
    {
      step: "2",
      title: "Expert Assessment",
      description: "Licensed electrician assesses your electrical needs"
    },
    {
      step: "3",
      title: "Safe Installation",
      description: "Professional installation with safety compliance"
    },
    {
      step: "4",
      title: "Testing & Certification",
      description: "Thorough testing and safety certification provided"
    }
  ],
  faqs: [
    {
      question: "Are your electricians licensed and certified?",
      answer: "Yes, all our electricians are licensed, certified, and regularly trained on the latest electrical codes and safety standards."
    },
    {
      question: "Do you provide 24/7 emergency electrical services?",
      answer: "Yes, we provide round-the-clock emergency electrical services for urgent repairs, power outages, and electrical safety issues."
    },
    {
      question: "What safety measures do you follow during electrical work?",
      answer: "We follow strict safety protocols including power isolation, proper grounding, safety testing, and compliance with electrical codes and regulations."
    },
    {
      question: "Do you provide warranty on electrical work and materials?",
      answer: "Yes, we provide comprehensive warranty on both workmanship and electrical materials used, ranging from 6 months to 2 years."
    },
    {
      question: "Can you handle both residential and commercial electrical work?",
      answer: "Absolutely! Our licensed electricians are equipped to handle electrical work for homes, offices, shops, and commercial establishments."
    },
    {
      question: "Do you provide electrical safety inspections?",
      answer: "Yes, we offer comprehensive electrical safety inspections to identify potential hazards and ensure your electrical system meets safety standards."
    }
  ]
};

export default function ElectricalServices() {
  return <ServiceCategory category={electricalServicesData} />;
}