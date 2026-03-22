import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import useStore from '../store';
const tabs = ['Today', 'This Week', 'This Month'];

export default function Analytics() {
    const { weeklyData, today, targets } = useStore();
    const [activeTab, setActiveTab] = useState('This Week');

    const missedDays = weeklyData.filter(d => d.calories === 0);
    const proteinHits = weeklyData.filter(d => d.protein >= targets.protein * 0.9).length;
    const calHits = weeklyData.filter(d => Math.abs(d.calories - targets.calories) <= 200).length;

    const insights = [];

    // 1. Protein hits
    if (proteinHits >= 4) insights.push({ border: '#B2F042', icon: '💪', text: `Hit protein ${proteinHits}/7 days`, sub: 'Great consistency!' });
    else insights.push({ border: '#E55733', icon: '🍗', text: `Protein hit ${proteinHits}/7 days`, sub: `Aim for ${targets.protein}g daily` });

    // 2. Missed days
    if (missedDays.length > 0) insights.push({ border: '#E55733', icon: '📅', text: `${missedDays[0].day} had no meals logged`, sub: 'Try setting a reminder' });
    else insights.push({ border: '#B2F042', icon: '🔥', text: 'Logged tracking every day', sub: 'Perfect streak!' });

    // 3. Calorie accuracy
    insights.push({ border: '#B286FD', icon: '🎯', text: `Hit calorie target ${calHits} days`, sub: 'Within 200 kcal margin' });

    const macroData = [
        { name: 'Protein', value: today.proteinConsumed, color: '#B286FD' },
        { name: 'Carbs', value: today.carbsConsumed, color: '#E55733' },
        { name: 'Fat', value: today.fatConsumed, color: '#0EA5E9' },
    ];

    const totalMacros = macroData.reduce((s, m) => s + m.value, 0);

    const stagger = (i) => ({
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.06 },
    });

    return (
        <>
            <div style={{ background: 'var(--bg-app)' }}>
                {/* Header */}
                <div style={{ position: 'sticky', top: 0, zIndex: 50, paddingTop: 59, paddingBottom: 16, paddingLeft: 18, paddingRight: 18, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
                    <h1 style={{ fontWeight: 700, fontSize: 26, color: 'var(--text-1)', marginBottom: 12 }}>Progress & Stats</h1>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {tabs.map(tab => (
                            <div key={tab} onClick={() => setActiveTab(tab)}
                                className="pill" style={{
                                    background: activeTab === tab ? '#B2F042' : 'var(--surface)',
                                    color: activeTab === tab ? '#0E0E0E' : 'var(--text-3)',
                                    cursor: 'pointer', fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                                }}>
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '16px 18px' }}>
                    {/* AI Insight Cards */}
                    <motion.div {...stagger(0)} style={{ display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
                        {insights.map((ins, i) => (
                            <motion.div key={i} {...stagger(i + 1)} className="card" style={{
                                minWidth: 230, padding: '14px 16px', borderLeft: `3px solid ${ins.border}`, flexShrink: 0
                            }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{ins.icon} {ins.text}</div>
                                <div style={{ fontWeight: 400, fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>{ins.sub}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Weekly Calories Bar Chart */}
                    <motion.div {...stagger(4)} className="card" style={{ marginBottom: 14, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                                    {weeklyData.reduce((s, d) => s + d.calories, 0).toLocaleString()} <span style={{ fontSize: 14, color: 'var(--text-4)', fontFamily: "'Outfit'" }}>kcal</span>
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Total consumed this week</div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart data={weeklyData}>
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#B286FD" />
                                        <stop offset="100%" stopColor="#B2F042" />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'Outfit' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, fontFamily: 'Outfit', fontSize: 13, color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                                <Bar dataKey="calories" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Macro Donut */}
                    <motion.div {...stagger(5)} className="card" style={{ marginBottom: 14, padding: 18 }}>
                        <h3 style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)', marginBottom: 14 }}>Macro Split</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                            <div style={{ width: 120, height: 120, position: 'relative' }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={macroData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                                            {macroData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: 'var(--text-4)' }}>Today</div>
                                    <div style={{ fontWeight: 600, fontSize: 20, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>
                                        {today.caloriesConsumed}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {macroData.map(m => (
                                    <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color }} />
                                        <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{m.name}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: m.color }}>{m.value}g</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Health Score */}
                    <motion.div {...stagger(6)} className="card" style={{ marginBottom: 14, padding: 18, textAlign: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: 64, letterSpacing: '-0.02em' }} className="grad-text">
                            82
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', color: 'var(--text-4)', letterSpacing: '0.07em' }}>
                            Average health score this week
                        </div>
                    </motion.div>

                    {/* Budget card */}
                    <motion.div {...stagger(7)} className="card" style={{ background: 'var(--grad-dark)', border: 'none', padding: 18, color: '#fff' }}>
                        <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>You saved ₹340 this week</div>
                        <div style={{ fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>vs buying restaurant equivalents</div>
                    </motion.div>
                </div>

            </div>
        </>
    );
}
