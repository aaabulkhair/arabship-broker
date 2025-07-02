import { motion } from 'framer-motion';
import { Ship, FileSearch, Shield, TrendingUp, Package, Anchor, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const services = [
  {
    icon: Ship,
    title: 'Dry-Bulk Brokerage',
    description: 'Comprehensive chartering services for dry-bulk commodities including grains, coal, iron ore, and fertilizers with competitive rates and reliable execution.'
  },
  {
    icon: Package,
    title: 'Break-Bulk Brokerage',
    description: 'Specialized handling of break-bulk cargo including steel products, machinery, and project cargo with expert logistics coordination.'
  },
  {
    icon: Anchor,
    title: 'S&P Services (<30K DWT)',
    description: 'Vessel sales and purchase advisory for smaller tonnage vessels with comprehensive market analysis and transaction support.'
  },
  {
    icon: FileSearch,
    title: 'Pre-Hire Inspections',
    description: 'Thorough vessel inspections before charter to ensure compliance, safety, and operational readiness with detailed reporting.'
  },
  {
    icon: Shield,
    title: 'War-Risk Clauses',
    description: 'Expert advisory on war-risk clauses and insurance matters for vessels operating in sensitive regions.'
  },
  {
    icon: TrendingUp,
    title: 'Market Analysis',
    description: 'Real-time market intelligence, freight rate analysis, and strategic advisory services to optimize your shipping decisions.'
  },
  {
    icon: Globe,
    title: 'MENA Expertise',
    description: 'Deep regional knowledge of Middle East and North African markets, regulations, and business practices.'
  }
];

const faqs = [
  {
    question: 'What types of cargo do you specialize in?',
    answer: 'We specialize in dry-bulk commodities including grains, coal, iron ore, fertilizers, and break-bulk cargo such as steel products, machinery, and project cargo. Our expertise covers the full spectrum of non-containerized cargo commonly traded in the MENA region.'
  },
  {
    question: 'What is your coverage area?',
    answer: 'While we specialize in the MENA region, our network extends globally. We handle shipments originating from or destined to the Middle East and North Africa, with particular expertise in regional ports, regulations, and market conditions.'
  },
  {
    question: 'How do you determine charter rates?',
    answer: 'Our rates are based on real-time market analysis, considering factors such as vessel availability, route efficiency, seasonal demand, and current market conditions. We provide competitive rates while ensuring quality service and reliable execution.'
  },
  {
    question: 'Do you handle vessel inspections?',
    answer: 'Yes, we provide comprehensive pre-hire inspections to ensure vessels meet safety and operational standards. Our experienced surveyors conduct thorough inspections and provide detailed reports covering structural condition, equipment functionality, and compliance status.'
  },
  {
    question: 'What support do you provide for first-time shippers?',
    answer: 'We offer comprehensive guidance for first-time shippers, including documentation assistance, regulatory compliance advice, logistics coordination, and step-by-step support throughout the shipping process. Our team ensures smooth execution from contract to delivery.'
  },
  {
    question: 'How do you handle war-risk situations?',
    answer: 'We provide expert advisory on war-risk clauses and work with specialized insurance providers to ensure proper coverage. Our team monitors geopolitical situations and provides guidance on route planning and risk mitigation strategies.'
  }
];

export default function ServicesPage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-ocean-900 to-ocean-700 text-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6 text-white drop-shadow-lg">
              Comprehensive Maritime Services
            </h1>
            <p className="text-xl text-ocean-100 leading-relaxed drop-shadow">
              From chartering to vessel sales, we provide end-to-end maritime solutions tailored to the unique needs of the MENA shipping market.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
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
              Our Services
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Specialized maritime brokerage services designed to meet the diverse needs of cargo owners and ship operators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full card-elevated focus-ring">
                  <CardHeader className="text-center pb-4">
                    <div className="w-14 h-14 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <service.icon className="h-7 w-7 text-ocean-500" />
                    </div>
                    <CardTitle className="text-lg font-poppins font-semibold text-ocean-900">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-ocean-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-ocean-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Get answers to common questions about our services and maritime brokerage processes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-lg border-0 shadow-sm px-6 focus-within:ring-2 focus-within:ring-ocean-500"
                >
                  <AccordionTrigger className="text-left font-poppins font-semibold text-ocean-900 hover:no-underline hover:text-ocean-500 transition-colors focus-ring rounded-md">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </div>
  );
}