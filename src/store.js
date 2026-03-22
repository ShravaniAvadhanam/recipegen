import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(persist((set, get) => ({
    // ─── User Profile ───
    user: {
        name: "",
        age: 25,
        gender: "female", // default, optional
        goal: "maintain",
        targetRate: "0.5",
        activityLevel: "moderate",
        allergies: [],
        allergyStrength: {},
        dietType: "balanced",
        cookFrequency: "daily",
        defaultCookTime: "10-20",
        preferredCuisines: [],
        onboardingComplete: false,
        seenTooltips: [],
        streak: 0,
        streakLastDate: null,
    },

    // ─── Daily Targets ───
    targets: {
        calories: 2000, protein: 100, carbs: 250, fat: 65, water: 2500,
    },

    // ─── Today's Log ───
    today: {
        date: "2026-02-23",
        caloriesConsumed: 840, proteinConsumed: 54,
        carbsConsumed: 96, fatConsumed: 28,
        waterMl: 1200,
        meals: [
            { id: "log1", name: "Avocado Toast", calories: 320, protein: 15, carbs: 30, fat: 18, category: "breakfast", loggedAt: "2026-02-23T08:00:00" },
            { id: "log2", name: "Greek Yogurt Bowl", calories: 280, protein: 22, carbs: 35, fat: 6, category: "snack", loggedAt: "2026-02-23T10:30:00" },
            { id: "log3", name: "Boiled Eggs", calories: 140, protein: 12, carbs: 2, fat: 10, category: "breakfast", loggedAt: "2026-02-23T08:00:00" },
            { id: "log4", name: "Protein Smoothie", calories: 100, protein: 5, carbs: 29, fat: -6, category: "snack", loggedAt: "2026-02-23T11:00:00" },
        ],
        workoutLogged: false,
        workoutIntensity: null,
        workoutCaloriesBurned: 0,
        workouts: [],
    },

    // ─── Meal Prep Items ───
    mealPrep: [
        { id: "mp1", name: "Grilled Chicken", emoji: "🍗", category: "protein", quantity: "500g", preppedDate: "2026-02-21", daysLeft: 3 },
        { id: "mp2", name: "Boiled Eggs", emoji: "🥚", category: "protein", quantity: "8 pcs", preppedDate: "2026-02-22", daysLeft: 4 },
        { id: "mp3", name: "Cooked Dal", emoji: "🍲", category: "protein", quantity: "400g", preppedDate: "2026-02-22", daysLeft: 2 },
        { id: "mp4", name: "Paneer", emoji: "🧀", category: "protein", quantity: "250g", preppedDate: "2026-02-21", daysLeft: 3 },
        { id: "mp5", name: "Brown Rice", emoji: "🍚", category: "carbs", quantity: "600g", preppedDate: "2026-02-22", daysLeft: 3 },
        { id: "mp6", name: "Chopped Spinach", emoji: "🥬", category: "veggies", quantity: "200g", preppedDate: "2026-02-22", daysLeft: 1 },
        { id: "mp7", name: "Roasted Broccoli", emoji: "🥦", category: "veggies", quantity: "300g", preppedDate: "2026-02-21", daysLeft: 2 },
        { id: "mp8", name: "Sliced Cucumber", emoji: "🥒", category: "veggies", quantity: "150g", preppedDate: "2026-02-23", daysLeft: 2 },
        { id: "mp9", name: "Quinoa", emoji: "🌾", category: "carbs", quantity: "300g", preppedDate: "2026-02-22", daysLeft: 4 },
        { id: "mp10", name: "Mint Chutney", emoji: "🌿", category: "flavor", quantity: "100ml", preppedDate: "2026-02-22", daysLeft: 3 },
    ],

    // ─── Meal Database ───
    mealDatabase: [
        {
            id: "m1", name: "Egg & Spinach Power Bowl", calories: 380, protein: 28, carbs: 32, fat: 14,
            timeMinutes: 12, healthScore: 88, proteinScore: 92,
            ingredients: [
                { name: "Boiled Eggs", amount: "3 pcs", inPrep: true, allergen: null, subs: [] },
                { name: "Chopped Spinach", amount: "100g", inPrep: true, allergen: null, subs: [] },
                { name: "Brown Rice", amount: "150g", inPrep: true, allergen: null, subs: [{ name: "Quinoa", calDelta: -20, proteinDelta: +2 }] },
                { name: "Olive Oil", amount: "1 tbsp", inPrep: false, allergen: null, subs: [] },
                { name: "Lemon", amount: "half", inPrep: false, allergen: null, subs: [] },
            ],
            steps: [
                { order: 1, text: "Warm the brown rice in a bowl.", timerSec: null },
                { order: 2, text: "Sauté spinach in olive oil for 2 minutes until wilted.", timerSec: 120 },
                { order: 3, text: "Slice boiled eggs and arrange over spinach and rice.", timerSec: null },
                { order: 4, text: "Squeeze lemon, season with salt and pepper.", timerSec: null },
            ],
            allergens: [], category: "high-protein", cuisine: "mediterranean",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
            tags: ["high-protein", "quick", "meal-prep"],
            description: "A nutrient-packed bowl using your prepped eggs, spinach, and rice. High protein, low effort.",
        },
        {
            id: "m2", name: "Chicken Quinoa Bowl", calories: 450, protein: 38, carbs: 40, fat: 12,
            timeMinutes: 10, healthScore: 92, proteinScore: 95,
            ingredients: [
                { name: "Grilled Chicken", amount: "150g", inPrep: true, allergen: null, subs: [{ name: "Paneer", calDelta: +30, proteinDelta: -8 }] },
                { name: "Quinoa", amount: "150g", inPrep: true, allergen: null, subs: [] },
                { name: "Roasted Broccoli", amount: "100g", inPrep: true, allergen: null, subs: [] },
                { name: "Mint Chutney", amount: "2 tbsp", inPrep: true, allergen: null, subs: [] },
                { name: "Cherry Tomatoes", amount: "5 pcs", inPrep: false, allergen: null, subs: [] },
            ],
            steps: [
                { order: 1, text: "Layer quinoa in a bowl as the base.", timerSec: null },
                { order: 2, text: "Slice grilled chicken and arrange on top.", timerSec: null },
                { order: 3, text: "Add roasted broccoli and halved cherry tomatoes.", timerSec: null },
                { order: 4, text: "Drizzle mint chutney. Toss gently.", timerSec: null },
            ],
            allergens: [], category: "high-protein", cuisine: "mediterranean",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
            tags: ["high-protein", "quick", "meal-prep"],
            description: "All from your prep. Chicken + quinoa + broccoli — the ultimate protein bowl.",
        },
        {
            id: "m3", name: "Paneer Bhurji", calories: 320, protein: 22, carbs: 12, fat: 22,
            timeMinutes: 15, healthScore: 78, proteinScore: 82,
            ingredients: [
                { name: "Paneer", amount: "200g", inPrep: true, allergen: "dairy", subs: [{ name: "Tofu", calDelta: -80, proteinDelta: -2 }] },
                { name: "Onion", amount: "1 medium", inPrep: false, allergen: null, subs: [] },
                { name: "Tomato", amount: "1 medium", inPrep: false, allergen: null, subs: [] },
                { name: "Green Chilli", amount: "2 pcs", inPrep: false, allergen: null, subs: [] },
            ],
            steps: [
                { order: 1, text: "Heat oil, sauté onions until golden.", timerSec: 180 },
                { order: 2, text: "Add tomatoes and green chillies. Cook 3 minutes.", timerSec: 180 },
                { order: 3, text: "Crumble paneer into the pan. Mix well.", timerSec: null },
                { order: 4, text: "Season with salt, turmeric, red chilli. Cook 2 min.", timerSec: 120 },
            ],
            allergens: ["dairy"], category: "quick", cuisine: "indian",
            image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
            tags: ["vegetarian", "high-protein", "indian"],
            description: "Spicy scrambled paneer — quick, protein-rich, and comforting.",
        },
        {
            id: "m4", name: "Grilled Chicken Salad", calories: 340, protein: 35, carbs: 15, fat: 16,
            timeMinutes: 8, healthScore: 90, proteinScore: 94,
            ingredients: [
                { name: "Grilled Chicken", amount: "150g", inPrep: true, allergen: null, subs: [] },
                { name: "Sliced Cucumber", amount: "100g", inPrep: true, allergen: null, subs: [] },
                { name: "Mixed Greens", amount: "handful", inPrep: false, allergen: null, subs: [] },
                { name: "Olive Oil", amount: "1 tbsp", inPrep: false, allergen: null, subs: [] },
            ],
            steps: [
                { order: 1, text: "Arrange mixed greens on a plate.", timerSec: null },
                { order: 2, text: "Slice grilled chicken and place over greens.", timerSec: null },
                { order: 3, text: "Add sliced cucumber, drizzle olive oil.", timerSec: null },
                { order: 4, text: "Season with salt, pepper, and lemon juice.", timerSec: null },
            ],
            allergens: [], category: "high-protein", cuisine: "mediterranean",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
            tags: ["high-protein", "keto", "quick"],
            description: "Simple, clean, and 35g protein. Uses your prepped chicken and cucumber.",
        },
        {
            id: "m5", name: "Dal & Rice Comfort Bowl", calories: 420, protein: 20, carbs: 60, fat: 10,
            timeMinutes: 5, healthScore: 80, proteinScore: 70,
            ingredients: [
                { name: "Cooked Dal", amount: "200g", inPrep: true, allergen: null, subs: [] },
                { name: "Brown Rice", amount: "200g", inPrep: true, allergen: null, subs: [] },
                { name: "Ghee", amount: "1 tsp", inPrep: false, allergen: "dairy", subs: [{ name: "Coconut Oil", calDelta: 0, proteinDelta: 0 }] },
            ],
            steps: [
                { order: 1, text: "Warm the dal and rice separately.", timerSec: 120 },
                { order: 2, text: "Serve rice in a bowl, pour dal over it.", timerSec: null },
                { order: 3, text: "Add a small dollop of ghee on top.", timerSec: null },
            ],
            allergens: ["dairy"], category: "comfort", cuisine: "indian",
            image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&q=80",
            tags: ["comfort", "vegetarian", "indian"],
            description: "The ultimate comfort meal. 5 minutes, everything from your prep.",
        },
        {
            id: "m6", name: "Protein Smoothie Bowl", calories: 290, protein: 25, carbs: 38, fat: 6,
            timeMinutes: 5, healthScore: 85, proteinScore: 88,
            ingredients: [
                { name: "Protein Powder", amount: "1 scoop", inPrep: false, allergen: null, subs: [] },
                { name: "Banana", amount: "1 medium", inPrep: false, allergen: null, subs: [] },
                { name: "Greek Yogurt", amount: "100g", inPrep: false, allergen: "dairy", subs: [{ name: "Coconut Yogurt", calDelta: +20, proteinDelta: -10 }] },
                { name: "Granola", amount: "30g", inPrep: false, allergen: "gluten", subs: [{ name: "Nuts & Seeds", calDelta: +40, proteinDelta: +5 }] },
            ],
            steps: [
                { order: 1, text: "Blend protein powder, banana, and yogurt until smooth.", timerSec: null },
                { order: 2, text: "Pour into a bowl.", timerSec: null },
                { order: 3, text: "Top with granola. Enjoy cold.", timerSec: null },
            ],
            allergens: ["dairy", "gluten"], category: "quick", cuisine: "international",
            image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500&q=80",
            tags: ["quick", "high-protein", "breakfast"],
            description: "Quick breakfast hit — 25g protein in 5 minutes.",
        },
        {
            id: "m7", name: "Chicken Stir Fry", calories: 380, protein: 32, carbs: 25, fat: 16,
            timeMinutes: 15, healthScore: 86, proteinScore: 90,
            ingredients: [
                { name: "Grilled Chicken", amount: "150g", inPrep: true, allergen: null, subs: [] },
                { name: "Roasted Broccoli", amount: "100g", inPrep: true, allergen: null, subs: [] },
                { name: "Soy Sauce", amount: "2 tbsp", inPrep: false, allergen: "soy", subs: [{ name: "Coconut Aminos", calDelta: 0, proteinDelta: 0 }] },
                { name: "Sesame Oil", amount: "1 tbsp", inPrep: false, allergen: null, subs: [] },
            ],
            steps: [
                { order: 1, text: "Heat sesame oil in a wok on high heat.", timerSec: null },
                { order: 2, text: "Add sliced chicken and broccoli. Stir fry 4 min.", timerSec: 240 },
                { order: 3, text: "Add soy sauce, toss well.", timerSec: null },
                { order: 4, text: "Serve hot over rice or as-is.", timerSec: null },
            ],
            allergens: ["soy"], category: "high-protein", cuisine: "asian",
            image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80",
            tags: ["high-protein", "quick"],
            description: "Wok-tossed chicken and broccoli — fast, flavorful, high protein.",
        },
        {
            id: "m8", name: "Cucumber Raita Bowl", calories: 180, protein: 12, carbs: 14, fat: 8,
            timeMinutes: 5, healthScore: 75, proteinScore: 60,
            ingredients: [
                { name: "Sliced Cucumber", amount: "100g", inPrep: true, allergen: null, subs: [] },
                { name: "Greek Yogurt", amount: "150g", inPrep: false, allergen: "dairy", subs: [] },
                { name: "Cumin Powder", amount: "1 tsp", inPrep: false, allergen: null, subs: [] },
                { name: "Mint", amount: "few leaves", inPrep: false, allergen: null, subs: [] },
            ],
            steps: [
                { order: 1, text: "Mix yogurt with cumin, salt, and mint.", timerSec: null },
                { order: 2, text: "Fold in sliced cucumber.", timerSec: null },
                { order: 3, text: "Chill and serve.", timerSec: null },
            ],
            allergens: ["dairy"], category: "snack", cuisine: "indian",
            image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80",
            tags: ["snack", "light", "indian"],
            description: "Cool, refreshing, probiotic-rich snack. Perfect between meals.",
        },
    ],

    // ─── Weekly History Mock ───
    weeklyData: [
        { day: "Mon", calories: 1650, protein: 115, carbs: 175, fat: 50 },
        { day: "Tue", calories: 0, protein: 0, carbs: 0, fat: 0 },
        { day: "Wed", calories: 1720, protein: 125, carbs: 185, fat: 52 },
        { day: "Thu", calories: 1580, protein: 110, carbs: 165, fat: 48 },
        { day: "Fri", calories: 1690, protein: 118, carbs: 178, fat: 53 },
        { day: "Sat", calories: 1800, protein: 130, carbs: 190, fat: 58 },
        { day: "Sun", calories: 840, protein: 54, carbs: 96, fat: 28 },
    ],

    // ─── Chat History ───
    suggestionChatHistory: [],
    recipeChatHistory: {},

    // ─── Current suggestion ───
    currentSuggestion: { loading: false, best: null, alternative: null, errorState: null },

    // ─── Actions ───
    setOnboardingComplete: () => set(s => ({ user: { ...s.user, onboardingComplete: true } })),
    updateUserProfile: (updates) => set(s => ({ user: { ...s.user, ...updates } })),
    setTargets: (targets) => set(s => ({ targets: { ...s.targets, ...targets } })),

    logMeal: (meal) => {
        set(s => ({
            today: {
                ...s.today,
                caloriesConsumed: s.today.caloriesConsumed + meal.calories,
                proteinConsumed: s.today.proteinConsumed + meal.protein,
                carbsConsumed: s.today.carbsConsumed + meal.carbs,
                fatConsumed: s.today.fatConsumed + meal.fat,
                meals: [...s.today.meals, { ...meal, id: `log${Date.now()}`, loggedAt: new Date().toISOString() }],
            },
        }));
    },

    logWorkout: (intensity) => {
        const boosts = { light: { cal: 100, protein: 5 }, moderate: { cal: 200, protein: 10 }, intense: { cal: 300, protein: 15 } };
        const boost = boosts[intensity] || boosts.moderate;
        set(s => ({
            today: { ...s.today, workoutLogged: true, workoutIntensity: intensity, workoutCaloriesBurned: boost.cal },
            targets: { ...s.targets, calories: s.targets.calories + boost.cal, protein: s.targets.protein + boost.protein },
        }));
    },

    updateWater: (ml) => set(s => ({ today: { ...s.today, waterMl: s.today.waterMl + ml } })),

    addMealPrep: (item) => set(s => ({ mealPrep: [...s.mealPrep, { ...item, id: `mp${Date.now()}` }] })),
    removeMealPrep: (id) => set(s => ({ mealPrep: s.mealPrep.filter(p => p.id !== id) })),

    getMealSuggestion: async (craving) => {
        set(s => ({ currentSuggestion: { ...s.currentSuggestion, loading: true, errorState: null } }));
        await new Promise(r => setTimeout(r, 1200));
        const { mealDatabase, today, targets, user, mealPrep } = get();
        const remaining = { cal: targets.calories - today.caloriesConsumed, protein: targets.protein - today.proteinConsumed };

        const scored = mealDatabase
            .filter(m => !m.allergens.some(a => user.allergies.includes(a) && user.allergyStrength[a] === "severe"))
            .filter(m => m.calories <= remaining.cal + 100)
            .map(m => {
                const prepMatch = m.ingredients.filter(i => i.inPrep).length / m.ingredients.length;
                const proteinScore = m.protein / remaining.protein;
                const score = (proteinScore * 0.4) + (prepMatch * 0.4) + ((m.timeMinutes <= 15 ? 1 : 0.5) * 0.2);
                return { ...m, score, prepMatch: Math.round(prepMatch * 100) };
            })
            .sort((a, b) => b.score - a.score);

        if (scored.length === 0) {
            set({ currentSuggestion: { loading: false, best: null, alternative: null, errorState: "no_match" } });
            return;
        }

        set({ currentSuggestion: { loading: false, best: scored[0], alternative: scored[1] || null, errorState: null } });
    },

    addSuggestionMessage: (msg) => set(s => ({ suggestionChatHistory: [...s.suggestionChatHistory, msg] })),
    dismissTooltip: (id) => set(s => ({ user: { ...s.user, seenTooltips: [...s.user.seenTooltips, id] } })),

    resetStore: () => set({
        today: {
            date: new Date().toISOString().split('T')[0],
            caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0,
            waterMl: 0, meals: [], workoutLogged: false, workoutIntensity: null, workoutCaloriesBurned: 0, workouts: [],
        }
    }),
}), { name: "recipegen-store" }));

export default useStore;
