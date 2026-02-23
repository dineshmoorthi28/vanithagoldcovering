import { useState, useEffect } from 'react';
import { Package, MessageSquare, TrendingUp, Clock, ArrowUpRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalEnquiries: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, enquiriesRes] = await Promise.all([
          api.get('/stats'),
          api.get('/enquiries')
        ]);
        setStats(statsRes.data);
        setRecentEnquiries(enquiriesRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const cards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Total Enquiries', value: stats.totalEnquiries, icon: MessageSquare, color: 'bg-maroon-600' },
    { title: 'Active Offers', value: '2', icon: TrendingUp, color: 'bg-gold-600' },
    { title: 'Store Status', value: 'Open', icon: Clock, color: 'bg-green-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-xl text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
              <span className="text-stone-400"><ArrowUpRight size={20} /></span>
            </div>
            <h3 className="text-stone-500 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-stone-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-stone-900">Recent Enquiries</h3>
            <button className="text-maroon-700 text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-widest">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentEnquiries.map((enquiry: any) => (
                  <tr key={enquiry.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-stone-900">{enquiry.name}</p>
                      <p className="text-xs text-stone-500">{enquiry.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">{enquiry.product_name || 'General Enquiry'}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500">
                      {new Date(enquiry.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        New
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-maroon-950 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="font-serif font-bold text-xl text-gold-400 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center space-x-4 transition-all border border-white/10">
              <div className="bg-gold-600 p-2 rounded-lg text-maroon-950"><Package size={20} /></div>
              <div className="text-left">
                <p className="font-bold text-sm">Add New Product</p>
                <p className="text-xs text-stone-400">Upload images and details</p>
              </div>
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center space-x-4 transition-all border border-white/10">
              <div className="bg-gold-600 p-2 rounded-lg text-maroon-950"><TrendingUp size={20} /></div>
              <div className="text-left">
                <p className="font-bold text-sm">Update Offers</p>
                <p className="text-xs text-stone-400">Change banner text</p>
              </div>
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl flex items-center space-x-4 transition-all border border-white/10">
              <div className="bg-gold-600 p-2 rounded-lg text-maroon-950"><FileText size={20} /></div>
              <div className="text-left">
                <p className="font-bold text-sm">Edit Homepage</p>
                <p className="text-xs text-stone-400">Update hero and about text</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
