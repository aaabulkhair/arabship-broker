import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProgressBar } from '@/components/ProgressBar';
import { ArrowRight, CheckCircle, Plus, Package, MapPin, User } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const steps = ['Cargo Details', 'Routing', 'Contact'];

export default function ListCargoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cargoName: '',
    quantity: '',
    quantityUnit: '',
    imsbcType: '',
    stowageFactor: '',
    loadingPort: '',
    dischargingPort: '',
    laycanFrom: '',
    laycanTo: '',
    targetFreight: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    companyType: 'firm',
    firstFixture: 'no',
    agreeTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    const { name, checked } = e.target;
    console.log(`Checkbox ${name} changed to:`, checked);
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: checked
      };
      console.log('Updated form data:', newFormData);
      return newFormData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Cargo listing submitted:', formData);
      
      // Save to Supabase database
      console.log('Attempting to save cargo to Supabase...');
      const { data: submissionData, error } = await supabase
        .from('cargo_listings')
        .insert({
          cargo_type: formData.cargoName,
          origin_port: formData.loadingPort,
          destination_port: formData.dischargingPort,
          cargo_weight: formData.quantity ? parseFloat(formData.quantity) : null,
          cargo_volume: null, // You can add a volume field later if needed
          preferred_vessel_type: formData.imsbcType,
          loading_date: formData.laycanFrom || null,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          company: formData.companyType,
          additional_details: `IMSBC: ${formData.imsbcType}, Quantity: ${formData.quantity} ${formData.quantityUnit}, Stowage Factor: ${formData.stowageFactor}, Laycan: ${formData.laycanFrom} to ${formData.laycanTo}, Target Freight: ${formData.targetFreight}, First Fixture: ${formData.firstFixture}`
        }, { returning: 'minimal' });

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Database error: ${error.message}`);
        return;
      }

      console.log('Cargo saved successfully:', submissionData);
      toast.success('✅ Cargo listing submitted successfully!');
      setIsSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting cargo:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Cargo Listed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your cargo listing has been submitted. Our team will review it and contact you within 24 hours.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(0);
                  setFormData({
                    cargoName: '',
                    quantity: '',
                    quantityUnit: '',
                    imsbcType: '',
                    stowageFactor: '',
                    loadingPort: '',
                    dischargingPort: '',
                    laycanFrom: '',
                    laycanTo: '',
                    targetFreight: '',
                    contactName: '',
                    contactPhone: '',
                    contactEmail: '',
                    companyType: 'firm',
                    firstFixture: 'no',
                    agreeTerms: false
                  });
                }}
                className="w-full px-4 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Cargo</span>
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
              List Your Cargo
            </h1>
            <p className="text-lg text-gray-600">
              Submit your cargo details and we'll connect you with suitable vessels in our network
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

            {/* Step 1: Cargo Details */}
            {currentStep === 0 && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-ocean-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Cargo Details</h3>
                    <p className="text-gray-600">Tell us about your cargo specifications</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Cargo Name - Full Width */}
                  <div className="space-y-2">
                    <label htmlFor="cargoName" className="block text-sm font-medium text-gray-700">
                      Cargo Name *
                    </label>
                    <input
                      type="text"
                      id="cargoName"
                      name="cargoName"
                      value={formData.cargoName}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                      placeholder="Enter cargo name"
                      required
                    />
                  </div>

                  {/* IMSBC Classification - Full Width */}
                  <div className="space-y-2">
                    <label htmlFor="imsbcType" className="block text-sm font-medium text-gray-700">
                      IMSBC Classification *
                    </label>
                    <select
                      id="imsbcType"
                      name="imsbcType"
                      value={formData.imsbcType}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors bg-white"
                      required
                    >
                      <option value="">Select IMSBC classification</option>
                      <option value="group-a">Group A - Cargoes which may liquefy</option>
                      <option value="group-b">Group B - Cargoes which possess chemical hazards</option>
                      <option value="group-c">Group C - Cargoes which are neither liable to liquefy nor possess chemical hazards</option>
                    </select>
                  </div>

                  {/* Quantity and Unit - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="Enter quantity"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="quantityUnit" className="block text-sm font-medium text-gray-700">
                        Unit *
                      </label>
                      <select
                        id="quantityUnit"
                        name="quantityUnit"
                        value={formData.quantityUnit}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors bg-white"
                        required
                      >
                        <option value="">Select unit</option>
                        <option value="mt">Metric Tons (MT)</option>
                        <option value="cbm">Cubic Meters (CBM)</option>
                        <option value="tons">Tons</option>
                        <option value="units">Units/Pieces</option>
                      </select>
                    </div>
                  </div>

                  {/* Stowage Factor - Full Width */}
                  <div className="space-y-2">
                    <label htmlFor="stowageFactor" className="block text-sm font-medium text-gray-700">
                      Stowage Factor <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="stowageFactor"
                      name="stowageFactor"
                      value={formData.stowageFactor}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                      placeholder="Enter stowage factor (m³/MT)"
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-8 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-medium flex items-center space-x-2"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Routing */}
            {currentStep === 1 && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-foam-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-foam-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Routing Information</h3>
                    <p className="text-gray-600">Specify ports and timeline for your cargo</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Loading and Discharging Ports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="loadingPort" className="block text-sm font-medium text-gray-700">
                        Loading Port *
                      </label>
                      <input
                        type="text"
                        id="loadingPort"
                        name="loadingPort"
                        value={formData.loadingPort}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="e.g., Jebel Ali, Dubai"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="dischargingPort" className="block text-sm font-medium text-gray-700">
                        Discharging Port *
                      </label>
                      <input
                        type="text"
                        id="dischargingPort"
                        name="dischargingPort"
                        value={formData.dischargingPort}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        placeholder="e.g., Port Said, Egypt"
                        required
                      />
                    </div>
                  </div>

                  {/* Laycan Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="laycanFrom" className="block text-sm font-medium text-gray-700">
                        Laycan From *
                      </label>
                      <input
                        type="date"
                        id="laycanFrom"
                        name="laycanFrom"
                        value={formData.laycanFrom}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="laycanTo" className="block text-sm font-medium text-gray-700">
                        Laycan To *
                      </label>
                      <input
                        type="date"
                        id="laycanTo"
                        name="laycanTo"
                        value={formData.laycanTo}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Target Freight Rate */}
                  <div className="space-y-2">
                    <label htmlFor="targetFreight" className="block text-sm font-medium text-gray-700">
                      Target Freight Rate <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="targetFreight"
                      name="targetFreight"
                      value={formData.targetFreight}
                      onChange={handleInputChange}
                      className="form-input w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
                      placeholder="e.g., $25/MT or Worldscale 85"
                    />
                    <p className="text-xs text-gray-500">Leave blank for best market rate or enter your target rate</p>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-500">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition-colors font-medium flex items-center space-x-2"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Contact */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-coral-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                    <p className="text-gray-600">How can we reach you about this cargo</p>
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

                  {/* Company Type */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.companyType === 'firm' ? 'border-ocean-500 bg-ocean-50' : 'border-slate-300 hover:border-ocean-300'
                      }`} onClick={() => handleInputChange({ target: { name: 'companyType', value: 'firm' } } as React.ChangeEvent<HTMLInputElement>)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          formData.companyType === 'firm' ? 'border-ocean-500 bg-ocean-500' : 'border-slate-300'
                        }`}>
                          {formData.companyType === 'firm' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Firm</div>
                          <div className="text-sm text-gray-600">Direct cargo owner/operator</div>
                        </div>
                      </div>
                      <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.companyType === 'nfc' ? 'border-ocean-500 bg-ocean-50' : 'border-slate-300 hover:border-ocean-300'
                      }`} onClick={() => handleInputChange({ target: { name: 'companyType', value: 'nfc' } } as React.ChangeEvent<HTMLInputElement>)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          formData.companyType === 'nfc' ? 'border-ocean-500 bg-ocean-500' : 'border-slate-300'
                        }`}>
                          {formData.companyType === 'nfc' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">NFC</div>
                          <div className="text-sm text-gray-600">Non-firm cargo broker</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* First Fixture */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Is this your first fixture? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.firstFixture === 'yes' ? 'border-ocean-500 bg-ocean-50' : 'border-slate-300 hover:border-ocean-300'
                      }`} onClick={() => handleInputChange({ target: { name: 'firstFixture', value: 'yes' } } as React.ChangeEvent<HTMLInputElement>)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          formData.firstFixture === 'yes' ? 'border-ocean-500 bg-ocean-500' : 'border-slate-300'
                        }`}>
                          {formData.firstFixture === 'yes' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Yes</div>
                          <div className="text-sm text-gray-600">This is my first fixture</div>
                        </div>
                      </div>
                      <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.firstFixture === 'no' ? 'border-ocean-500 bg-ocean-50' : 'border-slate-300 hover:border-ocean-300'
                      }`} onClick={() => handleInputChange({ target: { name: 'firstFixture', value: 'no' } } as React.ChangeEvent<HTMLInputElement>)}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          formData.firstFixture === 'no' ? 'border-ocean-500 bg-ocean-500' : 'border-slate-300'
                        }`}>
                          {formData.firstFixture === 'no' && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">No</div>
                          <div className="text-sm text-gray-600">I have experience with fixtures</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors bg-slate-50 border-slate-200`} 
                       onClick={() => setFormData(prev => ({ ...prev, agreeTerms: !prev.agreeTerms }))}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                      formData.agreeTerms ? 'border-ocean-500 bg-ocean-500' : 'border-slate-300'
                    }`}>
                      {formData.agreeTerms && (
                        <div className="text-white text-xs">✓</div>
                      )}
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      I agree to the <span className="text-ocean-600 hover:text-ocean-700 underline">terms and conditions</span> and <span className="text-ocean-600 hover:text-ocean-700 underline">privacy policy</span>. I understand that Arab ShipBroker will use this information to match my cargo with suitable vessels. *
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-6 mt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Previous
                    </button>
                    <div className="text-sm text-gray-500">
                      Step {currentStep + 1} of {steps.length}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.agreeTerms}
                      className={`px-8 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium flex items-center space-x-2 ${
                        (isSubmitting || !formData.agreeTerms) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Package className="w-4 h-4" />
                          <span>Submit Cargo</span>
                        </>
                      )}
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