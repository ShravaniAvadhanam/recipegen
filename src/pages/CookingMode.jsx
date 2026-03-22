import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Check, ChevronLeft, Clock } from 'lucide-react';
import useStore from '../store';

const BG = '#0E0E0E';
const SURFACE = '#1A1A1A';
const SURFACE2 = '#252525';
const BORDER = 'rgba(255,255,255,0.06)';
const LIME = '#B2F042';
const PURPLE = '#B286FD';
const TEXT1 = '#FFFFFF';
const TEXT3 = 'rgba(255,255,255,0.6)';
const TEXT4 = 'rgba(255,255,255,0.4)';

function StepTimer({ timerSec }) {
    const [active, setActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(timerSec);
    const intervalRef = useRef(null);
    const done = timeLeft === 0;

    useEffect(() => {
        if (active && timeLeft > 0) {
            intervalRef.current = setInterval(() => setTimeLeft(t => {
                if (t <= 1) { setActive(false); return 0; }
                return t - 1;
            }), 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [active, timeLeft]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    const progress = timerSec > 0 ? 1 - (timeLeft / timerSec) : 0;
    const circumference = 2 * Math.PI * 18;

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 14, background: SURFACE2, borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Circular progress miniature */}
            <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                <svg width={44} height={44} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={22} cy={22} r={18} fill="none" stroke={BORDER} strokeWidth={3} />
                    <circle cx={22} cy={22} r={18} fill="none"
                        stroke={done ? LIME : PURPLE} strokeWidth={3}
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div onClick={() => { if (!done) setActive(!active); }}
                    style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: done ? 'default' : 'pointer' }}>
                    {done
                        ? <Check size={16} color={LIME} strokeWidth={3} />
                        : active ? <Pause size={14} color={TEXT1} /> : <Play size={14} color={TEXT1} style={{ marginLeft: 1 }} />
                    }
                </div>
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: '-0.04em', color: done ? LIME : TEXT1, fontFamily: 'monospace' }}>
                        {formatTime(timeLeft)}
                    </span>
                    <span style={{ fontSize: 12, color: TEXT4 }}>/ {Math.round(timerSec / 60)} min</span>
                </div>
                <div style={{ height: 3, background: BORDER, borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div animate={{ width: `${progress * 100}%` }} transition={{ duration: 1, ease: 'linear' }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${PURPLE}, ${LIME})`, borderRadius: 99 }} />
                </div>
                {done && <div style={{ fontSize: 12, color: LIME, fontWeight: 600, marginTop: 4 }}>✓ Done!</div>}
            </div>
        </motion.div>
    );
}

export default function CookingMode() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { mealDatabase } = useStore();
    const meal = mealDatabase.find(m => m.id === id);
    const [completedSteps, setCompletedSteps] = useState([]);

    if (!meal) return null;

    const allDone = completedSteps.length === meal.steps.length;
    const toggleStep = (idx) => {
        setCompletedSteps(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    return (
        <>
            <div className="screen-content" style={{ background: BG, paddingBottom: 120 }}>

                {/* Sticky Header — dark glass */}
                <div style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    padding: '59px 20px 16px',
                    background: 'rgba(14,14,14,0.9)',
                    backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${BORDER}`,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <motion.div whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} style={{
                            width: 36, height: 36, borderRadius: '50%', background: SURFACE2,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}>
                            <ChevronLeft size={20} color={TEXT3} />
                        </motion.div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 17, color: TEXT1, letterSpacing: '-0.02em' }}>{meal.name}</div>
                            <div style={{ fontSize: 12, color: TEXT4, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} />
                                {meal.timeMinutes} min total · {completedSteps.length}/{meal.steps.length} steps done
                            </div>
                        </div>
                        {/* Progress pill */}
                        <div style={{
                            padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 700,
                            background: allDone ? LIME : SURFACE2,
                            color: allDone ? '#0E0E0E' : TEXT3,
                            transition: 'all 300ms',
                        }}>
                            {Math.round((completedSteps.length / meal.steps.length) * 100)}%
                        </div>
                    </div>
                </div>

                {/* Overall progress bar */}
                <div style={{ height: 3, background: BORDER }}>
                    <motion.div
                        animate={{ width: `${(completedSteps.length / meal.steps.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${PURPLE}, ${LIME})` }}
                    />
                </div>

                {/* Step Timeline */}
                <div style={{ padding: '24px 20px' }}>
                    <div style={{ position: 'relative' }}>
                        {/* Vertical connector line */}
                        <div style={{ position: 'absolute', top: 16, bottom: 16, left: 15, width: 2, background: BORDER, zIndex: 0 }} />

                        {meal.steps.map((step, idx) => {
                            const isDone = completedSteps.includes(idx);
                            const isActive = !isDone && completedSteps.length === idx;
                            return (
                                <motion.div key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.07 }}
                                    style={{ display: 'flex', gap: 16, marginBottom: 28, position: 'relative', zIndex: 1 }}>

                                    {/* Step indicator dot */}
                                    <motion.div
                                        onClick={() => toggleStep(idx)}
                                        whileTap={{ scale: 0.88 }}
                                        animate={{
                                            background: isDone ? LIME : isActive ? PURPLE : SURFACE2,
                                            boxShadow: isActive ? `0 0 0 3px rgba(178,134,253,0.25)` : 'none',
                                        }}
                                        transition={{ duration: 0.25 }}
                                        style={{ width: 32, height: 32, borderRadius: '50%', border: isDone ? 'none' : `2px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                        {isDone
                                            ? <Check size={15} color="#0E0E0E" strokeWidth={3} />
                                            : <span style={{ fontWeight: 700, fontSize: 13, color: isActive ? '#fff' : TEXT4 }}>{idx + 1}</span>
                                        }
                                    </motion.div>

                                    {/* Card content */}
                                    <motion.div
                                        animate={{ opacity: isDone ? 0.5 : 1 }}
                                        style={{
                                            flex: 1, background: SURFACE, borderRadius: 18, padding: '16px 18px',
                                            border: isActive ? `1px solid ${PURPLE}30` : `1px solid ${BORDER}`,
                                            boxShadow: isActive ? `0 0 0 1px ${PURPLE}20` : 'var(--e1)',
                                        }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                                            <p style={{
                                                fontWeight: 500, fontSize: 15, color: isDone ? TEXT3 : TEXT1,
                                                lineHeight: 1.55, letterSpacing: '-0.01em',
                                                textDecoration: isDone ? 'line-through' : 'none',
                                                cursor: 'pointer', flex: 1
                                            }} onClick={() => toggleStep(idx)}>
                                                {step.text}
                                            </p>
                                            {step.timerSec > 0 && (
                                                <div style={{ fontSize: 11, color: PURPLE, fontWeight: 600, whiteSpace: 'nowrap', paddingTop: 2 }}>
                                                    {Math.round(step.timerSec / 60)} min
                                                </div>
                                            )}
                                        </div>

                                        {!isDone && step.timerSec > 0 && (
                                            <StepTimer timerSec={step.timerSec} />
                                        )}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Finish nudge */}
                    {allDone && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center', padding: '16px 0', marginBottom: 8 }}>
                            <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
                            <div style={{ fontWeight: 700, fontSize: 20, color: TEXT1, letterSpacing: '-0.02em' }}>All done!</div>
                            <div style={{ fontSize: 14, color: TEXT3, marginTop: 4 }}>Tap finish to log your meal.</div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Floating Bottom CTA */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '16px 20px 34px',
                background: `linear-gradient(to top, ${BG} 50%, transparent)`,
                zIndex: 100,
            }}>
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="cta-primary"
                    onClick={() => navigate(`/cooking/${id}/complete`)}
                    style={{ filter: allDone ? 'none' : 'grayscale(0.5)', opacity: allDone ? 1 : 0.7 }}
                >
                    {allDone ? 'Finish Cooking 🎉' : `${completedSteps.length} / ${meal.steps.length} steps done`}
                </motion.button>
            </div>
        </>
    );
}
