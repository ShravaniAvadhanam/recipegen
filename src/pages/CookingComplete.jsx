import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useStore from '../store';

export default function CookingComplete() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { mealDatabase, logMeal } = useStore();
    const meal = mealDatabase.find(m => m.id === id);

    useEffect(() => {
        confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 }, colors: ['#10B981', '#7C3AED', '#F59E0B'] });
        if (meal) logMeal(meal);
    }, []);

    if (!meal) return null;

    return (
        <div className="screen-content" style={{ background: '#0E0E0E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 18, height: '100%', textAlign: 'center' }}>
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <span style={{ fontSize: 64 }}>🎉</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 700, fontSize: 28, color: 'var(--text-1)', marginTop: 16 }}>
                Meal Complete!
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ fontSize: 15, color: 'var(--text-3)', marginTop: 8 }}>
                {meal.name} has been logged automatically ✨
            </motion.p>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                {[
                    { value: meal.calories, label: 'kcal', color: 'var(--text-1)' },
                    { value: `${meal.protein}g`, label: 'protein', color: 'var(--protein)' },
                    { value: `${meal.timeMinutes}m`, label: 'cook time', color: 'var(--success)' },
                ].map(s => (
                    <div key={s.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 300, fontSize: 32, color: s.color }}>
                            {s.value}
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {s.label}
                        </div>
                    </div>
                ))}
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="cta-primary" onClick={() => navigate('/home')}
                style={{ marginTop: 40, maxWidth: 280 }}
            >
                Back to Home
            </motion.button>
        </div>
    );
}
