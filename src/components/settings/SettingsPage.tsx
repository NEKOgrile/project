import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { AppSettings } from '../../types';
import { t } from '../../utils/translations';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onBack
}) => {
  const [formData, setFormData] = useState(settings);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setMessage(t('settingsUpdated', formData.language));
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {t('settings', settings.language)}
          </h1>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <p className="text-green-400">{message}</p>
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Settings */}
          <Card>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                {t('language', settings.language)}
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="language"
                    value="fr"
                    checked={formData.language === 'fr'}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value as 'fr' | 'en' }))}
                    className="text-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🇫🇷</span>
                    <span className="text-white font-medium">Français</span>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Theme Settings */}
          <Card>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                {t('theme', formData.language)}
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value="blue-night"
                    checked={formData.theme === 'blue-night'}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as 'blue-night' | 'anthracite' }))}
                    className="text-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full border-2 border-white/20"></div>
                    <span className="text-white font-medium">
                      {t('blueNight', formData.language)}
                    </span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="radio"
                    name="theme"
                    value="anthracite"
                    checked={formData.theme === 'anthracite'}
                    onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value as 'blue-night' | 'anthracite' }))}
                    className="text-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-2 border-white/20"></div>
                    <span className="text-white font-medium">
                      {t('anthracite', formData.language)}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="lg">
              <Save className="w-5 h-5 mr-2" />
              {t('save', formData.language)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;