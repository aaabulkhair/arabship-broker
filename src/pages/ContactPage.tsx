import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Send, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  howDidYouFindUs: z.string().min(1, 'Please select how you found us'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone Number',
    details: ['+20 101 032 9231']
  },
  {
    icon: Mail,
    label: 'Email Address',
    details: ['info@arabshipbroker.com']
  },
  {
    icon: MapPin,
    label: 'Office Address',
    details: ['5th Settlement, New Cairo, Egypt', '(Office under set up)']
  },
  {
    icon: Clock,
    label: 'Business Hours',
    details: ['Sunday - Thursday: 9:00 AM - 6:00 PM', 'Friday: 9:00 AM - 1:00 PM', 'Saturday: Closed']
  }
];

export default function ContactPage() {
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  // Load reCAPTCHA v3 script
  useEffect(() => {
    const loadRecaptchaScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.onload = () => {
        setIsRecaptchaLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadRecaptchaScript();

    // Cleanup
    return () => {
      const script = document.querySelector(
        `script[src="https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}"]`
      );
      if (script) {
        document.head.removeChild(script);
      }
      
      // Remove reCAPTCHA badge
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge) {
        badge.remove();
      }
    };
  }, []);

  // Get reCAPTCHA token
  const executeRecaptcha = useCallback(async (): Promise<string | null> => {
    if (!isRecaptchaLoaded || !window.grecaptcha) {
      console.error('reCAPTCHA not loaded');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
        action: 'contact_form'
      });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution failed:', error);
      return null;
    }
  }, [isRecaptchaLoaded]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Execute reCAPTCHA v3
      const recaptchaToken = await executeRecaptcha();
      
      if (!recaptchaToken) {
        console.error('reCAPTCHA failed');
        toast.error('Security verification failed. Please try again.');
        return;
      }

      console.log('Contact form submitted:', data);
      console.log('reCAPTCHA v3 token:', recaptchaToken);
      
      // Save to Supabase database
      console.log('Attempting to save to Supabase...');
      const { data: submissionData, error } = await supabase
        .from('contact_submissions')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.howDidYouFindUs, // Store "how did you find us" in company field for now
          message: data.message
        });

      if (error) {
        console.error('Supabase error details:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        toast.error(`Database error: ${error.message}`);
        return;
      }

      console.log('Form saved successfully to Supabase:', submissionData);
      toast.success('✅ Message sent successfully! We\'ll get back to you within 24 hours.');
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('❌ Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Get In Touch
            </h1>
            <p className="text-xl text-ocean-100 leading-relaxed drop-shadow">
              Ready to discuss your maritime needs? Our experienced team is here to help you navigate the shipping markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section-padding bg-ocean-50 overflow-visible">
        <div className="container overflow-visible">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-visible">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center">
                      <Send className="w-6 h-6 text-ocean-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Send us a Message</h3>
                      <p className="text-gray-600">Fill out the form below and we'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 overflow-visible">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Full Name and Phone - Side by Side */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-gray-700">Full Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Enter your full name" 
                                  className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors placeholder:text-gray-400" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-gray-700">Phone Number *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="+20 101 032 9231" 
                                  className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors placeholder:text-gray-400" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Email - Full Width */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">Email Address *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="your.email@company.com" 
                                className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors placeholder:text-gray-400" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* How did you find us - Full Width */}
                      <FormField
                        control={form.control}
                        name="howDidYouFindUs"
                        render={({ field }) => (
                          <FormItem className="overflow-visible">
                            <FormLabel className="block text-sm font-medium text-gray-700">How did you find us? *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors bg-white placeholder:text-gray-400">
                                  <SelectValue placeholder="Select how you found us" className="text-gray-400" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent 
                                className="z-[9999] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                                position="popper"
                                sideOffset={4}
                              >
                                <SelectItem value="google" className="px-4 py-3 text-gray-900 hover:bg-ocean-50 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900 cursor-pointer data-[highlighted]:bg-ocean-100 data-[highlighted]:text-ocean-900">Google Search</SelectItem>
                                <SelectItem value="referral" className="px-4 py-3 text-gray-900 hover:bg-ocean-50 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900 cursor-pointer data-[highlighted]:bg-ocean-100 data-[highlighted]:text-ocean-900">Referral</SelectItem>
                                <SelectItem value="linkedin" className="px-4 py-3 text-gray-900 hover:bg-ocean-50 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900 cursor-pointer data-[highlighted]:bg-ocean-100 data-[highlighted]:text-ocean-900">LinkedIn</SelectItem>
                                <SelectItem value="industry-contact" className="px-4 py-3 text-gray-900 hover:bg-ocean-50 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900 cursor-pointer data-[highlighted]:bg-ocean-100 data-[highlighted]:text-ocean-900">Industry Contact</SelectItem>
                                <SelectItem value="conference" className="px-4 py-3 text-gray-900 hover:bg-ocean-50 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900 cursor-pointer data-[highlighted]:bg-ocean-100 data-[highlighted]:text-ocean-900">Conference/Event</SelectItem>
                                <SelectItem value="other" className="px-4 py-3 text-gray-900 hover:bg-ocean-50 hover:text-ocean-900 focus:bg-ocean-100 focus:text-ocean-900 cursor-pointer data-[highlighted]:bg-ocean-100 data-[highlighted]:text-ocean-900">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Message - Full Width */}
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your shipping requirements or ask us any questions..."
                                className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors min-h-[120px] placeholder:text-gray-400"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || !isRecaptchaLoaded}
                        className="w-full px-4 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        {isSubmitting ? (
                          <span>Sending Message...</span>
                        ) : !isRecaptchaLoaded ? (
                          <span>Loading Security...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>

                      {/* Google's Required Disclaimer */}
                      <p className="text-xs text-gray-500 text-center mt-4">
                        This site is protected by reCAPTCHA and the Google{' '}
                        <a 
                          href="https://policies.google.com/privacy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-ocean-600 hover:text-ocean-700 underline"
                        >
                          Privacy Policy
                        </a>{' '}
                        and{' '}
                        <a 
                          href="https://policies.google.com/terms" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-ocean-600 hover:text-ocean-700 underline"
                        >
                          Terms of Service
                        </a>{' '}
                        apply.
                      </p>
                    </form>
                  </Form>
                </div>
              </div>
            </motion.div>

            {/* Contact Information & Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Info Cards */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-md bg-white">
                    <CardContent className="p-6 bg-white">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-ocean-100 to-ocean-50 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <info.icon className="h-6 w-6 text-ocean-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-poppins font-semibold text-gray-900 mb-2 text-base">
                            {info.label}
                          </h3>
                          <div className="space-y-1">
                            {info.details.map((detail, i) => (
                              <p key={i} className="text-gray-700 text-sm leading-relaxed">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Google Maps Embed */}
              <Card className="border-0 shadow-md bg-white">
                <CardContent className="p-0 bg-white">
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13812.17!2d31.4944!3d30.0263!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzUzLjciTiAzMcKwMjknMzYuNyJF!5e0!3m2!1sen!2seg!4v1735715456789!5m2!1sen!2seg"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Arab ShipBroker Office Location - 5th Settlement, New Cairo, Egypt"
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}