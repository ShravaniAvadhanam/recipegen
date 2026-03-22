import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ChefHat, Sparkles, Dumbbell, User, LogOut } from 'lucide-react';
import useStore from '../store';

export default function AppShell({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const current = location.pathname;
    const { user } = useStore();

    // Do not show navigation on splash, onboarding or deep cooking modes where distraction isn't wanted
    const isNoNavPage = current === '/' || current.startsWith('/onboarding') || current.startsWith('/cooking/');

    const tabs = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: ChefHat, label: 'Prep', path: '/mealprep' },
        { icon: Sparkles, label: 'Suggest', path: '/suggest', isFab: true },
        { icon: Dumbbell, label: 'Progress', path: '/analytics' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    if (isNoNavPage) {
        return (
            <div className="app-shell no-nav">
                <main className="main-content">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            {/* Desktop / Tablet Sidebar */}
            <aside className="sidebar-nav">
                <div className="sidebar-logo" onClick={() => navigate('/home')}>
                    <div className="logo-orb">✨</div>
                    <span className="logo-text">Recipe<br />Gen</span>
                </div>

                <nav className="sidebar-links">
                    {tabs.map(tab => (
                        <div
                            key={tab.path}
                            className={`sidebar-item ${current === tab.path ? 'active' : ''} ${tab.isFab ? 'fab' : ''}`}
                            onClick={() => navigate(tab.path)}
                            title={tab.label}
                        >
                            <tab.icon size={22} className="sidebar-icon" />
                            <span className="sidebar-label">{tab.label}</span>
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-profile" onClick={() => navigate('/profile')}>
                        <div className="sidebar-avatar">{user?.name?.[0] || 'U'}</div>
                        <div className="sidebar-user-info">
                            <span className="sidebar-user-name">{user?.name || 'User'}</span>
                            <span className="sidebar-user-streak">🔥 {user?.streak || 0} day streak</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <div className="main-container">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
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
        </div>
    );
}
