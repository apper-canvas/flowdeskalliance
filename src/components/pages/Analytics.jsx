import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/organisms/SkeletonLoader';
import ErrorState from '@/components/organisms/ErrorState';
import { dealService, contactService, activityService } from '@/services';

const Analytics = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dealsResult, contactsResult, activitiesResult] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        activityService.getAll()
      ]);
      setDeals(dealsResult);
      setContacts(contactsResult);
      setActivities(activitiesResult);
    } catch (err) {
      setError(err.message || 'Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateMetrics = () => {
    const totalPipelineValue = deals.reduce((sum, deal) => sum + (deal.stage !== 'Closed' ? deal.value : 0), 0);
    const closedDeals = deals.filter(deal => deal.stage === 'Closed');
    const totalClosedValue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
    const averageDealValue = deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.value, 0) / deals.length : 0;
    const conversionRate = deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0;
    const averageProbability = deals.length > 0 ? deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length : 0;

    return {
      totalPipelineValue,
      totalClosedValue,
      averageDealValue,
      conversionRate,
      averageProbability,
      totalDeals: deals.length,
      totalContacts: contacts.length,
      totalActivities: activities.length,
      closedDealsCount: closedDeals.length
    };
  };

  const getDealsByStageData = () => {
    const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed'];
    const stageData = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage);
      return {
        stage,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
      };
    });

    return {
      labels: stageData.map(s => s.stage),
      series: stageData.map(s => s.count),
      values: stageData.map(s => s.value)
    };
  };

  const getActivityData = () => {
    const activityTypes = ['call', 'email', 'meeting'];
    const activityData = activityTypes.map(type => {
      const typeActivities = activities.filter(activity => activity.type === type);
      return {
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: typeActivities.length
      };
    });

    return {
      labels: activityData.map(a => a.type),
      series: activityData.map(a => a.count)
    };
  };

  const getMonthlyTrendData = () => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = subDays(new Date(), i * 30);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthDeals = deals.filter(deal => {
        const dealDate = new Date(deal.createdAt);
        return dealDate >= monthStart && dealDate <= monthEnd;
      });

      const monthContacts = contacts.filter(contact => {
        const contactDate = new Date(contact.createdAt);
        return contactDate >= monthStart && contactDate <= monthEnd;
      });

      last6Months.push({
        month: format(date, 'MMM'),
        deals: monthDeals.length,
        contacts: monthContacts.length,
        value: monthDeals.reduce((sum, deal) => sum + deal.value, 0)
      });
    }

    return {
      labels: last6Months.map(m => m.month),
      dealsSeries: last6Months.map(m => m.deals),
      contactsSeries: last6Months.map(m => m.contacts),
      valueSeries: last6Months.map(m => m.value)
    };
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="p-6 max-w-full overflow-hidden"
      >
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="p-6 max-w-full overflow-hidden"
      >
        <ErrorState
          message={error}
          onRetry={loadAnalyticsData}
          title="Failed to load analytics"
        />
      </motion.div>
    );
  }

  const metrics = calculateMetrics();
  const stageData = getDealsByStageData();
  const activityData = getActivityData();
  const trendData = getMonthlyTrendData();

  // Chart configurations
  const donutChartOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    colors: ['#9CA3AF', '#3B82F6', '#F59E0B', '#F97316', '#10B981'],
    labels: stageData.labels,
    legend: {
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) => `${val} deals (${formatCurrency(stageData.values[seriesIndex])})`
      }
    }
  };

  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 300
    },
    colors: ['#6366F1'],
    xaxis: {
      categories: activityData.labels
    },
    yaxis: {
      title: {
        text: 'Number of Activities'
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    dataLabels: {
      enabled: false
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} activities`
      }
    }
  };

  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 300
    },
    colors: ['#6366F1', '#8B5CF6'],
    xaxis: {
      categories: trendData.labels
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 6
    },
    tooltip: {
      shared: true,
      intersect: false
    }
  };

  const lineChartSeries = [
    {
      name: 'New Deals',
      data: trendData.dealsSeries
    },
    {
      name: 'New Contacts',
      data: trendData.contactsSeries
    }
  ];

  const areaChartOptions = {
    chart: {
      type: 'area',
      height: 300
    },
    colors: ['#EC4899'],
    xaxis: {
      categories: trendData.labels
    },
    yaxis: {
      title: {
        text: 'Deal Value'
      },
      labels: {
        formatter: (val) => formatCurrency(val)
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    tooltip: {
      y: {
        formatter: (val) => formatCurrency(val)
      }
    }
  };

  const areaChartSeries = [
    {
      name: 'Deal Value',
      data: trendData.valueSeries
    }
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="p-6 max-w-full overflow-hidden"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Analytics
          </h1>
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-sm"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="1year">Last year</option>
            </select>
            <Button
              onClick={loadAnalyticsData}
              variant="secondary"
              icon="RefreshCw"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={cardVariants}>
            <Card className="text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Pipeline Value</span>
                <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="DollarSign" className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalPipelineValue)}</p>
              <p className="text-xs text-gray-500 mt-1">Active deals</p>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Closed Revenue</span>
                <div className="w-8 h-8 bg-gradient-to-br from-success/10 to-success/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-4 h-4 text-success" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalClosedValue)}</p>
              <p className="text-xs text-gray-500 mt-1">{metrics.closedDealsCount} deals closed</p>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Conversion Rate</span>
                <div className="w-8 h-8 bg-gradient-to-br from-warning/10 to-warning/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" className="w-4 h-4 text-warning" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Deals closed vs total</p>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Card className="text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Avg. Deal Value</span>
                <div className="w-8 h-8 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BarChart3" className="w-4 h-4 text-secondary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.averageDealValue)}</p>
              <p className="text-xs text-gray-500 mt-1">Across all deals</p>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Charts */}
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div variants={cardVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h3>
            <Chart
              options={donutChartOptions}
              series={stageData.series}
              type="donut"
              height={300}
            />
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Distribution</h3>
            <Chart
              options={barChartOptions}
              series={[{ data: activityData.series }]}
              type="bar"
              height={300}
            />
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
            <Chart
              options={lineChartOptions}
              series={lineChartSeries}
              type="line"
              height={300}
            />
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
            <Chart
              options={areaChartOptions}
              series={areaChartSeries}
              type="area"
              height={300}
            />
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;