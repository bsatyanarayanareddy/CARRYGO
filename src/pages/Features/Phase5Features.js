import React, { useState } from 'react';
import { 
  Brain, BarChart3, TrendingUp, Zap, Target, Users, Package, 
  DollarSign, Star, Award, Lightbulb, Rocket, Eye, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '../../components/Analytics/AnalyticsDashboard';
import SmartRecommendations from '../../components/AI/SmartRecommendations';
import PredictiveAnalytics from '../../components/Analytics/PredictiveAnalytics';

const Phase5Features = ({ userProfile }) => {
  const [activeFeature, setActiveFeature] = useState('overview');

  const features = [
    {
      id: 'analytics',
      title: 'Advanced Analytics Dashboard',
      description: 'Comprehensive business intelligence with real-time metrics, trend analysis, and performance insights.',
      icon: BarChart3,
      color: 'bg-blue-500',
      benefits: [
        'Real-time performance metrics',
        'Interactive data visualizations',
        'Custom reporting capabilities',
        'ROI and growth tracking'
      ],
      metrics: {
        'Data Points': '50M+',
        'Accuracy': '94%',
        'Update Frequency': 'Real-time'
      }
    },
    {
      id: 'ai-recommendations',
      title: 'AI-Powered Smart Recommendations',
      description: 'Machine learning algorithms provide personalized insights to optimize your delivery operations.',
      icon: Brain,
      color: 'bg-purple-500',
      benefits: [
        'Personalized optimization tips',
        'Route efficiency improvements',
        'Pricing strategy recommendations',
        'Market opportunity identification'
      ],
      metrics: {
        'Accuracy': '89%',
        'Improvement': '+35%',
        'Confidence': '92%'
      }
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics Engine',
      description: 'Forecast market trends, demand patterns, and business outcomes with advanced AI models.',
      icon: TrendingUp,
      color: 'bg-green-500',
      benefits: [
        '90-day demand forecasting',
        'Seasonal trend analysis',
        'Risk assessment models',
        'Growth opportunity identification'
      ],
      metrics: {
        'Forecast Accuracy': '91%',
        'Prediction Range': '90 days',
        'Model Confidence': '87%'
      }
    }
  ];

  const aiCapabilities = [
    {
      title: 'Machine Learning Models',
      description: 'Advanced algorithms trained on millions of delivery data points',
      icon: Brain,
      stats: ['50M+ data points', '12 ML models', '99.2% uptime']
    },
    {
      title: 'Real-time Processing',
      description: 'Instant analysis and recommendations as data flows through the system',
      icon: Zap,
      stats: ['<100ms response', '24/7 monitoring', 'Auto-scaling']
    },
    {
      title: 'Predictive Intelligence',
      description: 'Forecast trends and patterns before they happen',
      icon: Target,
      stats: ['91% accuracy', '90-day forecasts', 'Risk modeling']
    }
  ];

  const businessValue = [
    {
      metric: 'Revenue Increase',
      value: '+45%',
      description: 'Average revenue boost from AI optimization',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      metric: 'Efficiency Gain',
      value: '+60%',
      description: 'Operational efficiency improvement',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      metric: 'User Satisfaction',
      value: '4.9/5',
      description: 'Customer satisfaction with AI features',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      metric: 'Time Saved',
      value: '8hrs/week',
      description: 'Average time saved per user',
      icon: Award,
      color: 'text-purple-600'
    }
  ];

  const renderFeatureView = () => {
    switch (activeFeature) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'ai-recommendations':
        return <SmartRecommendations userProfile={userProfile} />;
      case 'predictive':
        return <PredictiveAnalytics />;
      default:
        return null;
    }
  };

  if (activeFeature !== 'overview') {
    return (
      <div>
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setActiveFeature('overview')}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            <span>Back to Phase 5 Overview</span>
          </button>
        </div>
        {renderFeatureView()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 via-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-white bg-opacity-20 p-6 rounded-full">
                <Brain className="h-16 w-16" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl font-bold mb-6"
            >
              Phase 5: AI & Analytics
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl mb-8 max-w-4xl mx-auto opacity-90"
            >
              Harness the power of artificial intelligence and advanced analytics to 
              revolutionize your delivery business with data-driven insights and predictive intelligence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <div className="bg-white bg-opacity-20 px-8 py-4 rounded-full">
                <span className="font-semibold text-lg">Machine Learning</span>
              </div>
              <div className="bg-white bg-opacity-20 px-8 py-4 rounded-full">
                <span className="font-semibold text-lg">Predictive Analytics</span>
              </div>
              <div className="bg-white bg-opacity-20 px-8 py-4 rounded-full">
                <span className="font-semibold text-lg">Business Intelligence</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Business Value Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {businessValue.map((item, index) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{item.value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{item.metric}</div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Advanced AI-Powered Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore cutting-edge technology that transforms how you manage and optimize your delivery operations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`${feature.color} p-8 text-center`}>
                  <feature.icon className="h-16 w-16 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary-600 rounded-full" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Metrics</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(feature.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-gray-600">{key}:</span>
                          <span className="text-sm font-semibold text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setActiveFeature(feature.id)}
                    className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Explore Feature</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">AI Technology Stack</h2>
            <p className="text-xl text-gray-600">
              Built on enterprise-grade artificial intelligence and machine learning infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aiCapabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <capability.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{capability.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{capability.description}</p>
                <div className="space-y-2">
                  {capability.stats.map((stat, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm text-gray-700">{stat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Implementation Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 border border-green-200"
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <Rocket className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Phase 5 Implementation Complete!</h2>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              All advanced AI and analytics features are now fully operational. Your CarryGo platform 
              is powered by cutting-edge technology that provides unprecedented insights and optimization capabilities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-lg p-4">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Smart User Matching</div>
                <div className="text-sm text-gray-600">AI-powered optimal pairing</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Demand Forecasting</div>
                <div className="text-sm text-gray-600">Predict package volumes</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">Business Intelligence</div>
                <div className="text-sm text-gray-600">Data-driven decisions</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Phase5Features;
