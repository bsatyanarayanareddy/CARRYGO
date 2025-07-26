import React, { useState, useEffect, useCallback } from 'react';
import { Brain, TrendingUp, MapPin, Clock, Star, Zap, Target, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SmartRecommendations = ({ userProfile }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);

  // AI-powered recommendation engine (demo implementation)
  const generateRecommendations = useCallback(() => {
    const isCustomer = userProfile?.role === 'customer';
    const isTraveler = userProfile?.role === 'traveler';

    const baseRecommendations = [];

    if (isCustomer) {
      baseRecommendations.push(
        {
          id: 1,
          type: 'pricing',
          title: 'Optimize Package Pricing',
          description: 'Based on route analysis, consider reducing price by 10% to increase acceptance rate by 35%',
          impact: 'High',
          confidence: 92,
          action: 'Adjust pricing strategy',
          icon: TrendingUp,
          color: 'bg-blue-500',
          data: {
            currentPrice: '$45',
            suggestedPrice: '$40',
            expectedIncrease: '35% more responses'
          }
        },
        {
          id: 2,
          type: 'timing',
          title: 'Best Posting Time',
          description: 'Post packages on Tuesday-Thursday, 2-4 PM for 60% higher acceptance rates',
          impact: 'Medium',
          confidence: 87,
          action: 'Schedule posts optimally',
          icon: Clock,
          color: 'bg-green-500',
          data: {
            bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
            bestTime: '2:00 PM - 4:00 PM',
            improvement: '60% higher acceptance'
          }
        },
        {
          id: 3,
          type: 'route',
          title: 'Alternative Routes',
          description: 'Consider splitting NYC → LA into NYC → Chicago → LA for 40% cost savings',
          impact: 'High',
          confidence: 89,
          action: 'Explore route optimization',
          icon: MapPin,
          color: 'bg-purple-500',
          data: {
            originalRoute: 'NYC → LA',
            suggestedRoute: 'NYC → Chicago → LA',
            savings: '40% cost reduction'
          }
        }
      );
    }

    if (isTraveler) {
      baseRecommendations.push(
        {
          id: 4,
          type: 'route_match',
          title: 'High-Demand Route Match',
          description: 'Your Boston → NYC route has 85% higher demand. Consider posting availability.',
          impact: 'High',
          confidence: 94,
          action: 'Post route availability',
          icon: Target,
          color: 'bg-orange-500',
          data: {
            route: 'Boston → NYC',
            demandIncrease: '85% higher demand',
            estimatedEarnings: '$120-180 per trip'
          }
        },
        {
          id: 5,
          type: 'rating',
          title: 'Boost Your Rating',
          description: 'Complete 3 more deliveries to reach 4.8★ rating and unlock premium packages',
          impact: 'Medium',
          confidence: 91,
          action: 'Accept more packages',
          icon: Star,
          color: 'bg-yellow-500',
          data: {
            currentRating: '4.6★',
            targetRating: '4.8★',
            benefit: 'Access to premium packages'
          }
        },
        {
          id: 6,
          type: 'schedule',
          title: 'Peak Earning Hours',
          description: 'Weekend mornings show 45% higher package rates. Adjust your schedule for maximum earnings.',
          impact: 'Medium',
          confidence: 88,
          action: 'Optimize schedule',
          icon: Clock,
          color: 'bg-indigo-500',
          data: {
            peakTimes: 'Weekend mornings (8AM-12PM)',
            increase: '45% higher rates',
            potentialEarnings: '$50-80 extra per weekend'
          }
        }
      );
    }

    return baseRecommendations;
  }, [userProfile]);

  const generateInsights = () => {
    return {
      userBehavior: {
        score: 87,
        description: 'Highly active user with consistent delivery patterns',
        trends: [
          'Posts packages 40% more on weekdays',
          'Prefers mid-distance routes (200-500 miles)',
          'Average response time: 2.3 hours'
        ]
      },
      marketTrends: {
        score: 92,
        description: 'Current market shows strong demand for your services',
        trends: [
          'Electronic packages increased 35% this month',
          'Cross-country routes up 28%',
          'Premium packages growing 15% weekly'
        ]
      },
      performance: {
        score: 89,
        description: 'Above average performance with room for optimization',
        metrics: [
          'Completion rate: 94% (avg: 87%)',
          'Customer satisfaction: 4.7/5 (avg: 4.3/5)',
          'Response time: Better than 78% of users'
        ]
      }
    };
  };

  useEffect(() => {
    setLoading(true);
    // Simulate AI processing
    setTimeout(() => {
      setRecommendations(generateRecommendations());
      setInsights(generateInsights());
      setLoading(false);
    }, 2000);
  }, [userProfile, generateRecommendations]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-12 w-12 text-primary-600 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-800">AI is analyzing your data...</h2>
          <p className="text-gray-600">Generating personalized recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Brain className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Smart Recommendations</h1>
              </div>
              <p className="text-purple-100">AI-powered insights to optimize your CarryGo experience</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">AI</div>
              <div className="text-sm opacity-90">Powered</div>
            </div>
          </div>
        </div>

        {/* Insights Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {insights && Object.entries(insights).map(([key, insight], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">{insight.score}</div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{insight.description}</p>
              <div className="space-y-2">
                {(insight.trends || insight.metrics).map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Personalized Recommendations</h2>
          
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-full ${rec.color}`}>
                    <rec.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(rec.impact)}`}>
                        {rec.impact} Impact
                      </span>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">{rec.confidence}% confidence</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{rec.description}</p>
                    
                    {/* Recommendation Data */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Key Insights:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Object.entries(rec.data).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-sm text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="font-semibold text-gray-800">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                        {rec.action}
                      </button>
                      <button className="text-gray-500 hover:text-gray-700 flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Learn more</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Learning Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-8 border border-blue-200"
        >
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-800">AI Learning System</h3>
              <p className="text-gray-600 mt-1">
                Our AI continuously learns from your behavior and market trends to provide better recommendations. 
                The more you use CarryGo, the smarter our suggestions become!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartRecommendations;
