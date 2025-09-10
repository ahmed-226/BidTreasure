import React, { useState } from 'react';
import { Bell, Mail, Shield, CreditCard, Globe } from 'lucide-react';

const DashboardSettings = ({ user }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    bidReminders: true,
    outbidAlerts: true,
    winningNotifications: true,
    marketingEmails: false,
    smsNotifications: false
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Settings</h2>
        <p className="text-gray-600">Manage your dashboard preferences and notifications</p>
      </div>

      {/* Notification Settings */}
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <Bell className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'bidReminders', label: 'Bid Reminders', description: 'Get reminded about ending auctions' },
            { key: 'outbidAlerts', label: 'Outbid Alerts', description: 'Notify when you\'ve been outbid' },
            { key: 'winningNotifications', label: 'Winning Notifications', description: 'Alerts when you win an auction' },
            { key: 'marketingEmails', label: 'Marketing Emails', description: 'Promotional content and offers' },
            { key: 'smsNotifications', label: 'SMS Notifications', description: 'Text message alerts' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100">
              <div>
                <p className="font-medium text-gray-900">{setting.label}</p>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
              <button
                onClick={() => handleSettingChange(setting.key)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings[setting.key] ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings[setting.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <Shield className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
        </div>
        
        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <span className="text-sm text-blue-600">Enable</span>
            </div>
          </button>
          
          <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Login History</p>
                <p className="text-sm text-gray-500">View recent login activity</p>
              </div>
              <span className="text-sm text-blue-600">View</span>
            </div>
          </button>
        </div>
      </div>

      {/* Account Preferences */}
      <div className="card p-6">
        <div className="flex items-center mb-6">
          <Globe className="h-6 w-6 text-purple-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Account Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="input-field">
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <select className="input-field">
              <option>Eastern Time (ET)</option>
              <option>Central Time (CT)</option>
              <option>Mountain Time (MT)</option>
              <option>Pacific Time (PT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;