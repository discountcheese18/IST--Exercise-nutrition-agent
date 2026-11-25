# Insight selection engine: creates profile-specific, research-informed suggestion cards.
# Curated rules generate candidate insights; AI can rank those candidates when available.

"""Generate profile-based insights from curated health references."""
import json
import re
from typing import Any

SOURCES = {
    "activity": {"name": "Physical Activity Guidelines — Move Your Way (HHS)", "url": "https://odphp.health.gov/moveyourway/"},
    "sleep": {"name": "About Sleep (CDC)", "url": "https://www.cdc.gov/sleep/about/index.html"},
    "diabetes": {"name": "Diabetes: Diet, Eating & Physical Activity (NIDDK)", "url": "https://www.niddk.nih.gov/health-information/diabetes/overview/diet-eating-physical-activity"},
    "aging": {"name": "Exercise and Physical Activity (NIA)", "url": "https://www.nia.nih.gov/health/exercise-and-physical-activity"},
    "nutrition": {"name": "Dietary Guidelines for Americans (USDA/HHS)", "url": "https://www.dietaryguidelines.gov/"},
    "stress": {"name": "Coping with Stress (CDC)", "url": "https://www.cdc.gov/mental-health/living-with/index.html"},
    "kidney": {"name": "Eating Right for Chronic Kidney Disease (NIDDK)", "url": "https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/eating-nutrition"},
    "allergy": {"name": "Food Allergies (FDA)", "url": "https://www.fda.gov/food/food-labeling-nutrition/food-allergies"},
    "myplate": {"name": "MyPlate (USDA)", "url": "https://www.myplate.gov/"},
    "heart": {"name": "Heart Health (American Heart Association)", "url": "https://www.heart.org/en/health-topics/high-blood-pressure"},
    "cholesterol": {"name": "Cholesterol (CDC)", "url": "https://www.cdc.gov/cholesterol/about/index.html"},
    "family": {"name": "Family Health History (CDC)", "url": "https://www.cdc.gov/family-health-history/about/index.html"},
    "sickle_cell": {"name": "Sickle Cell Disease (CDC)", "url": "https://www.cdc.gov/sickle-cell/about/index.html"},
    "cystic_fibrosis": {"name": "Cystic Fibrosis (MedlinePlus)", "url": "https://medlineplus.gov/cysticfibrosis.html"},
    "familial_hypercholesterolemia": {"name": "Familial Hypercholesterolemia (CDC)", "url": "https://www.cdc.gov/heart-disease-family-history/about/about-familial-hypercholesterolemia.html"},
    "marfan": {"name": "Marfan Syndrome (MedlinePlus)", "url": "https://medlineplus.gov/marfansyndrome.html"},
    "eds": {"name": "Ehlers-Danlos Syndromes (MedlinePlus)", "url": "https://medlineplus.gov/ehlersdanlossyndromes.html"},
    "huntington": {"name": "Huntington Disease (MedlinePlus)", "url": "https://medlineplus.gov/huntingtonsdisease.html"},
    "hemochromatosis": {"name": "Hemochromatosis (NIDDK)", "url": "https://www.niddk.nih.gov/health-information/liver-disease/hemochromatosis"},
    "g6pd": {"name": "G6PD Deficiency (MedlinePlus)", "url": "https://medlineplus.gov/ency/article/000528.htm"},
    "genetic": {"name": "Genetic Disorders (MedlinePlus)", "url": "https://medlineplus.gov/geneticdisorders.html"},
    "nutrition_label": {"name": "How to Understand and Use the Nutrition Facts Label (FDA)", "url": "https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label"},
}


# Function: has positive entry. Handles the corresponding request or processing step.
def has_positive_entry(value: Any) -> bool:
    """True only for a meaningful affirmative free-text entry."""
    if value is None or isinstance(value, bool):
        return bool(value) if isinstance(value, bool) else False
    entry = str(value).strip().lower()
    if not entry:
        return False
    normalized = re.sub(r"[\s\.!,;:_-]+", " ", entry).strip()
    negative = {
        "none", "no", "n a", "na", "n/a", "not applicable", "nothing",
        "nil", "nope", "unknown", "not sure", "not taking any",
        "no medication", "no medications", "no meds", "not on medication",
        "not on medications", "not taking medication", "not taking medications",
        "i take no medications", "i do not take medications", "i don't take medications",
        "0", "-",
    }
    return normalized not in negative


