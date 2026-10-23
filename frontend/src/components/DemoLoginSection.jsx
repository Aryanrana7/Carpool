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
  compact = false,
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
    <div className={compact ? 'mt-3 pt-2.5 border-t border-border/70' : 'mt-5 pt-4 border-t border-border'}>
      <div className={`flex items-center justify-between ${compact ? 'mb-2' : 'mb-3'}`}>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
          <Zap size={12} className="text-[#134E35] dark:text-primary" />
          <span>Quick Demo Access</span>
        </div>
        <span className="text-[10px] text-text-muted flex items-center gap-1">
          Pass: <code className="bg-[#EBE7DF] dark:bg-surface-sunken px-1.5 py-0.5 rounded text-[10px] font-mono text-text-primary font-semibold border border-border/50">{DEMO_PASSWORD}</code>
        </span>
      </div>

      <div className={`grid grid-cols-2 ${compact ? 'gap-1.5' : 'gap-2.5'}`}>
        {list.map((account) => (
          <button
            key={account.email}
            type="button"
            disabled={loadingEmail !== null}
            onClick={() => handleQuickLogin(account)}
            className={`border border-border/70 bg-white/90 dark:bg-surface/90 hover:border-[#134E35]/60 hover:bg-[#F6FAF7] dark:hover:bg-surface-elevated text-left transition-all duration-150 group disabled:opacity-50 cursor-pointer shadow-2xs flex items-center justify-between ${
              compact ? 'px-2.5 py-1.5 rounded-lg' : 'p-3 rounded-xl'
            }`}
          >
            <div className="min-w-0 pr-1.5">
              <span className={`font-bold text-text-primary truncate block group-hover:text-[#134E35] dark:group-hover:text-primary ${
                compact ? 'text-[11px] leading-tight' : 'text-xs'
              }`}>
                {account.name.split(' ')[0]}
              </span>
              <p className={`text-text-muted truncate ${
                compact ? 'text-[10px] leading-tight mt-0.5' : 'text-[11px] mt-0.5'
              }`}>
                {type === 'passenger' ? account.tag : account.route}
              </p>
            </div>
            {type === 'passenger' ? (
              <User size={compact ? 12 : 14} className="text-text-muted group-hover:text-[#134E35] dark:group-hover:text-primary shrink-0 transition-colors" />
            ) : (
              <Car size={compact ? 12 : 14} className="text-text-muted group-hover:text-[#134E35] dark:group-hover:text-primary shrink-0 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoLoginSection;
