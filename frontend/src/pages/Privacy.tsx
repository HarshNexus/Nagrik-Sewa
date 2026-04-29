import { Shield, Lock, Eye, Database, Users, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CONTACT_INFO } from "../constants/contact";

export default function Privacy() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">{t('legal.privacy.title') || 'Privacy Policy'}</h1>
            <p className="text-xl text-brand-100">
              {t('legal.privacy.subtitle') || 'Your privacy and data security are our top priorities'}
            </p>
            <p className="text-sm text-brand-200 mt-2">
              {t('legal.privacy.lastUpdated') || 'Last updated'}: {new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-brand-600" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Nagrik Sewa ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our home services platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2 text-brand-600" />
              Information We Collect
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>Home address and service location</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Government-issued ID for service provider verification</li>
                  <li>Profile photos and service portfolio images</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">DigiLocker Authentication Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Aadhaar-linked identity verification through DigiLocker API</li>
                  <li>Government document verification status</li>
                  <li>Encrypted document references (not actual documents)</li>
                  <li>Verification timestamps and audit logs</li>
                  <li>Digital signature certificates for enhanced trust</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Service requests and booking history</li>
                  <li>Reviews and ratings provided or received</li>
                  <li>Communication with service providers and support</li>
                  <li>Location data when using our mobile app</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-brand-600" />
              How We Use Your Information
            </h2>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Connect you with verified service providers in your area</li>
              <li>Process payments and manage your account</li>
              <li>Send service notifications and booking confirmations</li>
              <li>Verify the identity of service providers for safety through DigiLocker integration</li>
              <li>Display government verification badges for authenticated users</li>
              <li>Enhance trust and security through official document verification</li>
              <li>Improve our platform and develop new features</li>
              <li>Provide customer support and resolve disputes</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Comply with legal obligations and prevent fraud</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-brand-600" />
              Data Security
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We implement industry-standard security measures to protect your personal information:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure data storage with encryption at rest</li>
                <li>Regular security audits and penetration testing</li>
                <li>Two-factor authentication for sensitive operations</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>PCI DSS compliance for payment processing</li>
              </ul>
            </div>
          </section>

          {/* DigiLocker Integration */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-brand-600" />
              DigiLocker Integration & Government Verification
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                Our DigiLocker integration enhances security and trust through government-verified authentication:
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">What We Access Through DigiLocker</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Identity verification status (verified/unverified)</li>
                  <li>Document authenticity confirmation</li>
                  <li>Encrypted reference IDs (not actual documents)</li>
                  <li>Verification timestamps for audit purposes</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
                <h3 className="text-lg font-semibold mb-3 text-green-800">What We DON'T Access</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Your actual Aadhaar number or personal documents</li>
                  <li>DigiLocker account credentials or passwords</li>
                  <li>Personal documents stored in your DigiLocker</li>
                  <li>Any information beyond verification status</li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
                <h3 className="text-lg font-semibold mb-3 text-amber-800">Your Control</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>DigiLocker verification is completely optional</li>
                  <li>You can revoke verification consent at any time</li>
                  <li>Verification badges can be hidden from your profile</li>
                  <li>All verification data is encrypted and secure</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-2 text-brand-600" />
              Information Sharing
            </h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> With verified professionals to fulfill your service requests</li>
                <li><strong>Payment Processing:</strong> With secure payment partners to process transactions</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Safety:</strong> To ensure user safety and prevent fraudulent activities</li>
                <li><strong>Business Transfer:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">You have the right to:</p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access and download your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of promotional communications</li>
                <li>Restrict processing of your data</li>
                <li>Data portability to another service</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
            
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Show you relevant advertisements</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Account Data:</strong> Until account deletion or 3 years of inactivity</li>
                <li><strong>Booking History:</strong> Retained for 7 years for legal and audit purposes</li>
                <li><strong>DigiLocker Verification:</strong> Verification status retained until revoked by user</li>
                <li><strong>Payment Records:</strong> Retained for 7 years as per legal requirements</li>
                <li><strong>Communication Logs:</strong> Retained for 2 years for dispute resolution</li>
                <li><strong>Marketing Data:</strong> Deleted immediately upon opt-out request</li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            
            <p className="text-gray-700">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will delete it promptly.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700">
                We integrate with trusted third-party services to enhance your experience:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Government Services</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• DigiLocker API (Identity Verification)</li>
                    <li>• Aadhaar Authentication</li>
                    <li>• Government Document Verification</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Partners</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Razorpay (Payment Processing)</li>
                    <li>• Paytm (Wallet Integration)</li>
                    <li>• UPI Payment Systems</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Communication</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• SMS Gateway Providers</li>
                    <li>• Email Service Providers</li>
                    <li>• Push Notification Services</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Analytics & Support</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Google Analytics (Usage Analytics)</li>
                    <li>• Customer Support Tools</li>
                    <li>• Performance Monitoring</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 italic">
                All third-party integrations are bound by strict data protection agreements and comply with applicable privacy laws.
              </p>
            </div>
          </section>

          {/* International Transfers */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
            
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than India. We ensure adequate protection through appropriate safeguards, including standard contractual clauses and adequacy decisions.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Policy Updates</h2>
            
            <p className="text-gray-700">
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or through our platform. Your continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            
            <div className="space-y-6">
              <p className="text-gray-700">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-800">General Privacy Inquiries</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> {CONTACT_INFO.PRIVACY_EMAIL}</p>
                    <p><strong>Phone:</strong> {CONTACT_INFO.MAIN_SUPPORT_PHONE}</p>
                    <p><strong>Response Time:</strong> {CONTACT_INFO.EMAIL_RESPONSE_TIME}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3 text-gray-800">Data Protection Officer</h3>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> {CONTACT_INFO.DPO_EMAIL}</p>
                    <p><strong>Purpose:</strong> Data rights requests, complaints</p>
                    <p><strong>Response Time:</strong> Within 30 days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-3 text-blue-800">Mailing Address</h3>
                <p className="text-gray-700">{CONTACT_INFO.FULL_ADDRESS}</p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Quick Tip:</strong> For faster resolution of privacy-related queries, please include your account email 
                  and specific details about your request when contacting us.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