# Function: mentioned condition. Handles the corresponding request or processing step.
def mentioned_condition(text: str, terms: tuple[str, ...]) -> bool:
    """Conservative matching; avoids treating common negated statements as diagnoses."""
    for term in terms:
        for match in re.finditer(r"(?<![a-z])" + re.escape(term) + r"(?![a-z])", text):
            prefix = text[max(0, match.start() - 55):match.start()]
            # Check the most recent clause, not an unrelated prior sentence.
            prefix = re.split(r"[.;\n]", prefix)[-1]
            if re.search(r"(?:\bno\b|\bnot\b|\bnegative for\b|\bruled out\b|\bwithout\b|\btested negative for\b)\s+(?:\w+\s+){0,3}$", prefix):
                continue
            if re.search(r"(?:\bfamily history of\b|\bmother has\b|\bfather has\b|\bsibling has\b|\bcarrier of\b|\bcarrier for\b)\s*$", prefix):
                continue
            return True
    return False


# Processing helper: generate candidates. Keeps this logic reusable across API requests.
def generate_candidates(profile: Any) -> list[dict]:
    def value(name):
        return getattr(profile, name, None)

    def text(name):
        return str(value(name) or "").strip().lower()

    def number(name):
        try:
            n = float(value(name))
            return n if 0 <= n < 100000 else None
        except (ValueError, TypeError):
            return None

    def add(key, title, observation, why, action, fields, source, priority=2, caution=None):
        items.append({"id": key, "title": title, "observation": observation,
                      "why_it_matters": why, "try_this": action,
                      "based_on": fields, "source": SOURCES[source],
                      "priority": priority, "caution": caution})

    items = []
    sleep = None
    try:
        sleep = float(value("sleep_hours")) if value("sleep_hours") not in (None, "") else None
    except (ValueError, TypeError):
        pass
    stress = text("stress_level")
    activity = text("activity_level")
    goal = text("goal")
    conditions = " ".join(text(f) for f in ("medical_conditions", "dietary_health_conditions", "past_conditions") if has_positive_entry(value(f)))
    medication = has_positive_entry(value("medications"))
    injuries = " ".join(text(f) for f in ("injuries_limitations", "previous_injuries") if has_positive_entry(value(f)))
    quality = text("diet_quality")
    try:
        days = int(value("workout_days_per_week") or 0)
    except (ValueError, TypeError):
        days = 0
    try:
        age = int(value("age") or 0)
    except (ValueError, TypeError):
        age = 0

    # Genetic-condition considerations are triggered ONLY by a user's current
    # Medical Conditions field, never by family history or past conditions.
    genetic_text = " ".join(text(f) for f in ("medical_conditions", "dietary_health_conditions")
                            if has_positive_entry(value(f)))
    genetic_rules = [
        ("sickle_cell", ("sickle cell disease", "sickle cell anemia", "sickle-cell disease", "sickle-cell anemia"),
         "Sickle cell disease can change activity and hydration planning",
         "You listed sickle cell disease in your medical conditions.",
         "Dehydration, extreme exertion, temperature extremes, and low oxygen may be relevant triggers for some people with sickle cell disease.",
         "Ask your hematology team how to adapt workout intensity, hydration, and environmental conditions to your individual situation.",
         "sickle_cell"),
        ("cystic_fibrosis", ("cystic fibrosis",),
         "Cystic fibrosis can change nutrition and exercise needs",
         "You listed cystic fibrosis in your medical conditions.",
         "Nutrition, salt and fluid needs, and exercise tolerance can differ from standard fitness guidance.",
         "Review calorie goals, hydration and salt needs, and exercise plans with your CF care team or dietitian before following generic targets.",
         "cystic_fibrosis"),
        ("familial_hypercholesterolemia", ("familial hypercholesterolemia", "familial hypercholesterolaemia"),
         "Inherited cholesterol conditions need more than generic diet advice",
         "You listed familial hypercholesterolemia in your medical conditions.",
         "An inherited cholesterol condition can cause high LDL cholesterol despite healthy habits; lifestyle changes alone may not fully address the risk.",
         "Discuss LDL targets, lipid-lowering treatment, and whether family screening is appropriate with your clinician.",
         "familial_hypercholesterolemia"),
        ("marfan", ("marfan syndrome", "marfan's syndrome"),
         "Marfan syndrome can affect which exercises are appropriate",
         "You listed Marfan syndrome in your medical conditions.",
         "Cardiovascular involvement can affect safe exercise intensity and activity choices.",
         "Ask your cardiology team about individualized activity limits before high-intensity or heavy resistance training.",
         "marfan"),
        ("eds", ("ehlers-danlos", "ehlers danlos", "eds syndrome"),
         "Joint stability may matter more than exercise volume",
         "You listed Ehlers-Danlos syndrome in your medical conditions.",
         "Joint hypermobility and tissue-related symptoms can make some generic stretching and training recommendations unsuitable.",
         "Discuss joint-stability exercises and symptom-guided progression with a clinician or physical therapist familiar with your subtype.",
         "eds"),
        ("huntington", ("huntington disease", "huntington's disease", "huntingtons disease"),
         "Huntington disease may change activity and nutrition priorities",
         "You listed Huntington disease in your medical conditions.",
         "Movement, swallowing, balance, and nutritional needs can change over time and may need individualized assessment.",
         "Ask your care team whether balance, fall prevention, and nutrition or swallowing assessment should be part of your plan.",
         "huntington"),
        ("hemochromatosis", ("hereditary hemochromatosis", "haemochromatosis", "hemochromatosis"),
         "Iron supplementation deserves special attention",
         "You listed hemochromatosis in your medical conditions.",
         "Iron overload can make routine iron supplements inappropriate unless a clinician has specifically advised them.",
         "Check any multivitamins or supplements with your treating clinician before starting or changing them.",
         "hemochromatosis"),
        ("g6pd", ("g6pd deficiency", "glucose-6-phosphate dehydrogenase deficiency"),
         "G6PD deficiency can affect food and medication choices",
         "You listed G6PD deficiency in your medical conditions.",
         "Some exposures, including fava beans and certain medications, can trigger hemolysis in people with G6PD deficiency.",
         "Review food and medication precautions with your clinician or pharmacist; do not change prescribed treatment based on this card.",
         "g6pd"),
    ]
    genetic_match = False
    for key, terms, title, observation, why, action, source in genetic_rules:
        if mentioned_condition(genetic_text, terms):
            genetic_match = True
            add("genetic_" + key, title, observation, why, action,
                ["Medical conditions", "Exercise and nutrition goals"], source, 6,
                "This is a condition-specific discussion prompt, not a diagnosis or an individualized treatment recommendation.")
    if not genetic_match and mentioned_condition(genetic_text, ("genetic disorder", "genetic condition", "inherited disorder", "inherited condition")):
        add("genetic_unspecified", "Your genetic condition may need condition-specific guidance",
            "You mentioned a genetic or inherited condition without naming a supported diagnosis.",
            "Different genetic conditions have very different implications, so a general genetic label is not enough to make safe diet or exercise recommendations.",
            "Enter the exact diagnosis if you know it and ask your specialist which nutrition or activity precautions apply.",
            ["Medical conditions"], "genetic", 5)

    if sleep is not None and sleep < 7 and days >= 3:
        add("sleep_recovery", "Your recovery deserves a closer look",
            f"You reported {sleep:g} hours of sleep and {days} planned workout days each week.",
            "Sleep duration can affect recovery and how sustainable a training schedule feels.",
            "For one week, record sleep and how recovered you feel before workouts. Consider making harder sessions more flexible on poorly rested days.",
            ["Sleep hours", "Workout days"], "sleep", 5)
    if sleep is not None and sleep < 7 and ("high" in stress or "very" in stress):
        add("stress_sleep", "Sleep and stress may be reinforcing each other",
            "You reported shorter sleep and elevated stress.",
            "Sleep and stress can influence one another; treating them as separate problems may miss part of the picture.",
            "Try a consistent wake time and a short wind-down routine, then compare your sleep and stress ratings over a week.",
            ["Sleep hours", "Stress level"], "sleep", 5)
    a1c = number("a1c")
    if "diabet" in conditions or "prediabet" in conditions or (a1c is not None and a1c >= 5.7):
        add("glucose_activity", "Activity timing may be worth exploring",
            "Your profile includes a glucose-related consideration.",
            "Light movement after meals can be a useful topic when discussing post-meal glucose patterns.",
            "Ask your diabetes care team whether a short, comfortable walk after a meal is appropriate, especially if medication can cause low blood sugar.",
            ["Medical history / A1C", "Activity planning"], "diabetes", 5,
            "If you use insulin or medication that can cause hypoglycemia, ask your care team about exercise timing and glucose monitoring.")
    if ("kidney" in conditions or "renal" in conditions or "ckd" in conditions) and goal in {"build_muscle", "gain_weight"}:
        add("kidney_protein", "Your nutrition goal needs an individualized protein plan",
            "You selected a muscle or weight-gain goal and reported a kidney-related condition.",
            "Generic high-protein targets may not suit every stage of kidney disease or treatment.",
            "Before increasing protein or supplements, ask your kidney clinician or renal dietitian what target fits your labs and treatment.",
            ["Primary goal", "Medical conditions"], "kidney", 5,
            "Do not use generic protein targets to override a kidney care plan.")
    if "high" in stress or "very" in stress:
        add("stress_flexibility", "A flexible minimum may beat an ideal routine",
            "Your stress level is elevated.",
            "An all-or-nothing schedule can make healthy habits harder to maintain during demanding periods.",
            "Create a minimum-day option: a brief walk, one simple meal, or a short mobility session. Treat it as success, not a failed full workout.",
            ["Stress level", "Activity goals"], "stress", 3)
    if days <= 2 and activity in {"sedentary", "lightly_active", "lightly active", "light"}:
        add("movement_frequency", "Movement frequency may matter more than workout length",
            f"Your activity level is {activity.replace('_', ' ')} and your plan includes {days} workout days.",
            "Smaller bouts of movement can add up even without a long gym session.",
            "Try two or three short movement breaks during your day and track whether they fit better than a long workout.",
            ["Activity level", "Workout days"], "activity", 4)
    if age >= 60:
        add("balance_strength", "Strength and balance support independence",
            f"Your profile lists age {age}.",
            "For older adults, balance and muscle-strengthening activities can support everyday function alongside aerobic activity.",
            "Consider a safe balance and strength routine suited to your mobility and health conditions.",
            ["Age", "Exercise plan"], "aging", 4)
    if injuries:
        add("injury_adaptation", "Your limitations can guide exercise selection",
            "You listed a past injury or current physical limitation.",
            "A plan that adjusts movements and workload may be easier to follow than avoiding all exercise or pushing through symptoms.",
            "List movements that worsen symptoms and ask a qualified clinician or physical therapist which alternatives are appropriate.",
            ["Injuries / limitations", "Workout plan"], "activity", 4,
            "Stop and seek assessment for new, severe, or worsening symptoms.")
    if goal == "build_muscle" and days >= 3:
        add("muscle_recovery", "Progress isn't only about adding more sessions",
            f"Your goal is building muscle with {days} weekly workouts.",
            "Progressive training and adequate recovery work together; simply adding sessions may not improve results.",
            "Track a few exercises, perceived effort, and recovery for two weeks before deciding whether to add volume.",
            ["Muscle-building goal", "Workout frequency"], "activity", 3)
    if has_positive_entry(value("food_allergies")) or has_positive_entry(value("health_allergies")):
        add("allergy_substitutions", "Ingredient substitutions need the same allergy check",
            "Your profile includes an allergy.",
            "An apparently safe meal can become unsafe when a substitute, packaged ingredient, or cross-contact is overlooked.",
            "Review every proposed substitute and packaged label for your allergen before using it.",
            ["Allergies", "Meal substitutions"], "allergy", 5,
            "For severe allergies, follow your prescribed emergency plan.")
    if quality in {"poor", "fair", "low"} and goal in {"lose_weight", "build_muscle", "improve_fitness"}:
        add("food_pattern", "Your eating pattern may be a better first target than a perfect diet",
            "You reported a lower diet-quality rating and an active health goal.",
            "Small consistent food changes can be more sustainable than a complete meal-plan overhaul.",
            "Choose one repeatable upgrade, such as adding a fruit, vegetable, or fiber-rich food to a meal you already eat.",
            ["Diet quality", "Primary goal"], "nutrition", 3)
    if medication:
        add("medication_context", "Medication context may change what is practical",
            "You listed one or more medications.",
            "Some medications affect appetite, hydration, blood glucose, or exercise tolerance, but effects depend on the specific drug.",
            "Ask your pharmacist whether any of your medications have food, supplement, hydration, or exercise considerations relevant to your plan.",
            ["Medications", "Nutrition and exercise goals"], "nutrition", 3,
            "Do not start, stop, or change medication based on this insight.")
    # Additional profile-driven connections. Today's logged intake is a single-day
    preference = text("dietary_preference")
    disliked = text("disliked_foods") if has_positive_entry(value("disliked_foods")) else ""
    logged_calories = number("actual_calories_today")
    logged_protein = number("actual_protein_today")
    tracking = bool(value("tracks_calories"))
    weight_lbs = number("weight_lbs")
    steps = number("daily_steps")
    sleep_quality = text("sleep_quality")
    smoking = text("smoking_status")

    if preference in {"vegan", "vegetarian"} and goal in {"build_muscle", "gain_weight"}:
        add("plant_protein", "Make your protein sources fit your eating pattern",
            f"You selected a {preference} diet and a muscle- or weight-gain goal.",
            "Protein needs and food choices can be planned without assuming you eat meat; variety and enough overall food matter too.",
            "Consider options that fit your preference, such as tofu, tempeh, beans, lentils, soy foods, and, if you eat them, eggs or dairy. Review portions against your own goals.",
            ["Dietary preference", "Primary goal"], "myplate", 4)
    elif preference == "pescatarian" and goal in {"build_muscle", "gain_weight"}:
        add("pescatarian_protein", "Build your protein plan around foods you actually eat",
            "You selected a pescatarian eating pattern and a muscle- or weight-gain goal.",
            "A useful plan should reflect your food choices rather than defaulting to meat-based suggestions.",
            "Explore fish, legumes, soy foods, and any eggs or dairy you eat; choose variety and consider your allergies and dislikes.",
            ["Dietary preference", "Primary goal"], "myplate", 4)
    if preference == "vegan":
        add("vegan_b12", "Vitamin B12 is worth checking in a vegan eating pattern",
            "Your dietary preference is vegan.",
            "Reliable vitamin B12 sources usually require fortified foods or supplements in a fully vegan diet.",
            "Check whether your regular foods include reliable fortified B12 sources; discuss supplementation or testing with a qualified clinician when appropriate.",
            ["Dietary preference"], "myplate", 4)
    if disliked and preference in {"vegan", "vegetarian", "pescatarian", "standard"}:
        add("food_fit", "A plan you enjoy may be easier to maintain",
            "You provided foods you dislike and a dietary preference.",
            "Food plans that repeatedly include unwanted ingredients can be difficult to follow, even if their nutrient targets look good on paper.",
            "Choose two or three acceptable staple foods and use them across meals. Check that any substitutions also respect your allergies.",
            ["Foods disliked", "Dietary preference"], "myplate", 2)
    if tracking and logged_protein is not None and weight_lbs and goal in {"build_muscle", "gain_weight"}:
        grams_per_kg = logged_protein / (weight_lbs * 0.45359237)
        if grams_per_kg < 1.0:
            add("protein_log_review", "Your logged protein is worth reviewing alongside your goal",
                f"You logged {logged_protein:g} g protein today at {weight_lbs:g} lb body weight, with a muscle- or weight-gain goal.",
                "A single day's log may be incomplete, but it can reveal a useful question about whether your usual intake supports your training goals.",
                "Check whether today's log is complete and compare several typical days. If appropriate, ask a dietitian about an individualized protein target, particularly if you have kidney-related concerns.",
                ["Protein logged today", "Weight", "Primary goal"], "nutrition", 4)
        else:
            add("protein_consistency", "Look beyond one day's protein total",
                f"You logged {logged_protein:g} g of protein today while working toward a muscle- or weight-gain goal.",
                "A daily total alone does not show how consistent your intake is or how meals fit your routine.",
                "Track a few typical days and consider whether protein-containing meals fit naturally into your schedule.",
                ["Protein logged today", "Primary goal"], "nutrition", 2)
    if tracking and logged_calories is not None and logged_calories > 0:
        add("calorie_log_context", "Treat today's calorie log as a clue, not a verdict",
            f"You entered {logged_calories:g} calories eaten today and selected the goal '{goal.replace('_', ' ')}'.",
            "One day's total cannot establish your usual energy intake, needs, or whether you are eating too much or too little.",
            "Compare several complete days with your estimated targets, activity and hunger patterns before making changes. Avoid aggressive adjustments from one day's data.",
            ["Calories logged today", "Primary goal"], "nutrition_label", 3)
    if tracking and logged_calories is not None and logged_protein is not None and logged_calories > 0:
        protein_calorie_fraction = logged_protein * 4 / logged_calories
        if protein_calorie_fraction > 0.45:
            add("intake_log_check", "Your calorie and protein entries may need a quick accuracy check",
                f"Today's log lists {logged_protein:g} g protein and {logged_calories:g} calories.",
                "These entries imply that protein accounts for a large share of logged calories; incomplete meal entries or differing tracking methods could explain the pattern.",
                "Double-check serving sizes, missing meals, and whether the entries represent a full day before interpreting the totals.",
                ["Calories logged today", "Protein logged today"], "nutrition_label", 4)
    if steps is not None and steps < 4000 and activity in {"sedentary", "lightly_active", "lightly active", "light"}:
        add("steps_activity", "Your daily movement pattern may offer an easy starting point",
            "You entered a lower step count and a lower activity level.",
            "Brief movement opportunities may be more practical than trying to add long workouts immediately.",
            "If appropriate for your mobility, try a few comfortable walking or movement breaks and track whether they fit your day.",
            ["Daily steps", "Activity level"], "activity", 3)
    if sleep is not None and sleep < 7 and sleep_quality in {"poor", "fair", "bad"}:
        add("sleep_quality_duration", "Sleep quality and duration point to the same area",
            "You reported both shorter sleep duration and lower sleep quality.",
            "Looking at timing, interruptions, and regularity may be more useful than focusing on hours alone.",
            "For a week, note bedtime, wake time and interruptions; discuss persistent sleep difficulties with a clinician.",
            ["Sleep duration", "Sleep quality"], "sleep", 4)
    if smoking and smoking not in {"never", "no", "none", "non smoker", "non-smoker", "nonsmoker"} and ("current" in smoking or "daily" in smoking or smoking in {"yes", "smoker"}):
        add("smoking_activity", "Smoking can be relevant to your exercise and long-term goals",
            "Your profile indicates current smoking.",
            "Tobacco use affects cardiovascular health, and addressing it can be relevant even if your immediate goal is exercise or nutrition.",
            "If you're interested, ask a clinician about evidence-based quitting support that fits your preferences.",
            ["Smoking status", "Long-term health goals"], "activity", 4)
    # More profile fields: do not treat historical conditions or medications as current.
    systolic = number("systolic_bp")
    diastolic = number("diastolic_bp")
    non_hdl = number("non_hdl_cholesterol")
    family = text("family_health_history") if has_positive_entry(value("family_health_history")) else ""
    surgery = text("surgeries_procedures") if has_positive_entry(value("surgeries_procedures")) else ""
    med_history = text("medication_history") if has_positive_entry(value("medication_history")) else ""
    record_notes = text("health_record_notes") if has_positive_entry(value("health_record_notes")) else ""
    recovery = text("recovery_notes") if has_positive_entry(value("recovery_notes")) else ""
    longevity = text("longevity_goal") if has_positive_entry(value("longevity_goal")) else ""
    experience = text("exercise_experience")
    equipment_raw = value("available_equipment")
    equipment = [str(x).lower() for x in equipment_raw if str(x).strip()] if isinstance(equipment_raw, (list, tuple)) else []
    mobility = number("mobility_days_per_week")
    active_conditions = " ".join(text(f) for f in ("medical_conditions", "dietary_health_conditions") if has_positive_entry(value(f)))

    if systolic is not None and diastolic is not None and (systolic >= 130 or diastolic >= 80):
        add("bp_context", "Your blood-pressure readings are worth following up",
            f"Your entered blood pressure is {systolic:g}/{diastolic:g} mmHg.",
            "A single reading does not establish a diagnosis, but repeated elevated readings deserve attention. Food patterns, activity, and other factors may be relevant.",
            "If this was one reading, repeat it using proper technique and discuss the pattern with your clinician. Do not change medications based on this card.",
            ["Systolic blood pressure", "Diastolic blood pressure"], "heart", 5)
    if systolic is not None and diastolic is not None and (systolic >= 180 or diastolic >= 120):
        # Replace routine follow-up card with more urgent, context-appropriate guidance.
        items[:] = [x for x in items if x["id"] != "bp_context"]
        add("bp_urgent", "This blood-pressure reading needs prompt attention",
            f"You entered {systolic:g}/{diastolic:g} mmHg.",
            "Readings in this range can require urgent evaluation; symptoms and repeat measurements matter.",
            "Wait at least one minute and recheck. If still this high, seek immediate medical advice; call emergency services for chest pain, severe shortness of breath, weakness, vision changes, or other concerning symptoms.",
            ["Blood pressure"], "heart", 10)
    if non_hdl is not None and non_hdl >= 130:
        add("cholesterol_pattern", "Connect cholesterol results with your eating pattern",
            f"Your entered non-HDL cholesterol is {non_hdl:g} mg/dL.",
            "Non-HDL cholesterol can be one part of cardiovascular risk assessment, but targets vary with medical history and overall risk.",
            "Review this result with your clinician. Consider whether saturated-fat sources, fiber-rich foods, and activity habits offer realistic improvements that fit your diet.",
            ["Non-HDL cholesterol", "Dietary preference", "Diet quality"], "cholesterol", 5)
    if family:
        add("family_history", "Family history can change which prevention questions matter",
            "You entered family health history information.",
            "Family history may affect screening discussions even when you feel well, depending on the specific relatives, conditions, and ages at diagnosis.",
            "Record which relative had which condition and at what age, then ask your clinician whether screening timing or risk assessment should differ.",
            ["Family health history", "Prevention goals"], "family", 4)
    if surgery and (injuries or days >= 1):
        add("procedure_activity", "Past procedures may matter when adapting workouts",
            "You entered a surgery or procedure history and an exercise plan or limitation.",
            "Restrictions depend on the procedure, timing, healing, and current symptoms; a historical procedure alone does not imply ongoing limitations.",
            "Check whether any restrictions still apply before increasing exercise intensity or range of motion.",
            ["Surgeries / procedures", "Exercise plan"], "activity", 4)
    if med_history and not medication:
        add("medication_history_only", "Keep past and current medications separate",
            "You provided medication history but did not list current medication use.",
            "A past medication can provide context, but it should not be treated as something you currently take.",
            "Confirm that your current medication list is up to date and mention any relevant past treatment to your clinician when discussing new plans.",
            ["Medication history", "Current medications"], "nutrition", 2)
    if equipment and goal in {"build_muscle", "improve_fitness", "lose_weight"}:
        sample = ", ".join(equipment[:3])
        add("equipment_fit", "Use the equipment you actually have",
            f"You listed available equipment including {sample}.",
            "Matching a workout to available tools can make a plan more realistic and easier to repeat.",
            "Build your next workout around available equipment and select movements that do not aggravate your listed limitations.",
            ["Available equipment", "Exercise goal", "Injuries / limitations"], "activity", 3)
    if experience in {"beginner", "new", "novice"} and days >= 4:
        add("beginner_volume", "Your planned workout frequency may need gradual progression",
            f"You selected beginner experience and {days} planned workout days.",
            "A manageable starting workload and recovery can help maintain consistency; four days is not inherently unsafe.",
            "Start with tolerable sessions and monitor soreness and energy before increasing volume.",
            ["Exercise experience", "Workout days"], "activity", 4)
    if mobility is not None and mobility == 0 and (age >= 60 or injuries):
        add("mobility_routine", "A little mobility practice may complement your routine",
            "You reported no mobility days and also listed an age- or injury-related consideration.",
            "Comfortable mobility and balance activities may complement exercise, but the right movements depend on symptoms and abilities.",
            "Ask about safe, brief mobility exercises that fit your limitations rather than pushing into pain.",
            ["Mobility days", "Age / injuries"], "aging", 3)
    if recovery and days >= 3:
        add("recovery_notes", "Your recovery notes deserve a place in workout planning",
            "You recorded recovery information and planned multiple workouts each week.",
            "Patterns in fatigue, soreness, and training response can help guide scheduling, but the notes alone cannot diagnose a cause.",
            "Compare your recovery notes with workout intensity and sleep for a week, then adjust training if needed.",
            ["Recovery notes", "Workout days", "Sleep"], "activity", 3)
    if longevity:
        add("longevity_priority", "Make your long-term goal measurable",
            "You entered a personal longevity goal.",
            "Long-term goals become more useful when linked to practical, trackable habits rather than vague promises about lifespan.",
            "Choose one weekly measure related to your goal, such as consistent activity, balance practice, or sleep regularity.",
            ["Longevity goal", "Current activity"], "aging", 2)
    if record_notes:
        add("health_records_context", "Your health-record notes may contain useful follow-up questions",
            "You supplied additional health-record notes.",
            "Unstructured notes can include dates, test names, or recommendations that are not captured by standard profile fields; this engine does not diagnose or extract results from them.",
            "Review the notes for measurable results or clinician instructions and enter verified values in their corresponding fields when available.",
            ["Health record notes"], "family", 2)
    if injuries:
        if any(x in injuries for x in ("knee", "patella", "meniscus")):
            add("knee_adaptation", "Knee symptoms can guide your movement choices",
                "You specifically mentioned a knee-related limitation.",
                "Knee discomfort can vary by activity; it is more useful to track aggravating movements than to assume all exercise is unsuitable.",
                "Note which movements, depth, and duration provoke symptoms and discuss appropriate modifications with a physical therapist.",
                ["Knee limitation", "Exercise plan"], "activity", 5)
        elif any(x in injuries for x in ("shoulder", "rotator cuff")):
            add("shoulder_adaptation", "Shoulder symptoms may affect exercise selection",
                "You specifically mentioned a shoulder-related limitation.",
                "Some movement angles and loads may be more aggravating than others; this varies by cause.",
                "Track painful movements and seek individualized guidance before progressing upper-body loads.",
                ["Shoulder limitation", "Exercise plan"], "activity", 5)
        elif any(x in injuries for x in ("back", "lumbar", "spine")):
            add("back_adaptation", "Adapt training around your back symptoms",
                "You specifically mentioned a back-related limitation.",
                "Tolerance to exercise varies, and avoiding all movement is not automatically the best response.",
                "Track symptom triggers and ask a clinician or physical therapist about safe movement options, especially for worsening symptoms.",
                ["Back limitation", "Exercise plan"], "activity", 5)
    if not items:
        add("starting_point", "Look for one small change you can measure",
            "Your current profile does not yet suggest a specific high-priority cross-factor insight.",
            "A useful next step is to establish a baseline before making several changes at once.",
            "Track your sleep, activity, and a simple food habit for a week, then update your profile to uncover more specific patterns.",
            ["Current profile"], "activity", 1)
    if any(x["id"] in {"knee_adaptation", "shoulder_adaptation", "back_adaptation"} for x in items):
        items = [x for x in items if x["id"] != "injury_adaptation"]
    return sorted(items, key=lambda x: (-x["priority"], x["id"]))


# Processing helper: select insights. Keeps this logic reusable across API requests.
def select_insights(profile: Any, generate_response: Any = None) -> dict:
    candidates = generate_candidates(profile)
    # Logged food is provided to insight ranking as context; existing vetted cards remain the only sources.
    meals = getattr(profile, "meal_history", []) or []
    if meals:
        recent = sorted(meals, key=lambda m: m.date, reverse=True)[:30]
        meal_summary = [{"date": m.date, "type": m.type, "food": m.description[:120],
                         "calories": m.calories, "protein": m.protein} for m in recent]
    else:
        meal_summary = []
    selected = candidates[:3]
    method = "curated rules"
    # AI may prioritize ONLY existing vetted cards, not invent new claims or sources.
    if generate_response is not None and len(candidates) > 3:
        try:
            choices = [{"id": c["id"], "title": c["title"], "based_on": c["based_on"], "priority": c["priority"]} for c in candidates]
            prompt = ("Choose the three most useful distinct insights for this user from the candidate list. "
                      "Use only candidate IDs. Prioritize safety-critical constraints and actionable connections. "
                      "Return only JSON like {\"ids\":[\"id1\",\"id2\",\"id3\"]}. "
                      "Do not add claims or explanations. Actual meal history is user-reported, and missing nutrition numbers are unknown. Meal history: " + json.dumps(meal_summary) + ". Candidates: " + json.dumps(choices))
            response = generate_response(prompt, feature="Personalized insights", json_output=True)
            raw = (response.text or "").strip()
            match = re.search(r"\{.*\}", raw, flags=re.S)
            if match:
                ids = json.loads(match.group(0)).get("ids", [])
                by_id = {c["id"]: c for c in candidates}
                picked = []
                for key in ids:
                    if isinstance(key, str) and key in by_id and key not in [c["id"] for c in picked]:
                        picked.append(by_id[key])
                if len(picked) == 3 and all(c["id"] != "bp_urgent" for c in candidates if c["id"] not in [x["id"] for x in picked]):
                    selected = picked
                    method = "AI-ranked curated insights"
        except Exception as exc:
            print(f"Personalized insights using curated rules: {type(exc).__name__}")
    for item in selected:
        item.pop("priority", None)
    return {"status": "success", "insights": selected, "method": method,
            "note": "Research-informed suggestions from a curated reference list; not live literature search or diagnosis."}
