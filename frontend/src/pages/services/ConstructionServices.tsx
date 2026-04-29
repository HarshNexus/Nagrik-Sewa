import ServiceCategory from "./ServiceCategory";
import { Shield, Users, Clock, CheckCircle, Award, HardHat } from "lucide-react";

const constructionServicesData = {
  name: "Construction Services",
  description: "Professional construction and renovation services by licensed contractors. From minor repairs to major renovations, we deliver quality workmanship.",
  icon: "🏗️",
  benefits: [
    "Licensed and experienced contractors",
    "Quality materials and workmanship", 
    "Project management support",
    "Transparent cost estimates",
    "Insurance and warranty coverage"
  ],
  popularServices: [
    {
      id: 1,
      title: "Home Renovation",
      description: "Complete home renovation and remodeling services",
      workers: 450,
      avgRating: 4.7,
      avgPrice: "₹500-1500/sq ft",
      availability: "1-2 weeks",
      features: ["Design consultation", "Material sourcing", "Project management", "Quality assurance"]
    },
    {
      id: 2,
      title: "Painting Services",
      description: "Professional interior and exterior painting services",
      workers: 820,
      avgRating: 4.8,
      avgPrice: "₹15-35/sq ft",
      availability: "2-3 days",
      features: ["Premium paints", "Color consultation", "Surface preparation", "Clean-up service"]
    },
    {
      id: 3,
      title: "Flooring Installation",
      description: "Expert installation of tiles, marble, wood, and laminate flooring",
      workers: 380,
      avgRating: 4.9,
      avgPrice: "₹80-300/sq ft",
      availability: "3-5 days",
      features: ["Material consultation", "Precision installation", "Finishing work", "Post-installation cleanup"]
    },
    {
      id: 4,
      title: "Bathroom Renovation",
      description: "Complete bathroom renovation and fixture installation",
      workers: 280,
      avgRating: 4.6,
      avgPrice: "₹25,000-80,000",
      availability: "1-2 weeks",
      features: ["Design planning", "Plumbing work", "Tiling", "Fixture installation"]
    },
    {
      id: 5,
      title: "Kitchen Renovation",
      description: "Modern kitchen design and renovation services",
      workers: 220,
      avgRating: 4.8,
      avgPrice: "₹50,000-200,000",
      availability: "2-3 weeks",
      features: ["Modular design", "Appliance installation", "Countertop work", "Storage solutions"]
    },
    {
      id: 6,
      title: "Waterproofing",
      description: "Professional waterproofing solutions for roofs and walls",
      workers: 320,
      avgRating: 4.7,
      avgPrice: "₹60-120/sq ft",
      availability: "3-5 days",
      features: ["Leak detection", "Surface treatment", "Quality materials", "Long-term warranty"]
    }
  ],
  whyChooseUs: [
    {
      icon: HardHat,
      title: "Licensed Contractors",
      description: "All contractors are licensed, experienced, and follow safety protocols for quality construction work."
    },
    {
      icon: CheckCircle,
      title: "Quality Materials",
      description: "We source high-quality materials from trusted suppliers to ensure durability and aesthetics."
    },
    {
      icon: Shield,
      title: "Project Insurance",
      description: "All projects are covered by insurance for material damage and workmanship warranty."
    }
  ],
  howItWorks: [
    {
      step: "1",
      title: "Consultation",
      description: "Free site visit and project consultation"
    },
    {
      step: "2",
      title: "Quote & Plan",
      description: "Detailed quote with timeline and materials"
    },
    {
      step: "3",
      title: "Project Start",
      description: "Work begins with quality materials and skilled workers"
    },
    {
      step: "4",
      title: "Completion",
      description: "Final inspection and handover with warranty"
    }
  ],
  faqs: [
    {
      question: "Do you provide free project consultation and estimates?",
      answer: "Yes, we provide free site visits, project consultation, and detailed cost estimates for all construction projects."
    },
    {
      question: "How do you ensure quality of materials used?",
      answer: "We source materials from certified suppliers and brands. You can also choose your preferred brands, and we'll arrange procurement."
    },
    {
      question: "What kind of warranty do you provide on construction work?",
      answer: "We provide a comprehensive warranty ranging from 6 months to 2 years depending on the type of work, covering both materials and workmanship."
    },
    {
      question: "Can you handle both residential and commercial projects?",
      answer: "Yes, we handle both residential and commercial construction projects of various scales, from minor repairs to major renovations."
    },
    {
      question: "How do you handle project delays and cost overruns?",
      answer: "We provide realistic timelines and stick to agreed budgets. Any changes are discussed and approved beforehand with transparent communication."
    },
    {
      question: "Do you handle permits and approvals for construction work?",
      answer: "Yes, we assist with necessary permits and approvals required for your construction project, ensuring compliance with local regulations."
    }
  ]
};

export default function ConstructionServices() {
  return <ServiceCategory category={constructionServicesData} />;
}