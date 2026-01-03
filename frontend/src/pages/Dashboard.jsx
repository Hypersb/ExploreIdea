import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Clock, Activity, Search } from 'lucide-react'
import { getAnalytics, getPerformanceMetrics, getQueryStats } from '../services/api'
import Background3D from '../components/Background3D'

const Dashboard = () => {
  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => getAnalytics(7),
  })
  
  const { data: performance } = useQuery({
    queryKey: ['performance'],
    queryFn: getPerformanceMetrics,
  })
  
  const { data: queryStats } = useQuery({
    queryKey: ['queryStats'],
    queryFn: getQueryStats,
  })
  
  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-400`}>{value}</p>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-600/20 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  )
  
  if (analyticsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl skeleton" />
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-8 relative">
      {/* 3D Background */}
      <Background3D variant="dashboard" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="w-8 h-8 text-primary-400" />
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        </div>
        <p className="text-slate-400">Track search patterns and performance metrics</p>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Search}
          title="Total Searches"
          value={analytics?.search_count || 0}
          subtitle={analytics?.time_period}
          color="primary"
        />
        
        <StatCard
          icon={TrendingUp}
          title="Unique Queries"
          value={analytics?.unique_queries || 0}
          subtitle="Different searches"
          color="green"
        />
        
        <StatCard
          icon={Clock}
          title="Avg Response Time"
          value={`${analytics?.avg_query_time || 0}s`}
          subtitle="Query processing"
          color="yellow"
        />
        
        <StatCard
          icon={Activity}
          title="Uptime"
          value={`${performance?.uptime_percentage || 0}%`}
          subtitle={performance?.status || 'healthy'}
          color="purple"
        />
      </div>
      
      {/* Top Searches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-semibold text-white">Top Searches</h2>
        </div>
        
        <div className="space-y-3">
          {analytics?.top_searches?.slice(0, 10).map((search, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-slate-600">
                  #{index + 1}
                </span>
                <span className="text-white">{search.query}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-primary-400 font-medium">
                  {search.count} searches
                </span>
                <div className="w-32 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{
                      width: `${(search.count / analytics.top_searches[0].count) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Query Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Query Distribution</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">High Frequency (10+)</span>
                <span className="text-primary-400 font-medium">
                  {queryStats?.query_distribution?.high_frequency || 0}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Medium Frequency (5-10)</span>
                <span className="text-yellow-400 font-medium">
                  {queryStats?.query_distribution?.medium_frequency || 0}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300">Low Frequency (1-5)</span>
                <span className="text-red-400 font-medium">
                  {queryStats?.query_distribution?.low_frequency || 0}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Popular Categories</h2>
          
          <div className="flex flex-wrap gap-3">
            {analytics?.popular_categories?.map((category, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-primary-600/20 border border-primary-500/30 rounded-full"
              >
                <span className="text-primary-400 font-medium capitalize">
                  {category}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg">
            <h3 className="text-sm text-slate-400 mb-2">System Performance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Cache Hit Rate</span>
                <span className="text-green-400 font-medium">
                  {((performance?.cache_hit_rate || 0) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">API Success Rate</span>
                <span className="text-green-400 font-medium">
                  {((performance?.api_success_rate || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Total Requests</span>
                <span className="text-primary-400 font-medium">
                  {performance?.total_requests?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
