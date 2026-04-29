import ServiceCategory from "./ServiceCategory";
import { Shield, Users, Clock, CheckCircle, Award, Smartphone } from "lucide-react";

const homeServicesData = {
  name: "Home Services",
  description: "Professional home services delivered by verified experts. From cleaning to maintenance, we've got your home covered.",
  icon: "🏠",
  benefits: [
    "Verified and trained professionals",
    "Same-day service availability", 
    "100% satisfaction guarantee",
    "Transparent pricing",
    "Insurance coverage"
  ],
  popularServices: [
    {
      id: 1,
      title: "House Cleaning",
      description: "Deep cleaning and regular maintenance by professional cleaners",
      workers: 1250,
      avgRating: 4.8,
      avgPrice: "₹300-500",
      availability: "Same day",
      features: ["Deep cleaning", "Regular maintenance", "Eco-friendly products", "Post-service cleanup"]
    },
    {
      id: 2,
      title: "Kitchen Cleaning",
      description: "Specialized kitchen deep cleaning including appliances and surfaces",
      workers: 850,
      avgRating: 4.7,
      avgPrice: "₹400-700",
      availability: "Next day",
      features: ["Appliance cleaning", "Chimney cleaning", "Countertop sanitization", "Cabinet cleaning"]
    },
    {
      id: 3,
      title: "Bathroom Cleaning",
      description: "Thorough bathroom sanitization and deep cleaning services",
      workers: 920,
      avgRating: 4.9,
      avgPrice: "₹200-400",
      availability: "Same day",
      features: ["Deep sanitization", "Tile cleaning", "Fixture polishing", "Drain cleaning"]
    },
    {
      id: 4,
      title: "Laundry & Ironing",
      description: "Professional laundry, dry cleaning, and ironing services",
      workers: 680,
      avgRating: 4.6,
      avgPrice: "₹15-30/piece",
      availability: "24-48 hours",
      features: ["Pickup & delivery", "Dry cleaning", "Steam ironing", "Stain removal"]
    },
    {
      id: 5,
      title: "Carpet Cleaning",
      description: "Professional carpet and upholstery cleaning services",
      workers: 420,
      avgRating: 4.8,
      avgPrice: "₹100-200/sq ft",
      availability: "Next day",
      features: ["Steam cleaning", "Stain removal", "Odor elimination", "Fabric protection"]
    },
    {
      id: 6,
      title: "Gardening Services",
      description: "Complete garden maintenance and landscaping services",
      workers: 380,
      avgRating: 4.7,
      avgPrice: "₹300-800",
      availability: "2-3 days",
      features: ["Lawn mowing", "Plant care", "Landscaping", "Pest control"]
    }
  ],
  whyChooseUs: [
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All our service providers are background-verified and trained for quality service delivery."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Book services at your convenience with same-day availability for most services."
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee with free re-service if you're not completely satisfied."
    }
  ],
  howItWorks: [
    {
      step: "1",
      title: "Choose Service",
      description: "Select from our wide range of home services"
    },
    {
      step: "2",
      title: "Book Slot",
      description: "Pick your preferred date and time"
    },
    {
      step: "3",
      title: "Expert Arrives",
      description: "Verified professional arrives at your doorstep"
    },
    {
      step: "4",
      title: "Service Complete",
      description: "Quality service delivered with satisfaction guarantee"
    }
  ],
  faqs: [
    {
      question: "Are your cleaning professionals background verified?",
      answer: "Yes, all our professionals undergo thorough background verification, identity checks, and skill assessment before joining our platform."
    },
    {
      question: "What cleaning supplies do you provide?",
      answer: "We bring all necessary cleaning supplies and equipment. We use eco-friendly and safe cleaning products unless you prefer your own supplies."
    },
    {
      question: "Can I book recurring home cleaning services?",
      answer: "Absolutely! You can book weekly, bi-weekly, or monthly recurring services at discounted rates."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "We offer a 100% satisfaction guarantee. If you're not happy with the service, we'll send another professional to redo the work at no extra cost."
    },
    {
      question: "Do you provide services on weekends and holidays?",
      answer: "Yes, we provide services 7 days a week including weekends and most holidays. Holiday bookings may have additional charges."
    }
  ]
};

export default function HomeServices() {
  return <ServiceCategory category={homeServicesData} />;
}