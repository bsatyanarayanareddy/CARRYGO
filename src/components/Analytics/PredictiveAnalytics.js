import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Brain, Zap, DollarSign,
  Package, Users, AlertTriangle, Target, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, addDays } from 'date-fns';

const PredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // AI-powered predictive models (demo implementation)
  const generatePredictions = () => {
    const today = new Date();
    
    return {
      revenue: {
        current: 45678,
        predicted30Days: 62340,
        predicted90Days: 185420,
        confidence: 89,
        trend: 'upward',
        growth: 36.5,
        data: Array.from({ length: 90 }, (_, i) => ({
          date: format(addDays(today, i), 'MMM dd'),
          actual: i < 30 ? Math.floor(Math.random() * 2000) + 1000 : null,
          predicted: Math.floor(Math.random() * 2500) + 1200 + (i * 15),
          confidence: Math.max(95 - (i * 0.5), 70)
        }))
      },
      packages: {
        current: 1247,
        predicted30Days: 1680,
        predicted90Days: 4920,
        confidence: 92,
        trend: 'upward',
        growth: 34.7,
        data: Array.from({ length: 90 }, (_, i) => ({
          date: format(addDays(today, i), 'MMM dd'),
          actual: i < 30 ? Math.floor(Math.random() * 50) + 20 : null,
          predicted: Math.floor(Math.random() * 60) + 25 + (i * 0.8),
          confidence: Math.max(94 - (i * 0.3), 75)
        }))
      },
      users: {
        current: 892,
        predicted30Days: 1150,
        predicted90Days: 2890,
        confidence: 86,
        trend: 'upward',
        growth: 28.9,
        data: Array.from({ length: 90 }, (_, i) => ({
          date: format(addDays(today, i), 'MMM dd'),
          actual: i < 30 ? Math.floor(Math.random() * 15) + 5 : null,
          predicted: Math.floor(Math.random() * 20) + 8 + (i * 0.3),
          confidence: Math.max(90 - (i * 0.4), 70)
        }))
      },
      marketTrends: {
        seasonal: [
          { season: 'Spring', factor: 1.2, description: 'Moving season peak' },
          { season: 'Summer', factor: 1.4, description: 'Vacation travel surge' },
          { season: 'Fall', factor: 1.1, description: 'Back-to-school deliveries' },
          { season: 'Winter', factor: 0.9, description: 'Holiday shipping competition' }
        ],
        emerging: [
          { trend: 'Same-day delivery demand', impact: '+45%', timeline: '6 months' },
          { trend: 'Cross-border packages', impact: '+67%', timeline: '12 months' },
          { trend: 'Eco-friendly packaging', impact: '+23%', timeline: '3 months' }
        ]
      },
      risks: [
        {
          type: 'Market Saturation',
          probability: 25,
          impact: 'Medium',
          timeline: '12-18 months',
          mitigation: 'Expand to new geographic markets'
        },
        {
          type: 'Seasonal Decline',
          probability: 65,
          impact: 'Low',
          timeline: '3-4 months',
          mitigation: 'Implement winter promotions'
        },
        {
          type: 'Competition Increase',
          probability: 40,
          impact: 'High',
          timeline: '6-12 months',
          mitigation: 'Enhance unique value propositions'
        }
      ],
      opportunities: [
        {
          type: 'AI-Enhanced Matching',
          potential: '+35% efficiency',
          investment: 'Medium',
          timeline: '3-6 months'
        },
        {
          type: 'Corporate Partnerships',
          potential: '+150% revenue',
          investment: 'High',
          timeline: '6-12 months'
        },
        {
          type: 'Mobile App Optimization',
          potential: '+25% user engagement',
          investment: 'Low',
          timeline: '1-3 months'
        }
      ]
    };
  };

  useEffect(() => {
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setPredictions(generatePredictions());
      setLoading(false);
    }, 2500);
  }, []);

  const PredictionCard = ({ title, current, predicted, growth, confidence, trend, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${trend === 'upward' ? 'bg-green-100' : 'bg-red-100'}`}>
            <Icon className={`h-5 w-5 ${trend === 'upward' ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Confidence</div>
          <div className="text-sm font-semibold text-primary-600">{confidence}%</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500">Current</div>
          <div className="text-xl font-bold text-gray-800">{current.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Predicted (30d)</div>
          <div className="text-xl font-bold text-primary-600">{predicted.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        {trend === 'upward' ? 
          <TrendingUp className="h-4 w-4 text-green-600" /> : 
          <TrendingDown className="h-4 w-4 text-red-600" />
        }
        <span className={`text-sm font-medium ${trend === 'upward' ? 'text-green-600' : 'text-red-600'}`}>
          {growth}% growth projected
        </span>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800">Processing Predictive Models...</h2>
          <p className="text-gray-600">Analyzing market trends and patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Brain className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Predictive Analytics</h1>
              </div>
              <p className="text-purple-100">AI-powered forecasting and market intelligence</p>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-yellow-300" />
              <span className="text-lg font-semibold">AI Engine</span>
            </div>
          </div>
        </div>

        {/* Key Predictions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PredictionCard
            title="Revenue Forecast"
            current={predictions?.revenue.current}
            predicted={predictions?.revenue.predicted30Days}
            growth={predictions?.revenue.growth}
            confidence={predictions?.revenue.confidence}
            trend={predictions?.revenue.trend}
            icon={DollarSign}
          />
          <PredictionCard
            title="Package Volume"
            current={predictions?.packages.current}
            predicted={predictions?.packages.predicted30Days}
            growth={predictions?.packages.growth}
            confidence={predictions?.packages.confidence}
            trend={predictions?.packages.trend}
            icon={Package}
          />
          <PredictionCard
            title="User Growth"
            current={predictions?.users.current}
            predicted={predictions?.users.predicted30Days}
            growth={predictions?.users.growth}
            confidence={predictions?.users.confidence}
            trend={predictions?.users.trend}
            icon={Users}
          />
        </div>

        {/* Prediction Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Metric Selector and Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Forecasting Model</h2>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="revenue">Revenue</option>
                <option value="packages">Packages</option>
                <option value="users">Users</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={predictions?.[selectedMetric]?.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Actual"
                />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.4}
                  strokeDasharray="5 5"
                  name="Predicted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Market Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Seasonal Trends</h2>
            <div className="space-y-4">
              {predictions?.marketTrends.seasonal.map((trend, index) => (
                <div key={trend.season} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">{trend.season}</div>
                    <div className="text-sm text-gray-600">{trend.description}</div>
                  </div>
                  <div className={`text-lg font-bold ${
                    trend.factor > 1 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.factor}x
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Emerging Trends</h3>
            <div className="space-y-3">
              {predictions?.marketTrends.emerging.map((trend, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-4">
                  <div className="font-medium text-gray-800">{trend.trend}</div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="text-green-600 font-semibold">{trend.impact}</span>
                    <span>Expected in {trend.timeline}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Risks and Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Risk Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-800">Risk Assessment</h2>
            </div>
            <div className="space-y-4">
              {predictions?.risks.map((risk, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{risk.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                      risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.impact} Impact
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                    <div>Probability: {risk.probability}%</div>
                    <div>Timeline: {risk.timeline}</div>
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Mitigation:</strong> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-800">Growth Opportunities</h2>
            </div>
            <div className="space-y-4">
              {predictions?.opportunities.map((opp, index) => (
                <div key={index} className="border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{opp.type}</h3>
                    <span className="text-green-600 font-semibold">{opp.potential}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Investment: {opp.investment}</div>
                    <div>Timeline: {opp.timeline}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">AI Recommendation</span>
              </div>
              <p className="text-sm text-green-700">
                Focus on Mobile App Optimization first for quick wins, then pursue Corporate Partnerships 
                for maximum revenue impact.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
