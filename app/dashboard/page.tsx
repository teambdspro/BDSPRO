"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LogOut, User, Users, LayoutGrid, Wallet, TrendingUp, Gift, Briefcase, ArrowUpRight, Home } from 'lucide-react';

type StatCard = {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data fetching hooks - moved to top to follow Rules of Hooks
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState<Array<{ 
    id: number; 
    date: string; 
    name: string; 
    detail: string; 
    credit: number; 
    debit: number; 
    balance: number;
    type: string;
    status: string;
  }>>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromFilter, setFromFilter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // User data state
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Fetch transactions function
  const fetchTransactions = async (userId: string) => {
    try {
      console.log('=== FETCHING TRANSACTIONS ===');
      console.log('User ID:', userId);
      console.log('User ID type:', typeof userId);
      
      setDataLoading(true);
      const url = `/api/transactions?userId=${userId}`;
      console.log('API URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        console.log('Setting transactions:', data.transactions);
        setTransactions(data.transactions);
        setError(null);
      } else {
        console.error('API returned error:', data);
        setError(data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Network error while fetching transactions');
    } finally {
      setDataLoading(false);
    }
  };

  // Check authentication on component mount
  // Handle NextAuth session
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }
    
    if (status === 'authenticated' && session) {
      console.log('NextAuth session found:', session);
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }
    
    if (status === 'unauthenticated') {
      console.log('NextAuth session not found, checking localStorage');
    }
  }, [status, session]);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('=== AUTH CHECK START ===');
      console.log('Current URL:', window.location.href);
      console.log('URL search params:', window.location.search);
      
      // Check for Google OAuth callback parameters
      const urlParams = new URLSearchParams(window.location.search);
      const googleAuth = urlParams.get('google_auth');
      const token = urlParams.get('token');
      const name = urlParams.get('name');
      const email = urlParams.get('email');
      
      console.log('URL params:', { googleAuth, token: token ? 'present' : 'missing', name, email });

      if (googleAuth === 'success' && token && name && email) {
        // Handle Google OAuth callback
        try {
          const user = {
            name,
            email,
            provider: 'google'
          };
          localStorage.setItem('authToken', token);
          localStorage.setItem('userData', JSON.stringify(user));
          setIsAuthenticated(true);
          
          console.log('Google OAuth success, user authenticated:', user);
          
          // Clean up URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Error parsing OAuth data:', error);
          router.push('/login');
        } finally {
          setLoading(false);
        }
        return;
      }

      // Check for regular token or NextAuth session
      const storedToken = localStorage.getItem('authToken');
      const storedUserData = localStorage.getItem('userData');
      
      console.log('=== AUTH CHECK ===');
      console.log('Stored token:', storedToken ? `${storedToken.substring(0, 20)}...` : 'MISSING');
      console.log('Stored user data:', storedUserData ? 'PRESENT' : 'MISSING');
      
      // Check if we have either a stored token or user data
      if (storedToken || storedUserData) {
        console.log('Authentication data found, setting authenticated');
        setIsAuthenticated(true);
      } else {
        console.log('No authentication data found, redirecting to login');
        router.push('/login');
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Filter transactions based on selected category and filters
  const filteredTransactions = transactions.filter(transaction => {
    if (!selectedCategory) return true;
    
    // Filter by category
    const categoryMatch = selectedCategory.toLowerCase().includes(transaction.type.toLowerCase()) ||
                         selectedCategory.toLowerCase().includes(transaction.name.toLowerCase());
    
    // Filter by withdrawal from (if applicable)
    const fromMatch = !fromFilter || transaction.name.toLowerCase().includes(fromFilter.toLowerCase());
    
    // Filter by date range
    const transactionDate = new Date(transaction.date);
    const startMatch = !startDate || transactionDate >= new Date(startDate);
    const endMatch = !endDate || transactionDate <= new Date(endDate);
    
    return categoryMatch && fromMatch && startMatch && endMatch;
  });

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || loading) return;
      
      try {
        setUserLoading(true);
        const token = localStorage.getItem('authToken');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        console.log('=== FETCHING USER DATA ===');
        console.log('isAuthenticated:', isAuthenticated);
        console.log('loading:', loading);
        console.log('Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'MISSING');
        
        if (!token) {
          console.error('No token found in localStorage');
          setError('Authentication token not found. Please log in again.');
          return;
        }
        
        const response = await fetch(`/api/dashboard/user-data`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('User data response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
          const data = await response.json();
          console.log('User data received:', data);
          setUserData(data.data);
          setError(null);
          
          // Fetch transactions for this user
          if (data.data && data.data.user_id) {
            await fetchTransactions(data.data.user_id);
          }
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch user data:', response.status, errorText);
          setError(`Failed to load user data: ${errorText}`);
          
          // If token is invalid, redirect to login
          if (response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, loading, router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // NextAuth will handle its own session cleanup
    router.push('/login');
  };

  // Debug function to manually set a token (for testing)
  const setTestToken = () => {
    const testToken = prompt('Enter a test token:');
    if (testToken) {
      localStorage.setItem('authToken', testToken);
      localStorage.setItem('userData', JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        provider: 'test'
      }));
      console.log('Test token set:', testToken);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Professional Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 98%, #00BFFF 100%),
                linear-gradient(0deg, transparent 98%, #00BFFF 100%),
                radial-gradient(circle at 20% 20%, #00BFFF 3px, transparent 3px),
                radial-gradient(circle at 80% 80%, #00BFFF 3px, transparent 3px)
              `,
              backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px',
              backgroundPosition: '0 0, 0 0, 0 0, 0 0'
            }}></div>
          </div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Professional Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 98%, #00BFFF 100%),
                linear-gradient(0deg, transparent 98%, #00BFFF 100%),
                radial-gradient(circle at 20% 20%, #00BFFF 3px, transparent 3px),
                radial-gradient(circle at 80% 80%, #00BFFF 3px, transparent 3px)
              `,
              backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px',
              backgroundPosition: '0 0, 0 0, 0 0, 0 0'
            }}></div>
          </div>
        </div>
        <div className="relative z-10 text-center max-w-md mx-auto p-6">
          <div className="bg-red-50/95 backdrop-blur-sm border border-red-200 rounded-lg p-6 shadow-2xl">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('userData');
                  router.push('/login');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={setTestToken}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Set Test Token
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const cards: StatCard[] = [
    { 
      title: 'Account Balance', 
      value: userLoading ? 'Loading...' : `$${Number(userData?.account_balance || 0).toFixed(2)} USDT`, 
      icon: Wallet 
    },
    { 
      title: 'Total Earnings', 
      value: userLoading ? 'Loading...' : `$${Number(userData?.total_earning || 0).toFixed(2)} USDT`, 
      icon: TrendingUp 
    },
    { 
      title: 'My Level 1 Income', 
      value: userLoading ? 'Loading...' : `$${Number(userData?.level1_income || 0).toFixed(2)} USDT`, 
      icon: ArrowUpRight 
    },
    { 
      title: 'Rewards', 
      value: userLoading ? 'Loading...' : `$${Number(userData?.rewards || 0).toFixed(2)} USDT`, 
      icon: Gift 
    },
    { 
      title: 'My Level 1 Business', 
      value: userLoading ? 'Loading...' : `$${Number(userData?.level1_business || 0).toFixed(2)} USDT`, 
      icon: Briefcase 
    },
    { 
      title: 'My Level 2 Income', 
      value: userLoading ? 'Loading...' : `$${Number(userData?.level2_income || 0).toFixed(2)} USDT`, 
      icon: ArrowUpRight 
    },
    { 
      title: 'My Level 2 Business', 
      value: userLoading ? 'Loading...' : `$${Number(userData?.level2_business || 0).toFixed(2)} USDT`, 
      icon: Briefcase 
    },
  ];

  const SidebarLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
    >
      {children}
    </Link>
  );

  const Card = ({ title, value, Icon, onClick, isAccountBalance = false }: { title: string; value: string; Icon: React.ComponentType<{ className?: string }>, onClick?: () => void, isAccountBalance?: boolean }) => (
    <button 
      onClick={onClick} 
      className={`rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm p-6 shadow-2xl text-left hover:shadow-xl hover:bg-white transition-all duration-300 ${isAccountBalance ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 grid place-items-center">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wider text-gray-600">{title.toUpperCase()}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          <p className="mt-1 text-xs font-semibold text-emerald-500">+0.00%</p>
          {isAccountBalance && (
            <p className="mt-1 text-xs text-blue-600">Click to view transaction history</p>
          )}
        </div>
      </div>
    </button>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 98%, #00BFFF 100%),
              linear-gradient(0deg, transparent 98%, #00BFFF 100%),
              radial-gradient(circle at 20% 20%, #00BFFF 3px, transparent 3px),
              radial-gradient(circle at 80% 80%, #00BFFF 3px, transparent 3px),
              radial-gradient(circle at 40% 60%, #FF1493 2px, transparent 2px),
              radial-gradient(circle at 60% 40%, #FF1493 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px, 80px 80px, 80px 80px',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0, 0 0'
          }}></div>
        </div>
        
        {/* Central Glowing Logo Area */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-400/30 rounded-full"></div>
        </div>
        
        {/* Financial Charts Simulation */}
        <div className="absolute left-8 top-1/3 w-32 h-40 opacity-15">
          <div className="flex items-end space-x-1 h-full">
            <div className="w-2 bg-green-400 h-8"></div>
            <div className="w-2 bg-red-400 h-12"></div>
            <div className="w-2 bg-green-400 h-6"></div>
            <div className="w-2 bg-red-400 h-10"></div>
            <div className="w-2 bg-green-400 h-14"></div>
            <div className="w-2 bg-red-400 h-8"></div>
            <div className="w-2 bg-green-400 h-11"></div>
            <div className="w-2 bg-red-400 h-9"></div>
          </div>
        </div>
        
        <div className="absolute right-8 top-1/4 w-32 h-40 opacity-15">
          <div className="flex items-end space-x-1 h-full">
            <div className="w-2 bg-red-400 h-10"></div>
            <div className="w-2 bg-green-400 h-7"></div>
            <div className="w-2 bg-red-400 h-13"></div>
            <div className="w-2 bg-green-400 h-9"></div>
            <div className="w-2 bg-red-400 h-6"></div>
            <div className="w-2 bg-green-400 h-12"></div>
            <div className="w-2 bg-red-400 h-8"></div>
            <div className="w-2 bg-green-400 h-10"></div>
          </div>
        </div>
        
        {/* Data Stream Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse delay-1500"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-2000"></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/6 left-1/6 w-24 h-24 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/6 right-1/6 w-32 h-32 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-3000"></div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Content */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-2xl border border-white/20 bg-white/95 backdrop-blur-sm p-4 shadow-2xl">
          <Link href="/" className="mb-4 flex items-center gap-2 px-2 hover:bg-gray-50 rounded-lg py-2 transition-colors">
            <Home className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-semibold text-gray-800">Home</span>
          </Link>
          <nav className="flex flex-col gap-1">
            <SidebarLink href="/dashboard">
              <LayoutGrid className="h-5 w-5" />
              <span>Dashboard</span>
            </SidebarLink>
            <SidebarLink href="/withdrawals">
              <ArrowUpRight className="h-5 w-5" />
              <span>Withdrawals</span>
            </SidebarLink>
            <SidebarLink href="/account">
              <User className="h-5 w-5" />
              <span>Deposit</span>
            </SidebarLink>
            <SidebarLink href="/referral">
              <Users className="h-5 w-5" />
              <span>Referral and Team</span>
            </SidebarLink>
            <div className="mt-2 h-px bg-gray-200" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-gray-200">Welcome back! Here's your trading overview.</p>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <Card
                key={c.title}
                title={c.title}
                value={c.value}
                Icon={c.icon}
                onClick={c.title === 'Account Balance' ? () => setShowTransactionModal(true) : () => setSelectedCategory(c.title)}
                isAccountBalance={c.title === 'Account Balance'}
              />
            ))}
          </div>

          {/* Transactions table */}
          {selectedCategory && selectedCategory.toLowerCase() !== 'rewards' && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">{selectedCategory}</h2>
                  <p className="text-sm text-gray-500">Transactions</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Withdrawal From</label>
                    <select
                      value={fromFilter}
                      onChange={(e) => setFromFilter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="">All</option>
                      <option value="Cashback">Cashback</option>
                      <option value="Level 1">Level 1</option>
                      <option value="Level 2">Level 2</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">Date From</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-gray-600">To</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => { /* trigger effect by toggling state noop */ setFromFilter((v) => v); }}
                      className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              {dataLoading ? (
                <p className="text-gray-600">Loading…</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : filteredTransactions.length === 0 ? (
                <p className="text-gray-600">No transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Detail</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Credit</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Debit</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {new Date(transaction.date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">{transaction.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-800">{transaction.detail}</td>
                          <td className="px-4 py-3 text-sm text-green-600 font-medium">
                            {transaction.credit > 0 ? `+${transaction.credit.toFixed(2)}` : '0.00'}
                          </td>
                          <td className="px-4 py-3 text-sm text-red-600 font-medium">
                            {transaction.debit > 0 ? `-${transaction.debit.toFixed(2)}` : '0.00'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 font-semibold">
                            {transaction.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Transaction History Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Account Balance - Transaction History</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {dataLoading ? 'Loading...' : `${filteredTransactions.length} transaction${filteredTransactions.length !== 1 ? 's' : ''} found`}
                  </p>
                </div>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              {/* Filters */}
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Transaction Type</label>
                  <select
                    value={fromFilter}
                    onChange={(e) => setFromFilter(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="">All</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="cashback">Cashback</option>
                    <option value="level1_income">Level 1 Income</option>
                    <option value="level2_income">Level 2 Income</option>
                    <option value="reward">Reward</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Date From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Date To</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => { /* trigger effect by toggling state noop */ setFromFilter((v) => v); }}
                    className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Transaction Table */}
              {dataLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading transactions...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No transactions found.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {new Date(transaction.date).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.type === 'deposit' 
                                  ? 'bg-green-100 text-green-800' 
                                  : transaction.type === 'withdrawal'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {transaction.name}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">{transaction.detail}</td>
                            <td className="px-4 py-3 text-sm">
                              {transaction.credit > 0 ? (
                                <span className="text-green-600 font-semibold">+${transaction.credit.toFixed(2)}</span>
                              ) : transaction.debit > 0 ? (
                                <span className="text-red-600 font-semibold">-${transaction.debit.toFixed(2)}</span>
                              ) : (
                                <span className="text-gray-500">$0.00</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800 font-semibold">
                              ${transaction.balance.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


