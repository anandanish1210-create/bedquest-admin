"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // <-- IMPORTED THE LINK COMPONENT
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
    ChevronDown, LayoutDashboard, Boxes, Building2, Package, PackageCheck, Truck, 
    ShoppingCart, IndianRupee, FileText, AlertTriangle, Settings, ChevronsLeft, 
    ChevronsRight, BedDouble, Factory, Warehouse, FileSignature, CircleDollarSign, 
    Undo2, BarChart2, Menu, Search, Filter, XCircle, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- HELPER HOOK --- //
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);
  return matches;
};

// --- MOCK DATA --- //
const initialOrders = [];

// --- REUSABLE COMPONENTS --- //
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-800 mt-4">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => {
    const statusStyles = {
        Processing: 'bg-blue-100 text-blue-800',
        Shipped: 'bg-yellow-100 text-yellow-800',
        Delivered: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
        Refunded: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

// --- SIDEBAR COMPONENT (FULLY FUNCTIONAL) --- //
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const sidebarVariants = {
    open: { width: '280px', transition: { type: 'spring', stiffness: 100, damping: 20 } },
    closed: { width: '80px', transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };
  
  const textVariants = {
      open: { opacity: 1, x: 0, display: 'inline-block', transition: { delay: 0.1, duration: 0.2 } },
      closed: { opacity: 0, x: -10, transitionEnd: { display: 'none' } },
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
    { name: 'Order Management', icon: <ShoppingCart />, path: '/ordermanagement' },
    {
      name: 'Raw Materials', icon: <Boxes />,
      submenu: [
        { name: 'Stock Tracking', path: '/materials/stock' },
        { name: 'Supplier Details', path: '/materials/suppliers' },
      ],
    },
    {
      name: 'Production', icon: <Factory />,
      submenu: [
        { name: 'Production Orders', path: '/production/orders' },
        { name: 'Bill of Materials', path: '/production/bom' },
      ],
    },
    { name: 'Suppliers', icon: <Building2 />, path: '/suppliers' },
  ];

  const handleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? null : name);
  };

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isSidebarOpen ? 'open' : 'closed'}
      className="bg-white h-full shadow-2xl flex flex-col justify-between"
    >
        <div>
            <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} p-6 h-[80px] border-b`}>
                <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-3">
                        <BedDouble className="text-indigo-600 w-8 h-8"/>
                        <motion.span variants={textVariants} className="text-xl font-bold text-gray-800 whitespace-nowrap">Bedquest</motion.span>
                    </motion.div>
                )}
                </AnimatePresence>
                {!isSidebarOpen && <BedDouble className="text-indigo-600 w-8 h-8"/>}
            </div>
            <nav className="mt-6 px-4">
                <ul>
                  {menuItems.map((item) => (
                    <li key={item.name} className="mb-2">
                      {item.submenu ? (
                        <>
                          <div
                            onClick={() => handleSubmenu(item.name)}
                            className="flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              {item.icon}
                              <motion.span variants={textVariants} className="font-medium whitespace-nowrap">{item.name}</motion.span>
                            </div>
                            {isSidebarOpen && (
                              <motion.div animate={{ rotate: openSubmenu === item.name ? 180 : 0 }}>
                                <ChevronDown size={18} />
                              </motion.div>
                            )}
                          </div>
                          <AnimatePresence>
                            {item.submenu && openSubmenu === item.name && isSidebarOpen && (
                              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-8 mt-1 border-l-2 border-indigo-100">
                                {item.submenu.map((subItem) => (
                                  <li key={subItem.name}>
                                    <Link href={subItem.path} className="block p-2 text-sm text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                                      {subItem.name}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link href={item.path} className="flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors">
                           <div className="flex items-center gap-4">
                              {item.icon}
                              <motion.span variants={textVariants} className="font-medium whitespace-nowrap">{item.name}</motion.span>
                            </div>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
            </nav>
        </div>
        
        <div className="p-4 border-t">
            <Link href="/settings" className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                <Settings />
                <motion.span variants={textVariants} className="ml-4 font-medium whitespace-nowrap">Settings</motion.span>
            </Link>
        </div>
    </motion.div>
  );
};


// --- MAIN ORDER MANAGEMENT PAGE COMPONENT --- //
export default function OrderManagementPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost/market/bedquest-api/orders.php');
        const result = await response.json();

        if (response.ok) {
          setOrders(result.data || []);
        } else {
          throw new Error(result.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.marketplace_order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const orderStats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {!isDesktop && isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-30"></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-40 md:relative md:translate-x-0 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 rounded-lg bg-white shadow-sm">
                    <Menu/>
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Order Management</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Search, filter, and manage all your orders.</p>
                </div>
            </div>
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
                {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
            </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Orders" value={orderStats.total} icon={<ShoppingCart className="text-blue-500"/>} bgColor="bg-blue-100"/>
          <StatCard title="Processing" value={orderStats.processing} icon={<Package className="text-purple-500"/>} bgColor="bg-purple-100" />
          <StatCard title="Shipped" value={orderStats.shipped} icon={<Truck className="text-yellow-500"/>} bgColor="bg-yellow-100" />
          <StatCard title="Delivered" value={orderStats.delivered} icon={<PackageCheck className="text-green-500"/>} bgColor="bg-green-100" />
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                 <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                    <input 
                        type="text"
                        placeholder="Search by Order ID or Name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 <div className="relative w-full sm:w-auto">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                     <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full sm:w-48 pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                     >
                         <option>All</option>
                         <option>Processing</option>
                         <option>Shipped</option>
                         <option>Delivered</option>
                         <option>Cancelled</option>
                     </select>
                 </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Order ID</th>
                            <th className="p-4 font-semibold text-gray-600">Customer</th>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            <th className="p-4 font-semibold text-gray-600">Amount</th>
                            <th className="p-4 font-semibold text-gray-600">Source</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center p-8">Loading orders...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="7" className="text-center p-8 text-red-500">Error: {error}</td></tr>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{order.marketplace_order_id}</td>
                                    <td className="p-4 text-gray-600">{order.customer_name}</td>
                                    <td className="p-4 text-gray-600">{new Date(order.order_date).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-800">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                    <td className="p-4 text-gray-600">{order.marketplace}</td>
                                    <td className="p-4"><StatusBadge status={order.status} /></td>
                                    <td className="p-4 text-center">
                                        <button className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100">
                                            <MoreVertical size={20}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr><td colSpan="7" className="text-center p-8 text-gray-500">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}