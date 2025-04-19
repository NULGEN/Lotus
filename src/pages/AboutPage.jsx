import { Users, Heart, Package, Clock } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Expert Team",
      description: "Our dedicated team of fashion experts curates the finest selections just for you."
    },
    {
      icon: <Heart size={24} />,
      title: "Quality First",
      description: "We partner with premium brands to ensure the highest quality in every product."
    },
    {
      icon: <Package size={24} />,
      title: "Global Shipping",
      description: "We deliver to customers worldwide, bringing fashion to your doorstep."
    },
    {
      icon: <Clock size={24} />,
      title: "24/7 Support",
      description: "Our customer service team is always here to help you with any questions."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About LOTUS</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about bringing you the latest fashion trends while maintaining 
            the highest standards of quality and customer service.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2020, LOTUS began with a simple mission: to make high-quality 
                fashion accessible to everyone. What started as a small boutique has grown 
                into a global fashion destination.
              </p>
              <p>
                We believe that style is a form of self-expression, and everyone deserves 
                to feel confident in what they wear. Our curated collections reflect this 
                philosophy, offering pieces that combine trend-forward design with timeless appeal.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We envision a world where quality fashion is accessible to all. Our goal 
                is to continue expanding our reach while maintaining the personal touch 
                that makes LOTUS special.
              </p>
              <p>
                Sustainability and ethical practices are at the heart of everything we do. 
                We carefully select our partners and materials to ensure we're making a 
                positive impact on both fashion and the environment.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center items-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full text-blue-600">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About LOTUS</h1>
          <p className="text-lg text-gray-600">
            We're passionate about bringing you the latest fashion trends while maintaining 
            the highest standards of quality and customer service.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Story</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                Founded in 2020, LOTUS began with a simple mission: to make high-quality 
                fashion accessible to everyone. What started as a small boutique has grown 
                into a global fashion destination.
              </p>
              <p>
                We believe that style is a form of self-expression, and everyone deserves 
                to feel confident in what they wear.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h2>
            <div className="space-y-3 text-gray-600">
              <p>
                We envision a world where quality fashion is accessible to all. Our goal 
                is to continue expanding our reach while maintaining the personal touch 
                that makes LOTUS special.
              </p>
              <p>
                Sustainability and ethical practices are at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}