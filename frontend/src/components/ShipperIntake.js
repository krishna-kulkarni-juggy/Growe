import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  Truck, 
  MapPin, 
  Package,
  Clock,
  CheckCircle,
  Calculator
} from 'lucide-react';

const ShipperIntake = () => {
  const [submitted, setSubmitted] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [shippingCost, setShippingCost] = useState(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const urgencyOptions = ['Low', 'Medium', 'High'];
  const regionOptions = [
    'California', 'Texas', 'Florida', 'New York', 'Illinois', 'Pennsylvania',
    'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia',
    'Washington', 'Arizona', 'Massachusetts', 'Tennessee', 'Indiana', 'Missouri',
    'Maryland', 'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama',
    'Louisiana', 'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah'
  ];

  const productTypes = [
    'Consumer Electronics', 'Apparel', 'Health & Wellness', 'Food & Beverage',
    'Home & Garden', 'Automotive', 'Books & Media', 'Sports & Outdoors',
    'Beauty & Personal Care', 'Industrial Equipment', 'Other'
  ];

  const watchedValues = watch();

  const calculateShippingCost = () => {
    setCalculating(true);
    
    // Simple cost calculation algorithm
    setTimeout(() => {
      const baseRate = 2.50; // base rate per shipment
      const volumeMultiplier = watchedValues.monthly_shipments > 1000 ? 0.8 : 
                              watchedValues.monthly_shipments > 500 ? 0.9 : 1.0;
      const urgencyMultiplier = watchedValues.urgency === 'High' ? 1.3 : 
                               watchedValues.urgency === 'Medium' ? 1.1 : 1.0;
      const regionMultiplier = watchedValues.regions_needed?.length > 3 ? 1.2 : 1.0;
      
      const estimatedCost = baseRate * volumeMultiplier * urgencyMultiplier * regionMultiplier;
      const monthlyCost = estimatedCost * (watchedValues.monthly_shipments || 0);
      
      setShippingCost({
        perShipment: estimatedCost.toFixed(2),
        monthly: monthlyCost.toFixed(2),
        annual: (monthlyCost * 12).toFixed(2)
      });
      setCalculating(false);
    }, 2000);
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        monthly_shipments: parseInt(data.monthly_shipments),
        regions_needed: Array.isArray(data.regions_needed) ? data.regions_needed : [data.regions_needed]
      };

      await axios.post('/api/shipper-leads', formData);
      toast.success('Thank you! Your request has been submitted successfully.');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('There was an error submitting your request. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Request Submitted!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Thank you for your interest in our 3PL network. We'll match you with suitable partners and get back to you within 24 hours.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900">What happens next?</h3>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• We'll analyze your requirements</li>
                <li>• Match you with suitable 3PL partners</li>
                <li>• Connect you directly with qualified providers</li>
                <li>• Provide ongoing support throughout the process</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 btn-primary"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect 3PL Partner</h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect with vetted logistics providers in our nationwide network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-lg p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        {...register('company_name', { required: 'Company name is required' })}
                        className="input-field"
                        placeholder="Your Company Name"
                      />
                      {errors.company_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Name *
                      </label>
                      <input
                        {...register('contact_name', { required: 'Contact name is required' })}
                        className="input-field"
                        placeholder="Your Full Name"
                      />
                      {errors.contact_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.contact_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="input-field"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="input-field"
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Product & Shipping Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Type *
                      </label>
                      <select
                        {...register('product_type', { required: 'Product type is required' })}
                        className="input-field"
                      >
                        <option value="">Select Product Type</option>
                        {productTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.product_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.product_type.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Shipments *
                      </label>
                      <input
                        type="number"
                        {...register('monthly_shipments', { 
                          required: 'Monthly shipments is required',
                          min: { value: 1, message: 'Must be at least 1' }
                        })}
                        className="input-field"
                        placeholder="e.g., 500"
                        min="1"
                      />
                      {errors.monthly_shipments && (
                        <p className="mt-1 text-sm text-red-600">{errors.monthly_shipments.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Urgency Level *
                      </label>
                      <select
                        {...register('urgency', { required: 'Urgency level is required' })}
                        className="input-field"
                      >
                        <option value="">Select Urgency</option>
                        {urgencyOptions.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      {errors.urgency && (
                        <p className="mt-1 text-sm text-red-600">{errors.urgency.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Region *
                      </label>
                      <select
                        {...register('regions_needed', { required: 'At least one region is required' })}
                        className="input-field"
                      >
                        <option value="">Select Primary Region</option>
                        {regionOptions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      {errors.regions_needed && (
                        <p className="mt-1 text-sm text-red-600">{errors.regions_needed.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={calculateShippingCost}
                    disabled={!watchedValues.monthly_shipments || calculating}
                    className="btn-secondary flex items-center"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {calculating ? 'Calculating...' : 'Calculate Shipping Cost'}
                  </button>

                  <button type="submit" className="btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why Choose Us */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Why Choose Growe?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Vetted 3PL partners nationwide</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">No commission fees to shippers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Expert guidance throughout</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Fast turnaround time</span>
                </li>
              </ul>
            </div>

            {/* Cost Calculator Results */}
            {shippingCost && (
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estimated Shipping Costs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Per Shipment:</span>
                    <span className="text-sm font-medium text-gray-900">${shippingCost.perShipment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly:</span>
                    <span className="text-sm font-medium text-gray-900">${shippingCost.monthly}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-medium text-gray-900">Annual:</span>
                    <span className="text-lg font-bold text-blue-600">${shippingCost.annual}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  *Estimates based on industry averages. Actual costs may vary.
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our logistics experts are here to help you find the perfect 3PL partner.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Phone:</strong> (555) 123-GROWE
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> hello@growe-co.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperIntake;