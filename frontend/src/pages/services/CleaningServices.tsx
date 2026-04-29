import ServiceCategory from "./ServiceCategory";
import { Shield, Users, Clock, CheckCircle, Award, Sparkles } from "lucide-react";

const cleaningServicesData = {
  name: "Cleaning Services",
  description: "Professional cleaning services for homes and offices. Our trained cleaners use eco-friendly products to deliver spotless results every time.",
  icon: "🧽",
  benefits: [
    "Trained and background-verified cleaners",
    "Eco-friendly cleaning products", 
    "Flexible scheduling options",
    "100% satisfaction guarantee",
    "Insurance covered services"
  ],
  popularServices: [
    {
      id: 1,
      title: "Deep House Cleaning",
      description: "Comprehensive deep cleaning service for your entire home",
      workers: 1250,
      avgRating: 4.8,
      avgPrice: "₹15-25/sq ft",
      availability: "Same day",
      features: ["All rooms cleaning", "Bathroom sanitization", "Kitchen deep clean", "Floor polishing"]
    },
    {
      id: 2,
      title: "Regular Home Cleaning",
      description: "Weekly or monthly regular cleaning service for ongoing maintenance",
      workers: 980,
      avgRating: 4.7,
      avgPrice: "₹300-600",
      availability: "Same day",
      features: ["Dusting & wiping", "Floor mopping", "Bathroom cleaning", "Trash removal"]
    },
    {
      id: 3,
      title: "Kitchen Deep Clean",
      description: "Specialized kitchen cleaning including appliances and surfaces",
      workers: 750,
      avgRating: 4.9,
      avgPrice: "₹400-800",
      availability: "Same day",
      features: ["Appliance cleaning", "Cabinet sanitization", "Countertop cleaning", "Chimney cleaning"]
    },
    {
      id: 4,
      title: "Bathroom Deep Clean",
      description: "Thorough bathroom sanitization and deep cleaning",
      workers: 690,
      avgRating: 4.8,
      avgPrice: "₹200-450",
      availability: "Same day",
      features: ["Tile scrubbing", "Fixture polishing", "Drain cleaning", "Mirror cleaning"]
    },
    {
      id: 5,
      title: "Office Cleaning",
      description: "Professional office and commercial space cleaning services",
      workers: 520,
      avgRating: 4.6,
      avgPrice: "₹8-15/sq ft",
      availability: "Next day",
      features: ["Desk cleaning", "Floor maintenance", "Washroom cleaning", "Pantry cleaning"]
    },
    {
      id: 6,
      title: "Post-Construction Cleaning",
      description: "Specialized cleaning after renovation or construction work",
      workers: 380,
      avgRating: 4.9,
      avgPrice: "₹20-35/sq ft",
      availability: "2-3 days",
      features: ["Dust removal", "Paint cleanup", "Debris removal", "Deep sanitization"]
    }
  ],
  whyChooseUs: [
    {
      icon: Sparkles,
      title: "Professional Results",
      description: "Our trained cleaners deliver consistently excellent results using proven techniques and quality equipment."
    },
    {
      icon: Shield,
      title: "Safe & Eco-Friendly",
      description: "We use eco-friendly, non-toxic cleaning products that are safe for your family and pets."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book one-time, weekly, or monthly cleaning services at times that work best for you."
    }
  ],
  howItWorks: [
    {
      step: "1",
      title: "Choose Service",
      description: "Select the type of cleaning service you need"
    },
    {
      step: "2",
      title: "Schedule Time",
      description: "Pick your preferred date and time slot"
    },
    {
      step: "3",
      title: "Professional Clean",
      description: "Trained cleaner arrives with all supplies"
    },
    {
      step: "4",
      title: "Quality Check",
      description: "Final inspection ensures satisfaction"
    }
  ],
  faqs: [
    {
      question: "What cleaning supplies do you provide?",
      answer: "We bring all necessary cleaning supplies and equipment including eco-friendly detergents, vacuum cleaners, mops, and specialized tools."
    },
    {
      question: "Are your cleaners background verified?",
      answer: "Yes, all our cleaning professionals undergo thorough background verification, training, and regular skill assessments."
    },
    {
      question: "Can I book recurring cleaning services?",
      answer: "Absolutely! You can schedule weekly, bi-weekly, or monthly recurring services at discounted rates."
    },
    {
      question: "What if I'm not satisfied with the cleaning?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy, we'll return within 24 hours to address any concerns at no extra cost."
    },
    {
      question: "Do you clean during weekends and holidays?",
      answer: "Yes, we provide cleaning services 7 days a week including weekends and most holidays for your convenience."
    },
    {
      question: "Can you accommodate special cleaning requests?",
      answer: "Yes, we can accommodate special requests like organizing, inside oven cleaning, or using your preferred cleaning products."
    }
  ]
};

export default function CleaningServices() {
  return <ServiceCategory category={cleaningServicesData} />;
}