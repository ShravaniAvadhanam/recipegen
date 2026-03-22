import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Splash() {
    const navigate = useNavigate();

    return (
        <div className="screen-content" style={{ background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '60px 24px 40px', position: 'relative', overflow: 'hidden', height: '100%' }}>
            {/* Apple Intelligence style mesh gradient orb */}
            <motion.div
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                    position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
                    width: 320, height: 320, background: 'radial-gradient(circle at 30% 30%, #4C1D95, #7C3AED, #DB2777)',
                    filter: 'blur(60px)', opacity: 0.65, borderRadius: '50%', zIndex: 0
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', marginTop: 60 }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}>
                    <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, border: '1px solid rgba(255,255,255,0.2)' }}>
                        <span style={{ fontSize: 26 }}>✨</span>
                    </div>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
                    style={{ fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.05, marginBottom: 16 }}>
                    Recipe<br />Gen
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                    style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, fontWeight: 400, letterSpacing: '-0.01em', maxWidth: '85%' }}>
                    Your intelligent kitchen companion. Cook smarter, eat perfectly.
                </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: [0.2, 0.9, 0.2, 1] }}
                style={{ width: '100%', zIndex: 1 }}>
                <button
                    onClick={() => navigate('/onboarding/1')}
                    style={{
                        width: '100%', height: 60, borderRadius: 20, background: '#fff', color: '#000',
                        fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', border: 'none', cursor: 'pointer',
                        boxShadow: '0 8px 32px rgba(255,255,255,0.15)'
                    }}>
                    Get Started
                </button>
            </motion.div>
        </div>
    );
}
