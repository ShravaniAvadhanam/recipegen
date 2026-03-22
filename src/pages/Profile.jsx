import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, LogOut, Bell, Shield, Target, Clock, Trash2 } from 'lucide-react';
import useStore from '../store';
export default function Profile() {
    const navigate = useNavigate();
    const { user, targets, updateUserProfile } = useStore();
    const [mealReminder, setMealReminder] = useState(true);
    const [hydrationReminder, setHydrationReminder] = useState(true);

    const sections = [
        {
            title: 'Goals & Targets',
            rows: [
                { icon: Target, label: 'Calorie target', value: `${targets.calories} kcal` },
                { icon: Target, label: 'Protein target', value: `${targets.protein}g` },
                { icon: Target, label: 'Activity level', value: user.activityLevel },
            ]
        },
        {
            title: 'Dietary',
            rows: [
                { icon: Shield, label: 'Allergies', value: user.allergies.length > 0 ? user.allergies.join(', ') : 'None' },
                { icon: Shield, label: 'Diet type', value: user.dietType },
                { icon: Clock, label: 'Cook time preference', value: user.defaultCookTime },
            ]
        },
        {
            title: 'Reminders',
            rows: [
                { icon: Bell, label: 'Meal reminders', toggle: mealReminder, onToggle: () => setMealReminder(!mealReminder) },
                { icon: Bell, label: 'Hydration reminders', toggle: hydrationReminder, onToggle: () => setHydrationReminder(!hydrationReminder) },
            ]
        },
    ];

    return (
        <>
            <div style={{ background: 'var(--bg-app)' }}>
                {/* Header card */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
                    background: 'var(--grad-dark)', borderRadius: 20, padding: 20, margin: '24px 18px 16px', color: '#fff',
                    display: 'flex', alignItems: 'center', gap: 16
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%', background: 'var(--grad-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, color: '#fff'
                    }}>
                        {user.name[0]}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 20 }}>{user.name}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                            <div className="pill" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, padding: '4px 10px' }}>
                                🎯 {user.goal === 'cut' ? 'Cutting' : user.goal === 'bulk' ? 'Bulking' : 'Maintaining'}
                            </div>
                            <div className="pill" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, padding: '4px 10px' }}>
                                🔥 {user.streak} day streak
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Settings sections */}
                <div style={{ padding: '0 18px' }}>
                    {sections.map((section, si) => (
                        <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}
                            className="card" style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}>
                            <div style={{ padding: '14px 16px 8px' }}>
                                <h3 style={{ fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 12 }}>
                                    {section.title}
                                </h3>
                            </div>
                            {section.rows.map((row, ri) => (
                                <div key={row.label} style={{
                                    height: 48, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
                                    borderTop: ri > 0 ? '1px solid var(--border)' : 'none', cursor: 'pointer',
                                }}>
                                    <row.icon size={18} color="var(--text-3)" />
                                    <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--text-1)', flex: 1 }}>{row.label}</span>
                                    {row.toggle !== undefined ? (
                                        <div onClick={row.onToggle} style={{
                                            width: 44, height: 24, borderRadius: 12, background: row.toggle ? 'var(--success)' : 'var(--surface)',
                                            position: 'relative', cursor: 'pointer', transition: 'background 200ms',
                                        }}>
                                            <div style={{
                                                width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute',
                                                top: 2, left: row.toggle ? 22 : 2, transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            }} />
                                        </div>
                                    ) : (
                                        <>
                                            <span style={{ fontSize: 14, color: 'var(--text-4)' }}>{row.value}</span>
                                            <ChevronRight size={16} color="var(--text-4)" />
                                        </>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    ))}

                    {/* Danger zone */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="card" style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}>
                        <div onClick={() => {
                            if (confirm('Are you sure? This will reset all your data.')) {
                                localStorage.removeItem('recipegen-store');
                                window.location.href = '/';
                            }
                        }} style={{
                            height: 48, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                        }}>
                            <Trash2 size={18} color="var(--danger)" />
                            <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--danger)' }}>Clear all data</span>
                        </div>
                    </motion.div>

                    <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', marginTop: 20 }}>
                        RecipeGen v1.0 · Made with 🧑‍🍳 for Shravani
                    </p>
                </div>

            </div>
        </>
    );
}
