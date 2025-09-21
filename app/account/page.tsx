'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  Wallet, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Copy, 
  QrCode, 
  RefreshCw,
  Upload,
  Shield, 
  AlertCircle,
  ChevronDown,
  Share2,
  Save,
  Gift,
  DollarSign,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  estimatedTime: string;
  walletAddress: string;
  network: string;
}

export default function MyAccountPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('bep20');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState<string>('');
  const [showAmountWarning, setShowAmountWarning] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [hashPassword, setHashPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
  // Deposit addresses for different networks
  const depositAddresses = {
    trc20: "TTxh7Fv9Npov8rZGYzYzwcUWhQzBEpAtzt",
    bep20: "0xdfca28ad998742570aecb7ffde1fe564b7d42c30"
  };
  
  const depositAddress = depositAddresses[selectedNetwork as keyof typeof depositAddresses];

  useEffect(() => {
    loadPaymentMethods();
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/dashboard/user-data', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
      } else {
        console.error('Failed to load user data');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payments/methods');
      const data = await response.json();
      if (data.success) {
        setPaymentMethods(data.data);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (JPG/PNG)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setFileName(file.name);
      setFormErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!hashPassword.trim()) {
      errors.hashPassword = 'Hash password is required';
    } else if (hashPassword.length < 6) {
      errors.hashPassword = 'Hash password must be at least 6 characters';
    }
    
    if (!amount || parseFloat(amount) < 50) {
      errors.amount = 'Minimum deposit is 50 USDT';
    }
    
    if (!selectedFile) {
      errors.file = 'Please upload a transaction screenshot';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('fullName', fullName);
      submitData.append('email', email);
      submitData.append('hashPassword', hashPassword);
      submitData.append('amount', amount);
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
        setFullName('');
        setEmail('');
        setHashPassword('');
        setAmount('');
        setSelectedFile(null);
        setFileName('');
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
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard!');
  };

  const downloadQRCode = () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account settings and deposits</p>
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
                <div className="w-48 h-48 bg-white flex items-center justify-center rounded-lg">
                  <div className="w-44 h-44 bg-black grid grid-cols-8 grid-rows-8 gap-0.5 p-2">
                    {Array.from({ length: 64 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`w-full h-full ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                      />
                    ))}
                  </div>
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
                <span className="font-medium text-green-600">
                  {selectedNetwork === 'trc20' ? '~1-5 USDT' : '-1.5 USDT'}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
            
            <form onSubmit={handleDepositSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={hashPassword}
                  onChange={(e) => setHashPassword(e.target.value)}
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
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
                      Selected: {fileName}
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
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Submitting...' : 'Submit Payment'}
              </button>
            </form>
          </div>
        </div>

        {/* Account Information */}
        {userData && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-medium">{userData.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Referral Code</p>
                <p className="font-medium">{userData.referral_code}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}