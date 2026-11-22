import { useEffect, useState } from "react";
import "./App.css";

const equipmentCategories = {
  "Bodyweight & Calisthenics": [
    "Bodyweight / No Equipment", "Pull-Up Bar", "Dip Station", "Parallettes",
    "Gymnastic Rings", "Suspension Trainer / TRX", "Ab Wheel",
  ],
  "Free Weights": [
    "Dumbbells", "Adjustable Dumbbells", "Barbell", "Olympic Barbell", "EZ Curl Bar",
    "Trap Bar / Hex Bar", "Kettlebells", "Weight Plates", "Medicine Ball",
    "Slam Ball", "Sandbag", "Weighted Vest", "Ankle Weights",
  ],
  "Benches, Racks & Platforms": [
    "Flat Bench", "Adjustable Bench", "Squat Rack", "Power Rack / Power Cage",
    "Smith Machine", "Deadlift Platform", "Preacher Curl Bench", "Roman Chair / Hyperextension Bench",
  ],
  "Cable & Selectorized Machines": [
    "Cable Machine", "Functional Trainer", "Lat Pulldown Machine", "Seated Row Machine",
    "Chest Press Machine", "Shoulder Press Machine", "Pec Deck / Chest Fly Machine",
    "Assisted Pull-Up / Dip Machine", "Biceps Curl Machine", "Triceps Extension Machine",
    "Abdominal Crunch Machine", "Back Extension Machine",
  ],
  "Lower Body Machines": [
    "Leg Press", "Hack Squat Machine", "Leg Extension Machine", "Leg Curl Machine",
    "Standing Calf Raise Machine", "Seated Calf Raise Machine", "Hip Abductor Machine",
    "Hip Adductor Machine", "Glute Drive / Hip Thrust Machine", "Belt Squat Machine",
  ],
  "Cardio": [
    "Treadmill", "Exercise Bike", "Spin Bike", "Recumbent Bike", "Elliptical",
    "Stair Climber / StairMill", "Rowing Machine", "SkiErg", "Air Bike / Assault Bike",
    "Arc Trainer", "Jump Rope", "Vertical Climber",
  ],
  "Functional & Cross-Training": [
    "Resistance Bands", "Resistance Tubes", "Battle Ropes", "Plyometric Box",
    "Weight Sled / Prowler", "Farmer's Carry Handles", "Landmine Attachment",
    "Agility Ladder", "Cones", "Hurdles", "Heavy Bag / Punching Bag", "Climbing Rope",
  ],
  "Mobility, Balance & Recovery": [
    "Yoga Mat", "Foam Roller", "Massage Ball", "Stretching Strap", "Stability Ball",
    "BOSU Ball", "Balance Board", "Balance Pad", "Yoga Blocks", "Mobility Stick",
  ],
  "Specialty Strength": [
    "Safety Squat Bar", "Swiss / Multi-Grip Bar", "Cambered Bar", "Buffalo Bar",
    "Lever / Jammer Arms", "Reverse Hyper Machine", "Glute Ham Developer (GHD)",
    "Wrist Roller", "Grip Trainer", "Neck Harness",
  ],
};

const equipmentOptions = Object.values(equipmentCategories).flat();

const emptyProfile = {
  age: "", sex: "", height_inches: "", weight_lbs: "", goal: "", activity_level: "",
  dietary_preference: "", food_allergies: "", disliked_foods: "", liked_foods: "", diet_specifications: "", dietary_health_conditions: "", tracks_calories: false,
  actual_calories_today: "", actual_protein_today: "", exercise_experience: "",
  workout_days_per_week: "", available_equipment: [...equipmentOptions], injuries_limitations: "",
  medical_conditions: "", medications: "",
  sleep_hours: "", sleep_quality: "", daily_steps: "", stress_level: "",
  mobility_days_per_week: "", recovery_notes: "", longevity_goal: "",
  past_conditions: "", surgeries_procedures: "", previous_injuries: "",
  health_allergies: "", medication_history: "", family_health_history: "",
  health_record_notes: "",
  family_early_history: "", resting_heart_rate: "", vo2_max: "", cardio_minutes_weekly: "", strength_days_weekly: "", waist_inches: "",
  smoking_status: "", alcohol_consumption: "", diet_quality: "", systolic_bp: "", diastolic_bp: "",
  non_hdl_cholesterol: "", a1c: "",
};

const todayLocal = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const blankMeal = () => ({ date: todayLocal(), type: "Lunch", description: "", portion: "", calories: "", protein: "" });

