import { Scale } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
  const { t } = useLanguage();
  const today = new Date();
  const lastUpdated = today.toLocaleDateString('en-IN');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <Scale className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">{t('legal.terms.title') || 'Terms of Service'}</h1>
            <p className="text-xl text-brand-100">{t('legal.terms.subtitle') || 'Terms and conditions governing the use of Nagrik Sewa platform'}</p>
            <p className="text-sm text-brand-200 mt-2">
              {t('legal.terms.lastUpdated') || 'Last updated'}: {lastUpdated}
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Terms of Service</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-800 font-medium">
              Welcome to Nagrik Sewa! These terms explain your rights and responsibilities when using our platform. 
              Please read carefully as they constitute a legally binding agreement.
            </p>
          </div>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">1. About Our Service</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>What we do:</strong> Nagrik Sewa connects customers with verified local service providers across India for home services, repairs, cleaning, and professional services.</p>
                <p><strong>Who we are:</strong> Nagrik Sewa Technologies Private Limited, a registered Indian company committed to empowering local workers and serving citizens nationwide.</p>
                <p><strong>Our mission:</strong> Creating employment opportunities for skilled workers while providing reliable, quality services to customers in their preferred Indian language.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">2. User Accounts & Registration</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Account Types:</strong> You can register as a Customer (booking services) or Worker (providing services).</p>
                <p><strong>Required Information:</strong> Valid phone number, email address, and government-issued ID for verification.</p>
                <p><strong>Age Requirement:</strong> You must be at least 18 years old to create an account.</p>
                <p><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials.</p>
                <p><strong>Account Suspension:</strong> We may suspend accounts for policy violations, fraudulent activity, or safety concerns.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">3. Service Booking & Payments</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Booking Process:</strong> Select service → Choose provider → Schedule appointment → Make payment → Service completion.</p>
                <p><strong>Payment Methods:</strong> UPI, Credit/Debit Cards, Net Banking, Digital Wallets, and Cash-on-Service (select services only).</p>
                <p><strong>Pricing:</strong> Service prices are set by providers and clearly displayed before booking confirmation.</p>
                <p><strong>Service Fees:</strong> Platform convenience fee may apply, clearly shown during checkout.</p>
                <p><strong>Payment Security:</strong> All online payments are processed through secure, PCI-compliant payment gateways.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">4. Cancellation & Refund Policy</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Customer Cancellation</h4>
                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                  <li><strong>Free Cancellation:</strong> Up to 2 hours before scheduled service time</li>
                  <li><strong>Partial Refund:</strong> 1-2 hours before service (50% refund)</li>
                  <li><strong>No Refund:</strong> Less than 1 hour before service or after worker arrival</li>
                  <li><strong>Emergency Cancellation:</strong> Full refund for genuine emergencies with valid proof</li>
                </ul>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><strong>Refund Processing:</strong> Refunds are processed within 5-7 business days to original payment method.</p>
                <p><strong>Service Issues:</strong> Full refund or re-service if work is unsatisfactory (report within 24 hours).</p>
                <p><strong>Worker Cancellation:</strong> If worker cancels, you receive full refund plus ₹50 compensation.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">5. Worker Verification & Standards</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Identity Verification:</strong> All workers undergo Aadhaar, PAN, and background verification through DigiLocker integration.</p>
                <p><strong>Skill Assessment:</strong> Workers complete practical skill tests and provide work samples before platform approval.</p>
                <p><strong>Insurance Coverage:</strong> All verified workers are covered under comprehensive insurance for damage/theft protection.</p>
                <p><strong>Rating System:</strong> Workers maintain minimum 4.0-star rating; consistent poor performance leads to removal.</p>
                <p><strong>Training Programs:</strong> Regular skill development and safety training provided through government partnerships.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">6. Safety & Security Measures</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-2">Your Safety is Our Priority</h4>
                <ul className="list-disc list-inside text-green-700 space-y-1">
                  <li>Real-time GPS tracking of service providers during visits</li>
                  <li>24/7 emergency helpline with immediate response team</li>
                  <li>In-app panic button for emergency situations</li>
                  <li>Mandatory ID badges and safety protocols for all workers</li>
                  <li>Post-service feedback and rating system</li>
                </ul>
              </div>
              <p className="text-gray-700"><strong>Incident Reporting:</strong> Report any safety concerns immediately through app, phone, or email for swift action.</p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">7. User Responsibilities</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Customers Must:</h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Provide accurate service requirements</li>
                    <li>Be present during scheduled service</li>
                    <li>Ensure safe working environment</li>
                    <li>Make timely payments</li>
                    <li>Treat workers with respect</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Workers Must:</h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>Arrive on time with proper tools</li>
                    <li>Maintain professional conduct</li>
                    <li>Complete work as agreed</li>
                    <li>Follow safety protocols</li>
                    <li>Respect customer property</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">8. Prohibited Activities</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium mb-2">The following activities are strictly prohibited:</p>
                <ul className="list-disc list-inside text-red-700 space-y-1">
                  <li>Direct contact between customers and workers outside the platform</li>
                  <li>Cash payments without platform knowledge (except authorized cash-on-service)</li>
                  <li>Fraudulent reviews or ratings manipulation</li>
                  <li>Sharing personal contact information for off-platform transactions</li>
                  <li>Discriminatory behavior based on religion, caste, gender, or region</li>
                  <li>Misuse of worker identity verification documents</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">9. Dispute Resolution</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Step 1:</strong> Report issues through in-app support or customer service within 24 hours.</p>
                <p><strong>Step 2:</strong> Our mediation team will investigate and attempt resolution within 48 hours.</p>
                <p><strong>Step 3:</strong> If unresolved, disputes will be escalated to senior management for final decision.</p>
                <p><strong>Legal Jurisdiction:</strong> All disputes are subject to Indian law and Delhi jurisdiction.</p>
                <p><strong>Alternative Resolution:</strong> We encourage amicable settlement before legal proceedings.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">10. Platform Updates & Changes</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Service Updates:</strong> We may update features, add new services, or modify existing ones to improve user experience.</p>
                <p><strong>Terms Updates:</strong> Changes to these terms will be notified via app, email, and website at least 30 days in advance.</p>
                <p><strong>Continued Use:</strong> Using the platform after changes indicates acceptance of updated terms.</p>
                <p><strong>Feedback:</strong> We welcome user feedback on platform improvements and policy changes.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">11. Limitation of Liability</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Platform Role:</strong> Nagrik Sewa acts as an intermediary connecting customers with independent service providers.</p>
                <p><strong>Service Quality:</strong> While we verify workers, the quality of service depends on individual provider performance.</p>
                <p><strong>Insurance Claims:</strong> Property damage or theft claims are processed through our insurance partners.</p>
                <p><strong>Maximum Liability:</strong> Our liability is limited to the service amount paid for the specific booking.</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">12. Contact & Support Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Customer Support</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>24/7 Helpline:</strong> +91-11-4567-8900</p>
                    <p><strong>Email:</strong> support@nagriksewa.com</p>
                    <p><strong>WhatsApp:</strong> +91-98765-43210</p>
                    <p><strong>Live Chat:</strong> Available in app (9 AM - 10 PM)</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Emergency & Legal</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Emergency:</strong> +91-11-EMERGENCY</p>
                    <p><strong>Safety Helpline:</strong> +91-11-SAFETY-01</p>
                    <p><strong>Legal Issues:</strong> legal@nagriksewa.com</p>
                    <p><strong>Grievance Officer:</strong> grievance@nagriksewa.com</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4 text-brand-600">13. Government Compliance</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Registrations:</strong> Registered under Ministry of Corporate Affairs, GSTIN, and Labour Department.</p>
                <p><strong>Data Protection:</strong> Compliant with Digital Personal Data Protection Act, 2023.</p>
                <p><strong>Worker Rights:</strong> All workers are provided benefits as per Indian labour laws and social security schemes.</p>
                <p><strong>Tax Compliance:</strong> TDS and GST applicable as per Indian tax regulations.</p>
              </div>
            </section>

            <div className="bg-brand-50 border border-brand-200 rounded-lg p-6 mt-8">
              <h4 className="font-semibold text-brand-800 mb-2">Agreement Acceptance</h4>
              <p className="text-brand-700">
                By creating an account or using our services, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, 
                please do not use our platform.
              </p>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-8 text-center text-gray-600">
            <p>Terms effective as of {lastUpdated} (Auto-updated daily)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
