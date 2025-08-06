"use client";

import React, { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "./signin/animations.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  ClipboardList,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  Clock,
  DollarSign,
  HeartPulse,
  Stethoscope,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  Star,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Shield,
  Timer,
  Award,
  Briefcase,
  MapPin,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useStats, usePerformanceMonitor } from "@/hooks/use-stats";

// Lazy load heavy components
const AppointmentStatusChart = dynamic(
  () => import("./components/appointment-status-chart").then(mod => ({ default: mod.AppointmentStatusChart })),
  {
    ssr: false,
    loading: () => <ChartSkeleton />
  }
);

const AppointmentTypeChart = dynamic(
  () => import("./components/appointment-type-chart").then(mod => ({ default: mod.AppointmentTypeChart })),
  {
    ssr: false,
    loading: () => <SmallChartSkeleton />
  }
);

const GenderDistributionChart = dynamic(
  () => import("./components/gender-distribution-chart").then(mod => ({ default: mod.GenderDistributionChart })),
  {
    ssr: false,
    loading: () => <SmallChartSkeleton />
  }
);

const RecentAppointmentsTable = dynamic(
  () => import("./components/recent-appointments-table").then(mod => ({ default: mod.RecentAppointmentsTable })),
  {
    ssr: false,
    loading: () => <TableSkeleton />
  }
);

