import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SettingsForm from './components/SettingForm';
import AdminSettingsForm from './components/AdminSettingsForm';

interface AdminSettingsConfigurationProps {
  onLogout: () => void;
  role: 'admin' | 'user';
}

const AdminSettingsConfiguration: React.FC<AdminSettingsConfigurationProps> = ({ onLogout, role }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <Sidebar onLogout={onLogout} />

      <div style={{ flex: 1, marginLeft: '220px', paddingTop: '60px', padding: '20px' }}>
        <Header title="Settings & Configuration." onLogout={onLogout} />

        <div style={{ marginTop: '20px' }}>
          {role === 'admin' ? <AdminSettingsForm /> : <SettingsForm />}
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsConfiguration;
