import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Card, CardContent } from './ui/card';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterSignupProps {
  variant?: 'inline' | 'card';
  className?: string;
}

export function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: data.email,
          name: data.name || null,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This email is already subscribed to our newsletter.');
          return;
        }
        throw error;
      }

      setIsSubmitted(true);
      toast.success('Successfully subscribed to our newsletter!');
      form.reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {variant === 'card' && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Your name (optional)" 
                    className="focus-ring focus:ring-foam-500" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className={variant === 'inline' ? 'flex gap-2' : 'space-y-2'}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={variant === 'inline' ? 'flex-1' : ''}>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="focus-ring focus:ring-foam-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="btn-secondary focus-ring"
            size={variant === 'inline' ? 'default' : 'lg'}
          >
            {form.formState.isSubmitting ? (
              'Subscribing...'
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (variant === 'card') {
    return (
      <Card className={`border-0 shadow-lg bg-ocean-800 text-white ${className}`}>
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <Mail className="h-8 w-8 text-foam-300 mx-auto mb-2" />
            <h3 className="font-poppins font-semibold text-white mb-1">
              Stay Updated
            </h3>
            <p className="text-sm text-ocean-200">
              Get the latest maritime market insights and opportunities
            </p>
          </div>
          {formContent}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {formContent}
    </div>
  );
}