// Skeleton Components for Loading States
function ChartSkeleton() {
  return (
    <div className="h-[350px] flex items-center justify-center p-4">
      <div className="w-full space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallChartSkeleton() {
  return (
    <div className="h-[150px] flex items-center justify-center p-4">
      <div className="w-full space-y-2">
        <Skeleton className="h-6 w-1/2" />
        <div className="flex items-center justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Memoized components for better performance
const MemoizedEnhancedStatCard = React.memo(EnhancedStatCard);
const MemoizedQuickActionCard = React.memo(QuickActionCard);

export default function StatsDashboard() {
  // Use performance optimized hook
  const { stats, isLoading, error } = useStats();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New patient registered", type: "success", time: "2 min ago" },
    { id: 2, message: "Appointment confirmed", type: "info", time: "5 min ago" },
    { id: 3, message: "System maintenance tonight", type: "warning", time: "1 hour ago" },
  ]);
  
  // Performance monitoring
  usePerformanceMonitor('StatsDashboard');
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Memoize expensive calculations
  const memoizedStats = useMemo(() => {
    if (!stats) return null;
    return {
      ...stats,
      // Add any computed values here
      totalActiveEntities: stats.totalPatients + stats.totalDoctors,
    };
  }, [stats]);
  
  // Error handling
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <Card className="w-full max-w-md backdrop-blur-lg bg-white/90 border-red-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-6">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-red-700">Dashboard Error</h2>
            <p className="text-red-600 mb-6 text-sm">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
            <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-white/30 animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-white animate-bounce" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CareBridge Loading
            </h2>
            <p className="text-gray-600 animate-pulse">Preparing your medical insights...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="max-w-md backdrop-blur-lg bg-white/80">
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-gray-600">Unable to load dashboard statistics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Modern Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-700/30 shadow-lg">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CareBridge
                </h1>
                <p className="text-xs text-gray-500">Advanced Medical Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative glassmorphism">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            </Button>
            <Button variant="ghost" size="sm" className="glassmorphism">
              <Settings className="h-4 w-4" />
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Welcome Section with Time Greeting */}
        <div className="glassmorphism rounded-2xl p-8 bg-gradient-to-r from-white/80 to-white/60 border border-white/30">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                Welcome back to your medical practice dashboard
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Downtown Medical Center
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline" className="glassmorphism border-white/30">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid with Glassmorphism */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ModernStatCard
            title="Total Patients"
            value={stats.totalPatients}
            change="+2.1%"
            changeType="positive"
            icon={<Users className="h-6 w-6" />}
            gradient="from-blue-500 to-cyan-500"
            href="/patient"
          />
          <ModernStatCard
            title="Active Doctors"
            value={stats.totalDoctors}
            change="+0.5%"
            changeType="positive"
            icon={<Stethoscope className="h-6 w-6" />}
            gradient="from-emerald-500 to-teal-500"
            href="/doctor"
          />
          <ModernStatCard
            title="Today's Appointments"
            value={stats.appointmentsLast7Days}
            change="+12.3%"
            changeType="positive"
            icon={<Calendar className="h-6 w-6" />}
            gradient="from-orange-500 to-amber-500"
            href="/appointments"
          />
          <ModernStatCard
            title="Monthly Revenue"
            value="$12,450"
            change="+8.2%"
            changeType="positive"
            icon={<DollarSign className="h-6 w-6" />}
            gradient="from-purple-500 to-pink-500"
            href="/revenue"
          />
        </div>

        {/* Advanced Features Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Real-time Notifications */}
          <Card className="glassmorphism bg-white/60 border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Live Notifications
                </CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {notifications.length} Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-white/30">
                  <div className={`w-2 h-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  } animate-pulse`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-sm text-blue-600 hover:bg-blue-50">
                View All Notifications
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions Hub */}
          <Card className="glassmorphism bg-white/60 border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 glassmorphism border-white/30 hover:bg-white/70">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-xs font-medium">Add Patient</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 glassmorphism border-white/30 hover:bg-white/70">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className="text-xs font-medium">Book Slot</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 glassmorphism border-white/30 hover:bg-white/70">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                <span className="text-xs font-medium">AI Chat</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 glassmorphism border-white/30 hover:bg-white/70">
                <FileText className="h-5 w-5 text-orange-500" />
                <span className="text-xs font-medium">Reports</span>
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="glassmorphism bg-white/60 border-white/30 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Database</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">API Services</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Security</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-yellow-600">Maintenance</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/30">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last Updated</span>
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <QuickActionCard
              title="Add Patient"
              description="Register a new patient"
              icon={<Users className="h-5 w-5" />}
              href="/patient/addpatient"
            />
            <QuickActionCard
              title="Schedule Appointment"
              description="Book a new appointment"
              icon={<Calendar className="h-5 w-5" />}
              href="/appointments/new"
            />
            <QuickActionCard
              title="Doctor Profile"
              description="Manage doctor information"
              icon={<Stethoscope className="h-5 w-5" />}
              href="/doctor/profile"
            />
            <QuickActionCard
              title="Reports"
              description="View analytics reports"
              icon={<ClipboardList className="h-5 w-5" />}
              href="/reports"
            />
          </div>
        </Card>

        {/* Enhanced Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
              <TabsTrigger value="overview" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="patients" className="gap-2">
                <Users className="h-4 w-4" />
                Patients
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    Appointment Status Distribution
                  </CardTitle>
                  <Badge variant="outline">Live Data</Badge>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex items-center justify-center">
                    <AppointmentStatusChart data={stats.appointmentsByStatus} />
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Appointment Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px] flex items-center justify-center">
                      <AppointmentTypeChart data={stats.appointmentsByType} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px] flex items-center justify-center">
                      <GenderDistributionChart data={stats.genderDistribution} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>
                    Manage and track all appointments
                  </CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Appointment
                </Button>
              </CardHeader>
              <CardContent>
                <RecentAppointmentsTable />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>
                  Overview of all registered patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <h3 className="mb-2 text-lg font-medium">
                      Patient Dashboard Coming Soon
                    </h3>
                    <p className="mb-4">
                      Advanced patient management features will be available in the next update.
                    </p>
                    <Link href="/patient">
                      <Button variant="outline">View All Patients</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Comprehensive insights and detailed reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ClipboardList className="mx-auto mb-4 h-12 w-12 opacity-50" />
                    <h3 className="mb-2 text-lg font-medium">
                      Advanced Reports Coming Soon
                    </h3>
                    <p className="mb-4">
                      Detailed analytics, custom reports, and business intelligence features will be available soon.
                    </p>
                    <Button variant="outline">Request Early Access</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  trend: string;
  ref: string;
}

// Enhanced Stat Card Component
interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  color: "blue" | "green" | "orange" | "purple";
  href: string;
}

function EnhancedStatCard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  href,
}: EnhancedStatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    green: "bg-green-500/10 text-green-600 border-green-500/20",
    orange: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  return (
    <Link href={href}>
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              <div className="flex items-center gap-1">
                {changeType === "positive" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    changeType === "positive" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {change}
                </span>
                <span className="text-sm text-muted-foreground">from last month</span>
              </div>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all group-hover:scale-110 ${colorClasses[color]}`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Quick Action Card Component
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function QuickActionCard({ title, description, icon, href }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card className="p-4 transition-all duration-300 hover:shadow-md hover:scale-105 group cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            {icon}
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Modern Glassmorphism Stat Card
interface ModernStatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  gradient: string;
  href: string;
}

function ModernStatCard({
  title,
  value,
  change,
  changeType,
  icon,
  gradient,
  href,
}: ModernStatCardProps) {
  return (
    <Link href={href}>
      <div className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              <div className="text-white">
                {icon}
              </div>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              changeType === "positive" 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {changeType === "positive" ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {change}
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">vs last month</p>
          </div>
        </div>
        
        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
      </div>
    </Link>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  ref,
}: StatCardProps) {
  return (
    <Link href={ref}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            {trend}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
