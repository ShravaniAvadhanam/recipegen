import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import useStore from '../store';

const steps = [
    {
        title: "Any food sensitivities?",
        hint: "We ask so we never suggest something that makes you feel bad.",
        type: "multi",
        options: ["Milk", "Nuts", "Gluten", "Eggs", "Soy", "Sesame", "Shellfish", "None"],
    },
    {
        title: "How do you like to eat?",
        hint: "This helps us match recipes to your lifestyle.",
        type: "single",
        options: [
            { emoji: "🥗", label: "Balanced", sub: "A bit of everything" },
            { emoji: "🌿", label: "Vegetarian", sub: "No meat" },
            { emoji: "🌱", label: "Vegan", sub: "Plant-based only" },
            { emoji: "💪", label: "High Protein", sub: "Muscle fuel" },
            { emoji: "🥑", label: "Keto", sub: "Low carb, high fat" },
            { emoji: "🙏", label: "Jain", sub: "No root vegetables" },
        ],
    },
    {
        title: "What's your main goal?",
        hint: "We'll tailor your calorie and macro targets based on this.",
        type: "goal",
        options: [
            { emoji: "🔥", label: "Lose weight", sub: "Cut calories, preserve muscle" },
            { emoji: "💪", label: "Build muscle", sub: "High protein, calorie surplus" },
            { emoji: "⚖️", label: "Maintain", sub: "Stay balanced" },
        ],
    },
    {
        title: "How much time to cook?",
        hint: "We'll match recipes to your pace.",
        type: "single-simple",
        options: [
            { emoji: "⚡", label: "Under 10 min" },
            { emoji: "🕐", label: "10–20 min" },
            { emoji: "🍳", label: "30 min+" },
        ],
    },
];

const bg = '#0E0E0E';
const surface = '#1A1A1A';
const surface2 = '#252525';
const border = 'rgba(255,255,255,0.06)';
const lime = '#B2F042';
const purple = '#B286FD';
const textPrimary = '#FFFFFF';
const textSecondary = 'rgba(255,255,255,0.6)';
const textTertiary = 'rgba(255,255,255,0.4)';

