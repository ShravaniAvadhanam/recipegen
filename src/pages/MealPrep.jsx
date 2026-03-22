import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search } from 'lucide-react';
import useStore from '../store';
const categories = ['All', '🍗 Protein', '🥦 Veggies', '🍚 Carbs', '🌿 Flavor'];
const categoryMap = { '🍗 Protein': 'protein', '🥦 Veggies': 'veggies', '🍚 Carbs': 'carbs', '🌿 Flavor': 'flavor' };

const quickAddItems = [
    { name: 'Grilled Chicken', emoji: '🍗', category: 'protein' },
    { name: 'Boiled Eggs', emoji: '🥚', category: 'protein' },
    { name: 'Cooked Dal', emoji: '🍲', category: 'protein' },
    { name: 'Paneer', emoji: '🧀', category: 'protein' },
    { name: 'Tofu', emoji: '🫘', category: 'protein' },
    { name: 'Cooked Rice', emoji: '🍚', category: 'carbs' },
    { name: 'Quinoa', emoji: '🌾', category: 'carbs' },
    { name: 'Roti', emoji: '🫓', category: 'carbs' },
    { name: 'Oats', emoji: '🥣', category: 'carbs' },
    { name: 'Chopped Spinach', emoji: '🥬', category: 'veggies' },
    { name: 'Broccoli', emoji: '🥦', category: 'veggies' },
    { name: 'Cucumber', emoji: '🥒', category: 'veggies' },
    { name: 'Tomatoes', emoji: '🍅', category: 'veggies' },
    { name: 'Mint Chutney', emoji: '🌿', category: 'flavor' },
    { name: 'Salsa', emoji: '🫙', category: 'flavor' },
];

