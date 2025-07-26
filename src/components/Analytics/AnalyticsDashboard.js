import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Package, Users, DollarSign, Star,
  Download, RefreshCw, Eye, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Demo analytics data
  const generateDemoData = () => {
    const today = new Date();
    const data = {
      summary: {
        totalPackages: 1247,
        totalUsers: 892,
        totalRevenue: 45678,
        averageRating: 4.7,
        completionRate: 94.2,
        growthRate: 23.5
      },
      packageTrends: Array.from({ length: 30 }, (_, i) => ({
        date: format(subDays(today, 29 - i), 'MMM dd'),
        packages: Math.floor(Math.random() * 50) + 20,
        completed: Math.floor(Math.random() * 45) + 15,
        revenue: Math.floor(Math.random() * 2000) + 500
      })),
      userGrowth: Array.from({ length: 12 }, (_, i) => ({
        month: format(new Date(2024, i, 1), 'MMM'),
        customers: Math.floor(Math.random() * 100) + 50,
        travelers: Math.floor(Math.random() * 80) + 30,
        total: Math.floor(Math.random() * 180) + 80
      })),
      routePopularity: [
        { route: 'NYC → Boston', packages: 45, percentage: 18 },
        { route: 'LA → SF', packages: 38, percentage: 15 },
        { route: 'Chicago → Detroit', packages: 32, percentage: 13 },
        { route: 'Miami → Orlando', packages: 28, percentage: 11 },
        { route: 'Seattle → Portland', packages: 25, percentage: 10 },
        { route: 'Others', packages: 82, percentage: 33 }
      ],
      performanceMetrics: [
        { metric: 'Avg Delivery Time', value: '2.3 days', trend: -8.2, status: 'improved' },
        { metric: 'Customer Satisfaction', value: '4.7/5', trend: 3.1, status: 'improved' },
        { metric: 'Success Rate', value: '94.2%', trend: 1.8, status: 'improved' },
        { metric: 'Response Time', value: '12 min', trend: -15.3, status: 'improved' }
      ],
      recentActivity: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        type: ['package_posted', 'package_completed', 'user_registered', 'payment_received'][Math.floor(Math.random() * 4)],
        description: [
          'New package posted: Electronics delivery',
          'Package completed successfully',
          'New traveler registered',
          'Payment of ₹45 received'
        ][Math.floor(Math.random() * 4)],
        timestamp: subDays(today, Math.floor(Math.random() * 7)),
        user: `User${Math.floor(Math.random() * 100) + 1}`
      }))
    };
    return data;
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(generateDemoData());
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'];

  const MetricCard = ({ title, value, trend, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">Loading Analytics...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Advanced insights and business intelligence</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Packages"
            value={analyticsData?.summary.totalPackages.toLocaleString()}
            trend={analyticsData?.summary.growthRate}
            icon={Package}
            color="bg-blue-500"
          />
          <MetricCard
            title="Active Users"
            value={analyticsData?.summary.totalUsers.toLocaleString()}
            trend={15.3}
            icon={Users}
            color="bg-green-500"
          />
          <MetricCard
            title="Revenue"
            value={`₹${analyticsData?.summary.totalRevenue.toLocaleString()}`}
            trend={28.7}
            icon={DollarSign}
            color="bg-yellow-500"
          />
          <MetricCard
            title="Avg Rating"
            value={analyticsData?.summary.averageRating}
            trend={2.1}
            icon={Star}
            color="bg-purple-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Package Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Package Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData?.packageTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="packages" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* User Growth */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData?.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="customers" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="travelers" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="total" stroke="#F59E0B" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Route Analysis and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Route Popularity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Popular Routes</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData?.routePopularity}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="packages"
                >
                  {analyticsData?.routePopularity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {analyticsData?.routePopularity.slice(0, 4).map((route, index) => (
                <div key={route.route} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-gray-600">{route.route}</span>
                  </div>
                  <span className="text-sm font-semibold">{route.packages}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyticsData?.performanceMetrics.map((metric, index) => (
                <div key={metric.metric} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{metric.metric}</h3>
                    <div className={`flex items-center ${
                      metric.status === 'improved' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        metric.trend < 0 ? 'rotate-180' : ''
                      }`} />
                      <span className="text-sm">{Math.abs(metric.trend)}%</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700">
              <Eye className="h-4 w-4" />
              <span>View All</span>
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData?.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'package_posted' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'package_completed' ? 'bg-green-100 text-green-600' :
                    activity.type === 'user_registered' ? 'bg-purple-100 text-purple-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {activity.type === 'package_posted' && <Package className="h-4 w-4" />}
                    {activity.type === 'package_completed' && <Target className="h-4 w-4" />}
                    {activity.type === 'user_registered' && <Users className="h-4 w-4" />}
                    {activity.type === 'payment_received' && <DollarSign className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.description}</p>
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {format(activity.timestamp, 'MMM dd, HH:mm')}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
