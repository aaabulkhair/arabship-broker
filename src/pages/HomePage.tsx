import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Ship, TrendingUp, Users, ArrowRight, Anchor, BarChart3, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Ship,
    title: 'Expert Brokerage',
    description: 'Specialized dry-bulk and break-bulk chartering services with deep market knowledge and extensive network of trusted partners.'
  },
  {
    icon: BarChart3,
    title: 'Market Insights',
    description: 'Real-time market analysis, freight rate trends, and strategic advisory services to optimize your shipping decisions.'
  },
  {
    icon: Globe,
    title: 'Local Expertise',
    description: 'Deep understanding of MENA markets, regulations, and business practices with international standards and reach.'
  }
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-ocean-900 via-ocean-800 to-ocean-700">
        {/* Background Image with improved contrast */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/website-cover.jpeg)'
          }}
        />
        <div className="absolute inset-0 bg-ocean-900/60" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-poppins font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Niche Dry-Bulk Brokerage
              <span className="block text-foam-300">for MENA</span>
            </h1>
            <p className="text-xl md:text-2xl text-ocean-100 mb-8 max-w-3xl mx-auto drop-shadow">
              Connecting cargo owners and ship operators across the Middle East and North Africa with expert maritime brokerage services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-primary shadow-lg transition-all duration-200 hover:shadow-xl focus-ring">
                <Link to="/list-cargo">
                  List Cargo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="btn-secondary shadow-lg transition-all duration-200 hover:shadow-xl focus-ring">
                <Link to="/list-vessel">
                  List Vessel
                  <Ship className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-ocean-900 mb-4">
              Why Choose Arab ShipBroker
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We combine local market expertise with international standards to deliver exceptional maritime brokerage services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-elevated focus-ring">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="h-8 w-8 text-ocean-500" />
                    </div>
                    <h3 className="text-xl font-poppins font-semibold text-ocean-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-ocean-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-ocean-900 mb-6">
                Trusted Maritime Partners
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Our boutique approach ensures personalized service while our extensive network delivers global reach. We specialize in dry-bulk and break-bulk commodities, offering comprehensive solutions from chartering to vessel sales and purchase.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Our team combines deep regional knowledge with international expertise, enabling us to navigate complex markets and deliver optimal solutions for our clients. From first-time shippers to established operators, we provide the guidance and connections needed to succeed in today's dynamic shipping environment.
              </p>
              <Button asChild className="btn-primary focus-ring">
                <Link to="/services">
                  Our Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/home-image.jpeg"
                alt="Maritime operations"
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/20 to-transparent rounded-lg" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}