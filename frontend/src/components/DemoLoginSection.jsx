import { useState } from 'react';
import { User, Car, Zap } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const DEMO_USERS = [
  { name: 'Aditi Mehta', email: 'aditi.demo@carpool.test', role: 'Passenger', tag: 'Frequent Rider' },
  { name: 'Karan Malhotra', email: 'karan.demo@carpool.test', role: 'Passenger', tag: 'Active Trips' },
  { name: 'Meera Sharma', email: 'meera.demo@carpool.test', role: 'Passenger', tag: 'Weekend Trips' },
  { name: 'Dev Patel', email: 'dev.demo@carpool.test', role: 'Passenger', tag: 'New Rider' },
];

const DEMO_DRIVERS = [
  { name: 'Rahul Sharma', email: 'rahul.demo@carpool.test', car: 'Maruti Swift', route: 'Chandigarh–Delhi' },
  { name: 'Priya Verma', email: 'priya.demo@carpool.test', car: 'Hyundai i20', route: 'Mohali–Shimla' },
  { name: 'Arjun Singh', email: 'arjun.demo@carpool.test', car: 'Tata Nexon', route: 'Chandigarh–Amritsar' },
  { name: 'Neha Kapoor', email: 'neha.demo@carpool.test', car: 'Honda City', route: 'Chandigarh–Ludhiana' },
];

const DEMO_PASSWORD = 'DemoPass123!';

export const DemoLoginSection = ({
  type = 'passenger', // 'passenger' | 'driver'
  onSelectFill,
  onDirectLogin,
}) => {
  const [loadingEmail, setLoadingEmail] = useState(null);
  const isDemoEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false';

  if (!isDemoEnabled) return null;

  const list = type === 'passenger' ? DEMO_USERS : DEMO_DRIVERS;

  const handleQuickLogin = async (account) => {
    if (onDirectLogin) {
      onDirectLogin(account);
      return;
    }

    setLoadingEmail(account.email);
    try {
      if (type === 'passenger') {
        const { data } = await api.post('/users/login', {
          email: account.email,
          password: DEMO_PASSWORD,
        });
        toast.success(`Logged in as ${data.name}`);
        if (onSelectFill) onSelectFill(account.email, DEMO_PASSWORD, data);
      } else {
        const { data } = await api.post('/drivers/login', {
          email: account.email,
          password: DEMO_PASSWORD,
        });
        toast.success(`Logged in as Driver ${data.name}`);
        if (onSelectFill) onSelectFill(account.email, DEMO_PASSWORD, data);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Demo login failed. Make sure demo database is seeded.'
      );
    } finally {
      setLoadingEmail(null);
    }
  };

  return (
    <div className="mt-6 pt-5 border-t border-border">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">
          <Zap size={13} className="text-primary" />
          <span>Quick Demo Access</span>
        </div>
        <span className="text-[11px] text-text-muted">
          Pass: <code className="bg-border-subtle px-1.5 py-0.5 rounded text-[10px] font-mono text-text-secondary">{DEMO_PASSWORD}</code>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {list.map((account) => (
          <button
            key={account.email}
            type="button"
            disabled={loadingEmail !== null}
            onClick={() => handleQuickLogin(account)}
            className="p-2.5 rounded-md border border-border bg-surface hover:border-primary hover:bg-background text-left transition-colors group disabled:opacity-50 cursor-pointer shadow-subtle"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary truncate group-hover:text-primary">
                {account.name.split(' ')[0]}
              </span>
              {type === 'passenger' ? (
                <User size={12} className="text-text-muted group-hover:text-primary shrink-0" />
              ) : (
                <Car size={12} className="text-text-muted group-hover:text-primary shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-text-muted truncate mt-0.5">
              {type === 'passenger' ? account.tag : account.route}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoLoginSection;
