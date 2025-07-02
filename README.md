# Arab ShipBroker

A modern maritime brokerage platform built with React, TypeScript, and Supabase. The application facilitates cargo and vessel listings, contact management, and maritime business operations.

## Features

- 🚢 **Vessel Listings**: Comprehensive vessel registration and management
- 📦 **Cargo Listings**: Efficient cargo posting and tracking system  
- 📧 **Contact Forms**: Professional inquiry management with Supabase integration
- 🔐 **Authentication**: Secure user authentication and authorization
- 📱 **Responsive Design**: Modern UI with Tailwind CSS
- 🔒 **Database Security**: Row Level Security (RLS) policies with Supabase

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Netlify with continuous deployment
- **Security**: reCAPTCHA v3 integration

## Database Schema

- `contact_submissions` - Contact form inquiries
- `cargo_listings` - Cargo posting and details
- `vessel_listings` - Vessel information and availability

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## Live Demo

🌐 [Arab ShipBroker Platform](https://your-netlify-url.netlify.app)

---

*Built for the maritime industry with modern web technologies*
