import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  Eye, 
  Lock,
  Users,
  Home,
  MapPin,
  Clock,
  FileText,
  Ban,
  Heart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CONTACT_INFO } from "@/constants/contact";

export default function SafetyGuidelines() {
  const customerGuidelines = [
    {
      icon: CheckCircle,
      title: "Verify Professional Identity",
      description: "Always check the professional's ID badge and verify their profile matches the app before allowing entry."
    },
    {
      icon: Eye,
      title: "Stay Present During Service",
      description: "Try to be present at home or have someone you trust available during the service appointment."
    },
    {
      icon: Lock,
      title: "Secure Valuables",
      description: "Keep valuable items, important documents, and cash secured in a safe place before the service."
    },
    {
      icon: Phone,
      title: "Use In-App Communication",
      description: "Communicate through the app for booking and coordination. This helps us assist you if any issues arise."
    },
    {
      icon: MapPin,
      title: "Share Live Location",
      description: "Enable location sharing with family members when a service provider is at your home."
    },
    {
      icon: FileText,
      title: "Review Before Payment",
      description: "Inspect the completed work thoroughly before making the final payment or signing off on the service."
    },
  ];

  const workerGuidelines = [
    {
      icon: Users,
      title: "Professional Conduct",
      description: "Maintain professional behavior at all times. Dress appropriately and carry your ID badge visibly."
    },
    {
      icon: Clock,
      title: "Punctuality",
      description: "Arrive on time for all appointments. If running late, inform the customer through the app immediately."
    },
    {
      icon: Home,
      title: "Respect Customer Property",
      description: "Handle customer belongings with care. Clean up your work area after completing the service."
    },
    {
      icon: Shield,
      title: "Follow Safety Protocols",
      description: "Use proper safety equipment, follow industry safety standards, and maintain hygiene practices."
    },
    {
      icon: Phone,
      title: "Document Everything",
      description: "Take before/after photos of your work. Keep records of all communications and transactions."
    },
    {
      icon: Ban,
      title: "No Outside Deals",
      description: "All transactions must go through the platform. Outside deals violate terms and remove safety protections."
    },
  ];

  const emergencySteps = [
    {
      step: 1,
      title: "Use Emergency SOS",
      description: "Tap the SOS button in the app for immediate assistance. Our team will be alerted instantly."
    },
    {
      step: 2,
      title: "Call Emergency Helpline",
      description: `Call our 24/7 emergency helpline at ${CONTACT_INFO.EMERGENCY_HELPLINE} for immediate support.`
    },
    {
      step: 3,
      title: "Contact Local Authorities",
      description: "For serious emergencies, contact local police (100), ambulance (102), or fire services (101)."
    },
    {
      step: 4,
      title: "Report the Incident",
      description: "File a detailed report through the app or website. Include photos, timestamps, and witness details."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Safety Guidelines</h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Your safety is our top priority. Follow these guidelines to ensure a secure and 
            positive experience on Nagrik Sewa.
          </p>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <span className="font-medium text-red-800">
                Emergency? Call our 24/7 helpline: {CONTACT_INFO.EMERGENCY_HELPLINE}
              </span>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>
        </div>
      </div>

      {/* For Customers */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              For Customers
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Safety Guidelines</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these best practices to ensure a safe service experience at your home.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerGuidelines.map((item, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* For Workers */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              For Service Providers
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Worker Safety Guidelines</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these guidelines to maintain professionalism and ensure your safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workerGuidelines.map((item, index) => (
              <Card key={index} className="border-2 hover:border-green-200 transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Procedures */}
      <div className="py-16 bg-red-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency Procedures</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              If you ever feel unsafe or encounter an emergency, follow these steps immediately.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencySteps.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust & Verification */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Heart className="w-10 h-10 text-brand-600" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Commitment to Safety</h3>
                <p className="text-gray-600 mb-4">
                  Every professional on Nagrik Sewa undergoes thorough background verification, 
                  KYC checks through DigiLocker, and skill assessments. We're committed to 
                  maintaining the highest safety standards in the industry.
                </p>
                <Button className="bg-brand-600 hover:bg-brand-700">
                  Learn About Our Verification Process
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
