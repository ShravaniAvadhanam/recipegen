import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ChefHat, Sparkles, Dumbbell, User } from 'lucide-react';

export default function IPhoneFrame({ children }) {
    return (
        <div className="iphone-frame">
            <div className="dynamic-island" />
            <StatusBar />
            {children}
            <div className="home-indicator" />
        </div>
    );
}

function StatusBar() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    return (
        <div className="status-bar">
            <span>{time}</span>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <svg width="16" height="12" viewBox="0 0 16 12"><path d="M1 9h2v3H1zM5 6h2v6H5zM9 3h2v9H9zM13 0h2v12h-2z" fill="currentColor" opacity="0.8" /></svg>
                <svg width="15" height="12" viewBox="0 0 15 12"><path d="M7.5 3.6c1.8 0 3.4.7 4.6 1.9l1.1-1.1C11.6 2.8 9.6 2 7.5 2S3.4 2.8 1.8 4.4l1.1 1.1C4.1 4.3 5.7 3.6 7.5 3.6zM7.5 7.2c1 0 2 .4 2.7 1.1l1.1-1.1c-1-.9-2.3-1.5-3.8-1.5s-2.8.6-3.8 1.5l1.1 1.1c.7-.7 1.7-1.1 2.7-1.1zM6.5 10l1 1.5 1-1.5c-.3-.3-.6-.4-1-.4s-.7.1-1 .4z" fill="currentColor" opacity="0.8" /></svg>
                <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="21" height="10" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" /><rect x="22" y="4" width="2" height="4" rx="0.5" fill="currentColor" opacity="0.3" /><rect x="1.5" y="2.5" width="14" height="7" rx="1" fill="currentColor" opacity="0.8" /></svg>
            </div>
        </div>
    );
}

export function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const current = location.pathname;

    const tabs = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: ChefHat, label: 'Prep', path: '/mealprep' },
        { icon: Sparkles, label: 'Suggest', path: '/suggest', isFab: true },
        { icon: Dumbbell, label: 'Progress', path: '/analytics' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="bottom-nav">
            {tabs.map(tab => (
                tab.isFab ? (
                    <div key={tab.path} className="fab-center" onClick={() => navigate(tab.path)}>
                        <tab.icon size={24} />
                    </div>
                ) : (
                    <div
                        key={tab.path}
                        className={`bottom-nav-item ${current === tab.path ? 'active' : ''}`}
                        onClick={() => navigate(tab.path)}
                    >
                        <tab.icon size={22} />
                        <span>{tab.label}</span>
                    </div>
                )
            ))}
        </div>
    );
}
