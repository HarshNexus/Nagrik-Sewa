import ServiceCategory from "./ServiceCategory";
import { Shield, Users, Clock, CheckCircle, Award, Leaf } from "lucide-react";

const gardeningServicesData = {
  name: "Gardening Services",
  description: "Professional gardening and landscaping services to transform your outdoor spaces. From maintenance to complete garden makeovers, we bring nature to life.",
  icon: "🌱",
  benefits: [
    "Expert gardeners and landscapers",
    "Organic and eco-friendly practices", 
    "Seasonal care programs",
    "Plant health guarantee",
    "Custom landscape design"
  ],
  popularServices: [
    {
      id: 1,
      title: "Garden Maintenance",
      description: "Regular garden upkeep including pruning, watering, and plant care",
      workers: 420,
      avgRating: 4.7,
      avgPrice: "₹300-800",
      availability: "Same day",
      features: ["Plant pruning", "Weeding", "Watering", "Fertilizing"]
    },
    {
      id: 2,
      title: "Lawn Care",
      description: "Complete lawn maintenance including mowing, edging, and fertilization",
      workers: 380,
      avgRating: 4.8,
      avgPrice: "₹200-600",
      availability: "Next day",
      features: ["Grass cutting", "Edge trimming", "Lawn fertilizing", "Weed control"]
    },
    {
      id: 3,
      title: "Plant Installation",
      description: "Professional planting of flowers, shrubs, and trees",
      workers: 320,
      avgRating: 4.9,
      avgPrice: "₹150-500/plant",
      availability: "2-3 days",
      features: ["Plant selection", "Soil preparation", "Professional planting", "Initial care guidance"]
    },
    {
      id: 4,
      title: "Garden Design",
      description: "Custom garden design and landscaping consultation",
      workers: 180,
      avgRating: 4.8,
      avgPrice: "₹2000-10000",
      availability: "1 week",
      features: ["Design consultation", "Plant selection", "Layout planning", "Seasonal planning"]
    },
    {
      id: 5,
      title: "Pest Control",
      description: "Organic pest control solutions for gardens and plants",
      workers: 280,
      avgRating: 4.6,
      avgPrice: "₹300-800",
      availability: "Same day",
      features: ["Organic treatments", "Pest identification", "Preventive measures", "Plant health care"]
    },
    {
      id: 6,
      title: "Seasonal Care",
      description: "Seasonal garden preparation and plant protection services",
      workers: 350,
      avgRating: 4.7,
      avgPrice: "₹500-1500",
      availability: "3-5 days",
      features: ["Seasonal pruning", "Weather protection", "Soil conditioning", "Plant relocation"]
    }
  ],
  whyChooseUs: [
    {
      icon: Leaf,
      title: "Expert Gardeners",
      description: "Our gardeners are trained in horticulture and understand local climate conditions for optimal plant care."
    },
    {
      icon: CheckCircle,
      title: "Organic Practices",
      description: "We use organic fertilizers and eco-friendly pest control methods to maintain healthy gardens naturally."
    },
    {
      icon: Award,
      title: "Plant Guarantee",
      description: "We provide a health guarantee on plants we install and maintain, ensuring your garden thrives."
    }
  ],
  howItWorks: [
    {
      step: "1",
      title: "Garden Assessment",
      description: "Expert visits to assess your garden needs"
    },
    {
      step: "2",
      title: "Service Plan",
      description: "Customized care plan based on your requirements"
    },
    {
      step: "3",
      title: "Professional Care",
      description: "Skilled gardener provides quality service"
    },
    {
      step: "4",
      title: "Ongoing Support",
      description: "Regular maintenance and plant care guidance"
    }
  ],
  faqs: [
    {
      question: "Do you provide plants or do I need to purchase them separately?",
      answer: "We can provide plants as part of our service or work with plants you've purchased. We'll recommend the best plants for your garden conditions."
    },
    {
      question: "How often should I schedule garden maintenance?",
      answer: "We recommend weekly or bi-weekly maintenance depending on your garden size and plant types. We'll create a custom schedule based on your needs."
    },
    {
      question: "Do you use organic gardening methods?",
      answer: "Yes, we prioritize organic and eco-friendly gardening practices including organic fertilizers, natural pest control, and sustainable care methods."
    },
    {
      question: "Can you help design a new garden layout?",
      answer: "Absolutely! Our landscaping experts can design custom garden layouts considering your space, preferences, and local growing conditions."
    },
    {
      question: "What happens if plants die after your service?",
      answer: "We provide a plant health guarantee. If plants fail due to our care within the guarantee period, we'll replace them at no additional cost."
    },
    {
      question: "Do you provide seasonal garden care?",
      answer: "Yes, we offer seasonal services including winter protection, spring preparation, monsoon care, and summer maintenance programs."
    },
    {
      question: "Can you maintain rooftop or balcony gardens?",
      answer: "Definitely! We specialize in all types of gardens including rooftop gardens, balcony gardens, and indoor plant care."
    }
  ]
};

export default function GardeningServices() {
  return <ServiceCategory category={gardeningServicesData} />;
}