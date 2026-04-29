import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Linkedin, 
  Instagram, 
  Mail,
  Phone,
  MapPin,
  Shield,
  Award,
  Users,
  CheckCircle,
  Lock,
  BadgeCheck
} from "lucide-react";
import { CONTACT_INFO, makePhoneCall, sendEmail } from "../constants/contact";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePlatformStats } from "@/hooks/use-platform-stats";

// Social media links
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/nagriksewa.co.in?igsh=b2o1Y2J6d21sbGtk",
  linkedin: "https://www.linkedin.com/in/nagrik-sewa-972038395?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  youtube: "https://youtube.com/@nagriksewaconnect?si=qekNkPBm9Hyf6H99"
};

export function Footer() {
  const { t } = useLanguage();
  const { platformStats: stats, loading } = usePlatformStats();

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (num >= 100000) {
      return `${Math.floor(num / 1000)}K+`;
    } else if (num >= 1000) {
      return `${Math.floor(num / 1000)}K+`;
    }
    return `${num}+`;
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Indicators */}
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="font-semibold">
                  {loading ? '...' : formatNumber(stats?.totalCustomers || 35000)}
                </p>
                <p className="text-sm text-gray-400">{t('footer.happyCustomers') || 'Happy Customers'}</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <BadgeCheck className="w-8 h-8 text-green-400" />
              <div>
                <p className="font-semibold">
                  {loading ? '...' : formatNumber(stats?.totalWorkers || 15000)}
                </p>
                <p className="text-sm text-gray-400">{t('footer.verifiedProfessionals') || 'Verified Professionals'}</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="font-semibold">640+</p>
                <p className="text-sm text-gray-400">{t('footer.districtsCovered') || 'Districts Covered'}</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Lock className="w-8 h-8 text-purple-400" />
              <div>
                <p className="font-semibold">100%</p>
                <p className="text-sm text-gray-400">{t('footer.securePayments') || 'Secure Payments'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">न</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Nagrik Sewa</h3>
                  <p className="text-sm text-gray-400">नागरिक सेवा</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                {t("footer.companyDescription")}
              </p>
              <div className="flex space-x-3">
                <a 
                  href={SOCIAL_LINKS.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-colors p-2"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={SOCIAL_LINKS.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-colors p-2"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href={SOCIAL_LINKS.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold mb-4">{t("footer.platform") || "Platform"}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">{t("footer.aboutUs") || "About Us"}</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white">{t("footer.howItWorks") || "How It Works"}</Link></li>
                <li><Link to="/get-verified" className="hover:text-white">{t("footer.trustSafety") || "Trust & Safety"}</Link></li>
                <li><Link to="/services" className="hover:text-white">{t("footer.ourServices") || "Our Services"}</Link></li>
                <li><Link to="/workers" className="hover:text-white">{t("footer.findProfessionals") || "Find Professionals"}</Link></li>
                <li><Link to="/careers" className="hover:text-white">{t("footer.careers") || "Careers"}</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">{t("footer.resources") || "Resources"}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/support" className="hover:text-white" onClick={() => window.scrollTo(0, 0)}>{t("footer.helpCenter") || "Help Center"}</Link></li>
                <li><Link to="/support-faqs" className="hover:text-white" onClick={() => window.scrollTo(0, 0)}>{t("footer.faqs") || "FAQs"}</Link></li>
                <li><Link to="/join-as-worker" className="hover:text-white" onClick={() => window.scrollTo(0, 0)}>{t("footer.becomePartner") || "Become a Partner"}</Link></li>
                <li><Link to="/for-businesses" className="hover:text-white" onClick={() => window.scrollTo(0, 0)}>{t("footer.forBusinesses") || "For Businesses"}</Link></li>
                <li><Link to="/safety-guidelines" className="hover:text-white" onClick={() => window.scrollTo(0, 0)}>{t("footer.safetyGuidelines") || "Safety Guidelines"}</Link></li>
                <li><Link to="/refer-earn" className="hover:text-white" onClick={() => window.scrollTo(0, 0)}>{t("footer.referEarn") || "Refer & Earn"}</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">{t("footer.contactUs")}</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{CONTACT_INFO.MAIN_SUPPORT_PHONE}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{CONTACT_INFO.MAIN_EMAIL}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{CONTACT_INFO.ADDRESS}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-medium mb-2">{t("footer.emergencyHelpline")}</h5>
                <Button 
                  onClick={() => makePhoneCall(CONTACT_INFO.EMERGENCY_HELPLINE)}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {t("footer.emergency")}: {CONTACT_INFO.EMERGENCY_HELPLINE}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Trust Badges */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">{t('footer.backgroundVerified') || 'Background Verified'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span className="text-sm">{t('footer.qualityAssured') || 'Quality Assured'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-purple-500" />
              <span className="text-sm">{t('footer.sslSecured') || 'SSL Secured'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">{t('footer.trustedPlatform') || 'Trusted Platform'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Nagrik Sewa. {t("footer.copyright")}<br />
                <span className="block mt-1">Made with ❤️ for India by Pushkar Kumar Saini</span>
              </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">{t("navigation.privacy")}</Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm">{t("navigation.terms")}</Link>
              <Link to="/support" className="text-gray-400 hover:text-white text-sm">{t("navigation.support")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
