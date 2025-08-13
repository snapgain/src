import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Header } from '@/components/layout/Header';   // ✅ ADICIONAR
import { Footer } from '@/components/layout/Footer';   // ✅ ADICIONAR
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Shield, Smartphone, Mail, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

function SettingsPage() {
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    dealAlerts: true,
    twoFactorAuth: false,
    marketingEmails: false
  });

  const handleSettingChange = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem('snapgain_settings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
        variant: "default"
      });
      
      console.log('Settings saved:', settings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('snapgain_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Settings - SnapGain</title>
        <meta name="description" content="Manage your SnapGain account settings and preferences." />
      </Helmet>

      <Header />  {/* ✅ ADICIONAR HEADER */}

      <DashboardLayout
        title="⚙️ Settings"
        subtitle="Customize your SnapGain experience"
        icon={{
          element: <Settings className="h-8 w-8 text-white" />,
          bgColor: "bg-gradient-to-r from-gray-500 to-gray-600"
        }}
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-[#7D4DFB]" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email notifications</span>
                  </Label>
                  <Checkbox 
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleSettingChange('emailNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Push notifications</span>
                  </Label>
                  <Checkbox 
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={() => handleSettingChange('pushNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-reports" className="flex items-center space-x-2">
                    <span>Weekly savings reports</span>
                  </Label>
                  <Checkbox 
                    id="weekly-reports"
                    checked={settings.weeklyReports}
                    onCheckedChange={() => handleSettingChange('weeklyReports')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="deal-alerts" className="flex items-center space-x-2">
                    <span>Deal alerts</span>
                  </Label>
                  <Checkbox 
                    id="deal-alerts"
                    checked={settings.dealAlerts}
                    onCheckedChange={() => handleSettingChange('dealAlerts')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-[#FF3FCE]" />
                  <span>Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-factor authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Checkbox 
                    checked={settings.twoFactorAuth}
                    onCheckedChange={() => handleSettingChange('twoFactorAuth')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Marketing Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and special offers
                    </p>
                  </div>
                  <Checkbox 
                    checked={settings.marketingEmails}
                    onCheckedChange={() => handleSettingChange('marketingEmails')}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button 
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] hover:from-purple-700 hover:to-pink-600"
            >
              Save Settings
            </Button>
          </motion.div>
        </motion.div>
      </DashboardLayout>
      <Footer />  {/* ✅ ADICIONAR FOOTER */}
    </>
  );
}

export default SettingsPage;