export default function MealPrep() {
    const { mealPrep, addMealPrep, removeMealPrep } = useStore();
    const [activeCategory, setActiveCategory] = useState('All');
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');

    const filteredItems = mealPrep.filter(item => {
        if (activeCategory !== 'All' && item.category !== categoryMap[activeCategory]) return false;
        if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const handleQuickAdd = (item) => {
        addMealPrep({ ...item, quantity: '200g', preppedDate: new Date().toISOString().split('T')[0], daysLeft: 3 });
        setShowAdd(false);
    };

    return (
        <>
            <div style={{ background: 'var(--bg-app)' }}>
                {/* Header */}
                <div style={{ position: 'sticky', top: 0, paddingTop: 59, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: '59px 18px 16px', borderBottom: '1px solid var(--border)', zIndex: 50 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h1 style={{ fontWeight: 700, fontSize: 26, color: 'var(--text-1)' }}>Meal Prep</h1>
                        <div className="pill" style={{ background: 'var(--grad-soft)', color: 'var(--success)', fontWeight: 600, fontSize: 13 }}>
                            {mealPrep.length}
                        </div>
                    </div>
                </div>

                <div style={{ padding: '14px 18px' }}>
                    {/* Agent banner */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="card" style={{ background: 'var(--grad-soft)', border: 'none', padding: '14px 16px', marginBottom: 14 }}>
                        <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--text-1)' }}>
                            ✨ {mealPrep.filter(p => p.daysLeft <= 1).length > 0
                                ? `${mealPrep.filter(p => p.daysLeft <= 1).map(p => p.name).join(' & ')} need using up soon!`
                                : 'Your prep is looking great this week!'
                            }
                        </div>
                        {mealPrep.filter(p => p.daysLeft <= 1).length > 0 && (
                            <div style={{ fontWeight: 400, fontSize: 13, color: 'var(--success)', marginTop: 4 }}>See recipes that use them →</div>
                        )}
                    </motion.div>

                    {/* Category pills */}
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
                        {categories.map(cat => (
                            <div key={cat} onClick={() => setActiveCategory(cat)}
                                className="pill" style={{
                                    background: activeCategory === cat ? 'var(--grad-primary)' : 'var(--surface)',
                                    color: activeCategory === cat ? '#fff' : 'var(--text-3)',
                                    cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 13, fontWeight: activeCategory === cat ? 600 : 400,
                                }}>
                                {cat}
                            </div>
                        ))}
                    </div>

                    {/* Search */}
                    <div style={{ position: 'relative', marginBottom: 14 }}>
                        <Search size={18} color="var(--text-4)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search your prep..."
                            style={{
                                width: '100%', background: 'var(--surface)', border: 'none', borderRadius: 13,
                                padding: '12px 14px 12px 40px', fontFamily: "'Outfit'", fontSize: 14, outline: 'none',
                            }} />
                    </div>

                    {/* Grid */}
                    {filteredItems.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {filteredItems.map((item, i) => (
                                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.045 }}
                                    className="card" style={{
                                        padding: 14, position: 'relative', textAlign: 'center',
                                        border: item.daysLeft <= 1 ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                                        background: item.daysLeft <= 1 ? 'rgba(255,71,87,0.12)' : 'var(--surface)',
                                    }}>
                                    {/* Category dot */}
                                    <div style={{
                                        position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%',
                                        background: item.category === 'protein' ? '#6366F1' : item.category === 'veggies' ? '#10B981' : item.category === 'carbs' ? '#F59E0B' : '#3B82F6'
                                    }} />
                                    {/* Remove button */}
                                    <div onClick={() => removeMealPrep(item.id)} style={{
                                        position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderRadius: '50%',
                                        background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }}>
                                        <X size={12} color="var(--text-4)" />
                                    </div>
                                    <div style={{ fontSize: 48, margin: '8px 0' }}>{item.emoji}</div>
                                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)' }}>{item.name}</div>
                                    <div style={{ fontWeight: 400, fontSize: 13, color: 'var(--text-4)', marginTop: 2 }}>{item.quantity}</div>
                                    {/* Expiry state */}
                                    {item.daysLeft <= 1 ? (
                                        <div className="pill" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', fontSize: 11, marginTop: 6, padding: '3px 10px' }}>
                                            ⚠️ {item.daysLeft <= 0 ? 'Expired' : '1 day'}
                                        </div>
                                    ) : item.daysLeft <= 3 ? (
                                        <div className="pill" style={{ background: 'rgba(229,87,51,0.15)', color: '#E55733', fontSize: 11, marginTop: 6, padding: '3px 10px' }}>
                                            {item.daysLeft} days left
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 6 }}>Expires {item.daysLeft}d</div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ fontSize: 48 }}>📦</div>
                            <h3 style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)', marginTop: 12 }}>No items yet</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>Add your protein pillars to get started</p>
                        </div>
                    )}
                </div>

                {/* FAB */}
                <motion.div whileTap={{ scale: 0.9 }} onClick={() => setShowAdd(true)} style={{
                    position: 'fixed', bottom: 100, right: 'calc(50% - 215px + 18px)',
                    width: 56, height: 56, borderRadius: '50%', background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--fab-glow)', cursor: 'pointer', zIndex: 95,
                }}>
                    <Plus size={24} color="#fff" />
                </motion.div>

                {/* Add sheet */}
                <AnimatePresence>
                    {showAdd && (
                        <>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }}
                                onClick={() => setShowAdd(false)} style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 96 }} />
                            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                                style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 430, background: '#1A1A1A', borderRadius: '26px 26px 0 0', padding: '16px 18px 34px', zIndex: 97, maxHeight: '70%', overflow: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderBottom: 'none' }}>
                                <div style={{ width: 36, height: 4, borderRadius: 999, background: 'var(--surface)', margin: '0 auto 16px' }} />
                                <h3 style={{ fontWeight: 700, fontSize: 20, color: 'var(--text-1)', marginBottom: 4 }}>Add to your prep</h3>
                                <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>Tap to add items you've prepped this week</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                                    {quickAddItems.filter(qi => !mealPrep.some(mp => mp.name === qi.name)).map(item => (
                                        <motion.div key={item.name} whileTap={{ scale: 0.95 }} onClick={() => handleQuickAdd(item)}
                                            className="card" style={{ padding: '12px 8px', textAlign: 'center', cursor: 'pointer' }}>
                                            <span style={{ fontSize: 28 }}>{item.emoji}</span>
                                            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginTop: 4 }}>{item.name}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

            </div>
        </>
    );
}
