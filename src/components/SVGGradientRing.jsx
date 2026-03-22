import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SVGGradientRing({ consumed, target, size = 190, strokeWidth = 14 }) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(consumed / target, 1);
    const offset = circumference - (animatedValue * circumference);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(progress), 300);
        return () => clearTimeout(timer);
    }, [progress]);

    return (
        <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <defs>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                    <filter id="ringGlow">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(124,58,237,0.25)" />
                    </filter>
                </defs>
                {/* Track */}
                <circle
                    cx={center} cy={center} r={radius}
                    fill="none" stroke="#F1F3F5" strokeWidth={strokeWidth}
                />
                {/* Fill */}
                <circle
                    cx={center} cy={center} r={radius}
                    fill="none" stroke="url(#ringGrad)" strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    filter="url(#ringGlow)"
                    style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.34,1.56,0.64,1)' }}
                />
            </svg>
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <CountUp value={consumed} style={{ fontWeight: 600, fontSize: 48, letterSpacing: '-0.02em', color: 'var(--text-1)', lineHeight: 1 }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 400, fontSize: 12, color: 'var(--text-4)', marginTop: 2 }}>
                    / {target} kcal
                </span>
            </div>
        </div>
    );
}

function CountUp({ value, style }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 650;
        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [value]);

    return <span style={style}>{display.toLocaleString()}</span>;
}

export function MacroTrio({ protein, proteinTarget, carbs, carbsTarget, fat, fatTarget }) {
    const macros = [
        { label: 'PROTEIN', value: protein, target: proteinTarget, color: 'var(--protein)' },
        { label: 'CARBS', value: carbs, target: carbsTarget, color: 'var(--carb)' },
        { label: 'FAT', value: fat, target: fatTarget, color: 'var(--fat)' },
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16 }}>
            {macros.map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 16, color: m.color }}>
                        {m.value}g<span style={{ fontWeight: 400, fontSize: 13, color: 'var(--text-4)' }}>/{m.target}g</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: 'var(--surface)', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }}
                            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                            style={{ height: '100%', background: m.color, borderRadius: 999 }}
                        />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 6 }}>
                        {m.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