const navItems = ["Dashboard", "Profile", "Health Records", "Health Guidance", "Nutrition", "Exercise", "Longevity", "Insights", "Network", "AI Coach"];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mealHistory, setMealHistory] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem("mealHistory") || "[]"); return Array.isArray(v) ? v : []; }
    catch { return []; }
  });
  const [mealDraft, setMealDraft] = useState(blankMeal);
  const [editingMealId, setEditingMealId] = useState(null);
  const [mealNotice, setMealNotice] = useState("");
  const [foodPhoto, setFoodPhoto] = useState("");
  const [foodPhotoLoading, setFoodPhotoLoading] = useState(false);
  const [foodPhotoWarning, setFoodPhotoWarning] = useState("");
  const [mealHistoryDate, setMealHistoryDate] = useState("");
  const [formData, setFormData] = useState(emptyProfile);
  const [sleepHoursChanged, setSleepHoursChanged] = useState(false);
  const [heightFeet, setHeightFeet] = useState("");
  const [heightRemainderInches, setHeightRemainderInches] = useState("0");
  const [profileMessage, setProfileMessage] = useState("");
  const [nutritionTargets, setNutritionTargets] = useState(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [showSelectedEquipment, setShowSelectedEquipment] = useState(false);
  const [openEquipmentCategories, setOpenEquipmentCategories] = useState(["Bodyweight & Calisthenics"]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [healthConcern, setHealthConcern] = useState("");
  const [healthTestQuestion, setHealthTestQuestion] = useState("");
  const [healthConcernGuidance, setHealthConcernGuidance] = useState("");
  const [healthTestGuidance, setHealthTestGuidance] = useState("");
  const [healthGuidanceLoading, setHealthGuidanceLoading] = useState(false);
  const [medicationQuestion, setMedicationQuestion] = useState("");
  const [medicationGuidance, setMedicationGuidance] = useState("");
  const [medicationGuidanceLoading, setMedicationGuidanceLoading] = useState(false);
  const [lifespanEstimate, setLifespanEstimate] = useState(null);
  const [lifespanLoading, setLifespanLoading] = useState(false);
  const [deepLongevityInsights, setDeepLongevityInsights] = useState([]);
  const [deepLongevityLoading, setDeepLongevityLoading] = useState(false);
  const [deepLongevityMethod, setDeepLongevityMethod] = useState("");
  const [deepLongevityError, setDeepLongevityError] = useState("");
  const [agingPhoto, setAgingPhoto] = useState("");
  const [agingResult, setAgingResult] = useState("");
  const [agingTarget, setAgingTarget] = useState(70);
  const [agingLoading, setAgingLoading] = useState(false);
  const [agingError, setAgingError] = useState("");
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState("");
  const [insightsMethod, setInsightsMethod] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const parsedProfile = { ...emptyProfile, ...JSON.parse(savedProfile) };
      setFormData(parsedProfile);
      if (parsedProfile.height_inches) {
        const totalInches = Number(parsedProfile.height_inches);
        setHeightFeet(String(Math.floor(totalInches / 12)));
        setHeightRemainderInches(String(totalInches % 12));
      }
    }
  }, []);

  useEffect(() => { localStorage.setItem("mealHistory", JSON.stringify(mealHistory)); }, [mealHistory]);

  const selectFoodPhoto = (event) => {
    const file = event.target.files?.[0];
    setFoodPhotoWarning(""); setFoodPhoto("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setFoodPhotoWarning("Choose a JPG, PNG, or WebP photo under 5 MB."); return;
    }
    const reader = new FileReader();
    reader.onload = () => setFoodPhoto(String(reader.result || ""));
    reader.onerror = () => setFoodPhotoWarning("Could not read that image.");
    reader.readAsDataURL(file);
  };
  const analyzeFoodPhoto = async () => {
    if (!foodPhoto) return;
    setFoodPhotoLoading(true); setFoodPhotoWarning("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyze-food-photo", {
        method: "POST", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({photo: foodPhoto, portion_hint: mealDraft.portion}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Photo analysis failed.");
      const result = data.estimate;
      setMealDraft(previous => ({
        ...previous,
        description: result.description || previous.description,
        portion: result.portion || previous.portion,
        calories: result.calories == null ? "" : String(result.calories),
        protein: result.protein == null ? "" : String(result.protein),
      }));
      setFoodPhotoWarning(result.notes || "AI estimate only. Review the foods, serving sizes and nutrition before saving.");
    } catch (error) { setFoodPhotoWarning(error.message || "Unable to analyze photo."); }
    finally { setFoodPhotoLoading(false); }
  };

  const saveMeal = (event) => {
    event.preventDefault();
    if (!mealDraft.description.trim() || !mealDraft.date) return;
    const entry = {
      ...mealDraft,
      description: mealDraft.description.trim(),
      portion: mealDraft.portion.trim(),
      calories: mealDraft.calories === "" ? null : Number(mealDraft.calories),
      protein: mealDraft.protein === "" ? null : Number(mealDraft.protein),
      id: editingMealId || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    };
    if ([entry.calories, entry.protein].some(x => x !== null && (!Number.isFinite(x) || x < 0))) {
      setMealNotice("Calories and protein must be positive numbers."); return;
    }
    setMealHistory(previous => editingMealId
      ? previous.map(item => item.id === editingMealId ? entry : item)
      : [entry, ...previous]);
    setEditingMealId(null); setMealDraft(blankMeal()); setFoodPhoto(""); setFoodPhotoWarning("");
    setMealNotice(editingMealId ? "Meal updated." : "Meal added to your history.");
  };
  const editMeal = (item) => {
    setMealDraft({ ...item, calories: item.calories ?? "", protein: item.protein ?? "" });
    setEditingMealId(item.id); setMealNotice("");
  };
  const deleteMeal = (id) => {
    if (!window.confirm("Delete this meal from your history?")) return;
    setMealHistory(previous => previous.filter(item => item.id !== id));
    if (editingMealId === id) { setEditingMealId(null); setMealDraft(blankMeal()); }
    setMealNotice("Meal deleted.");
  };
  const todayMeals = mealHistory.filter(item => item.date === todayLocal());
  const todayMealCalories = todayMeals.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const todayMealProtein = todayMeals.reduce((sum, item) => sum + (Number(item.protein) || 0), 0);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const updateHeight = (feet, inches) => {
    setHeightFeet(feet);
    setHeightRemainderInches(inches);
    setFormData((previous) => ({
      ...previous,
      height_inches: feet === "" ? "" : String(Number(feet) * 12 + Number(inches || 0)),
    }));
  };

  const toggleEquipment = (equipment) => {
    const selected = formData.available_equipment.includes(equipment);
    setFormData({
      ...formData,
      available_equipment: selected
        ? formData.available_equipment.filter((item) => item !== equipment)
        : [...formData.available_equipment, equipment],
    });
  };

  const toggleEquipmentCategory = (category) => {
    setOpenEquipmentCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  };

  const selectCategory = (category) => {
    const items = equipmentCategories[category];
    setFormData((previous) => ({
      ...previous,
      available_equipment: [...new Set([...previous.available_equipment, ...items])],
    }));
  };

  const clearCategory = (category) => {
    const items = new Set(equipmentCategories[category]);
    setFormData((previous) => ({
      ...previous,
      available_equipment: previous.available_equipment.filter((item) => !items.has(item)),
    }));
  };

  const clearAllEquipment = () =>
    setFormData((previous) => ({ ...previous, available_equipment: [] }));

  const selectAllEquipment = () =>
    setFormData((previous) => ({ ...previous, available_equipment: [...equipmentOptions] }));

  const buildProfile = () => ({
    ...formData,
    meal_history: mealHistory.slice().sort((x,y) => y.date.localeCompare(x.date)).slice(0, 90),
    age: Number(formData.age),
    height_inches: Number(formData.height_inches),
    weight_lbs: Number(formData.weight_lbs),
    workout_days_per_week: Number(formData.workout_days_per_week),
    actual_calories_today: formData.actual_calories_today === "" ? null : Number(formData.actual_calories_today),
    actual_protein_today: formData.actual_protein_today === "" ? null : Number(formData.actual_protein_today),
    resting_heart_rate: formData.resting_heart_rate === "" ? null : Number(formData.resting_heart_rate),
    vo2_max: formData.vo2_max === "" ? null : Number(formData.vo2_max),
    cardio_minutes_weekly: formData.cardio_minutes_weekly === "" ? null : Number(formData.cardio_minutes_weekly),
    strength_days_weekly: formData.strength_days_weekly === "" ? null : Number(formData.strength_days_weekly),
    waist_inches: formData.waist_inches === "" ? null : Number(formData.waist_inches),
    systolic_bp: formData.systolic_bp === "" ? null : Number(formData.systolic_bp),
    diastolic_bp: formData.diastolic_bp === "" ? null : Number(formData.diastolic_bp),
    non_hdl_cholesterol: formData.non_hdl_cholesterol === "" ? null : Number(formData.non_hdl_cholesterol),
    a1c: formData.a1c === "" ? null : Number(formData.a1c),
  });

  const profileIsComplete = () => formData.age && formData.sex && formData.height_inches &&
    formData.weight_lbs && formData.goal && formData.activity_level &&
    formData.exercise_experience && formData.workout_days_per_week;

  const nutritionProfileIsComplete = () => formData.age && formData.sex && formData.height_inches &&
    formData.weight_lbs && formData.goal && formData.activity_level;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(buildProfile()),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userProfile", JSON.stringify(formData));
        setProfileMessage("Profile saved successfully.");
        console.log(data);
      } else {
        setProfileMessage("There was a problem saving the profile.");
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      setProfileMessage("Could not connect to backend.");
    }
  };

  const resetProfile = () => {
    localStorage.removeItem("userProfile");
    setFormData({ ...emptyProfile, available_equipment: [...equipmentOptions] });
    setHeightFeet("");
    setHeightRemainderInches("0");
    setNutritionTargets(null); setChatMessages([]); setInsights([]); setInsightsError(""); setProfileMessage("Profile reset.");
  };

  const getNutritionTargets = async () => {
    if (!nutritionProfileIsComplete()) {
      setNutritionTargets(null);
      setProfileMessage("Please complete your basic information and goals before calculating nutrition targets.");
      return;
    }
    setNutritionLoading(true); setProfileMessage("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/nutrition-targets", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(buildProfile()),
      });
      const data = await response.json();
      if (response.ok) setNutritionTargets(data.targets);
      else { setNutritionTargets(null); setProfileMessage("There was a problem calculating nutrition targets."); }
    } catch (error) {
      console.error(error); setNutritionTargets(null); setProfileMessage("Could not connect to the nutrition calculator.");
    } finally { setNutritionLoading(false); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!profileIsComplete()) {
      setChatMessages((p) => [...p, { role: "agent", text: "Please complete your profile before asking the agent for personalized recommendations." }]);
      return;
    }
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatMessages((p) => [...p, { role: "user", text: userMessage }]);
    setChatInput(""); setChatLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, profile: buildProfile() }),
      });
      const data = await response.json();
      setChatMessages((p) => [...p, {
        role: "agent",
        text: response.ok ? data.response : (data.detail || data.response || "There was a problem getting a response from the agent."),
      }]);
    } catch (error) {
      console.error(error);
      setChatMessages((p) => [...p, { role: "agent", text: "Could not connect to the AI backend." }]);
    } finally { setChatLoading(false); }
  };

  const generateDeepLongevityInsights = async () => {
    if (!nutritionProfileIsComplete()) return;
    setDeepLongevityLoading(true);
    setDeepLongevityError("");
    setDeepLongevityInsights([]);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/deep-longevity-insights", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({profile: buildProfile()}),
      });
      if (!response.ok) throw new Error("Could not generate deeper insights.");
      const data = await response.json();
      setDeepLongevityInsights(data.insights || []);
      setDeepLongevityMethod(data.method || "");
    } catch (error) {
      setDeepLongevityError(error.message || "The insights service is unavailable.");
    } finally {
      setDeepLongevityLoading(false);
    }
  };

  const calculateLifespanEstimate = async () => {
    if (!nutritionProfileIsComplete()) {
      setProfileMessage("Please complete your basic profile information before calculating a lifespan estimate.");
      return;
    }

    setLifespanLoading(true);
    setDeepLongevityInsights([]);
    setDeepLongevityMethod("");
    setProfileMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/lifespan-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildProfile()),
      });
      const data = await response.json();
      if (response.ok) setLifespanEstimate(data.estimate);
      else setProfileMessage(data.detail || "There was a problem calculating the lifespan estimate.");
    } catch (error) {
      console.error(error);
      setProfileMessage("Could not connect to the lifespan estimator.");
    } finally {
      setLifespanLoading(false);
    }
  };

  const requestHealthGuidance = async (mode) => {
    const question = mode === "concern" ? healthConcern.trim() : healthTestQuestion.trim();

    if (!question) {
      if (mode === "concern") setHealthConcernGuidance("Please describe a health concern first.");
      else setHealthTestGuidance("Please enter a question about a health test first.");
      return;
    }

    if (!profileIsComplete()) {
      if (mode === "concern") setHealthConcernGuidance("Please complete your core profile before requesting personalized health guidance.");
      else setHealthTestGuidance("Please complete your core profile before requesting personalized health guidance.");
      return;
    }

    setHealthGuidanceLoading(true);
    if (mode === "concern") setHealthConcernGuidance("");
    else setHealthTestGuidance("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/health-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, question, profile: buildProfile() }),
      });

      const data = await response.json();
      const result = response.ok ? data.response : (data.detail || data.response || "There was a problem getting health guidance.");
      if (mode === "concern") setHealthConcernGuidance(result);
      else setHealthTestGuidance(result);
    } catch (error) {
      console.error(error);
      if (mode === "concern") setHealthConcernGuidance("Could not connect to the health guidance service.");
      else setHealthTestGuidance("Could not connect to the health guidance service.");
    } finally {
      setHealthGuidanceLoading(false);
    }
  };

  const requestMedicationGuidance = async () => {
    const question = medicationQuestion.trim();
    if (!question) {
      setMedicationGuidance("Please enter a question about an over-the-counter medication, vitamin, or supplement first.");
      return;
    }
    if (!profileIsComplete()) {
      setMedicationGuidance("Please complete your core profile before requesting personalized medication or supplement guidance.");
      return;
    }

    setMedicationGuidanceLoading(true);
    setMedicationGuidance("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/medication-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, profile: buildProfile() }),
      });
      const data = await response.json();
      setMedicationGuidance(response.ok ? data.response : (data.detail || data.response || "There was a problem getting medication or supplement guidance."));
    } catch (error) {
      console.error(error);
      setMedicationGuidance("Could not connect to the medication and supplement guidance service.");
    } finally {
      setMedicationGuidanceLoading(false);
    }
  };

  const discoverInsights = async () => {
    if (!nutritionProfileIsComplete()) {
      setInsightsError("Complete the basic Profile information first to discover personalized insights.");
      return;
    }
    setInsightsLoading(true);
    setInsightsError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/personalized-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildProfile()),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not generate insights.");
      setInsights(data.insights || []);
      setInsightsMethod(data.method || "");
    } catch (error) {
      setInsightsError(error.message || "Could not connect to the insights service.");
    } finally {
      setInsightsLoading(false);
    }
  };

  const goalLabel = {
    lose_weight: "Lose Weight", maintain_weight: "Maintain Weight", gain_weight: "Gain Weight",
    build_muscle: "Build Muscle", improve_fitness: "Improve Fitness",
  }[formData.goal] || "Not set";

  const calorieLogged = todayMeals.length ? todayMealCalories : (Number(formData.actual_calories_today) || 0);
  const proteinLogged = todayMeals.length ? todayMealProtein : (Number(formData.actual_protein_today) || 0);
  const calorieTarget = nutritionTargets?.target_calories || 0;
  const proteinTarget = nutritionTargets?.protein_grams || 0;
  const healthNutrition = nutritionTargets?.health_nutrition || null;
  const caloriePercent = calorieTarget ? Math.min(100, Math.round((calorieLogged / calorieTarget) * 100)) : 0;
  const proteinPercent = proteinTarget ? Math.min(100, Math.round((proteinLogged / proteinTarget) * 100)) : 0;

  const go = (page) => { setActivePage(page); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const FormattedAIResponse = ({ text }) => {
    const lines = text.split("\n");
    const elements = [];
    let bullets = [];

    const flushBullets = () => {
      if (bullets.length) {
        elements.push(
          <ul className="health-guidance-list" key={`list-${elements.length}`}>
            {bullets.map((item, index) => <li key={index}>{formatInline(item)}</li>)}
          </ul>
        );
        bullets = [];
      }
    };

    const formatInline = (value) => {
      const parts = value.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={index}>{part.slice(2, -2)}</strong>
          : part
      );
    };

    lines.forEach((rawLine, index) => {
      const line = rawLine.trim();
      if (!line) {
        flushBullets();
        return;
      }

      if (line.startsWith("### ")) {
        flushBullets();
        elements.push(<h5 className="health-guidance-heading" key={`heading-${index}`}>{line.slice(4)}</h5>);
      } else if (/^[-*]\s+/.test(line)) {
        bullets.push(line.replace(/^[-*]\s+/, ""));
      } else {
        flushBullets();
        elements.push(<p className="health-guidance-paragraph" key={`p-${index}`}>{formatInline(line)}</p>);
      }
    });

    flushBullets();
    return <div className="health-guidance-output">{elements}</div>;
  };

  const Navigation = ({ mobile = false }) => (
    <nav className={mobile ? "mobile-nav" : "nav"}>
      {navItems.map((item) => (
        <button key={item} className={`nav-button ${activePage === item ? "active" : ""}`} onClick={() => go(item)}>{item}</button>
      ))}
    </nav>
  );

  const PhotoBanner = ({ photo, title, description }) => (
    <div className="wellness-photo-banner">
      <img
        src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=1600&q=82`}
        alt={description}
        loading="lazy"
        onError={(event) => { event.currentTarget.style.display = "none"; }}
      />
      <div className="wellness-photo-shade" />
      <div className="wellness-photo-copy">
        <span>EXERCISE & NUTRITION AGENT</span>
        <strong>{title}</strong>
      </div>
    </div>
  );

  const Dashboard = () => (
    <>
      <section className="hero-card hero-card-photo">
        <div className="wellness-doodles" aria-hidden="true">
          <span>🍃</span><span>💧</span><span>☀️</span>
        </div>
        
        <h3>Your health plan, organized in one place. <span className="hero-sparkle">🌱</span></h3>
        <p>Build your profile, calculate nutrition targets, track your intake, and ask the AI Coach for recommendations based on the information you provide.</p>
      </section>

      <div className="metric-grid">
        <div className="metric-card"><div className="metric-label">Calorie Target</div><div className="metric-value">{calorieTarget ? calorieTarget.toLocaleString() : "—"}</div><div className="metric-sub">calories / day</div></div>
        <div className="metric-card"><div className="metric-label">Protein Target</div><div className="metric-value">{proteinTarget ? `${proteinTarget}g` : "—"}</div><div className="metric-sub">daily protein</div></div>
        <div className="metric-card"><div className="metric-label">Workout Schedule</div><div className="metric-value">{formData.workout_days_per_week || "—"}</div><div className="metric-sub">days / week</div></div>
        <div className="metric-card"><div className="metric-label">Primary Goal</div><div className="metric-value" style={{fontSize: "19px", marginTop: "13px"}}>{goalLabel}</div><div className="metric-sub">current focus</div></div>
      </div>

      <div className="two-column">
        <section className="card">
          <div className="card-header"><div><h4>Today's Nutrition</h4><p>Your logged intake compared with your targets.</p></div></div>
          {nutritionTargets ? <>
            <div className="progress-wrap"><div className="progress-meta"><span>Calories</span><span>{calorieLogged} / {calorieTarget}</span></div><div className="progress"><span style={{width: `${caloriePercent}%`}} /></div></div>
            <div className="progress-wrap"><div className="progress-meta"><span>Protein</span><span>{proteinLogged}g / {proteinTarget}g</span></div><div className="progress"><span style={{width: `${proteinPercent}%`}} /></div></div>
            <div className="actions"><button className="btn btn-secondary" onClick={() => go("Nutrition")}>Open Nutrition</button></div>
          </> : <><p className="muted small">Calculate your nutrition targets to populate this dashboard.</p><div className="actions"><button className="btn btn-primary" onClick={() => go("Nutrition")}>Set Nutrition Targets</button></div></>}
        </section>
        <section className="card">
          <div className="card-header"><div><h4>Profile Overview</h4><p>Information used to personalize recommendations.</p></div></div>
          <div className="info-list">
            <div className="info-item"><span>Profile status</span><strong>{profileIsComplete() ? "Core profile complete" : "Needs information"}</strong></div>
            <div className="info-item"><span>Exercise experience</span><strong>{formData.exercise_experience || "Not set"}</strong></div>
            <div className="info-item"><span>Available equipment</span><strong>{formData.available_equipment.length} selected</strong></div>
          </div>
          <div className="actions"><button className="btn btn-secondary" onClick={() => go("Profile")}>Edit Profile</button></div>
        </section>
      </div>

      <section className="card">
        <div className="card-header"><div><h4>Quick Actions</h4><p>Jump directly to the tools you use most.</p></div></div>
        <div className="quick-actions">
          <button className="quick-action" onClick={() => go("Nutrition")}><strong>Nutrition Targets</strong><span>Calculate calories and protein.</span></button>
          <button className="quick-action" onClick={() => go("Exercise")}><strong>Exercise Setup</strong><span>Manage experience and equipment.</span></button>
          <button className="quick-action" onClick={() => go("AI Coach")}><strong>Ask AI Coach</strong><span>Get personalized guidance.</span></button>
        </div>
      </section>
    </>
  );

  const Profile = () => (
    <form onSubmit={handleProfileSubmit}>
      <div className="page-heading"><h3><span className="page-icon">👤</span>Your Profile</h3><p>Keep your information current so recommendations can be personalized.</p></div>
      <PhotoBanner photo="photo-1470252649378-9c29740c9fa8" title="Profile" description="Wellness" />
      <section className="card decorative-card decor-profile">
        <div className="card-header"><div><h4>Basic Information</h4><p>Core information used by your nutrition and exercise tools.</p></div></div>
        <div className="form-grid">
          <div className="field"><label>Age</label><input type="number" name="age" min="1" value={formData.age} onChange={handleChange} required /></div>
          <div className="field"><label>Sex</label><select name="sex" value={formData.sex} onChange={handleChange} required><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
          <div className="field">
            <label>Height</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <select value={heightFeet} onChange={(e) => updateHeight(e.target.value, heightRemainderInches)} required>
                <option value="">Feet</option>
                {[3, 4, 5, 6, 7, 8].map((feet) => <option key={feet} value={feet}>{feet} ft</option>)}
              </select>
              <select value={heightRemainderInches} onChange={(e) => updateHeight(heightFeet, e.target.value)} disabled={!heightFeet}>
                {[0,1,2,3,4,5,6,7,8,9,10,11].map((inches) => <option key={inches} value={inches}>{inches} in</option>)}
              </select>
            </div>
          </div>
          <div className="field"><label>Weight (lbs)</label><input type="number" name="weight_lbs" min="1" value={formData.weight_lbs} onChange={handleChange} required /></div>
        </div>
      </section>
      <section className="card decorative-card decor-goals">
        <div className="card-header"><div><h4>Goals & Lifestyle</h4><p>Tell the agent what you are working toward.</p></div></div>
        <div className="form-grid">
          <div className="field"><label>Primary Goal</label><select name="goal" value={formData.goal} onChange={handleChange} required><option value="">Select</option><option value="lose_weight">Lose Weight</option><option value="maintain_weight">Maintain Weight</option><option value="gain_weight">Gain Weight</option><option value="build_muscle">Build Muscle</option><option value="improve_fitness">Improve Fitness</option></select></div>
          <div className="field"><label>Activity Level</label><select name="activity_level" value={formData.activity_level} onChange={handleChange} required><option value="">Select</option><option value="sedentary">Sedentary</option><option value="lightly_active">Lightly Active</option><option value="moderately_active">Moderately Active</option><option value="very_active">Very Active</option></select></div>
        </div>
      </section>
      <section className="card decorative-card decor-health">
        <div className="card-header"><div><h4>Health Considerations</h4><p>Optional context the agent should consider when responding.</p></div></div>
        <div className="form-grid">
          <div className="field full"><label>Injuries or Physical Limitations</label><textarea name="injuries_limitations" value={formData.injuries_limitations} onChange={handleChange} placeholder="Example: shoulder pain, limited knee mobility" /></div>
          <div className="field"><label>Medical Conditions</label><textarea name="medical_conditions" value={formData.medical_conditions} onChange={handleChange} placeholder="Enter any conditions the agent should consider" /></div>
          <div className="field"><label>Medications</label><textarea name="medications" value={formData.medications} onChange={handleChange} placeholder="Enter medications the agent should consider" /></div>
        </div>
      </section>
      <div className="actions"><button className="btn btn-primary" type="submit">Save Profile</button><button className="btn btn-secondary" type="button" onClick={resetProfile}>Reset Profile</button></div>
      {profileMessage && <div className="notice">{profileMessage}</div>}
    </form>
  );

  const HealthRecords = () => (
    <>
      <div className="page-heading">
        <h3><span className="page-icon">📋</span>Health Records</h3>
        <p>Add previous health information and keep important medical history organized for your wellness profile.</p>
      </div>
      <PhotoBanner photo="photo-1576091160399-112ba8d25d1d" title="Health Records" description="Health information" />

      <section className="card">
        <div className="card-header">
          <div><h4>Medical History</h4><p>Enter relevant past health information that may affect nutrition, exercise, or recovery recommendations.</p></div>
        </div>
        <div className="form-grid">
          <div className="field full"><label>Past Medical Conditions / Diagnoses</label><textarea name="past_conditions" value={formData.past_conditions} onChange={handleChange} placeholder="Example: previous diagnoses or resolved health conditions" /></div>
          <div className="field"><label>Surgeries / Procedures</label><textarea name="surgeries_procedures" value={formData.surgeries_procedures} onChange={handleChange} placeholder="Include procedure and approximate date if known" /></div>
          <div className="field"><label>Previous Injuries</label><textarea name="previous_injuries" value={formData.previous_injuries} onChange={handleChange} placeholder="Example: ankle sprain, shoulder injury, back injury" /></div>
          <div className="field"><label>Allergies</label><textarea name="health_allergies" value={formData.health_allergies} onChange={handleChange} placeholder="Medication, environmental, or other health-related allergies" /></div>
          <div className="field"><label>Medication History</label><textarea name="medication_history" value={formData.medication_history} onChange={handleChange} placeholder="Previous medications or treatments" /></div>
          <div className="field full"><label>Family Health History</label><textarea name="family_health_history" value={formData.family_health_history} onChange={handleChange} placeholder="Optional family medical history relevant to long-term health" /></div>
          <div className="field full"><label>Additional Health Record Notes</label><textarea name="health_record_notes" value={formData.health_record_notes} onChange={handleChange} placeholder="Add any other historical health information here" /></div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div><h4>Upload Health Records</h4><p>Select previous records such as lab reports, medical summaries, or imaging reports.</p></div>
        </div>
        <div className="field">
          <label>Choose Health Record</label>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
        </div>
        <p className="muted small" style={{marginTop: "12px"}}>Prototype upload interface only. File storage and AI record analysis are not connected yet.</p>
      </section>

      <div className="actions">
        <button className="btn btn-primary" onClick={(e) => handleProfileSubmit(e)}>Save Health Information</button>
        <button className="btn btn-secondary" onClick={() => go("AI Coach")}>Ask AI Coach</button>
      </div>
      {profileMessage && <div className="notice">{profileMessage}</div>}
    </>
  );

  const HealthGuidance = () => (
    <>
      <div className="page-heading">
        <h3><span className="page-icon">🩺</span>Health Guidance</h3>
        <p>Explore health concerns, health tests and screening, and over-the-counter medication or supplement options.</p>
      </div>
      <PhotoBanner photo="photo-1505751172876-fa1923c5c528" title="Health Guidance" description="Healthcare" />

      <section className="card">
        <div className="card-header"><div><h4>🩺 Health Concerns</h4><p>Describe a symptom or concern and explore possible next steps.</p></div></div>
        <div className="field full">
          <label>Describe a Health Concern</label>
          <textarea value={healthConcern} onChange={(e) => setHealthConcern(e.target.value)} placeholder="Example: I've had blurry vision for the past week and sometimes notice a strange smell." />
        </div>
        <div className="actions">
          <button type="button" className="btn btn-primary" disabled={healthGuidanceLoading} onClick={() => requestHealthGuidance("concern")}>
            {healthGuidanceLoading ? "Exploring..." : "Explore Concern"}
          </button>
        </div>
        {healthConcernGuidance && (
          <div className="health-guidance-card" style={{marginTop: "18px"}}>
            <div className="health-guidance-title">
              <span>✚</span>
              <div><strong>Health Concern Guidance</strong><small>Results based on your concern and health profile</small></div>
            </div>
            <FormattedAIResponse text={healthConcernGuidance} />
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header"><div><h4>🧪 Health Tests & Screening</h4><p>Ask what a health test checks for or what tests may be worth discussing based on your concern.</p></div></div>
        <div className="field full">
          <label>Ask About Health Tests & Screening</label>
          <textarea value={healthTestQuestion} onChange={(e) => setHealthTestQuestion(e.target.value)} placeholder="Example: What tests can check my blood sugar, such as an A1C test?" />
        </div>
        <div className="actions">
          <button type="button" className="btn btn-secondary" disabled={healthGuidanceLoading} onClick={() => requestHealthGuidance("test")}>
            {healthGuidanceLoading ? "Exploring..." : "Explore Tests & Screening"}
          </button>
        </div>
        {healthTestGuidance && (
          <div className="health-guidance-card" style={{marginTop: "18px"}}>
            <div className="health-guidance-title">
              <span>🧪</span>
              <div><strong>Health Tests & Screening Guidance</strong><small>Results based on your question and health profile</small></div>
            </div>
            <FormattedAIResponse text={healthTestGuidance} />
          </div>
        )}
      </section>

      <section className="card">
        <div className="card-header"><div><h4>💊 Medications & Supplements</h4><p>Ask about over-the-counter medications, vitamins, or supplements using your health profile as context.</p></div></div>
        <div className="field full">
          <label>Ask About OTC Medications, Vitamins, or Supplements</label>
          <textarea value={medicationQuestion} onChange={(e) => setMedicationQuestion(e.target.value)} placeholder="Example: What over-the-counter options could help with seasonal allergies?" />
        </div>
        <div className="actions">
          <button type="button" className="btn btn-primary" disabled={medicationGuidanceLoading} onClick={requestMedicationGuidance}>
            {medicationGuidanceLoading ? "Checking..." : "Get Recommendations"}
          </button>
        </div>
        {medicationGuidance && (
          <div className="health-guidance-card" style={{marginTop: "18px"}}>
            <div className="health-guidance-title">
              <span>💊</span>
              <div><strong>Medication & Supplement Guidance</strong><small>Uses your medications, allergies, conditions, and health history as context</small></div>
            </div>
            <FormattedAIResponse text={medicationGuidance} />
          </div>
        )}
      </section>
    </>
  );

  const Nutrition = () => (
    <>
      <div className="page-heading"><h3><span className="page-icon">🥗</span>Nutrition</h3><p>Manage dietary preferences, daily tracking, and estimated nutrition targets.</p></div>
      <PhotoBanner photo="photo-1498837167922-ddd27525d352" title="Nutrition" description="Healthy food" />
      <section className="card decorative-card decor-nutrition">
        <div className="card-header"><div><h4>Nutrition Preferences</h4><p>Help the agent suggest foods that fit your needs.</p></div></div>
        <div className="form-grid">
          <div className="field"><label>Dietary Preference</label><select name="dietary_preference" value={formData.dietary_preference} onChange={handleChange}><option value="">No Preference</option><option value="standard">Standard</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="pescatarian">Pescatarian</option></select></div>
          <div className="field"><label>Food Allergies</label><input name="food_allergies" value={formData.food_allergies} onChange={handleChange} placeholder="Example: peanuts, shellfish" /></div>
          <div className="field full"><label>Foods You Dislike</label><input name="disliked_foods" value={formData.disliked_foods} onChange={handleChange} placeholder="Example: mushrooms, olives" /></div>
          <div className="field full"><label>Foods You Like</label><textarea name="liked_foods" value={formData.liked_foods} onChange={handleChange} placeholder="Example: chicken, rice, eggs, pasta, Greek yogurt" /></div>
          <div className="field full"><label>Diet Specifications</label><textarea name="diet_specifications" value={formData.diet_specifications} onChange={handleChange} placeholder="Example: high protein, low sodium, three meals daily, budget-friendly, quick recipes" /></div>
          <div className="field full">
            <label>Dietary Health Conditions</label>
            <textarea
              name="dietary_health_conditions"
              value={formData.dietary_health_conditions}
              onChange={handleChange}
              placeholder="Example: high cholesterol, type 2 diabetes, high blood pressure, acid reflux"
            />
            <span className="muted small">Enter any conditions that should affect your food and nutrition recommendations.</span>
          </div>
        </div>
      </section>
      <section className="card">
       <section className="card meal-diary-card">
         <div className="card-header"><div><h4>🍽️ Food Diary & Meal History</h4><p>Log what you actually eat. Saved meals become context for the AI Coach and personalized recommendations.</p></div><span className="status-pill">{mealHistory.length} recorded</span></div>
         <div className="food-photo-panel">
           <strong>📷 Analyze a meal photo</strong>
           <p className="muted small">Upload a food photo or take one with your phone. The AI will suggest foods, portions, calories and protein. Review the estimate before saving.</p>
           <div className="field"><label>Food photo (JPG, PNG or WebP, max 5 MB)</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFoodPhoto} /></div>
           {foodPhoto && <img className="food-photo-preview" src={foodPhoto} alt="Selected food to analyze" />}
           <div className="actions"><button type="button" className="btn btn-secondary" disabled={!foodPhoto || foodPhotoLoading} onClick={analyzeFoodPhoto}>{foodPhotoLoading ? "Analyzing photo..." : "Estimate Nutrition from Photo"}</button>{foodPhoto && <button type="button" className="btn btn-secondary" onClick={() => {setFoodPhoto("");setFoodPhotoWarning("");}}>Clear Photo</button>}</div>
           {foodPhotoWarning && <p className="food-photo-warning" role="status">{foodPhotoWarning}</p>}
         </div>
         <form onSubmit={saveMeal}>
           <div className="form-grid">
             <div className="field"><label>Date</label><input type="date" value={mealDraft.date} max={todayLocal()} onChange={e => setMealDraft(p => ({...p,date:e.target.value}))} required /></div>
             <div className="field"><label>Meal</label><select value={mealDraft.type} onChange={e => setMealDraft(p => ({...p,type:e.target.value}))}>{["Breakfast","Lunch","Dinner","Snack","Other"].map(t => <option key={t}>{t}</option>)}</select></div>
             <div className="field full"><label>What did you eat?</label><textarea value={mealDraft.description} onChange={e => setMealDraft(p => ({...p,description:e.target.value}))} placeholder="Example: grilled chicken, brown rice, broccoli and water" required /></div>
             <div className="field full"><label>Portion / Amount (optional)</label><input value={mealDraft.portion} onChange={e => setMealDraft(p => ({...p,portion:e.target.value}))} placeholder="Example: 5 oz chicken, 1 cup rice" /></div>
             <div className="field"><label>Calories (optional)</label><input type="number" min="0" step="any" value={mealDraft.calories} onChange={e => setMealDraft(p => ({...p,calories:e.target.value}))} placeholder="e.g. 550" /></div>
             <div className="field"><label>Protein in grams (optional)</label><input type="number" min="0" step="any" value={mealDraft.protein} onChange={e => setMealDraft(p => ({...p,protein:e.target.value}))} placeholder="e.g. 35" /></div>
           </div>
           <div className="actions"><button className="btn btn-primary" type="submit">{editingMealId ? "Update Meal" : "+ Save Meal"}</button>{editingMealId && <button className="btn btn-secondary" type="button" onClick={() => {setEditingMealId(null);setMealDraft(blankMeal());}}>Cancel Edit</button>}</div>
         </form>
         {mealNotice && <div className="notice" role="status">{mealNotice}</div>}
         <div className="metric-grid" style={{marginTop:20}}>
           <div className="metric-card"><div className="metric-label">Today's Meals</div><div className="metric-value">{todayMeals.length}</div><div className="metric-sub">logged today</div></div>
           <div className="metric-card"><div className="metric-label">Recorded Calories</div><div className="metric-value">{todayMealCalories.toLocaleString()}</div><div className="metric-sub">known amounts only</div></div>
           <div className="metric-card"><div className="metric-label">Recorded Protein</div><div className="metric-value">{todayMealProtein}g</div><div className="metric-sub">known amounts only</div></div>
         </div>
         <div className="card-header" style={{marginTop:24}}><div><h4>Meal History</h4><p>Review, edit or delete previously recorded meals.</p></div></div>
         <div className="field" style={{maxWidth:260,marginBottom:16}}><label>Filter by date</label><input type="date" value={mealHistoryDate} onChange={e => setMealHistoryDate(e.target.value)} /></div>
         {mealHistoryDate && <button className="btn btn-secondary" type="button" onClick={() => setMealHistoryDate("")} style={{marginBottom:14}}>Show All Dates</button>}
         {mealHistory.filter(m => !mealHistoryDate || m.date === mealHistoryDate).length === 0 ? <p className="muted small">No meals recorded for this selection yet.</p> :
           <div className="meal-history-list">{mealHistory.filter(m => !mealHistoryDate || m.date === mealHistoryDate).slice().sort((x,y) => y.date.localeCompare(x.date)).map(m => <div className="meal-history-entry" key={m.id}>
             <div><strong>{m.type} · {m.date}</strong><p>{m.description}</p>{m.portion && <span className="muted small">Portion: {m.portion} · </span>}<span className="muted small">{m.calories == null ? "Calories not entered" : `${m.calories} cal`} · {m.protein == null ? "Protein not entered" : `${m.protein}g protein`}</span></div>
             <div className="meal-history-actions"><button type="button" className="btn btn-secondary" onClick={() => editMeal(m)}>Edit</button><button type="button" className="btn btn-secondary" onClick={() => deleteMeal(m.id)}>Delete</button></div>
           </div>)}</div>}
         <p className="muted small" style={{marginTop:14}}>Only confirmed meals count as eaten. Missing calorie or protein values are not estimated or counted as zero intake. Meal history is stored in this browser.</p>
       </section>
        <div className="card-header"><div><h4>Daily Tracking</h4><p>Optional manual totals if you are not recording individual meals. When meals are logged today, their known nutrition amounts take priority on the dashboard.</p></div></div>
        <label className="checkbox-row"><input type="checkbox" checked={formData.tracks_calories} onChange={(e) => setFormData({...formData, tracks_calories: e.target.checked})} /> I track my calories manually</label>
        {formData.tracks_calories && <div className="form-grid" style={{marginTop: "18px"}}><div className="field"><label>Calories Eaten Today</label><input type="number" name="actual_calories_today" min="0" value={formData.actual_calories_today} onChange={handleChange} /></div><div className="field"><label>Protein Eaten Today (g)</label><input type="number" name="actual_protein_today" min="0" value={formData.actual_protein_today} onChange={handleChange} /></div></div>}
      </section>
      <section className="card">
        <div className="card-header"><div><h4>Estimated Daily Targets</h4><p>Calculated from the basic information and goal in your profile.</p></div><button className="btn btn-primary" onClick={getNutritionTargets} disabled={nutritionLoading}>{nutritionLoading ? "Calculating..." : "Calculate Targets"}</button></div>
        {nutritionTargets ? <>
          <div className="metric-grid" style={{marginBottom: "20px"}}>
            <div className="metric-card"><div className="metric-label">Target Calories</div><div className="metric-value">{nutritionTargets.target_calories}</div><div className="metric-sub">calories / day</div></div>
            <div className="metric-card"><div className="metric-label">Protein</div><div className="metric-value">{nutritionTargets.protein_grams}g</div><div className="metric-sub">per day</div></div>
            <div className="metric-card"><div className="metric-label">Maintenance</div><div className="metric-value">{nutritionTargets.estimated_maintenance_calories}</div><div className="metric-sub">calories / day</div></div>
            <div className="metric-card"><div className="metric-label">Estimated BMR</div><div className="metric-value">{nutritionTargets.estimated_bmr}</div><div className="metric-sub">calories / day</div></div>
          </div>
          <div className="health-nutrition-panel">
            <div className="card-header"><div><h4>❤️ Health-Aware Nutrition</h4><p>Recommendations adjusted using your health profile and available health measurements.</p></div></div>
            {healthNutrition?.active ? <>
              <div className="health-condition-tags">{healthNutrition.considerations.map((item) => <span className="status-pill" key={item.condition}>{item.condition}</span>)}</div>
              <div className="info-list" style={{marginTop:"14px"}}>{healthNutrition.considerations.map((item) => <div className="info-item" key={item.condition}><span>{item.condition}</span><strong>{item.focus}</strong></div>)}</div>
              <div className="two-column" style={{marginTop:"18px"}}>
                <div className="nutrition-guidance-box"><h5>✓ Prioritize</h5><ul>{healthNutrition.prioritize.map((item) => <li key={item}>{item}</li>)}</ul></div>
                <div className="nutrition-guidance-box"><h5>↓ Limit</h5><ul>{healthNutrition.limit.length ? healthNutrition.limit.map((item) => <li key={item}>{item}</li>) : <li>No additional limits identified.</li>}</ul></div>
              </div>
            </> : <p className="muted small">No condition-specific nutrition adjustments are currently active. Add health conditions or available health measurements, then recalculate.</p>}
          </div>
        </> : <p className="muted small">No targets calculated yet. Complete your basic profile information, then select Calculate Targets.</p>}
      </section>
      {profileMessage && <div className="notice">{profileMessage}</div>}
    </>
  );

  const Exercise = () => (
    <>
      <div className="page-heading"><h3><span className="page-icon">🏃</span>Exercise</h3><p>Set your experience, weekly schedule, and available equipment.</p></div>
      <PhotoBanner photo="photo-1517836357463-d25dfeac3438" title="Exercise" description="Fitness equipment" />
      <section className="card decorative-card decor-exercise">
        <div className="card-header"><div><h4>Training Setup</h4><p>This information helps tailor workout recommendations.</p></div></div>
        <div className="form-grid">
          <div className="field"><label>Experience Level</label><select name="exercise_experience" value={formData.exercise_experience} onChange={handleChange} required><option value="">Select</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></div>
          <div className="field"><label>Workout Days Per Week</label><select name="workout_days_per_week" value={formData.workout_days_per_week} onChange={handleChange} required><option value="">Select</option>{[1,2,3,4,5,6,7].map((day) => <option key={day} value={day}>{day} {day === 1 ? "Day" : "Days"}</option>)}</select></div>
        </div>
      </section>
      <section className="card">
        <div className="card-header">
          <div>
            <h4>Available Equipment</h4>
            <p>Search or browse by training category. Select only equipment you can use.</p>
          </div>
          <span className="status-pill">{formData.available_equipment.length} selected</span>
        </div>

        <div className="field" style={{ marginBottom: "16px" }}>
          <label>Search Equipment</label>
          <input
            type="search"
            value={equipmentSearch}
            onChange={(e) => setEquipmentSearch(e.target.value)}
            placeholder="Search dumbbell, treadmill, cable, yoga..."
          />
        </div>

        <div className="actions" style={{ marginBottom: "18px" }}>
          <button type="button" className="btn btn-secondary" onClick={selectAllEquipment}>Select All</button>
          <button type="button" className="btn btn-secondary" onClick={clearAllEquipment}>Clear All</button>
        </div>

        {formData.available_equipment.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => setShowSelectedEquipment((previous) => !previous)}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 14px",
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: "10px",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <strong>Selected Equipment ({formData.available_equipment.length})</strong>
              <span>{showSelectedEquipment ? "▲" : "▼"}</span>
            </button>

            {showSelectedEquipment && (
              <div className="equipment-grid" style={{ marginTop: "12px" }}>
                {formData.available_equipment.map((equipment) => (
                  <button
                    type="button"
                    key={equipment}
                    className="equipment-chip selected"
                    onClick={() => toggleEquipment(equipment)}
                    title={`Remove ${equipment}`}
                  >
                    {equipment} ×
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          {Object.entries(equipmentCategories).map(([category, items]) => {
            const matches = items.filter((item) =>
              item.toLowerCase().includes(equipmentSearch.toLowerCase())
            );
            if (equipmentSearch && matches.length === 0) return null;

            const isOpen = equipmentSearch ? true : openEquipmentCategories.includes(category);
            const selectedCount = items.filter((item) =>
              formData.available_equipment.includes(item)
            ).length;

            return (
              <div key={category} style={{ borderTop: "1px solid var(--border, #e5e7eb)", padding: "12px 0" }}>
                <button
                  type="button"
                  onClick={() => toggleEquipmentCategory(category)}
                  style={{
                    width: "100%", display: "flex", justifyContent: "space-between",
                    alignItems: "center", border: 0, background: "transparent",
                    cursor: "pointer", padding: "4px 0", textAlign: "left"
                  }}
                >
                  <strong>{isOpen ? "▼" : "▶"} {category}</strong>
                  <span className="muted small">{selectedCount} / {items.length}</span>
                </button>

                {isOpen && (
                  <>
                    <div className="actions" style={{ margin: "10px 0" }}>
                      <button type="button" className="btn btn-secondary" onClick={() => selectCategory(category)}>Select Category</button>
                      <button type="button" className="btn btn-secondary" onClick={() => clearCategory(category)}>Clear Category</button>
                    </div>
                    <div className="equipment-grid">
                      {matches.map((equipment) => (
                        <label
                          key={equipment}
                          className={`equipment-chip ${formData.available_equipment.includes(equipment) ? "selected" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.available_equipment.includes(equipment)}
                            onChange={() => toggleEquipment(equipment)}
                          />
                          {equipment}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <section className="card"><div className="card-header"><div><h4>Physical Limitations</h4><p>Add any limitations the agent should account for when suggesting exercise.</p></div></div><div className="field"><label>Injuries or Physical Limitations</label><textarea name="injuries_limitations" value={formData.injuries_limitations} onChange={handleChange} placeholder="Example: shoulder pain, limited knee mobility" /></div></section>
      <div className="actions"><button className="btn btn-primary" onClick={(e) => handleProfileSubmit(e)}>Save Exercise Settings</button><button className="btn btn-secondary" onClick={() => go("AI Coach")}>Ask AI Coach for a Workout</button></div>
      {profileMessage && <div className="notice">{profileMessage}</div>}
    </>
  );

  const handleAgingPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAgingError("");
    setAgingResult("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAgingError("Choose a JPG, PNG, or WebP image.");
      setAgingPhoto("");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setAgingError("Choose an image smaller than 8 MB.");
      setAgingPhoto("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAgingPhoto(String(reader.result || ""));
    reader.onerror = () => setAgingError("Could not read the photo. Please try another file.");
    reader.readAsDataURL(file);
  };

  const generateAgedPhoto = async () => {
    if (!agingPhoto || agingLoading) return;
    if (formData.age && agingTarget <= Number(formData.age)) {
      setAgingError("Choose a target age older than your current age.");
      return;
    }
    setAgingLoading(true);
    setAgingError("");
    setAgingResult("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/face-aging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: agingPhoto, target_age: agingTarget, profile: buildProfile() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Image generation failed.");
      if (!result.image) throw new Error("No image was returned.");
      setAgingResult(result.image);
    } catch (error) {
      setAgingError(error.message || "Could not generate an image.");
    } finally {
      setAgingLoading(false);
    }
  };

  const Longevity = () => (
    <>
      <div className="page-heading">
        <h3><span className="page-icon">🌿</span>Longevity</h3>
        <p>Track lifestyle and recovery factors that support long-term health and physical function.</p>
      </div>
      <PhotoBanner photo="photo-1441974231531-c6227db76b6e" title="Longevity" description="Nature and recovery" />

      <section className="card decorative-card decor-sleep">
        <div className="card-header"><div><h4>Sleep & Recovery</h4><p>Add your usual sleep and recovery habits.</p></div></div>
        <div className="form-grid">
          <div className="field sleep-slider-field">
            <label htmlFor="sleep-hours-slider">Average Sleep Per Night</label>
            <div className="sleep-slider-value">{formData.sleep_hours === "" ? "Select hours" : `${formData.sleep_hours} hours`}</div>
            <input
              id="sleep-hours-slider"
              className="sleep-hours-slider"
              type="range"
              name="sleep_hours"
              min="0"
              max="24"
              step="0.5"
              value={formData.sleep_hours === "" ? 8 : formData.sleep_hours}
              onChange={(event) => {
                handleChange(event);
                setSleepHoursChanged(true);
              }}
              aria-label="Average sleep hours per night"
              style={{
                "--sleep-color": (() => {
                  const hours = Number(formData.sleep_hours === "" ? 8 : formData.sleep_hours);
                  const stops = [
                    [0, [210, 55, 55]], [4, [220, 90, 55]],
                    [6, [225, 185, 60]], [7, [46, 155, 104]],
                    [9, [46, 155, 104]], [11, [225, 185, 60]],
                    [14, [220, 90, 55]], [24, [210, 55, 55]],
                  ];
                  for (let i = 0; i < stops.length - 1; i++) {
                    const [from, a] = stops[i];
                    const [to, b] = stops[i + 1];
                    if (hours <= to) {
                      const t = Math.max(0, (hours - from) / (to - from));
                      return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * t)).join(",")})`;
                    }
                  }
                  return "rgb(210,55,55)";
                })(),
                background: "var(--sleep-color)",
                backgroundImage: "none",
              }}
            />
            <div className="sleep-slider-ticks"><span>0h</span><span>7–9h</span><span>24h</span></div>
            {sleepHoursChanged && (
              <div role="status" aria-live="polite" style={{display:"flex", alignItems:"center", gap:8, marginTop:12, color:"#25845d", fontSize:13, fontWeight:600}}>
                <span aria-hidden="true">✓</span>
                {formData.sleep_hours} hours selected — Saved automatically
              </div>
            )}
            <div className="sleep-slider-caption">{formData.sleep_hours === "" ? "Move the slider to set your average sleep." : Number(formData.sleep_hours) >= 7 && Number(formData.sleep_hours) <= 9 ? "Within the typical adult sleep range" : Number(formData.sleep_hours) < 7 ? "Below the typical adult sleep range" : "Above the typical adult sleep range"}</div>
          </div>
          <div className="field"><label>Sleep Quality</label><select name="sleep_quality" value={formData.sleep_quality} onChange={handleChange}><option value="">Select</option><option value="poor">Poor</option><option value="fair">Fair</option><option value="good">Good</option><option value="very_good">Very Good</option><option value="excellent">Excellent</option></select></div>
          <div className="field full"><label>Recovery Notes</label><textarea name="recovery_notes" value={formData.recovery_notes} onChange={handleChange} placeholder="Example: soreness, fatigue, rest-day habits, recovery routine" /></div>
        </div>
      </section>

      <section className="card">
        <div className="card-header"><div><h4>Daily Activity & Mobility</h4><p>Track movement outside of your normal workouts.</p></div></div>
        <div className="form-grid">
          <div className="field"><label>Average Daily Steps</label><input type="number" name="daily_steps" min="0" value={formData.daily_steps} onChange={handleChange} placeholder="Example: 8000" /></div>
          <div className="field"><label>Mobility / Flexibility Days Per Week</label><select name="mobility_days_per_week" value={formData.mobility_days_per_week} onChange={handleChange}><option value="">Select</option>{[0,1,2,3,4,5,6,7].map((day) => <option key={day} value={day}>{day} {day === 1 ? "Day" : "Days"}</option>)}</select></div>
        </div>
      </section>

      <section className="card">
        <div className="card-header"><div><h4>Stress & Long-Term Goals</h4><p>Give the agent additional context about wellness priorities.</p></div></div>
        <div className="form-grid">
          <div className="field"><label>Typical Stress Level</label><select name="stress_level" value={formData.stress_level} onChange={handleChange}><option value="">Select</option><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option><option value="very_high">Very High</option></select></div>
          <div className="field"><label>Primary Longevity Goal</label><select name="longevity_goal" value={formData.longevity_goal} onChange={handleChange}><option value="">Select</option><option value="healthy_aging">Healthy Aging</option><option value="maintain_mobility">Maintain Mobility</option><option value="maintain_strength">Maintain Strength</option><option value="improve_recovery">Improve Recovery</option><option value="improve_sleep">Improve Sleep</option><option value="increase_daily_activity">Increase Daily Activity</option></select></div>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div><h4>⏳ Lifespan Estimator</h4><p>Combine your profile and long-term health factors into a personalized longevity estimate.</p></div>
          <button className="btn btn-primary" type="button" onClick={calculateLifespanEstimate} disabled={lifespanLoading}>
            {lifespanLoading ? "Calculating..." : "Calculate Estimate"}
          </button>
        </div>

        <div className="form-grid">
          <div className="field">
            <label>Smoking / Nicotine Status</label>
            <select name="smoking_status" value={formData.smoking_status} onChange={handleChange}>
              <option value="">Select</option><option value="never">Never</option><option value="former">Former</option><option value="current">Current</option>
            </select>
          </div>
          <div className="field">
            <label>Alcohol Consumption</label>
            <select name="alcohol_consumption" value={formData.alcohol_consumption} onChange={handleChange}>
              <option value="">Select</option>
              <option value="never">Never drink</option>
              <option value="former">Former drinker</option>
              <option value="less_than_weekly">Less than once per week</option>
              <option value="1_3">1–3 drinks per week</option>
              <option value="4_7">4–7 drinks per week</option>
              <option value="8_14">8–14 drinks per week</option>
              <option value="15_plus">15+ drinks per week</option>
            </select>
            <span className="muted small">One standard drink is approximately 12 oz beer, 5 oz wine, or 1.5 oz spirits.</span>
          </div>
          <div className="field">
            <label>Overall Diet Quality</label>
            <select name="diet_quality" value={formData.diet_quality} onChange={handleChange}>
              <option value="">Select</option><option value="excellent">Excellent</option><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option>
            </select>
          </div>
          <div className="field"><label>Systolic Blood Pressure</label><input type="number" name="systolic_bp" value={formData.systolic_bp} onChange={handleChange} placeholder="Example: 118" /></div>
          <div className="field"><label>Diastolic Blood Pressure</label><input type="number" name="diastolic_bp" value={formData.diastolic_bp} onChange={handleChange} placeholder="Example: 76" /></div>
          <div className="field"><label>Non-HDL Cholesterol (mg/dL)</label><input type="number" name="non_hdl_cholesterol" value={formData.non_hdl_cholesterol} onChange={handleChange} placeholder="Optional" /></div>
          <div className="field"><label>A1C (%)</label><input type="number" step="0.1" name="a1c" value={formData.a1c} onChange={handleChange} placeholder="Optional" /></div>
          <div className="field full"><label>Family History of Early Heart Disease, Diabetes, or Early Death</label><textarea name="family_early_history" value={formData.family_early_history} onChange={handleChange} rows={3} placeholder="Example: My father had a heart attack at 48; my grandmother had type 2 diabetes." /><span className="muted small">Describe any known family history, including the relative and age when possible. You can also add details under Health Records.</span></div>
          <div className="field"><label>Resting Heart Rate (BPM)</label><input type="number" min="30" max="220" name="resting_heart_rate" value={formData.resting_heart_rate} onChange={handleChange} placeholder="Example: 65" /></div>
          <div className="field"><label>Estimated VO₂ Max (mL/kg/min)</label><input type="number" min="10" max="100" step="0.1" name="vo2_max" value={formData.vo2_max} onChange={handleChange} placeholder="Optional, if measured or estimated" /></div>
          <div className="field"><label>Weekly Cardio Minutes</label><input type="number" min="0" max="3000" name="cardio_minutes_weekly" value={formData.cardio_minutes_weekly} onChange={handleChange} placeholder="Example: 150" /></div>
          <div className="field"><label>Strength Training Days Per Week</label><select name="strength_days_weekly" value={formData.strength_days_weekly} onChange={handleChange}><option value="">Not provided</option>{[0,1,2,3,4,5,6,7].map(day => <option key={day} value={day}>{day}</option>)}</select></div>
          <div className="field"><label>Waist Circumference (inches)</label><input type="number" min="15" max="100" step="0.1" name="waist_inches" value={formData.waist_inches} onChange={handleChange} placeholder="Example: 34" /></div>
        </div>

        {lifespanEstimate && (
          <>
            <div className="metric-grid" style={{marginTop: "22px", marginBottom: "18px"}}>
              <div className="metric-card"><div className="metric-label">Estimated Lifespan</div><div className="metric-value">{lifespanEstimate.estimated_lifespan}</div><div className="metric-sub">years</div></div>
              <div className="metric-card"><div className="metric-label">Estimated Range</div><div className="metric-value" style={{fontSize:"22px"}}>{lifespanEstimate.range_low}–{lifespanEstimate.range_high}</div><div className="metric-sub">years</div></div>
              <div className="metric-card"><div className="metric-label">Remaining Years</div><div className="metric-value">{lifespanEstimate.remaining_years}</div><div className="metric-sub">estimated</div></div>
              <div className="metric-card"><div className="metric-label">Longevity Score</div><div className="metric-value">{lifespanEstimate.longevity_score}</div><div className="metric-sub">out of 100</div></div>
            </div>
            <div className="two-column">
              <div className="info-list">
                <div className="info-item"><span>Strong Factors</span><strong>{lifespanEstimate.positive_factors.join(", ") || "Add more information"}</strong></div>
              </div>
              <div className="info-list">
                <div className="info-item"><span>Biggest Opportunities</span><strong>{lifespanEstimate.opportunities.join(", ") || "Maintain current habits"}</strong></div>
              </div>
            </div>
            <div style={{ marginTop: "24px", padding: "20px", border: "1px solid var(--border, #dce5e0)", borderRadius: "16px" }}>
              <h4 style={{ margin: "0 0 6px" }}>🌱 How to Improve Your Longevity</h4>
              <p className="muted small" style={{ margin: "0 0 18px" }}>Personalized steps based on the health information you entered.</p>
              {(lifespanEstimate.recommendations || []).map((recommendation, index) => (
                <div key={recommendation.title} style={{ padding: "14px 0", borderTop: index ? "1px solid var(--border, #e4e9e6)" : "none" }}>
                  <strong>{index + 1}. {recommendation.title}</strong>
                  <p style={{ margin: "7px 0 4px", lineHeight: 1.55 }}>{recommendation.action}</p>
                  <p className="muted small" style={{ margin: 0 }}><strong>Why it helps:</strong> {recommendation.why}</p>
                </div>
              ))}
              <p className="muted small" style={{ margin: "16px 0 0" }}>This estimate is an educational project model, not a clinically validated prediction. These steps may reduce health risks, but no specific increase in lifespan can be guaranteed. Consult a healthcare professional for individualized advice.</p>
            </div>
            <div className="health-guidance-card" style={{ marginTop: "20px", padding: "20px" }}>
              <div className="card-header">
                <div>
                  <h4>🔎 Deeper Longevity Insights</h4>
                  <p>Explore less-obvious connections between your health measurements, activity, sleep, and history.</p>
                </div>
                <button type="button" className="btn btn-secondary" onClick={generateDeepLongevityInsights} disabled={deepLongevityLoading}>
                  {deepLongevityLoading ? "Analyzing..." : deepLongevityInsights.length ? "Refresh Insights" : "Explore Deeper Insights"}
                </button>
              </div>
              {deepLongevityMethod && <p className="muted small">{deepLongevityMethod}</p>}
              {deepLongevityError && <p className="notice" role="alert">{deepLongevityError}</p>}
              {deepLongevityInsights.map((insight, index) => (
                <div key={index} style={{ padding: "16px 0", borderTop: "1px solid var(--border, #e4e9e6)" }}>
                  <h5 style={{ margin: "0 0 8px" }}>{index + 1}. {insight.title}</h5>
                  <p style={{ margin: "6px 0" }}><strong>The connection:</strong> {insight.connection}</p>
                  <p style={{ margin: "6px 0" }}><strong>Something to try:</strong> {insight.action}</p>
                  {insight.caution && <p className="muted small" style={{ margin: "6px 0" }}><strong>Keep in mind:</strong> {insight.caution}</p>}
                </div>
              ))}
              <p className="muted small" style={{ margin: "12px 0 0" }}>Educational insights, not a diagnosis or validated prediction. AI insights may contain errors; discuss individual health decisions with a clinician. Your entered health profile is sent to Gemini when you request AI insights.</p>
            </div>
          </>
        )}
      </section>

      <div className="actions">
        <button className="btn btn-primary" onClick={(e) => handleProfileSubmit(e)}>Save Longevity Settings</button>
        <button className="btn btn-secondary" onClick={() => go("AI Coach")}>Ask AI Coach</button>
      </div>
      {profileMessage && <div className="notice">{profileMessage}</div>}
    </>
  );

  const Network = () => {
    const networkData = {
      "Personal Trainer": [
        { name: "Alex Morgan, CPT", detail: "Strength & conditioning • 4.9 rating", meta: "West Chester Fitness Studio • (610) 555-0142" },
        { name: "Jordan Lee, CPT", detail: "Weight loss & beginner fitness • 4.8 rating", meta: "Independent Trainer • (610) 555-0188" },
        { name: "Taylor Brooks, CSCS", detail: "Sports performance • 4.7 rating", meta: "Performance Lab • (484) 555-0121" },
      ],
      "Pharmacy": [
        { name: "Community Care Pharmacy", detail: "Prescriptions • Vaccinations • Medication review", meta: "1.2 miles away • (610) 555-0110" },
        { name: "Westside Pharmacy", detail: "Prescriptions • Delivery available", meta: "2.4 miles away • (610) 555-0155" },
        { name: "HealthFirst Pharmacy", detail: "Prescriptions • Wellness supplies", meta: "3.1 miles away • (484) 555-0190" },
      ],
      "Nutritionist": [
        { name: "Jamie Carter, RDN", detail: "Sports nutrition & meal planning • 4.9 rating", meta: "Nutrition Wellness Center • (610) 555-0133" },
        { name: "Morgan Davis, RDN", detail: "Weight management • 4.8 rating", meta: "Healthy Living Nutrition • (484) 555-0167" },
        { name: "Casey Miller, RDN", detail: "General nutrition & healthy eating • 4.7 rating", meta: "Virtual and in-person visits • (610) 555-0199" },
      ],
      "Doctor": [
        { name: "Dr. Avery Wilson", detail: "Primary Care • Family Medicine", meta: "Chester County Health Center • (610) 555-0104" },
        { name: "Dr. Cameron Reed", detail: "Sports Medicine", meta: "Sports & Joint Clinic • (484) 555-0174" },
        { name: "Dr. Riley Parker", detail: "Internal Medicine", meta: "West Chester Medical Group • (610) 555-0128" },
      ],
      "Gyms": [
        { name: "West Chester Fitness Club", detail: "Weights • Cardio • Group classes • 4.8 rating", meta: "0.9 miles away • Open until 10 PM" },
        { name: "Iron Works Training Center", detail: "Free weights • Power racks • Personal training", meta: "2.1 miles away • Open until 11 PM" },
        { name: "Community Wellness Gym", detail: "Cardio • Machines • Pool • Classes", meta: "3.0 miles away • Open until 9 PM" },
      ],
    };

    const networkIcons = {
      "Personal Trainer": "🏋️",
      "Pharmacy": "💊",
      "Nutritionist": "🍎",
      "Doctor": "🩺",
      "Gyms": "💪",
    };

    const descriptions = {
      "Personal Trainer": "Personalized exercise programming, technique guidance, and fitness support.",
      "Pharmacy": "Medication, prescription, and pharmacy support.",
      "Nutritionist": "Individualized food and nutrition guidance.",
      "Doctor": "Medical care, follow-up, and professional health support.",
      "Gyms": "Fitness facilities that can support your training goals.",
    };

    return (
      <>
        <div className="page-heading">
          <h3><span className="page-icon">🤝</span>Network</h3>
          <p>Explore a prototype network of professionals and services that can support your health, nutrition, and fitness goals.</p>
        </div>
      <PhotoBanner photo="photo-1497366811353-6870744d04b2" title="Network" description="Professional connections" />

        <section className="card">
          <div className="card-header"><div><h4>Your Health & Fitness Network</h4><p>Select a category to view example providers and services.</p></div></div>
          <div className="quick-actions">
            {Object.keys(networkData).map((category) => (
              <button className="quick-action" type="button" key={category} onClick={() => setSelectedNetwork(category)}>
                <span className="network-icon">{networkIcons[category]}</span>
                <strong>{category}</strong>
                <span>{descriptions[category]}</span>
              </button>
            ))}
          </div>
        </section>

        {selectedNetwork && (
          <section className="card">
            <div className="card-header">
              <div><h4>{selectedNetwork}</h4><p>Example prototype results. These are fictional and are not real providers or businesses.</p></div>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedNetwork(null)}>Close</button>
            </div>
            <div className="info-list">
              {networkData[selectedNetwork].map((item) => (
                <div className="info-item" key={item.name} style={{alignItems: "flex-start"}}>
                  <div>
                    <strong style={{display: "block", marginBottom: "5px"}}>{item.name}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <span className="muted small" style={{textAlign: "right"}}>{item.meta}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!selectedNetwork && (
          <section className="card">
            <div className="card-header"><div><h4>Prototype Network</h4><p>Choose one of the categories above to see example results.</p></div></div>
            <p className="muted small">The current network uses fictional sample providers. A future version can connect to real provider and business data.</p>
          </section>
        )}
      </>
    );
  };

  const Insights = () => (
    <>
      <div className="page-heading">
        <h3><span className="page-icon">💡</span>Personalized Insights</h3>
        <p>Discover overlooked connections between your lifestyle, health history, nutrition, and activity.</p>
      </div>
      <PhotoBanner photo="photo-1494597564530-871f2b93ac55" title="Discover more" description="Fresh green leaves and sunlight" />
      <section className="card insights-intro">
        <div className="card-header">
          <div>
            <h4>Find something worth exploring</h4>
            <p>Get up to three tailored, research-informed suggestions based on your current profile.</p>
          </div>
          <span className="insights-lightbulb" aria-hidden="true">✨</span>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="button" onClick={discoverInsights} disabled={insightsLoading}>
            {insightsLoading ? "Finding connections..." : insights.length ? "Refresh My Insights" : "Discover My Insights"}
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => go("Profile")}>Update Profile</button>
        </div>
        {insightsError && <p className="notice" role="alert">{insightsError}</p>}
      </section>
      {insights.length > 0 && (
        <>
          <div className="insights-heading-row"><h4>Your discoveries</h4><span>{insightsMethod}</span></div>
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <article className="card insight-card" key={insight.id}>
                <div className="insight-card-top"><span className="insight-number">0{index + 1}</span><span className="insight-eyebrow">Personalized connection</span></div>
                <h4>{insight.title}</h4>
                <p className="insight-observation">{insight.observation}</p>
                <div className="insight-divider" />
                <strong>Why it may matter</strong>
                <p>{insight.why_it_matters}</p>
                <strong>Something to try</strong>
                <p>{insight.try_this}</p>
                {insight.caution && <p className="insight-caution">{insight.caution}</p>}
                <div className="insight-footer">
                  <span>Based on: {insight.based_on.join(" + ")}</span>
                  <a href={insight.source.url} target="_blank" rel="noopener noreferrer">Related reading: {insight.source.name} ↗</a>
                </div>
              </article>
            ))}
          </div>
          <p className="insights-footnote">These suggestions use curated health references and your entered profile. They are not a live research search or a diagnosis. Update your profile and refresh to explore new connections.</p>
        </>
      )}
    </>
  );

  const AICoach = () => (
    <>
      <div className="page-heading"><h3><span className="page-icon">✨</span>AI Coach</h3><p>Your profile is automatically included with each request for personalized responses.</p></div>
      <div className="chat-layout">
        <section className="card chat-card">
          <div className="card-header"><div><h4>Conversation</h4><p>Ask about exercise, nutrition, health concerns, health tests, meals, or your current goals.</p></div><span className="status-pill"><span className="status-dot" /> Agent ready</span></div>
          <div className="chat-window">
            {chatMessages.length === 0 && <div className="empty-chat"><div><strong>How can I help today?</strong><div>Try “Give me a workout for today” or “What should I eat for breakfast?”</div></div></div>}
            {chatMessages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <span className="message-label">{message.role === "user" ? "You" : "AI Coach"}</span>
                {message.role === "agent"
                  ? <FormattedAIResponse text={message.text} />
                  : <div className="user-message-text">{message.text}</div>}
              </div>
            ))}
            {chatLoading && <div className="message agent"><span className="message-label">AI Coach</span>Thinking...</div>}
          </div>
          <form className="chat-form" onSubmit={sendMessage}><textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about exercise, nutrition, health concerns, or health tests..." rows="2" /><button className="btn btn-primary" type="submit" disabled={chatLoading}>{chatLoading ? "Sending..." : "Send"}</button></form>
        </section>
        <aside className="card">
          <div className="card-header"><div><h4>Profile Context</h4><p>Current information available to the agent.</p></div></div>
          <div className="info-list">
            <div className="info-item"><span>Goal</span><strong>{goalLabel}</strong></div>
            <div className="info-item"><span>Activity</span><strong>{formData.activity_level?.replace("_", " ") || "Not set"}</strong></div>
            <div className="info-item"><span>Diet</span><strong>{formData.dietary_preference || "No preference"}</strong></div>
            <div className="info-item"><span>Experience</span><strong>{formData.exercise_experience || "Not set"}</strong></div>
            <div className="info-item"><span>Equipment</span><strong>{formData.available_equipment.length} selected</strong></div>
          </div>
          <div className="actions"><button className="btn btn-secondary" onClick={() => go("Profile")}>Update Profile</button></div>
        </aside>
      </div>
    </>
  );

  const pageDescription = {
    Dashboard: "Overview of your personalized health and fitness plan",
    Profile: "Personal details and health considerations",
    "Health Records": "Previous health history, records, and medical information",
    "Health Guidance": "Health concerns, tests and screening, medications, vitamins, and supplements",
    Nutrition: "Targets, preferences, and daily tracking",
    Exercise: "Training preferences and available equipment",
    Longevity: "Sleep, recovery, mobility, activity, and long-term wellness",
    Insights: "Research-informed connections from your personal health profile",
    Network: "Personal trainers, pharmacies, nutritionists, doctors, and gyms",
    "AI Coach": "Personalized exercise and nutrition conversation",
  }[activePage];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark health-logo" aria-label="Health and wellness logo">
            <span className="logo-heart">♥</span>
            <span className="logo-pulse">⌁</span>
          </div>
          <div><h1>Exercise & Nutrition</h1><p>Personal AI Agent</p></div>
        </div>
        <Navigation />
        <div className="sidebar-art" aria-hidden="true">
          <span className="art-dot dot-one"></span>
          <span className="art-dot dot-two"></span>
          <span className="art-dot dot-three"></span>
          <span className="art-leaf leaf-one"></span>
          <span className="art-leaf leaf-two"></span>
          <span className="art-leaf leaf-three"></span>
          <span className="art-wave wave-one"></span>
          <span className="art-wave wave-two"></span>
        </div>
      </aside>
      <main className="main">
        <header className="topbar"><div><h2>{activePage}</h2><p>{pageDescription}</p></div><span className="status-pill"><span className="status-dot" /> System ready</span></header>
        <Navigation mobile />
        <div className="content">
          {activePage === "Dashboard" && Dashboard()}
          {activePage === "Profile" && Profile()}
          {activePage === "Health Records" && HealthRecords()}
          {activePage === "Health Guidance" && HealthGuidance()}
          {activePage === "Nutrition" && Nutrition()}
          {activePage === "Exercise" && Exercise()}
          {activePage === "Longevity" && Longevity()}
          {activePage === "Insights" && Insights()}
          {activePage === "Network" && Network()}
          {activePage === "AI Coach" && AICoach()}
        </div>
      </main>
    </div>
  );
}

export default App;

