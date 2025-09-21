"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowUpRight, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WithdrawalsPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    transactionHash: '',
    transactionUID: '',
    email: '',
    amount: ''
  });
  
  const [selectedNetwork, setSelectedNetwork] = useState('trc20');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.transactionHash.trim()) {
      errors.transactionHash = 'Transaction hash is required';
    }
    
    if (!formData.transactionUID.trim()) {
      errors.transactionUID = 'Transaction UID is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.amount || parseFloat(formData.amount) < 10) {
      errors.amount = 'Minimum withdrawal is 10 USDT';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          network: selectedNetwork
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Withdrawal request submitted successfully!');
        // Reset form
        setFormData({
          transactionHash: '',
          transactionUID: '',
          email: '',
          amount: ''
        });
      } else {
        toast.error(result.message || 'Failed to submit withdrawal request');
      }
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      toast.error('Failed to submit withdrawal request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Withdrawals</h1>
          <p className="text-gray-600">Submit your withdrawal requests and track their status</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Withdrawal Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Network Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Network *
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedNetwork('trc20')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedNetwork === 'trc20'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    TRC20 (Tron)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedNetwork('bep20')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedNetwork === 'bep20'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    BEP20 (BSC)
                  </button>
                </div>
              </div>

              {/* Transaction Hash */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Hash *
                </label>
                <input
                  type="text"
                  name="transactionHash"
                  value={formData.transactionHash}
                  onChange={handleInputChange}
                  placeholder="Enter your transaction hash"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.transactionHash ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.transactionHash && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.transactionHash}</p>
                )}
              </div>

              {/* Transaction UID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction UID *
                </label>
                <input
                  type="text"
                  name="transactionUID"
                  value={formData.transactionUID}
                  onChange={handleInputChange}
                  placeholder="Enter transaction UID"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.transactionUID ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.transactionUID && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.transactionUID}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>

              {/* Withdrawal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount (USDT) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter withdrawal amount"
                  min="10"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.amount && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
                )}
              </div>

              {/* Withdrawal Process Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Withdrawal Process</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Your withdrawal will be processed within 60 minutes to your account. 
                      Please ensure the transaction hash is correct and matches the selected network.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Important Notes</h4>
                    <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                      <li>• Minimum withdrawal amount is 10 USDT</li>
                      <li>• Withdrawal processing time: 60 minutes</li>
                      <li>• Admin fee: 2% on all withdrawals</li>
                      <li>• Ensure transaction hash matches selected network</li>
                      <li>• Double-check all information before submitting</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>
            </form>
          </div>

          {/* Withdrawal History Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Withdrawals</h3>
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No withdrawal history available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
