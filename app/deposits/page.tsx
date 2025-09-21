"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowDownLeft, 
  Copy, 
  QrCode, 
  Share2, 
  Save,
  Upload,
  AlertCircle,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DepositsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    hashPassword: '',
    amount: '0.00'
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('trc20');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Deposit address (this would come from your backend)
  const depositAddress = "Bdffca28ad996742570mmcb7ffd1f56b7d12c30";
  const qrCodeData = `tron:${depositAddress}`;

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
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.hashPassword.trim()) {
      errors.hashPassword = 'Hash password is required';
    } else if (formData.hashPassword.length < 6) {
      errors.hashPassword = 'Hash password must be at least 6 characters';
    }
    
    if (!formData.amount || parseFloat(formData.amount) < 50) {
      errors.amount = 'Minimum deposit is 50 USDT';
    }
    
    if (!selectedFile) {
      errors.file = 'Please upload a transaction screenshot';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPG/PNG)');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setFormErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('hashPassword', formData.hashPassword);
      submitData.append('amount', formData.amount);
      submitData.append('network', selectedNetwork);
      if (selectedFile) {
        submitData.append('screenshot', selectedFile);
      }
      
      const response = await fetch('/api/deposits', {
        method: 'POST',
        body: submitData
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Deposit request submitted successfully!');
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          hashPassword: '',
          amount: '0.00'
        });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(result.message || 'Failed to submit deposit request');
      }
    } catch (error) {
      console.error('Error submitting deposit:', error);
      toast.error('Failed to submit deposit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const downloadQRCode = () => {
    // This would generate and download the QR code
    toast.success('QR code downloaded!');
  };

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BDS PRO Deposit Address',
        text: `Deposit USDT to: ${depositAddress}`,
        url: window.location.href
      });
    } else {
      copyToClipboard(depositAddress);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deposits</h1>
          <p className="text-gray-600">Manage your USDT deposits and transactions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment QR Code Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment QR Code</h2>
            
            {/* Network Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Payment Network</label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedNetwork('trc20')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedNetwork === 'trc20'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  TRX Tron (TRC20)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNetwork('bep20')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedNetwork === 'bep20'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  BSC BNB Smart Chain (BEP20)
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Deposit Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedNetwork === 'trc20' ? 'TRC20 (Tron) Deposit Address' : 'BSC BNB Smart Chain (BEP20) Deposit Address'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={depositAddress}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(depositAddress)}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                type="button"
                onClick={downloadQRCode}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save as Image</span>
              </button>
              <button
                type="button"
                onClick={shareAddress}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Address</span>
              </button>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Minimum Deposit:</span>
                <span className="font-medium">50 USDT</span>
              </div>
              <div className="flex justify-between">
                <span>Network Fee:</span>
                <span className="font-medium text-green-600">-1.5 USDT</span>
              </div>
            </div>
          </div>

          {/* Payment Information Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.fullName}</p>
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

              {/* Hash Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hash Password *
                </label>
                <input
                  type="password"
                  name="hashPassword"
                  value={formData.hashPassword}
                  onChange={handleInputChange}
                  placeholder="Enter your hash password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.hashPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.hashPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.hashPassword}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USDT) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="50"
                  step="0.01"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.amount && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
                )}
              </div>

              {/* Transaction Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Screenshot *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    formErrors.file ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Upload a screenshot of your blockchain transaction
                  </p>
                  <p className="text-xs text-gray-500">(JPG/PNG, max 5MB)</p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {formErrors.file && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.file}</p>
                )}
              </div>

              {/* Important Note */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Make sure to send the exact amount and use the correct network. 
                      Double-check the wallet address before sending your transaction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}