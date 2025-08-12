"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // <-- IMPORTED THE LINK COMPONENT
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
    ChevronDown, LayoutDashboard, Boxes, Building2, Package, PackageCheck, Truck, 
    ShoppingCart, IndianRupee, FileText, AlertTriangle, Settings, ChevronsLeft, 
    ChevronsRight, BedDouble, Factory, Warehouse, FileSignature, CircleDollarSign, 
    Undo2, BarChart2, Menu 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


// --- MOCK DATA (same as before) --- //
const summaryStats = {
  rawMaterials: { value: "12,450", unit: "units", change: "+5.2%" },
  finishedGoods: { value: "8,720", unit: "units", change: "-1.8%" },
  monthlySales: { value: "₹4,50,000", change: "+12.5%" },
  productionOrders: { value: "78", change: "+3" },
};
const salesData = [
  { name: 'Jan', sales: 40000 }, { name: 'Feb', sales: 30000 },
  { name: 'Mar', sales: 55000 }, { name: 'Apr', sales: 48000 },
  { name: 'May', sales: 62000 }, { name: 'Jun', sales: 58000 },
];
const stockDistributionData = [
  { name: 'Fabric Rolls', value: 400 },
  { name: 'Filling Material', value: 300 },
  { name: 'Accessories', value: 300 },
  { name: 'Packaging', value: 200 },
];
const productionData = [
    { name: 'Week 1', produced: 400, wastage: 24 },
    { name: 'Week 2', produced: 300, wastage: 13 },
    { name: 'Week 3', produced: 450, wastage: 31 },
    { name: 'Week 4', produced: 380, wastage: 20 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const recentActivities = [
    { id: 1, action: 'New Sales Order #SO-1024 created', time: '2 hours ago', type: 'sales' },
    { id: 2, action: 'Low stock alert for "White Cotton Fabric"', time: '5 hours ago', type: 'alert' },
    { id: 3, action: 'Production Order #PO-512 completed', time: '1 day ago', type: 'production' },
    { id: 4, action: 'Dispatched Order #DO-887', time: '2 days ago', type: 'dispatch' },
    { id: 5, action: 'Received new batch of polyfill from Supplier XYZ', time: '3 days ago', type: 'raw_material'},
];

// --- HELPER HOOK for detecting screen size --- //
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


// --- REUSABLE COMPONENTS --- //
const StatCard = ({ title, value, unit, change, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
    <div className="flex justify-between items-start">
      <h3 className="text-base md:text-lg font-semibold text-gray-600">{title}</h3>
      <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
    </div>
    <div>
      <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">{value} <span className="text-sm md:text-base font-medium text-gray-500">{unit}</span></p>
      <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
    </div>
  </div>
);

// --- SIDEBAR COMPONENT (CORRECTED) --- //
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
                      {/* ▼▼▼ THIS IS THE CORRECTED LOGIC ▼▼▼ */}
                      {item.submenu ? (
                        // IF IT HAS A SUBMENU, render a button to toggle it
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
                                    {/* Use Link for submenu items as well */}
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
                        // ELSE (NO SUBMENU), render a direct link
                        <Link href={item.path} className="flex items-center justify-between p-3 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors">
                           <div className="flex items-center gap-4">
                              {item.icon}
                              <motion.span variants={textVariants} className="font-medium whitespace-nowrap">{item.name}</motion.span>
                            </div>
                        </Link>
                      )}
                      {/* ▲▲▲ END OF CORRECTED LOGIC ▲▲▲ */}
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


// --- MAIN DASHBOARD PAGE COMPONENT --- //
export default function DashboardPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsSidebarOpen(isDesktop);
  }, [isDesktop]);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">Welcome back, here an overview of your business.</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
          </button>
        </header>

        {/* The rest of your page content remains the same */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Raw Material Stock" value={summaryStats.rawMaterials.value} unit={summaryStats.rawMaterials.unit} change={summaryStats.rawMaterials.change} icon={<Boxes className="text-blue-500"/>} />
          <StatCard title="Finished Goods" value={summaryStats.finishedGoods.value} unit={summaryStats.finishedGoods.unit} change={summaryStats.finishedGoods.change} icon={<PackageCheck className="text-green-500"/>} />
          <StatCard title="Monthly Sales" value={summaryStats.monthlySales.value} change={summaryStats.monthlySales.change} icon={<IndianRupee className="text-yellow-500"/>} />
          <StatCard title="Active Production" value={summaryStats.productionOrders.value} unit="Orders" change={summaryStats.productionOrders.change} icon={<Truck className="text-purple-500"/>} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3 bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Sales Performance</h3>
            <ResponsiveContainer width="100%" height={300}><BarChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fill: '#6B7280' }} /><YAxis tick={{ fill: '#6B7280' }} tickFormatter={(value) => `₹${value/1000}k`} /><Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} contentStyle={{backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px'}}/><Legend /><Bar dataKey="sales" fill="#4f46e5" name="Sales (INR)" barSize={30} radius={[10, 10, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Raw Material Distribution</h3>
            <ResponsiveContainer width="100%" height={300}><PieChart><Pie data={stockDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">{stockDistributionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px'}}/><Legend iconType="circle"/></PieChart></ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Weekly Production vs Wastage</h3>
                 <ResponsiveContainer width="100%" height={300}><LineChart data={productionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" tick={{ fill: '#6B7280' }}/><YAxis tick={{ fill: '#6B7280' }}/><Tooltip contentStyle={{backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '10px'}}/><Legend /><Line type="monotone" dataKey="produced" stroke="#8884d8" strokeWidth={2} name="Units Produced"/><Line type="monotone" dataKey="wastage" stroke="#ff7300" strokeWidth={2} name="Units Wasted"/></LineChart></ResponsiveContainer>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
                <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">{recentActivities.map(activity => (<div key={activity.id} className="flex items-center gap-4"><div className={`p-2 rounded-full ${activity.type === 'alert' ? 'bg-red-100 text-red-600' : activity.type === 'sales' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{activity.type === 'alert' ? <AlertTriangle size={20}/> : <Package size={20}/>}</div><div><p className="font-medium text-sm text-gray-800">{activity.action}</p><p className="text-xs text-gray-500">{activity.time}</p></div></div>))}</div>
            </div>
        </div>
      </main>
    </div>
  );
}