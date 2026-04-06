import json
import sys
from pathlib import Path

import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "symptom_disease_model.pkl"
DETAILS_PATH = MODELS_DIR / "disease_details.json"


GENERIC_DIETS = [
    "Stay hydrated with water, soups, and electrolyte-rich fluids.",
    "Choose light home-cooked meals with vegetables, dal, and fruits.",
    "Avoid oily, deep-fried, and very sugary foods during recovery.",
]

GENERIC_WORKOUTS = [
    "Take short, gentle walks (10-20 minutes) based on energy level.",
    "Do light stretching and mobility exercises once or twice daily.",
    "Practice deep breathing for 5-10 minutes to improve recovery.",
]


def load_artifacts():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run train_symptom_model.py first."
        )

    payload = joblib.load(MODEL_PATH)
    model = payload["model"]
    features = payload["features"]

    details = {}
    if DETAILS_PATH.exists():
        details = json.loads(DETAILS_PATH.read_text(encoding="utf-8"))

    return model, features, details


def to_binary(value):
    if isinstance(value, bool):
        return int(value)

    text = str(value or "").strip().lower()
    truthy = {"1", "true", "yes", "y", "present", "on"}
    return 1 if text in truthy else 0


def build_feature_row(features, payload):
    provided = payload.get("features") if isinstance(payload.get("features"), dict) else {}
    symptoms = payload.get("symptoms") if isinstance(payload.get("symptoms"), list) else []

    symptom_set = {str(item).strip().lower() for item in symptoms}

    row = {}
    for feature in features:
        key = feature.strip().lower()
        if key in provided:
            row[feature] = to_binary(provided.get(key))
        elif feature in provided:
            row[feature] = to_binary(provided.get(feature))
        else:
            row[feature] = 1 if key in symptom_set else 0

    return row


def top_predictions(model, frame, limit=3):
    if not hasattr(model, "predict_proba"):
        label = str(model.predict(frame)[0])
        return [{"disease": label, "confidence": None}]

    probs = model.predict_proba(frame)[0]
    labels = list(model.classes_)

    ranked = sorted(
        [
            {
                "disease": str(labels[index]),
                "confidence": float(probs[index]),
            }
            for index in range(len(labels))
        ],
        key=lambda item: item["confidence"],
        reverse=True,
    )

    return ranked[:limit]


def build_fallback_diets(selected_symptoms):
    symptom_set = set(selected_symptoms)
    suggestions = []

    if "diarrhea" in symptom_set or "vomiting" in symptom_set or "nausea" in symptom_set:
        suggestions.append("Use ORS, coconut water, khichdi, bananas, and toast for easy digestion.")

    if "fever" in symptom_set or "fatigue" in symptom_set:
        suggestions.append("Prefer warm fluids, protein-rich meals, and vitamin C foods.")

    if "cough" in symptom_set or "sore_throat" in symptom_set or "breathlessness" in symptom_set:
        suggestions.append("Take warm soups, ginger-tulsi tea, and avoid cold packaged drinks.")

    suggestions.extend(item for item in GENERIC_DIETS if item not in suggestions)
    return suggestions[:5]


def build_fallback_workouts(selected_symptoms):
    symptom_set = set(selected_symptoms)
    suggestions = []

    if "breathlessness" in symptom_set or "cough" in symptom_set:
        suggestions.append("Perform diaphragmatic breathing and pursed-lip breathing exercises.")

    if "body_pain" in symptom_set or "fatigue" in symptom_set:
        suggestions.append("Do low-impact stretching and avoid high-intensity workouts.")

    if "dizziness" in symptom_set or "fever" in symptom_set:
        suggestions.append("Prioritize rest and only do short slow walks after symptoms reduce.")

    suggestions.extend(item for item in GENERIC_WORKOUTS if item not in suggestions)
    return suggestions[:5]


def enrich_details(details, selected_symptoms):
    enriched = {
        "description": details.get("description") or "No details available for this disease.",
        "diets": details.get("diets") or [],
        "workouts": details.get("workouts") or [],
        "precautions": details.get("precautions") or [],
        "medications": details.get("medications") or [],
        "riskFactors": details.get("riskFactors") or [],
    }

    if len(enriched["diets"]) == 0:
        enriched["diets"] = build_fallback_diets(selected_symptoms)

    if len(enriched["workouts"]) == 0:
        enriched["workouts"] = build_fallback_workouts(selected_symptoms)

    return enriched


def run_prediction(payload):
    model, features, details = load_artifacts()
    row = build_feature_row(features, payload)

    frame = pd.DataFrame([row], columns=features)
    predicted = str(model.predict(frame)[0])

    predictions = top_predictions(model, frame)
    confidence = predictions[0]["confidence"] if predictions else None

    default_details = {
        "description": "No details available for this disease.",
        "diets": [],
        "workouts": [],
        "precautions": [],
        "medications": [],
        "riskFactors": [],
    }

    final_details = enrich_details(details.get(predicted, default_details), output_selected_symptoms := [key for key, value in row.items() if value == 1])

    output = {
        "predictedDisease": predicted,
        "confidence": confidence,
        "topPredictions": predictions,
        "selectedSymptoms": output_selected_symptoms,
        "details": final_details,
    }

    return output


if __name__ == "__main__":
    try:
        request_payload = json.load(sys.stdin)
        result = run_prediction(request_payload)
        print(json.dumps(result))
    except Exception as exc:
        print(json.dumps({"error": str(exc)}))
        sys.exit(1)