export default function Onboarding() {
    const { step } = useParams();
    const navigate = useNavigate();
    const stepNum = parseInt(step) || 1;
    const s = steps[stepNum - 1];
    const updateUserProfile = useStore(st => st.updateUserProfile);

    const [selected, setSelected] = useState([]);
    const [severity, setSeverity] = useState({});
    const [calories, setCalories] = useState(1680);

    if (!s) { navigate('/onboarding/ready'); return null; }

    const canContinue = selected.length > 0;

    const handleContinue = () => {
        if (stepNum === 1) {
            const allergies = selected.includes("None") ? [] : selected.map(a => a.toLowerCase());
            const allergyStrength = {};
            allergies.forEach(a => { allergyStrength[a] = severity[a] || "mild"; });
            updateUserProfile({ allergies, allergyStrength });
        } else if (stepNum === 2) {
            const map = { "Balanced": "balanced", "Vegetarian": "vegetarian", "Vegan": "vegan", "High Protein": "high-protein", "Keto": "keto", "Jain": "jain" };
            updateUserProfile({ dietType: map[selected[0]] || "balanced" });
        } else if (stepNum === 3) {
            const goalMap = { "Lose weight": "cut", "Build muscle": "bulk", "Maintain": "maintain" };
            updateUserProfile({ goal: goalMap[selected[0]] || "cut", calorieTarget: calories });
        } else if (stepNum === 4) {
            const map = { "Under 10 min": "<10", "10–20 min": "10-20", "30 min+": "30+" };
            updateUserProfile({ defaultCookTime: map[selected[0]] || "10-20" });
        }

        if (stepNum < 4) {
            setSelected([]);
            navigate(`/onboarding/${stepNum + 1}`);
        } else {
            navigate('/onboarding/ready');
        }
    };

    const toggleSelect = (opt) => {
        if (s.type === "multi") {
            if (opt === "None") { setSelected(["None"]); return; }
            setSelected(prev => {
                const without = prev.filter(x => x !== "None");
                return without.includes(opt) ? without.filter(x => x !== opt) : [...without, opt];
            });
        } else {
            setSelected([typeof opt === 'string' ? opt : opt.label]);
        }
    };

    const pageVariants = {
        enter: { opacity: 0, x: 24 },
        center: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
        exit: { opacity: 0, x: -24, transition: { duration: 0.18 } },
    };

    return (
        <div className="screen-content" style={{ background: bg, display: 'flex', flexDirection: 'column', padding: '0 20px', position: 'relative', overflow: 'hidden' }}>

            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '64px 0 20px', position: 'relative', zIndex: 2 }}>
                {stepNum > 1 ? (
                    <div onClick={() => { setSelected([]); navigate(`/onboarding/${stepNum - 1}`); }}
                        style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={20} color={textSecondary} />
                    </div>
                ) : <div style={{ width: 36 }} />}
                <span style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: textTertiary, letterSpacing: '0.1em' }}>
                    {stepNum} / 4
                </span>
                <div style={{ width: 36 }} />
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: surface2, borderRadius: 999, marginBottom: 28, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${(stepNum / 4) * 100}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', background: lime, borderRadius: 999 }} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={stepNum} variants={pageVariants} initial="enter" animate="center" exit="exit" style={{ flex: 1, position: 'relative', zIndex: 1, overflowY: 'auto', paddingBottom: 120 }}>
                    {/* Question */}
                    <h2 style={{ fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em', color: textPrimary, marginBottom: 8, lineHeight: 1.15 }}>
                        {s.title}
                    </h2>
                    <p style={{ fontSize: 15, color: textSecondary, lineHeight: 1.5, marginBottom: 28 }}>{s.hint}</p>

                    {/* Options */}
                    {s.type === "multi" && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                {s.options.map(opt => {
                                    const isSelected = selected.includes(opt);
                                    return (
                                        <motion.div key={opt} onClick={() => toggleSelect(opt)} whileTap={{ scale: 0.94 }}
                                            style={{
                                                background: isSelected ? 'rgba(178, 240, 66, 0.15)' : surface,
                                                border: isSelected ? `1.5px solid ${lime}` : `1px solid ${border}`,
                                                color: isSelected ? lime : textSecondary,
                                                borderRadius: 14, padding: '12px 8px', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                fontWeight: isSelected ? 600 : 400, fontSize: 13, textAlign: 'center',
                                            }}>
                                            {isSelected && <Check size={13} />}{opt}
                                        </motion.div>
                                    );
                                })}
                            </div>
                            {selected.length > 0 && !selected.includes("None") && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20 }}>
                                    {selected.filter(s => s !== "None").map(allergen => (
                                        <div key={allergen} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                            <span style={{ fontSize: 13, color: textSecondary, fontWeight: 500, minWidth: 72 }}>{allergen}:</span>
                                            {["Mild", "Severe"].map(sev => (
                                                <div key={sev} onClick={() => setSeverity(p => ({ ...p, [allergen.toLowerCase()]: sev.toLowerCase() }))}
                                                    style={{
                                                        background: severity[allergen.toLowerCase()] === sev.toLowerCase() ? lime : surface2,
                                                        color: severity[allergen.toLowerCase()] === sev.toLowerCase() ? '#0E0E0E' : textSecondary,
                                                        cursor: 'pointer', fontSize: 12, padding: '6px 14px', borderRadius: 999, fontWeight: 600,
                                                    }}>{sev}</div>
                                            ))}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </>
                    )}

                    {(s.type === "single" || s.type === "goal") && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {s.options.map(opt => {
                                const isSelected = selected.includes(opt.label);
                                return (
                                    <motion.div key={opt.label} onClick={() => toggleSelect(opt)} whileTap={{ scale: 0.97 }}
                                        style={{
                                            minHeight: 68, borderRadius: 18, padding: '0 18px',
                                            display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                                            background: isSelected ? 'rgba(178, 240, 66, 0.1)' : surface,
                                            border: isSelected ? `1.5px solid ${lime}` : `1px solid ${border}`,
                                            boxShadow: isSelected ? `0 0 0 1px rgba(178,240,66,0.2)` : 'none',
                                        }}>
                                        <span style={{ fontSize: 26 }}>{opt.emoji}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: 16, color: textPrimary }}>{opt.label}</div>
                                            {opt.sub && <div style={{ fontWeight: 400, fontSize: 13, color: textSecondary, marginTop: 2 }}>{opt.sub}</div>}
                                        </div>
                                        {isSelected && (
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Check size={13} color="#0E0E0E" strokeWidth={3} />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {s.type === "goal" && selected.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }} style={{ marginTop: 24, background: surface, borderRadius: 20, padding: 20, border: `1px solid ${border}` }}>
                            <div style={{ fontSize: 13, color: textTertiary, fontWeight: 500, marginBottom: 16 }}>Daily calorie target</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                                <button onClick={() => setCalories(c => Math.max(1200, c - 50))} style={{ width: 44, height: 44, borderRadius: '50%', background: surface2, border: `1px solid ${border}`, fontSize: 22, cursor: 'pointer', color: textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                <span style={{ fontWeight: 700, fontSize: 48, letterSpacing: '-0.04em', color: textPrimary }}>{calories.toLocaleString()}</span>
                                <button onClick={() => setCalories(c => Math.min(4000, c + 50))} style={{ width: 44, height: 44, borderRadius: '50%', background: lime, border: 'none', fontSize: 22, cursor: 'pointer', color: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                            </div>
                            <div style={{ fontSize: 12, color: textTertiary, textAlign: 'center', marginTop: 12, lineHeight: 1.4 }}>
                                ✨ AI suggests {calories} kcal based on your goal
                            </div>
                        </motion.div>
                    )}

                    {s.type === "single-simple" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {s.options.map(opt => {
                                const isSelected = selected.includes(opt.label);
                                return (
                                    <motion.div key={opt.label} onClick={() => toggleSelect(opt)} whileTap={{ scale: 0.97 }}
                                        style={{
                                            minHeight: 68, borderRadius: 18, padding: '0 18px',
                                            display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                                            background: isSelected ? 'rgba(178, 240, 66, 0.1)' : surface,
                                            border: isSelected ? `1.5px solid ${lime}` : `1px solid ${border}`,
                                        }}>
                                        <span style={{ fontSize: 26 }}>{opt.emoji}</span>
                                        <div style={{ fontWeight: 600, fontSize: 16, color: textPrimary, flex: 1 }}>{opt.label}</div>
                                        {isSelected && <div style={{ width: 22, height: 22, borderRadius: '50%', background: lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={13} color="#0E0E0E" strokeWidth={3} /></div>}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Sticky Continue button */}
            <AnimatePresence>
                {canContinue && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 25 }}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px 34px', background: `linear-gradient(to top, ${bg} 60%, transparent)`, zIndex: 10 }}>
                        <button className="cta-primary" onClick={handleContinue}>
                            {stepNum === 4 ? 'Get Started 🚀' : 'Continue'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
