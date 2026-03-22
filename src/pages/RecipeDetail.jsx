import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, MessageCircle } from 'lucide-react';
import useStore from '../store';

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { mealDatabase, targets, today, logMeal } = useStore();
    const meal = mealDatabase.find(m => m.id === id);
    const remaining = { cal: targets.calories - today.caloriesConsumed, protein: targets.protein - today.proteinConsumed };

    if (!meal) return <div className="screen-content" style={{ padding: 20 }}>Recipe not found</div>;

    return (
        <div className="screen-content" style={{ background: 'var(--bg-app)', paddingTop: 0, paddingBottom: 100 }}>
            {/* Hero */}
            <div style={{ position: 'relative' }}>
                <img src={meal.image} alt={meal.name} style={{ width: '100%', height: 260, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 60, left: 18, right: 18, display: 'flex', justifyContent: 'space-between' }}>
                    <motion.div whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} style={{
                        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: 999, padding: '8px 12px',
                        boxShadow: 'var(--e1)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                    }}>
                        <ChevronLeft size={18} /> Back
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.9 }} style={{
                        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)', borderRadius: 999, padding: '8px 12px',
                        boxShadow: 'var(--e1)', cursor: 'pointer'
                    }}>
                        <Heart size={18} />
                    </motion.div>
                </div>
            </div>

            {/* Score badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: -22, position: 'relative', zIndex: 10, padding: '0 18px' }}>
                {[
                    { value: meal.healthScore, label: 'HEALTH' },
                    { value: meal.proteinScore, label: 'PROTEIN', color: '#B286FD' },
                    { value: `${meal.timeMinutes} MIN`, label: 'COOK TIME' },
                ].map(badge => (
                    <div key={badge.label} style={{
                        background: 'var(--surface-2)', boxShadow: 'var(--e2)', borderRadius: 999, padding: '10px 16px', textAlign: 'center'
                    }}>
                        <div style={{ fontWeight: 700, fontSize: 17, color: badge.color || 'var(--text-1)' }} className={!badge.color ? 'grad-text' : undefined}>
                            {badge.value}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', color: 'var(--text-4)', letterSpacing: '0.05em' }}>
                            {badge.label}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: '16px 18px' }}>
                <h1 style={{ fontWeight: 700, fontSize: 24, color: 'var(--text-1)', marginBottom: 6 }}>{meal.name}</h1>
                <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 16 }}>{meal.description}</p>

                {/* Agent context */}
                <div className="card" style={{ borderLeft: '3px solid var(--success)', padding: '12px 14px', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
                        This recipe gives you <strong>{meal.calories} kcal</strong> and <strong>{meal.protein}g protein</strong>.
                        You'll have <strong>{remaining.cal - meal.calories} kcal</strong> left for {new Date().getHours() < 15 ? 'dinner' : 'snacks'} 🎯
                    </div>
                </div>

                {/* Macro bars */}
                <div className="card" style={{ marginBottom: 12 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)', marginBottom: 14 }}>Macronutrients</h3>
                    {[
                        { label: 'Protein', value: meal.protein, max: 50, color: 'var(--protein)', unit: 'g' },
                        { label: 'Carbs', value: meal.carbs, max: 80, color: 'var(--carb)', unit: 'g' },
                        { label: 'Fat', value: meal.fat, max: 40, color: 'var(--fat)', unit: 'g' },
                    ].map(m => (
                        <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: 'var(--text-3)', fontWeight: 500, width: 55 }}>{m.label}</span>
                            <div style={{ flex: 1, height: 6, background: 'var(--surface)', borderRadius: 999, overflow: 'hidden' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${(m.value / m.max) * 100}%` }} transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                                    style={{ height: '100%', background: m.color, borderRadius: 999 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: m.color, width: 35, textAlign: 'right' }}>{m.value}{m.unit}</span>
                        </div>
                    ))}
                </div>

                {/* Ingredients */}
                <div className="card" style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <h3 style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)' }}>Ingredients</h3>
                        <div className="pill" style={{ background: 'var(--grad-soft)', color: 'var(--success)', fontSize: 12 }}>
                            {meal.ingredients.filter(i => i.inPrep).length}/{meal.ingredients.length} in prep
                        </div>
                    </div>
                    {meal.ingredients.map((ing, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: ing.inPrep ? 'var(--success)' : 'var(--warning)', flexShrink: 0 }} />
                            <span style={{ fontSize: 14, color: 'var(--text-2)', flex: 1 }}>{ing.name}</span>
                            <span style={{ fontSize: 13, color: 'var(--text-4)' }}>{ing.amount}</span>
                        </div>
                    ))}
                </div>

                {/* Steps preview */}
                <div className="card" style={{ marginBottom: 16 }}>
                    <h3 style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)', marginBottom: 14 }}>Steps</h3>
                    {meal.steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--grad-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--success)', flexShrink: 0 }}>
                                {step.order}
                            </div>
                            <span style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>{step.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed bottom CTAs */}
            <div style={{
                position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 430,
                background: 'rgba(14,14,14,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid var(--border)', padding: '14px 18px 34px',
                display: 'flex', gap: 12, zIndex: 90,
            }}>
                <button className="cta-secondary" onClick={() => { logMeal(meal); navigate('/home'); }} style={{ flex: 1, height: 48 }}>
                    📝 Log This
                </button>
                <motion.button whileTap={{ scale: 0.95 }} className="cta-primary" onClick={() => navigate(`/cooking/${meal.id}`)} style={{ flex: 1, height: 48, fontSize: 15 }}>
                    ▶ Start Cooking
                </motion.button>
            </div>

            {/* AI Chat FAB */}
            <motion.div
                whileTap={{ scale: 0.9 }}
                style={{
                    position: 'fixed', bottom: 110, right: 'calc(50% - 215px + 18px)',
                    width: 56, height: 56, borderRadius: '50%', background: 'var(--grad-chat)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--chat-glow)', cursor: 'pointer', zIndex: 95,
                }}
            >
                <MessageCircle size={24} color="#fff" />
            </motion.div>
        </div>
    );
}
