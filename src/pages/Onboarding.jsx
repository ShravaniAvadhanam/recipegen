import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import useStore from '../store';

const steps = [
    {
        title: "What should we call you?",
        hint: "This is how your AI kitchen will greet you.",
        type: "name",
    },
    {
        title: "Tell us about yourself",
        hint: "We use this to calculate your daily calorie targets.",
        type: "profile",
    },
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
            { emoji: "🔥", label: "Lose weight", sub: "Cut calories, preserve muscle", val: "cut" },
            { emoji: "💪", label: "Build muscle", sub: "High protein, calorie surplus", val: "bulk" },
            { emoji: "⚖️", label: "Maintain", sub: "Stay balanced", val: "maintain" },
        ],
    },
    {
        title: "How fast?",
        hint: "Select a safe and sustainable target rate.",
        type: "rate",
    },
    {
        title: "How much time to cook?",
        hint: "We'll match recipes to your pace.",
        type: "single-simple",
        options: [
            { emoji: "⚡", label: "Under 10 min", val: "<10" },
            { emoji: "🕐", label: "10–20 min", val: "10-20" },
            { emoji: "🍳", label: "30 min+", val: "30+" },
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

    // Store
    const { user, updateUserProfile, setTargets } = useStore();

    // Local state for all steps
    const [name, setName] = useState(user.name || "");
    const [age, setAge] = useState(user.age || 25);
    const [gender, setGender] = useState(user.gender || "female");
    const [activity, setActivity] = useState(user.activityLevel || "moderate");

    // Sensitivities
    const [selectedAllergies, setSelectedAllergies] = useState(user.allergies.length > 0 ? user.allergies : []);
    const [severity, setSeverity] = useState(user.allergyStrength || {});

    // Diet
    const [diet, setDiet] = useState(user.dietType === "balanced" ? "Balanced" : user.dietType.charAt(0).toUpperCase() + user.dietType.slice(1));

    // Goal
    const [goal, setGoal] = useState("Lose weight");

    // Rate & Calories
    const [rate, setRate] = useState("0.5");
    const [calories, setCalories] = useState(2000);
    const [baseCalories, setBaseCalories] = useState(2000);

    // Cook time
    const [cookTime, setCookTime] = useState("10–20 min");

    if (!s) { navigate('/onboarding/ready'); return null; }

    useEffect(() => {
        if (stepNum === 6) {
            // Rough TDEE calculation
            let bmr = gender === 'male' ? 1800 : 1500;
            bmr -= (age - 25) * 5;
            const actMult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, 'very active': 1.9 }[activity] || 1.55;
            let tdee = Math.round(bmr * actMult);

            let target = tdee;
            const rateNum = parseFloat(rate);
            if (goal === "Lose weight") target -= rateNum * 1100;
            if (goal === "Build muscle") target += rateNum * 600;

            target = Math.max(1200, Math.round(target / 50) * 50);
            setBaseCalories(target);
            setCalories(Math.max(1200, target));
        }
    }, [stepNum, age, gender, activity, goal, rate]);

    const canContinue =
        (stepNum === 1 && name.trim().length > 1) ||
        (stepNum === 2 && age > 0) ||
        (stepNum === 3 && selectedAllergies.length > 0) ||
        (stepNum === 4 && diet) ||
        (stepNum === 5 && goal) ||
        (stepNum === 6) ||
        (stepNum === 7 && cookTime);

    const handleContinue = () => {
        if (stepNum === 1) updateUserProfile({ name });
        if (stepNum === 2) updateUserProfile({ age, gender, activityLevel: activity });
        if (stepNum === 3) {
            const allergies = selectedAllergies.includes("None") ? [] : selectedAllergies.map(a => a.toLowerCase());
            const allergyStrength = {};
            allergies.forEach(a => { allergyStrength[a] = severity[a] || "mild"; });
            updateUserProfile({ allergies, allergyStrength });
        }
        if (stepNum === 4) {
            const map = { "Balanced": "balanced", "Vegetarian": "vegetarian", "Vegan": "vegan", "High Protein": "high-protein", "Keto": "keto", "Jain": "jain" };
            updateUserProfile({ dietType: map[diet] || "balanced" });
        }
        if (stepNum === 5) {
            const goalMap = { "Lose weight": "cut", "Build muscle": "bulk", "Maintain": "maintain" };
            updateUserProfile({ goal: goalMap[goal] || "maintain" });
        }
        if (stepNum === 6) {
            updateUserProfile({ targetRate: goal === "Maintain" ? "0" : rate });
            // Set macro split
            let p, c, f;
            if (goal === "Build muscle") { p = 140; c = 250; f = 70; }
            else if (goal === "Lose weight") { p = 130; c = 150; f = 55; }
            else { p = 110; c = 200; f = 60; }
            setTargets({ calories, protein: p, carbs: c, fat: f, water: 2500 });
        }
        if (stepNum === 7) {
            const map = { "Under 10 min": "<10", "10–20 min": "10-20", "30 min+": "30+" };
            updateUserProfile({ defaultCookTime: map[cookTime] || "10-20" });
        }

        if (stepNum < 7) {
            navigate(`/onboarding/${stepNum + 1}`);
        } else {
            navigate('/onboarding/ready');
        }
    };

    const toggleAllergy = (opt) => {
        if (opt === "None") { setSelectedAllergies(["None"]); return; }
        setSelectedAllergies(prev => {
            const without = prev.filter(x => x !== "None");
            return without.includes(opt) ? without.filter(x => x !== opt) : [...without, opt];
        });
    };

    const pageVariants = {
        enter: { opacity: 0, x: 24 },
        center: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
        exit: { opacity: 0, x: -24, transition: { duration: 0.18 } },
    };

    return (
        <div style={{ background: bg, display: 'flex', flexDirection: 'column', padding: '0 20px', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

            {/* Top bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '64px 0 20px', position: 'relative', zIndex: 2 }}>
                {stepNum > 1 ? (
                    <div onClick={() => navigate(`/onboarding/${stepNum - 1}`)}
                        style={{ cursor: 'pointer', width: 36, height: 36, borderRadius: '50%', background: surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={20} color={textSecondary} />
                    </div>
                ) : <div style={{ width: 36 }} />}
                <span style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: textTertiary, letterSpacing: '0.1em' }}>
                    {stepNum} / 7
                </span>
                <div style={{ width: 36 }} />
            </div>

            {/* Progress bar */}
            <div style={{ height: 3, background: surface2, borderRadius: 999, marginBottom: 28, overflow: 'hidden' }}>
                <motion.div animate={{ width: `${(stepNum / 7) * 100}%` }} transition={{ duration: 0.4 }} style={{ height: '100%', background: lime, borderRadius: 999 }} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={stepNum} variants={pageVariants} initial="enter" animate="center" exit="exit" style={{ flex: 1, position: 'relative', zIndex: 1, overflowY: 'auto', paddingBottom: 120 }}>
                    {/* Question */}
                    <h2 style={{ fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em', color: textPrimary, marginBottom: 8, lineHeight: 1.15 }}>
                        {s.title}
                    </h2>
                    <p style={{ fontSize: 15, color: textSecondary, lineHeight: 1.5, marginBottom: 28 }}>{s.hint}</p>

                    {/* Step 1: Name */}
                    {s.type === "name" && (
                        <input
                            value={name} onChange={e => setName(e.target.value)}
                            placeholder="Your name" autoFocus
                            style={{ width: '100%', background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: '16px 20px', fontSize: 18, color: textPrimary, outline: 'none' }}
                            onKeyDown={e => e.key === 'Enter' && canContinue && handleContinue()}
                        />
                    )}

                    {/* Step 2: Profile */}
                    {s.type === "profile" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, color: textTertiary, marginBottom: 8, fontWeight: 500 }}>Age</label>
                                <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || '')}
                                    style={{ width: '100%', background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: '14px 16px', fontSize: 16, color: textPrimary, outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, color: textTertiary, marginBottom: 8, fontWeight: 500 }}>Gender</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {["female", "male", "other"].map(g => (
                                        <div key={g} onClick={() => setGender(g)} style={{ flex: 1, textAlign: 'center', padding: '12px 0', background: gender === g ? lime : surface, color: gender === g ? '#0E0E0E' : textPrimary, borderRadius: 12, cursor: 'pointer', fontWeight: gender === g ? 600 : 400, textTransform: 'capitalize', fontSize: 15 }}>
                                            {g}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 13, color: textTertiary, marginBottom: 8, fontWeight: 500 }}>Activity Level</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {[
                                        { val: 'sedentary', label: 'Sedentary', sub: 'Little to no exercise' },
                                        { val: 'light', label: 'Light', sub: 'Exercise 1-3 days/week' },
                                        { val: 'moderate', label: 'Moderate', sub: 'Exercise 3-5 days/week' },
                                        { val: 'active', label: 'Active', sub: 'Exercise 6-7 days/week' }
                                    ].map(act => (
                                        <div key={act.val} onClick={() => setActivity(act.val)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: activity === act.val ? `rgba(178,240,66,0.15)` : surface, border: activity === act.val ? `1px solid ${lime}` : `1px solid ${border}`, borderRadius: 12, cursor: 'pointer' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 15, color: activity === act.val ? lime : textPrimary }}>{act.label}</div>
                                                <div style={{ fontSize: 12, color: textSecondary, marginTop: 2 }}>{act.sub}</div>
                                            </div>
                                            {activity === act.val && <Check size={16} color={lime} />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Sensitivities */}
                    {s.type === "multi" && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                {s.options.map(opt => {
                                    const isSelected = selectedAllergies.includes(opt);
                                    return (
                                        <motion.div key={opt} onClick={() => toggleAllergy(opt)} whileTap={{ scale: 0.94 }}
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
                            {selectedAllergies.length > 0 && !selectedAllergies.includes("None") && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20 }}>
                                    {selectedAllergies.filter(x => x !== "None").map(allergen => (
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

                    {/* Step 4 & 5 & 7: Diet & Goal & Cook Time */}
                    {(s.type === "single" || s.type === "goal" || s.type === "single-simple") && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {s.options.map(opt => {
                                const valStr = opt.label;
                                let currentVal = s.type === "single" ? diet : s.type === "goal" ? goal : cookTime;
                                const isSelected = currentVal === valStr;
                                return (
                                    <motion.div key={opt.label}
                                        onClick={() => {
                                            if (s.type === "single") setDiet(valStr);
                                            else if (s.type === "goal") setGoal(valStr);
                                            else setCookTime(valStr);
                                        }}
                                        whileTap={{ scale: 0.97 }}
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

                    {/* Step 6: Rate & Calories */}
                    {s.type === "rate" && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {goal !== "Maintain" && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[
                                        { label: "0.25 kg / week", val: "0.25", sub: "Easy pace" },
                                        { label: "0.5 kg / week", val: "0.5", sub: "Recommended" },
                                        { label: "0.75 kg / week", val: "0.75", sub: goal === "Lose weight" ? "Aggressive (harder)" : "High surplus" },
                                    ].map(r => (
                                        <div key={r.val} onClick={() => setRate(r.val)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: rate === r.val ? `rgba(178,240,66,0.15)` : surface, border: rate === r.val ? `1px solid ${lime}` : `1px solid ${border}`, borderRadius: 16, cursor: 'pointer' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 16, color: rate === r.val ? lime : textPrimary }}>{r.label}</div>
                                                <div style={{ fontSize: 13, color: textSecondary, marginTop: 2 }}>{r.sub}</div>
                                            </div>
                                            {rate === r.val && <Check size={16} color={lime} />}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {goal === "Maintain" && (
                                <div style={{ padding: '16px', background: surface, borderRadius: 16, border: `1px solid ${border}` }}>
                                    <div style={{ fontSize: 15, color: textPrimary, fontWeight: 500 }}>Maintain Current Weight</div>
                                    <div style={{ fontSize: 13, color: textSecondary, marginTop: 4 }}>We will set your calories to match your daily burn rate.</div>
                                </div>
                            )}

                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' }} style={{ marginTop: 8, background: surface, borderRadius: 20, padding: 24, border: `1px solid ${border}` }}>
                                <div style={{ fontSize: 13, color: textTertiary, fontWeight: 500, marginBottom: 16, textAlign: 'center' }}>Daily calorie target</div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                                    <button onClick={() => setCalories(c => Math.max(1200, c - 50))} style={{ width: 44, height: 44, borderRadius: '50%', background: surface2, border: `1px solid ${border}`, fontSize: 22, cursor: 'pointer', color: textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                                    <span style={{ fontWeight: 700, fontSize: 48, letterSpacing: '-0.04em', color: textPrimary }}>{calories.toLocaleString()}</span>
                                    <button onClick={() => setCalories(c => Math.min(4000, c + 50))} style={{ width: 44, height: 44, borderRadius: '50%', background: lime, border: 'none', fontSize: 22, cursor: 'pointer', color: '#0E0E0E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                                </div>

                                <div style={{ fontSize: 13, color: textSecondary, textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
                                    ✨ To {goal.toLowerCase()} {goal !== "Maintain" && `${rate} kg/week`}, you should eat <strong>~{baseCalories} kcal/day</strong>.
                                </div>
                            </motion.div>
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
                            {stepNum === 7 ? 'Get Started 🚀' : 'Continue'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
