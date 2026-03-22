import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Plus } from 'lucide-react';
import useStore from '../store';

const BG = '#0E0E0E';
const SURFACE = '#1A1A1A';
const SURFACE2 = '#252525';
const BORDER = 'rgba(255,255,255,0.06)';
const LIME = '#B2F042';
const PURPLE = '#B286FD';
const TEXT1 = '#FFFFFF';
const TEXT2 = 'rgba(255,255,255,0.85)';
const TEXT3 = 'rgba(255,255,255,0.6)';
const TEXT4 = 'rgba(255,255,255,0.4)';

const MEAL_TIMES = [
    { key: 'morning', label: 'Morning', emoji: '🌅', time: '7–10 AM' },
    { key: 'afternoon', label: 'Afternoon', emoji: '☀️', time: '12–3 PM' },
    { key: 'evening', label: 'Evening', emoji: '🌆', time: '5–8 PM' },
    { key: 'night', label: 'Night', emoji: '🌙', time: '8–11 PM' },
];

const QUICK_FOODS = [
    { name: 'Rice', calories: 200, protein: 4, carbs: 44, fat: 0, emoji: '🍚' },
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 4, emoji: '🍗' },
    { name: 'Dal', calories: 180, protein: 12, carbs: 30, fat: 1, emoji: '🍲' },
    { name: 'Roti', calories: 120, protein: 3, carbs: 25, fat: 1, emoji: '🫓' },
    { name: 'Egg', calories: 78, protein: 6, carbs: 1, fat: 5, emoji: '🥚' },
    { name: 'Paneer', calories: 265, protein: 18, carbs: 3, fat: 20, emoji: '🧀' },
    { name: 'Banana', calories: 89, protein: 1, carbs: 23, fat: 0, emoji: '🍌' },
    { name: 'Oats', calories: 150, protein: 5, carbs: 27, fat: 3, emoji: '🥣' },
    { name: 'Salad', calories: 60, protein: 2, carbs: 10, fat: 1, emoji: '🥗' },
];

