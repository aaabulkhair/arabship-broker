import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '@/components/ProgressBar';
import { ArrowRight, CheckCircle, Plus, Ship, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const steps = ['Vessel Details', 'Availability', 'Contact & Documents'];

interface VesselFormData {
  // Step 1: Vessel Details
  vesselName: string;
  vesselType: string;
  dwt: string;
  yearBuilt: string;
  flag: string;
  hasGear: string;
  gearDetails: string;
  fuelConsumption: string;
  
  // Step 2: Availability  
  currentLocation: string;
  availability: string;
  preferredTrade: string;
  targetRate: string;
  
  // Step 3: Contact
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyType: string;
  agreeTerms: boolean;
}

// Simplified card option component without radio input
const CardOption = ({ 
  value, 
  name, 
  checked, 
  onClick, 
  title, 
  description 
}: {
  value: string;
  name: string;
  checked: boolean;
  onClick: (value: string) => void;
  title: string;
  description: string;
}) => {
  const baseClasses = "flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md";
  const selectedClasses = "border-ocean-500 bg-ocean-50 shadow-md";
  const unselectedClasses = "border-slate-300 hover:border-ocean-300";
  
  return (
    <div 
      className={`${baseClasses} ${checked ? selectedClasses : unselectedClasses}`}
      onClick={() => onClick(value)}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
        checked ? 'border-ocean-500 bg-ocean-500' : 'border-slate-300'
      }`}>
        {checked && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </div>
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
};

export default function ListVesselPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<VesselFormData>({
    vesselName: '',
    vesselType: '',
    dwt: '',
    yearBuilt: '',
    flag: '',
    hasGear: '',
    gearDetails: '',
    fuelConsumption: '',
    currentLocation: '',
    availability: '',
    preferredTrade: '',
    targetRate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    companyType: '',
    agreeTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Vessel listing submitted:', formData);
      
      // Save to Supabase database
      console.log('Attempting to save vessel to Supabase...');
      const { data: submissionData, error } = await supabase
        .from('vessel_listings')
        .insert({
          vessel_name: formData.vesselName,
          vessel_type: formData.vesselType,
          dwt: formData.dwt ? parseInt(formData.dwt) : null,
          year_built: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
          flag: formData.flag,
          current_location: formData.currentLocation,
          availability_date: formData.availability || null,
          owner_name: formData.contactName,
          owner_email: formData.contactEmail,
          owner_phone: formData.contactPhone,
          company: formData.companyType,
          additional_specs: `Has Gear: ${formData.hasGear}, Gear Details: ${formData.gearDetails}, Fuel Consumption: ${formData.fuelConsumption}, Preferred Trade: ${formData.preferredTrade}, Target Rate: ${formData.targetRate}`
        }, { returning: 'minimal' });

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Database error: ${error.message}`);
        return;
      }

      console.log('Vessel saved successfully:', submissionData);
      toast.success('✅ Vessel listing submitted successfully!');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting vessel:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoize the gear options to prevent re-renders
  const gearOptions = useMemo(() => [
    {
      value: 'yes',
      title: 'Yes',
      description: 'Vessel has cargo gear'
    },
    {
      value: 'no', 
      title: 'No',
      description: 'No cargo gear'
    }
  ], []);

  // Memoize company type options
  const companyTypeOptions = useMemo(() => [
    {
      value: 'owner',
      title: 'Owner',
      description: 'Vessel owner'
    },
    {
      value: 'operator',
      title: 'Operator', 
      description: 'Ship operator'
    },
    {
      value: 'broker',
      title: 'Broker',
      description: 'Ship broker'
    }
  ], []);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-ocean-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Vessel Listed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your vessel listing has been submitted. Our team will review it and contact you within 24 hours.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(0);
                  setFormData({
                    vesselName: '',
                    vesselType: '',
                    dwt: '',
                    yearBuilt: '',
                    flag: '',
                    hasGear: '',
                    gearDetails: '',
                    fuelConsumption: '',
                    currentLocation: '',
                    availability: '',
                    preferredTrade: '',
                    targetRate: '',
                    contactName: '',
                    contactPhone: '',
                    contactEmail: '',
                    companyType: '',
                    agreeTerms: false
                  });
                }}
                className="w-full px-4 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Vessel</span>
              </button>
              <Link
                to="/"
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-50 section-padding">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-ocean-900 mb-4">
              List Your Vessel
            </h1>
            <p className="text-lg text-gray-600">
              Submit your vessel details and we'll connect you with suitable cargo
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={steps.length}
                steps={steps}
              />
            </div>

            {/* Step 1: Vessel Details */}
            {currentStep === 0 && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center">
                    <Ship className="w-6 h-6 text-ocean-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Vessel Details</h3>
                    <p className="text-gray-600">Tell us about your vessel specifications</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Vessel Name - Full Width */}
                  <div className="space-y-2">
                    <label htmlFor="vesselName" className="block text-sm font-medium text-gray-700">
                      Vessel Name *
                    </label>
                    <input
                      type="text"
                      id="vesselName"
                      name="vesselName"
                      value={formData.vesselName}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                      placeholder="e.g., M.V. Ocean Star"
                      required
                    />
                  </div>

                  {/* Vessel Type - Full Width */}
                  <div className="space-y-2">
                    <label htmlFor="vesselType" className="block text-sm font-medium text-gray-700">
                      Vessel Type *
                    </label>
                    <select
                      id="vesselType"
                      name="vesselType"
                      value={formData.vesselType}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors bg-white"
                      required
                    >
                      <option value="">Select vessel type</option>
                      <option value="bulk-carrier">Bulk Carrier</option>
                      <option value="general-cargo">General Cargo</option>
                      <option value="multi-purpose">Multi-Purpose</option>
                      <option value="coaster">Coaster</option>
                    </select>
                  </div>

                  {/* DWT, Year Built, Flag - Three columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="dwt" className="block text-sm font-medium text-gray-700">
                        DWT (tons) *
                      </label>
                      <input
                        type="number"
                        id="dwt"
                        name="dwt"
                        value={formData.dwt}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="25000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">
                        Year Built *
                      </label>
                      <input
                        type="number"
                        id="yearBuilt"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="2010"
                        min="1990"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="flag" className="block text-sm font-medium text-gray-700">
                        Flag *
                      </label>
                      <input
                        type="text"
                        id="flag"
                        name="flag"
                        value={formData.flag}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="e.g., Panama"
                        required
                      />
                    </div>
                  </div>

                  {/* Cargo Gear - Full Width with Memoized Options */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Does the vessel have cargo gear? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {gearOptions.map((option) => (
                        <CardOption
                          key={option.value}
                          value={option.value}
                          name="hasGear"
                          checked={formData.hasGear === option.value}
                          onClick={(value) => handleInputChange({ target: { name: 'hasGear', value } } as React.ChangeEvent<HTMLInputElement>)}
                          title={option.title}
                          description={option.description}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Gear Details - Always rendered to prevent layout shift */}
                  <div className={`space-y-2 transition-opacity duration-200 ${
                    formData.hasGear === 'yes' ? 'opacity-100' : 'opacity-50 pointer-events-none'
                  }`}>
                    <label htmlFor="gearDetails" className="block text-sm font-medium text-gray-700">
                      Gear Details {formData.hasGear === 'yes' ? '*' : '(optional)'}
                    </label>
                    <input
                      type="text"
                      id="gearDetails"
                      name="gearDetails"
                      value={formData.gearDetails}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                      placeholder="e.g., 4 x 25 ton cranes"
                      disabled={formData.hasGear !== 'yes'}
                    />
                  </div>

                  {/* Fuel Consumption - Full Width */}
                  <div className="space-y-2">
                    <label htmlFor="fuelConsumption" className="block text-sm font-medium text-gray-700">
                      Fuel Consumption <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="fuelConsumption"
                      name="fuelConsumption"
                      value={formData.fuelConsumption}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                      placeholder="e.g., 22 MT/day at sea"
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200 space-y-4 sm:space-y-0">
                    <div></div>
                    <div className="text-sm text-gray-500 order-1 sm:order-2">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:w-auto px-8 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-medium flex items-center justify-center space-x-2 order-3"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Availability */}
            {currentStep === 1 && (
              <div className="p-6 md:p-8">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-foam-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-foam-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Availability</h3>
                    <p className="text-gray-600 text-sm md:text-base">Specify location and availability details</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Current Location and Availability Date */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                    <div className="space-y-3">
                      <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Location *
                      </label>
                      <input
                        type="text"
                        id="currentLocation"
                        name="currentLocation"
                        value={formData.currentLocation}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors text-base"
                        placeholder="e.g., Jebel Ali, Dubai"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                        Available Date *
                      </label>
                      <input
                        type="date"
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Preferred Trade Route */}
                  <div className="space-y-3">
                    <label htmlFor="preferredTrade" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Trade Route <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="preferredTrade"
                      name="preferredTrade"
                      value={formData.preferredTrade}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors text-base"
                      placeholder="e.g., Middle East to India, or Any"
                    />
                  </div>

                  {/* Target Rate */}
                  <div className="space-y-3">
                    <label htmlFor="targetRate" className="block text-sm font-medium text-gray-700 mb-2">
                      Target Freight Rate <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="targetRate"
                      name="targetRate"
                      value={formData.targetRate}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors text-base"
                      placeholder="e.g., $25/MT or USD 15,000/day"
                    />
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      Leave blank for best market rate or enter your target rate
                    </p>
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200 space-y-4 sm:space-y-0">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-500 order-1 sm:order-2">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="w-full sm:w-auto px-8 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-medium flex items-center justify-center space-x-2 order-3"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Contact & Documents */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-coral-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                    <p className="text-gray-600">How can we reach you about this vessel</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Name and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="+971 50 123 4567"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                      placeholder="john@company.com"
                      required
                    />
                  </div>

                  {/* Company Type with Memoized Options */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {companyTypeOptions.map((option) => (
                        <CardOption
                          key={option.value}
                          value={option.value}
                          name="companyType"
                          checked={formData.companyType === option.value}
                          onClick={(value) => handleInputChange({ target: { name: 'companyType', value } } as React.ChangeEvent<HTMLInputElement>)}
                          title={option.title}
                          description={option.description}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-start space-x-3">
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, agreeTerms: !prev.agreeTerms }))}
                        className="mt-1 w-4 h-4 border-2 border-gray-300 rounded cursor-pointer flex items-center justify-center bg-white hover:border-ocean-500 transition-colors"
                        style={{ minWidth: '16px', minHeight: '16px' }}
                      >
                        {formData.agreeTerms && (
                          <span className="text-ocean-600 font-bold text-xs">✓</span>
                        )}
                      </div>
                      <label className="text-sm text-gray-700 leading-relaxed cursor-pointer select-none" onClick={() => setFormData(prev => ({ ...prev, agreeTerms: !prev.agreeTerms }))}>
                        I agree to the <span className="text-ocean-600 hover:text-ocean-700 underline">terms and conditions</span> and <span className="text-ocean-600 hover:text-ocean-700 underline">privacy policy</span>. I understand that Arab ShipBroker will use this information to match my vessel with suitable cargo. *
                      </label>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-8 mt-8 border-t border-gray-200 space-y-4 sm:space-y-0">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:w-auto px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium order-2 sm:order-1"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-500 order-1 sm:order-2">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium flex items-center justify-center space-x-2 order-3"
                    >
                      <Ship className="w-4 h-4" />
                      <span>Submit Vessel</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}