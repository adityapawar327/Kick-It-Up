import { Shield, Zap, Award, Users, Target, Heart, TrendingUp, Globe } from 'lucide-react'

const AboutUs = () => {
  const stats = [
    { number: '10K+', label: 'HAPPY CUSTOMERS' },
    { number: '50K+', label: 'SNEAKERS SOLD' },
    { number: '100%', label: 'AUTHENTIC' },
    { number: '24/7', label: 'SUPPORT' }
  ]

  const values = [
    {
      icon: Shield,
      title: 'AUTHENTICITY',
      description: 'Every sneaker on our platform is verified for authenticity. We guarantee 100% genuine products or your money back.'
    },
    {
      icon: Users,
      title: 'COMMUNITY',
      description: 'We\'ve built a thriving community of sneaker enthusiasts, collectors, and sellers who share the same passion.'
    },
    {
      icon: Heart,
      title: 'PASSION',
      description: 'Our team lives and breathes sneaker culture. We understand what makes each pair special and valuable.'
    },
    {
      icon: Globe,
      title: 'GLOBAL REACH',
      description: 'Connect with buyers and sellers worldwide. We ship internationally with secure and tracked delivery.'
    }
  ]

  const features = [
    {
      icon: Shield,
      title: 'AUTHENTIC',
      subtitle: '100% VERIFIED SNEAKERS',
      description: 'Every pair is thoroughly inspected and authenticated by our expert team before listing.'
    },
    {
      icon: Zap,
      title: 'FAST SHIPPING',
      subtitle: 'QUICK & SECURE DELIVERY',
      description: 'We partner with trusted carriers to ensure your sneakers arrive safely and quickly.'
    },
    {
      icon: Award,
      title: 'TOP QUALITY',
      subtitle: 'PREMIUM CONDITION ONLY',
      description: 'We maintain strict quality standards. Only the best condition sneakers make it to our marketplace.'
    }
  ]

  const team = [
    {
      role: 'FOUNDER & CEO',
      description: 'Sneaker collector for 15+ years with a vision to create the ultimate marketplace for authentic kicks.'
    },
    {
      role: 'HEAD OF AUTHENTICATION',
      description: 'Expert authenticator with deep knowledge of every major brand and their signature details.'
    },
    {
      role: 'COMMUNITY MANAGER',
      description: 'Building and nurturing our global community of sneaker enthusiasts and collectors.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
          }}></div>
        </div>

        {/* Image Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1920&q=80"
            alt="About Us Background"
            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <Heart className="h-4 w-4" />
                <span className="text-xs uppercase tracking-widest font-bold">OUR STORY</span>
              </div>
            </div>
            
            <h1 className="text-display text-8xl md:text-9xl font-bold mb-8 leading-none">
              ABOUT US
            </h1>
            
            <p className="text-xl uppercase tracking-wider font-semibold max-w-3xl mx-auto">
              WHERE PASSION MEETS AUTHENTICITY IN THE WORLD OF SNEAKERS
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="border-b-2 border-black py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-display text-6xl font-bold mb-3">{stat.number}</div>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-gray-50 border-b-2 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-black rounded-full mb-8">
            <Target className="h-10 w-10" />
          </div>
          <h2 className="text-display text-6xl font-bold mb-8 uppercase">OUR MISSION</h2>
          <div className="w-32 h-2 bg-black mx-auto mb-8"></div>
          <p className="text-lg leading-relaxed mb-6">
            At <span className="font-bold">KICK IT UP</span>, we're on a mission to revolutionize the sneaker marketplace. 
            We believe every sneakerhead deserves access to authentic, premium-quality kicks without the worry of counterfeits or scams.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Founded by passionate sneaker collectors, we understand the thrill of finding that perfect pair and the importance 
            of trust in every transaction. That's why we've built a platform that prioritizes authenticity, quality, and community above all else.
          </p>
          <p className="text-lg leading-relaxed font-semibold">
            Whether you're buying your first pair or adding to a legendary collection, we're here to make your sneaker journey 
            safe, seamless, and exciting.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display text-6xl font-bold mb-4 uppercase">OUR VALUES</h2>
            <div className="w-32 h-2 bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-2xl transition-all group">
                <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-black rounded-full mb-6 group-hover:bg-black transition-all">
                  <value.icon className="h-10 w-10 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-display text-2xl font-bold mb-4 uppercase">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display text-6xl font-bold mb-4 uppercase">WHY CHOOSE US</h2>
            <div className="w-32 h-2 bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-10 hover:shadow-2xl transition-all group">
                <div className="inline-flex items-center justify-center w-24 h-24 border-2 border-black rounded-full mb-6 group-hover:bg-black transition-all">
                  <feature.icon className="h-12 w-12 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-display text-3xl font-bold mb-2 uppercase">{feature.title}</h3>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-600 mb-4">{feature.subtitle}</p>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display text-6xl font-bold mb-4 uppercase">OUR TEAM</h2>
            <div className="w-32 h-2 bg-black mx-auto mb-6"></div>
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-600">
              PASSIONATE EXPERTS DEDICATED TO YOUR SNEAKER EXPERIENCE
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-2xl transition-all">
                <div className="w-32 h-32 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-display text-2xl font-bold mb-4 uppercase">{member.role}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-display text-6xl font-bold mb-4 uppercase">HOW IT WORKS</h2>
            <div className="w-32 h-2 bg-black mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-black text-white rounded-full mb-6 text-4xl font-bold">
                1
              </div>
              <h3 className="text-display text-3xl font-bold mb-4 uppercase">BROWSE</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore our curated collection of authentic sneakers from top brands. Use filters to find your perfect pair.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-black text-white rounded-full mb-6 text-4xl font-bold">
                2
              </div>
              <h3 className="text-display text-3xl font-bold mb-4 uppercase">BUY</h3>
              <p className="text-gray-600 leading-relaxed">
                Purchase with confidence knowing every sneaker is verified. Secure checkout and buyer protection included.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-black text-white rounded-full mb-6 text-4xl font-bold">
                3
              </div>
              <h3 className="text-display text-3xl font-bold mb-4 uppercase">ENJOY</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive your authentic sneakers quickly and securely. Rock them with pride or add them to your collection.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="h-16 w-16 mx-auto mb-8" />
          <h2 className="text-display text-6xl font-bold mb-6 uppercase">JOIN OUR COMMUNITY</h2>
          <p className="text-lg uppercase tracking-wider mb-10 font-semibold">
            BE PART OF THE MOST TRUSTED SNEAKER MARKETPLACE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="inline-block bg-white text-black px-12 py-5 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all border-2 border-white hover:scale-105 shadow-lg">
              SIGN UP NOW
            </a>
            <a href="/" className="inline-block bg-transparent text-white px-12 py-5 rounded-full font-bold uppercase text-sm tracking-wider hover:bg-white/10 transition-all border-2 border-white hover:scale-105">
              BROWSE SNEAKERS
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUs
