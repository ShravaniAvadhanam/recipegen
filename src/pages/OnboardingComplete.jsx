import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import useStore from '../store';

export default function OnboardingComplete() {
    const navigate = useNavigate();
    const setOnboardingComplete = useStore(s => s.setOnboardingComplete);
    const name = useStore(s => s.user.name);

    useEffect(() => {
        setTimeout(() => {
            confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 }, colors: ['#10B981', '#7C3AED', '#F59E0B'] });
        }, 600);
        const timer = setTimeout(() => {
            setOnboardingComplete();
            navigate('/home');
        }, 2400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="screen-content" style={{ background: '#0E0E0E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 18, height: '100%' }}>
            {/* Animated checkmark */}
            <motion.svg
                width={80} height={80} viewBox="0 0 80 80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <motion.circle
                    cx={40} cy={40} r={36} fill="none" stroke="url(#checkGrad)" strokeWidth={3}
                    strokeDasharray={226} strokeDashoffset={226}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <motion.path
                    d="M24 40 L35 51 L56 30" fill="none" stroke="url(#checkGrad)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={50} strokeDashoffset={50}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.4, delay: 1.2, ease: "easeOut" }}
                />
                <defs>
                    <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                </defs>
            </motion.svg>

            <motion.h1
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                style={{ fontWeight: 700, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--text-1)', marginTop: 24, textAlign: 'center' }}
            >
                Your AI Kitchen is Ready ✨
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
                style={{ fontSize: 15, color: 'var(--text-3)', marginTop: 8 }}
            >
                Personalized for {name}
            </motion.p>
        </div>
    );
}
