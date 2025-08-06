import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  Bell, 
  Shield, 
  CheckCircle,
  Globe,
  Database,
  Wifi
} from 'lucide-react';

export default function RealTimePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl font-bold tracking-tight">Real-Time Policy</h1>
            <Badge className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              LIVE
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding how SnapGain UK delivers instant cashback rate updates across TopCashback, JamDoughnut, and Amazon UK.
          </p>
        </div>

        {/* Real-time Infrastructure */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500" />
              Real-Time Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Wifi className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">WebSocket Connections</h3>
                    <p className="text-sm text-muted-foreground">
                      Persistent connections ensure instant updates without page refreshes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Supabase Realtime</h3>
                    <p className="text-sm text-muted-foreground">
                      Database triggers automatically broadcast changes to all connected users.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Multi-Platform APIs</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct integrations with TopCashback, JamDoughnut, and Amazon UK APIs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Data Integrity</h3>
                    <p className="text-sm text-muted-foreground">
                      All rate changes are logged with timestamps and source verification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Update Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Update Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Our monitoring system detects rate changes across platforms
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Validation</h3>
                  <p className="text-sm text-muted-foreground">
                    Changes are verified and cross-referenced for accuracy
                  </p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Broadcast</h3>
                  <p className="text-sm text-muted-foreground">
                    Updates are instantly pushed to all connected users
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform-Specific Policies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Platform-Specific Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💰</span>
                  <h3 className="font-semibold">TopCashback UK</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Updates every 15 minutes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Weekend bonus rates tracked
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Store-specific promotions included
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🍩</span>
                  <h3 className="font-semibold">JamDoughnut</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Student rate changes tracked
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Age-specific promotions noted
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Flash sales detected instantly
                  </li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🛒</span>
                  <h3 className="font-semibold">Amazon UK</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Prime member rates differentiated
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Lightning deals monitored
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Category-specific rates tracked
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification System */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Notification System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Instant Alerts</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Rate increases above 1%
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    Significant rate decreases
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    New store additions
                  </li>
                  <li className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-500" />
                    Special promotions launched
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">User Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Customizable notification thresholds
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Store-specific alert preferences
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Platform filtering options
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Quiet hours scheduling
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Privacy & Security */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Data Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Your Privacy is Protected</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Real-time updates do not require personal data sharing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Only aggregated, anonymized usage patterns are collected
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  All data transmissions are encrypted (TLS 1.3)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  You can disable real-time features at any time
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Technical Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Update Frequencies</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>TopCashback UK:</span>
                    <Badge variant="outline">Every 15 minutes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>JamDoughnut:</span>
                    <Badge variant="outline">Every 10 minutes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Amazon UK:</span>
                    <Badge variant="outline">Every 5 minutes</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency updates:</span>
                    <Badge variant="outline">Instant</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">System Performance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Update latency:</span>
                    <Badge variant="outline">&lt; 100ms</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Connection uptime:</span>
                    <Badge variant="outline">99.9%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Data accuracy:</span>
                    <Badge variant="outline">99.95%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Fallback systems:</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Questions about our Real-Time Policy?</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Our team is here to help explain how our real-time system works.
          </p>
          <Badge className="bg-blue-100 text-blue-800">
            Contact: support@snapgain.uk
          </Badge>
        </div>
      </div>
    </div>
  );
}