export default function ManualLog() {
    const navigate = useNavigate();
    const { logMeal } = useStore();

    const [mealTime, setMealTime] = useState('morning');
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState([]);
    const [customName, setCustomName] = useState('');
    const [customCal, setCustomCal] = useState('');
    const [customProtein, setCustomProtein] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const filteredFoods = QUICK_FOODS.filter(f =>
        search === '' || f.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleFood = (food) => {
        setSelected(prev =>
            prev.some(f => f.name === food.name)
                ? prev.filter(f => f.name !== food.name)
                : [...prev, food]
        );
    };

    const totalCal = selected.reduce((s, f) => s + f.calories, 0);
    const totalProtein = selected.reduce((s, f) => s + f.protein, 0);

    const handleLog = () => {
        if (selected.length === 0) return;
        const combined = {
            id: Date.now().toString(),
            name: selected.length === 1 ? selected[0].name : `${selected.map(f => f.name).join(' + ')}`,
            calories: totalCal,
            protein: totalProtein,
            carbs: selected.reduce((s, f) => s + f.carbs, 0),
            fat: selected.reduce((s, f) => s + f.fat, 0),
            category: mealTime,
        };
        logMeal(combined);
        navigate('/home');
    };

    const handleCustomAdd = () => {
        if (!customName || !customCal) return;
        const c = { name: customName, calories: parseInt(customCal) || 0, protein: parseInt(customProtein) || 0, carbs: 0, fat: 0, emoji: '🍽️' };
        setSelected(prev => [...prev, c]);
        setCustomName(''); setCustomCal(''); setCustomProtein('');
        setShowCustom(false);
    };

    return (
        <>
            <div style={{ background: BG, paddingBottom: 120, minHeight: '100vh' }}>

                {/* Sticky Header */}
                <div style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    padding: '59px 20px 16px',
                    background: 'rgba(14,14,14,0.92)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${BORDER}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)}
                            style={{ width: 36, height: 36, borderRadius: '50%', background: SURFACE2, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <ChevronLeft size={20} color={TEXT3} />
                        </motion.div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontWeight: 700, fontSize: 20, color: TEXT1, letterSpacing: '-0.02em' }}>Log a Meal</h1>
                            {selected.length > 0 && (
                                <div style={{ fontSize: 12, color: TEXT4, marginTop: 2 }}>
                                    {totalCal} kcal · {totalProtein}g protein
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ padding: '20px 20px 0' }}>
                    {/* Meal time selector — chronometer style */}
                    <h3 style={{ fontWeight: 600, fontSize: 13, color: TEXT4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>When did you eat?</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                        {MEAL_TIMES.map(mt => {
                            const active = mealTime === mt.key;
                            return (
                                <motion.div key={mt.key} whileTap={{ scale: 0.96 }} onClick={() => setMealTime(mt.key)}
                                    style={{
                                        padding: '14px 16px', borderRadius: 18, cursor: 'pointer',
                                        background: active ? 'rgba(178,240,66,0.12)' : SURFACE,
                                        border: active ? `1.5px solid ${LIME}` : `1px solid ${BORDER}`,
                                        display: 'flex', alignItems: 'center', gap: 12,
                                    }}>
                                    <span style={{ fontSize: 22 }}>{mt.emoji}</span>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14, color: active ? LIME : TEXT1 }}>{mt.label}</div>
                                        <div style={{ fontSize: 11, color: TEXT4 }}>{mt.time}</div>
                                    </div>
                                    {active && (
                                        <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: LIME, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Check size={12} color="#0E0E0E" strokeWidth={3} />
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Selected summary */}
                    <AnimatePresence>
                        {selected.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                style={{ background: SURFACE, borderRadius: 20, padding: '16px 18px', marginBottom: 20, border: `1px solid ${BORDER}` }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: TEXT1, marginBottom: 10 }}>Selected ({selected.length})</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {selected.map((f, i) => (
                                        <motion.div key={i} onClick={() => toggleFood(f)} whileTap={{ scale: 0.92 }}
                                            style={{ padding: '6px 12px', borderRadius: 999, background: 'rgba(178,240,66,0.12)', border: `1px solid ${LIME}40`, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <span style={{ fontSize: 14 }}>{f.emoji}</span>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: LIME }}>{f.name}</span>
                                            <span style={{ fontSize: 11, color: TEXT4 }}>×</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}` }}>
                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 22, color: TEXT1, letterSpacing: '-0.03em' }}>{totalCal}</div>
                                        <div style={{ fontSize: 11, color: TEXT4, marginTop: 2 }}>kcal</div>
                                    </div>
                                    <div style={{ textAlign: 'center', flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 22, color: PURPLE, letterSpacing: '-0.03em' }}>{totalProtein}g</div>
                                        <div style={{ fontSize: 11, color: TEXT4, marginTop: 2 }}>protein</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search */}
                    <h3 style={{ fontWeight: 600, fontSize: 13, color: TEXT4, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Quick Add</h3>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search foods..."
                        style={{ width: '100%', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 13, padding: '12px 16px', fontFamily: "'Outfit'", fontSize: 14, outline: 'none', color: TEXT1, marginBottom: 12, boxSizing: 'border-box' }} />

                    {/* Food grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                        {filteredFoods.map(food => {
                            const isSelected = selected.some(f => f.name === food.name);
                            return (
                                <motion.div key={food.name} whileTap={{ scale: 0.93 }} onClick={() => toggleFood(food)}
                                    style={{
                                        padding: '14px 8px', borderRadius: 16, cursor: 'pointer', textAlign: 'center',
                                        background: isSelected ? 'rgba(178,240,66,0.12)' : SURFACE,
                                        border: isSelected ? `1.5px solid ${LIME}` : `1px solid ${BORDER}`,
                                    }}>
                                    <div style={{ fontSize: 28, marginBottom: 6 }}>{food.emoji}</div>
                                    <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? LIME : TEXT2 }}>{food.name}</div>
                                    <div style={{ fontSize: 10, color: TEXT4, marginTop: 2 }}>{food.calories} kcal</div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Custom entry */}
                    <div style={{ marginBottom: 20 }}>
                        <button onClick={() => setShowCustom(!showCustom)}
                            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 16px', cursor: 'pointer', color: TEXT3, fontFamily: "'Outfit'", fontSize: 13 }}>
                            <Plus size={16} /> Add custom food
                        </button>
                        <AnimatePresence>
                            {showCustom && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                    style={{ background: SURFACE, borderRadius: 18, padding: 16, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10, border: `1px solid ${BORDER}` }}>
                                    {[
                                        { ph: 'Food name', val: customName, set: setCustomName, type: 'text' },
                                        { ph: 'Calories (kcal)', val: customCal, set: setCustomCal, type: 'number' },
                                        { ph: 'Protein (g) — optional', val: customProtein, set: setCustomProtein, type: 'number' },
                                    ].map(({ ph, val, set, type }) => (
                                        <input key={ph} type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph}
                                            style={{ background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', fontFamily: "'Outfit'", fontSize: 14, outline: 'none', color: TEXT1 }} />
                                    ))}
                                    <button onClick={handleCustomAdd} className="cta-primary" style={{ height: 44 }}>Add to log</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Floating log button */}
            <AnimatePresence>
                {selected.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 34px', background: `linear-gradient(to top, ${BG} 55%, transparent)`, zIndex: 100 }}>
                        <button className="cta-primary" onClick={handleLog}>
                            Log {selected.length} item{selected.length > 1 ? 's' : ''} · {totalCal} kcal
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
