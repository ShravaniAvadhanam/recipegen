import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ChevronRight, Droplets } from 'lucide-react';
import useStore from '../store';
import SVGGradientRing, { MacroTrio } from '../components/SVGGradientRing';
import { BottomNav } from '../components/IPhoneFrame';

const stagger = (i) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.045, type: 'spring', stiffness: 300, damping: 25 },
});

function greetingWord() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}

export default function Home() {
    const navigate = useNavigate();
    const { user, today, targets, updateWater, mealPrep, logWorkout } = useStore();
    const isFirstUse = mealPrep.length === 0 && today.meals.length === 0;
    const remaining = { cal: targets.calories - today.caloriesConsumed, protein: targets.protein - today.proteinConsumed };

    const expiringItems = mealPrep.filter(p => p.daysLeft <= 1);
    const proteinGap = remaining.protein > 40;
    const missedBreakfast = today.meals.filter(m => m.category === 'breakfast').length === 0;

    let nudge = null;
    if (expiringItems.length > 0) {
        nudge = { icon: '⚠️', border: '#E55733', title: `${expiringItems[0].name} needs using up`, sub: 'Expires soon — open a recipe', action: () => navigate('/suggest') };
    } else if (proteinGap) {
        nudge = { icon: '💪', border: '#B286FD', title: `${remaining.protein}g protein left`, sub: 'Find a high-protein meal', action: () => navigate('/suggest') };
    } else if (today.workoutLogged) {
        nudge = { icon: '🏋️', border: '#B2F042', title: 'Targets adjusted for training', sub: '+200 kcal · +10g protein', action: null };
    } else if (missedBreakfast && new Date().getHours() >= 10) {
        nudge = { icon: '☀️', border: '#B286FD', title: 'No breakfast logged yet', sub: 'Want a suggestion?', action: () => navigate('/suggest') };
    }

    const waterDrops = Math.floor((today.waterMl / targets.water) * 8);

    return (
        <>
            <div className="screen-content home-screen" style={{ background: 'var(--bg-app)', position: 'relative' }}>

                <motion.header {...stagger(0)} className="home-header">
                    <div>
                        <span className="home-eyebrow">Good {greetingWord()}</span>
                        <span className="home-name">{user.name}</span>
                    </div>
                    <div className="home-header__actions">
                        <Bell size={21} color="var(--text-3)" strokeWidth={1.75} aria-hidden />
                        <div className="home-avatar">{user.name[0]}</div>
                    </div>
                </motion.header>

                <div className="home-main">
                    {isFirstUse ? (
                        <motion.div {...stagger(1)} style={{ padding: '20px 0', marginTop: 20 }}>
                            <div style={{ textAlign: 'center', marginBottom: 32 }}>
                                <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
                                <h2 style={{ fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em', color: 'var(--text-1)' }}>Welcome to your AI Kitchen</h2>
                                <p style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 8, padding: '0 24px', lineHeight: 1.5 }}>
                                    Let's add the ingredients you have prepped this week, so we can suggest the perfect meals for you.
                                </p>
                            </div>
                            <motion.button
                                {...stagger(2)}
                                className="cta-primary"
                                style={{ margin: '0 auto', width: 'calc(100% - 40px)' }}
                                onClick={() => navigate('/mealprep')}
                            >
                                Log your first ingredient →
                            </motion.button>
                        </motion.div>
                    ) : (
                        <>
                            <motion.p {...stagger(1)} className="home-section-label" style={{ marginTop: 0 }}>
                                Today
                            </motion.p>

                            {nudge && (
                                <motion.div
                                    {...stagger(2)}
                                    className="card home-card-nudge"
                                    data-clickable={nudge.action ? 'true' : 'false'}
                                    onClick={nudge.action || undefined}
                                    style={{ borderLeftColor: nudge.border }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
                                        {nudge.icon} {nudge.title}
                                    </div>
                                    <div style={{ fontWeight: 400, fontSize: 13, color: nudge.action ? 'var(--success)' : 'var(--text-3)', marginTop: 6, lineHeight: 1.4 }}>
                                        {nudge.sub}
                                    </div>
                                </motion.div>
                            )}

                            <motion.div {...stagger(3)} className="card home-card-quiet">
                                <div className="home-streak-top">
                                    <div className="home-streak-title">
                                        <span style={{ fontSize: 20, lineHeight: 1 }} aria-hidden>🔥</span>
                                        <span>{user.streak}-day streak</span>
                                    </div>
                                </div>
                                <div className="home-streak-dots" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                                        const isActive = i < user.streak;
                                        const isToday = i === user.streak;
                                        return (
                                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: isActive ? 'var(--grad-primary)' : isToday ? 'transparent' : 'var(--bg-app)', border: isToday ? '2px solid var(--text-3)' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {isActive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                                                </div>
                                                <span style={{ fontSize: 11, fontWeight: 500, color: isActive || isToday ? 'var(--text-1)' : 'var(--text-4)' }}>{d}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            <motion.div {...stagger(4)} className="card home-ring-card">
                                <SVGGradientRing consumed={today.caloriesConsumed} target={targets.calories} />
                                <MacroTrio
                                    protein={today.proteinConsumed} proteinTarget={targets.protein}
                                    carbs={today.carbsConsumed} carbsTarget={targets.carbs}
                                    fat={today.fatConsumed} fatTarget={targets.fat}
                                />
                                <div className="home-water-row" style={{ display: 'flex', alignItems: 'center', marginTop: 16, padding: '16px', background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)' }}>
                                    <span style={{ fontSize: 24, lineHeight: 1, marginRight: 16 }} aria-hidden>💧</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-1)' }}>Water Intake</div>
                                        <div style={{ fontSize: 13, color: 'var(--text-4)', marginTop: 2 }}>{(today.waterMl / 1000).toFixed(1)}L / {(targets.water / 1000).toFixed(1)}L</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div onClick={() => updateWater(-250)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 24, color: 'var(--text-1)', border: '1px solid var(--border)' }}>−</div>
                                        <div onClick={() => updateWater(250)} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 24, color: '#fff', boxShadow: 'var(--fab-glow)' }}>+</div>
                                    </div>
                                </div>
                            </motion.div>

                            {!today.workoutLogged && (
                                <motion.div {...stagger(5)} className="card home-workout-card">
                                    <div className="home-workout-title">Training today?</div>
                                    <div className="segmented-control">
                                        {[
                                            { label: '🚶 Light', val: 'light' },
                                            { label: '🏃 Moderate', val: 'moderate' },
                                            { label: '🏋️ Intense', val: 'intense' },
                                        ].map(w => (
                                            <div
                                                key={w.val}
                                                className="segmented-item"
                                                onClick={() => logWorkout(w.val)}
                                            >
                                                {w.label}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <motion.div
                                {...stagger(6)}
                                className="home-cta-primary"
                                onClick={() => navigate('/suggest')}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/suggest'); } }}
                            >
                                <div>
                                    <div className="home-cta-primary__title">What should I eat?</div>
                                    <div className="home-cta-primary__sub">
                                        {remaining.cal} kcal · {remaining.protein}g protein remaining
                                    </div>
                                </div>
                                <ChevronRight size={22} color="#fff" strokeWidth={2} aria-hidden />
                            </motion.div>

                            {/* Secondary action - manual log */}
                            <motion.div {...stagger(7)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 18px', background: 'var(--surface)', borderRadius: 18, marginBottom: 20, cursor: 'pointer', border: '1px solid var(--border)' }}
                                onClick={() => navigate('/log')}
                                role="button" tabIndex={0}
                            >
                                <span style={{ fontSize: 16 }}>✏️</span>
                                <span style={{ fontWeight: 500, fontSize: 15, color: 'var(--text-2)' }}>Log a meal manually</span>
                            </motion.div>

                            {today.meals.length > 0 && (
                                <motion.div {...stagger(7)} style={{ marginTop: 28 }}>
                                    <h3 className="home-meals-head">Logged today</h3>
                                    {today.meals.map((meal, i) => (
                                        <motion.div key={meal.id} {...stagger(8 + i)} className="card home-meal-row">
                                            <div className="home-meal-icon">
                                                {meal.category === 'breakfast' ? '🌅' : meal.category === 'lunch' ? '☀️' : meal.category === 'dinner' ? '🌙' : '🍎'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{meal.name}</div>
                                                <div style={{ fontWeight: 400, fontSize: 12, color: 'var(--text-4)', marginTop: 3 }}>{meal.calories} kcal · {meal.protein}g protein</div>
                                            </div>
                                        </motion.div>
                                    ))}
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
