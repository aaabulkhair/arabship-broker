import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ship, Package, TrendingUp, User, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ocean-50 section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-ocean-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}
            </h1>
            <p className="text-lg text-slate-600">
              Manage your listings and track your maritime opportunities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Cargo</p>
                    <p className="text-2xl font-bold text-ocean-900">0</p>
                  </div>
                  <Package className="h-8 w-8 text-ocean-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active Vessels</p>
                    <p className="text-2xl font-bold text-ocean-900">0</p>
                  </div>
                  <Ship className="h-8 w-8 text-ocean-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Matches</p>
                    <p className="text-2xl font-bold text-ocean-900">0</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-foam-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Listings</p>
                    <p className="text-2xl font-bold text-ocean-900">0</p>
                  </div>
                  <User className="h-8 w-8 text-coral-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Cargo Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No cargo listings yet</p>
                  <Button asChild className="btn-primary focus-ring">
                    <Link to="/list-cargo">
                      <Plus className="mr-2 h-4 w-4" />
                      List Your First Cargo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  Vessel Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">No vessel listings yet</p>
                  <Button asChild className="btn-secondary focus-ring">
                    <Link to="/list-vessel">
                      <Plus className="mr-2 h-4 w-4" />
                      List Your First Vessel
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}