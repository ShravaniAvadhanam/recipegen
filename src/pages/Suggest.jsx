import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic, Send, Sparkles } from 'lucide-react';
import useStore from '../store';
import { BottomNav } from '../components/IPhoneFrame';

const cravingChips = [
    { emoji: '🍲', label: 'Something warm' },
    { emoji: '🥗', label: 'Quick & light' },
    { emoji: '💪', label: 'High protein' },
    { emoji: '🍝', label: 'Comfort food' },
    { emoji: '⚡', label: 'Under 10 min' },
    { emoji: '🎲', label: 'Surprise me' },
];

export default function Suggest() {
    const navigate = useNavigate();
    const { currentSuggestion, getMealSuggestion, targets, today, mealPrep, logMeal } = useStore();
    const [input, setInput] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const remaining = { cal: targets.calories - today.caloriesConsumed, protein: targets.protein - today.proteinConsumed };

    const handleSuggest = async (craving) => {
        setHasSearched(true);
        await getMealSuggestion(craving);
    };

    const handleLogMeal = (meal) => {
        logMeal(meal);
        navigate('/home');
    };

    return (
        <>
            <div className="screen-content" style={{ background: 'var(--bg-app)', paddingBottom: 120 }}>
                {/* Header */}
                <div style={{ position: 'sticky', top: 0, zIndex: 50, paddingTop: 59, paddingBottom: 16, paddingLeft: 18, paddingRight: 18, background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ChevronLeft size={22} color="var(--text-3)" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }} />
                        <h1 style={{ fontWeight: 700, fontSize: 22, color: 'var(--text-1)', flex: 1 }}>What are you craving?</h1>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <div className="pill" style={{ background: 'var(--grad-soft)', color: 'var(--success)', fontSize: 12 }}>
                            {remaining.cal} kcal left
                        </div>
                        <div className="pill" style={{ background: 'rgba(178,134,253,0.12)', color: 'var(--purple)', fontSize: 12 }}>
                            {remaining.protein}g protein needed
                        </div>
                    </div>
                </div>

                <div style={{ padding: '16px 18px' }}>
                    {/* Agent message */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '14px 16px', marginBottom: 16, borderLeft: '3px solid var(--success)' }}>
                        <div style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.5 }}>
                            Hey {useStore.getState().user.name}! 👋 You've got <strong>{remaining.cal} kcal</strong> and <strong>{remaining.protein}g protein</strong> left today.
                            {mealPrep.length > 0 && <> I see your prepped <strong>{mealPrep.filter(p => p.category === 'protein').map(p => p.name).slice(0, 2).join(' & ')}</strong> — let me find something!</>}
                        </div>
                    </motion.div>

                    {!hasSearched ? (
                        <>
                            {/* Craving chips */}
                            <h3 style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-3)', marginBottom: 12 }}>Tell me what you're in the mood for</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
                                {cravingChips.map((chip, i) => (
                                    <motion.div
                                        key={chip.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="card"
                                        onClick={() => handleSuggest(chip.label)}
                                        style={{ padding: '14px 12px', textAlign: 'center', cursor: 'pointer' }}
                                    >
                                        <div style={{ fontSize: 24, marginBottom: 6 }}>{chip.emoji}</div>
                                        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{chip.label}</div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Text input */}
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <Mic size={20} color="var(--text-4)" />
                                </div>
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Or describe what you want..."
                                    onKeyDown={e => e.key === 'Enter' && input && handleSuggest(input)}
                                    style={{
                                        flex: 1, background: 'var(--surface)', border: 'none', borderRadius: 13,
                                        padding: '12px 14px', fontFamily: "'Outfit'", fontSize: 14, outline: 'none',
                                    }}
                                />
                                <div onClick={() => input && handleSuggest(input)} style={{
                                    width: 44, height: 44, borderRadius: '50%', background: input ? 'var(--grad-primary)' : 'var(--surface)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input ? 'pointer' : 'default'
                                }}>
                                    <Send size={18} color={input ? '#fff' : 'var(--text-4)'} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Loading */}
                            {currentSuggestion.loading && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div className="shimmer" style={{ height: 200, borderRadius: 20 }} />
                                    <div className="shimmer" style={{ height: 160, borderRadius: 20 }} />
                                </div>
                            )}

                            {/* Results */}
                            {!currentSuggestion.loading && currentSuggestion.best && (
                                <AnimatePresence>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }}>
                                        <h3 style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-3)', marginBottom: 12 }}>
                                            <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />Best match for you
                                        </h3>
                                        <MealCard meal={currentSuggestion.best} onView={() => navigate(`/recipe/${currentSuggestion.best.id}`)} onLog={() => handleLogMeal(currentSuggestion.best)} />

                                        {currentSuggestion.alternative && (
                                            <>
                                                <h3 style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-3)', margin: '20px 0 12px' }}>Alternative</h3>
                                                <MealCard meal={currentSuggestion.alternative} onView={() => navigate(`/recipe/${currentSuggestion.alternative.id}`)} onLog={() => handleLogMeal(currentSuggestion.alternative)} />
                                            </>
                                        )}

                                        <button className="cta-secondary" onClick={() => { setHasSearched(false); }} style={{ marginTop: 16 }}>
                                            ← Try different craving
                                        </button>
                                    </motion.div>
                                </AnimatePresence>
                            )}

                            {/* No match */}
                            {!currentSuggestion.loading && currentSuggestion.errorState === "no_match" && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div style={{ fontSize: 48 }}>😅</div>
                                    <h3 style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)', marginTop: 12 }}>Nothing quite fits</h3>
                                    <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>Try relaxing your filters or a different craving</p>
                                    <button className="cta-secondary" onClick={() => setHasSearched(false)} style={{ marginTop: 20, maxWidth: 200, margin: '20px auto 0' }}>
                                        Try Again
                                    </button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>

            </div>
            <BottomNav />
        </>
    );
}

function MealCard({ meal, onView, onLog }) {
    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <img src={meal.image} alt={meal.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
            <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)', flex: 1 }}>{meal.name}</h3>
                    <div className="pill" style={{ background: 'var(--grad-soft)', fontSize: 11, fontWeight: 600 }}>
                        <span className="grad-text">{meal.healthScore}</span>
                    </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4, lineHeight: 1.4 }}>{meal.description}</p>

                <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                    <div className="pill" style={{ background: 'var(--surface)', fontSize: 12 }}>🔥 {meal.calories} kcal</div>
                    <div className="pill" style={{ background: 'var(--surface)', fontSize: 12 }}>💪 {meal.protein}g protein</div>
                    <div className="pill" style={{ background: 'var(--surface)', fontSize: 12 }}>⏱ {meal.timeMinutes} min</div>
                </div>

                {/* Prep match */}
                {meal.prepMatch !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: meal.prepMatch >= 60 ? 'var(--success)' : 'var(--warning)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-4)' }}>{meal.prepMatch}% from your prep</span>
                    </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <button className="cta-secondary" onClick={onView} style={{ flex: 1, height: 42, fontSize: 14 }}>View Recipe</button>
                    <motion.button whileTap={{ scale: 0.95 }} className="cta-primary" onClick={onLog} style={{ flex: 1, height: 42, fontSize: 14 }}>
                        Log This ✓
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
