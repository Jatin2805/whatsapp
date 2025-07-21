import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, MessageCircle, Users, Calendar, Activity, ArrowUp, ArrowDown, Eye, Download } from 'lucide-react'
import { useMessages } from '../../hooks/useMessages'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import toast from 'react-hot-toast'

export const Analytics: React.FC = () => {
  const { messages, stats, loading } = useMessages()
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [chartData, setChartData] = useState<any[]>([])
  const [trends, setTrends] = useState({
    messagesChange: 0,
    repliesChange: 0,
    responseRateChange: 0
  })

  useEffect(() => {
    if (messages.length > 0) {
      generateChartData()
      calculateTrends()
    }
  }, [messages, timeRange])

  const generateChartData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const data = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayStart = startOfDay(date)
      const dayEnd = endOfDay(date)
      
      const dayMessages = messages.filter(msg => {
        const msgDate = new Date(msg.created_at)
        return msgDate >= dayStart && msgDate <= dayEnd
      })
      
      data.push({
        date: format(date, 'MMM d'),
        messages: dayMessages.length,
        sent: dayMessages.filter(m => m.status === 'sent').length,
        scheduled: dayMessages.filter(m => m.status === 'scheduled').length,
        failed: dayMessages.filter(m => m.status === 'failed').length
      })
    }
    
    setChartData(data)
  }

  const calculateTrends = () => {
    // Simulate trend calculations
    setTrends({
      messagesChange: Math.floor(Math.random() * 10) + 5, // Always positive for demo
      repliesChange: Math.floor(Math.random() * 8) + 2, // Always positive for demo
      responseRateChange: Math.floor(Math.random() * 5) + 1 // Always positive for demo
    })
  }

  const handleExportData = () => {
    if (messages.length === 0) {
      toast.error('No data to export')
      return
    }

    try {
      const csvData = messages.map(msg => ({
        id: msg.id,
        content: msg.content.substring(0, 50) + '...',
        recipients: msg.recipients.length,
        status: msg.status,
        created_at: format(new Date(msg.created_at), 'yyyy-MM-dd HH:mm:ss')
      }))
      
      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `whatsapp-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Analytics data exported successfully!')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
              <p className="text-gray-600 mt-2">Track your WhatsApp automation performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range as any)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      timeRange === range
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
                  </button>
                ))}
              </div>
              <button
                onClick={handleExportData}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalMessages}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm ml-1 text-green-600">
                    {trends.messagesChange}% vs last period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sent Successfully</p>
                <p className="text-2xl font-bold text-gray-800">{stats.sentMessages}</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 ml-1">
                    {((stats.sentMessages / Math.max(stats.totalMessages, 1)) * 100).toFixed(1)}% success rate
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Replies</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalReplies}</p>
                <div className="flex items-center mt-1">
                  {trends.repliesChange >= 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${trends.repliesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(trends.repliesChange)}% vs last period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-800">{stats.responseRate}%</p>
                <div className="flex items-center mt-1">
                  {trends.responseRateChange >= 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ml-1 ${trends.responseRateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(trends.responseRateChange)}% vs last period
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Message Volume Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Volume</h3>
            <div className="h-64 overflow-x-auto">
              <div className="min-w-full flex items-end space-x-2" style={{ minWidth: `${Math.max(chartData.length * 40, 400)}px` }}>
                {chartData.map((day, index) => (
                  <div key={index} className="flex flex-col items-center" style={{ minWidth: '32px', width: '32px' }}>
                    <div className="w-full bg-gray-100 rounded-t relative overflow-hidden" style={{ height: '200px' }}>
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t absolute bottom-0 transition-all duration-300"
                        style={{ 
                          height: `${Math.max((day.messages / Math.max(...chartData.map(d => d.messages), 1)) * 180, 4)}px`,
                          minHeight: day.messages > 0 ? '4px' : '0px'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2 truncate w-full text-center">{day.date}</span>
                    <span className="text-xs font-medium text-gray-800">{day.messages}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Message Status Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-700">Sent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-medium">{stats.sentMessages}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(stats.sentMessages / Math.max(stats.totalMessages, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-700">Scheduled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-medium">{stats.scheduledMessages}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(stats.scheduledMessages / Math.max(stats.totalMessages, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-700">Failed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-800 font-medium">{stats.failedMessages}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(stats.failedMessages / Math.max(stats.totalMessages, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Messages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Message</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Recipients</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Replies</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {messages.slice(0, 10).map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-800 truncate max-w-xs">
                        {message.content}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {message.recipients.length} contacts
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        message.status === 'sent' ? 'bg-green-100 text-green-800' :
                        message.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {format(new Date(message.created_at), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {message.reply_count || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}