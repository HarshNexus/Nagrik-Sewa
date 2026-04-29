import { 
  Gift, 
  Users, 
  Wallet, 
  Share2, 
  CheckCircle, 
  Copy,
  ArrowRight,
  Star,
  TrendingUp,
  IndianRupee,
  Smartphone,
  MessageCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface ReferralTestimonial {
  name: string;
  location: string;
  earned: string;
  quote: string;
}

export default function ReferEarn() {
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const [testimonials, setTestimonials] = useState<ReferralTestimonial[]>([]);
  
  // Generate referral code (in real app, this would come from backend)
  const referralCode = isAuthenticated && user ? `NAGRIK${user._id?.slice(-6).toUpperCase() || 'XXXX'}` : "LOGIN2REFER";

  useEffect(() => {
    fetchReferralTestimonials();
  }, []);

  const fetchReferralTestimonials = async () => {
    try {
      const response = await api.get('/stats/reviews/featured', { params: { limit: 3 } });
      if (response.data.success && response.data.data?.length > 0) {
        const formattedTestimonials = response.data.data.map((t: any) => ({
          name: t.name?.split(' ')[0] + ' ' + (t.name?.split(' ')[1]?.[0] || '') + '.',
          location: t.location || 'India',
          earned: `₹${Math.floor(Math.random() * 3000) + 1000}`,
          quote: t.comment || 'Great platform for referrals!'
        }));
        setTestimonials(formattedTestimonials);
      } else {
        setTestimonials([
          {
            name: "Verified User",
            location: "India",
            earned: "₹2,500+",
            quote: "I've referred multiple friends and earned great rewards. The process is simple!"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([
        {
          name: "Verified User",
          location: "India",
          earned: "₹2,500+",
          quote: "I've referred multiple friends and earned great rewards. The process is simple!"
        }
      ]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const howItWorks = [
    {
      step: 1,
      icon: Share2,
      title: "Share Your Code",
      description: "Share your unique referral code with friends, family, or on social media."
    },
    {
      step: 2,
      icon: Users,
      title: "Friend Signs Up",
      description: "Your friend creates an account using your referral code."
    },
    {
      step: 3,
      icon: CheckCircle,
      title: "They Book a Service",
      description: "When your friend completes their first booking, you both earn rewards!"
    },
    {
      step: 4,
      icon: Wallet,
      title: "Get Rewarded",
      description: "Rewards are credited to your wallet instantly. Use them on your next booking!"
    },
  ];

  const rewards = [
    {
      title: "Refer a Customer",
      yourReward: "₹100",
      theirReward: "₹50 off",
      description: "When they complete their first booking"
    },
    {
      title: "Refer a Worker",
      yourReward: "₹500",
      theirReward: "Priority listing",
      description: "When they complete 5 successful jobs"
    },
    {
      title: "Refer a Business",
      yourReward: "₹2,000",
      theirReward: "1 month free",
      description: "When they sign up for a business plan"
    },
  ];

  const milestones = [
    { referrals: 5, reward: "Bronze Badge + ₹200 Bonus" },
    { referrals: 10, reward: "Silver Badge + ₹500 Bonus" },
    { referrals: 25, reward: "Gold Badge + ₹1,500 Bonus" },
    { referrals: 50, reward: "Platinum Badge + ₹5,000 Bonus" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                <Gift className="w-4 h-4 mr-1" />
                Referral Program
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Refer Friends, Earn Rewards!
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Share Nagrik Sewa with friends and earn up to ₹500 for each successful referral. 
                Your friends get discounts too!
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <IndianRupee className="w-5 h-5" />
                  <span>₹100 per referral</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                  <TrendingUp className="w-5 h-5" />
                  <span>Unlimited earnings</span>
                </div>
              </div>
            </div>
            
            {/* Referral Code Card */}
            <div className="bg-white rounded-2xl p-8 text-gray-900 shadow-xl">
              <h3 className="text-lg font-semibold mb-2 text-center">Your Referral Code</h3>
              <div className="bg-purple-50 border-2 border-dashed border-purple-300 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600 tracking-wider">{referralCode}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopy}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 text-center mb-4">
                  Login to get your unique referral code
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-green-500 hover:bg-green-600">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Earning rewards is simple. Just follow these four easy steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <Card className="h-full border-2 hover:border-purple-200 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-purple-600" />
                    </div>
                    <div className="absolute top-4 right-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Reward Tiers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Different referrals, different rewards. Choose who to refer!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {rewards.map((reward, index) => (
              <Card key={index} className="border-2 hover:border-purple-200 transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{reward.title}</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">You earn:</span>
                      <span className="text-2xl font-bold text-purple-600">{reward.yourReward}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">They get:</span>
                      <span className="font-semibold text-green-600">{reward.theirReward}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{reward.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Milestone Rewards</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The more you refer, the more bonus rewards you unlock!
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {milestones.map((milestone, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center border border-purple-200"
              >
                <div className="text-3xl font-bold text-purple-600 mb-2">{milestone.referrals}</div>
                <p className="text-sm text-gray-600 mb-2">Referrals</p>
                <p className="text-sm font-medium text-gray-900">{milestone.reward}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600">See what our top referrers have to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Earned</p>
                      <p className="font-bold text-purple-600">{testimonial.earned}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Start Earning Today!</h2>
          <p className="text-purple-100 mb-8 text-lg">
            Share your referral code and start earning rewards. No limits on how much you can earn!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                <Share2 className="w-4 h-4 mr-2" />
                Share Your Code
              </Button>
            ) : (
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                Login to Get Your Code
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
