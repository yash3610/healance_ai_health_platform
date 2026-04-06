import ast
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

DATASET_PATH = BASE_DIR / "disease_dataset_1500_rows.csv"
DESCRIPTION_PATH = BASE_DIR / "updated_description_dataset.csv"
DIET_PATH = BASE_DIR / "diets.csv"
WORKOUT_PATH = BASE_DIR / "workout.csv"
PRECAUTION_PATH = BASE_DIR / "updated_precautions_dataset.csv"
MEDICATION_PATH = BASE_DIR / "medications.csv"
RISK_FACTORS_PATH = BASE_DIR / "disease_riskFactors.csv"

MODEL_PATH = MODELS_DIR / "symptom_disease_model.pkl"
DETAILS_PATH = MODELS_DIR / "disease_details.json"
METRICS_PATH = MODELS_DIR / "training_metrics.json"


def normalize_disease_name(value: str) -> str:
    return str(value or "").strip().lower()


def read_csv_with_fallback(path: Path) -> pd.DataFrame:
    try:
        return pd.read_csv(path)
    except UnicodeDecodeError:
        return pd.read_csv(path, encoding="latin1")


def parse_list_cell(value):
    if pd.isna(value):
        return []

    text = str(value).strip()
    if not text:
        return []

    try:
        parsed = ast.literal_eval(text)
        if isinstance(parsed, list):
            return [str(item).strip() for item in parsed if str(item).strip()]
    except Exception:
        pass

    if text.startswith("[") and text.endswith("]"):
        text = text[1:-1]

    return [item.strip(" ' \"") for item in text.split(",") if item.strip(" ' \"")]


def load_symptom_dataset():
    df = pd.read_csv(DATASET_PATH)
    df.columns = [col.strip() for col in df.columns]

    symptom_columns = [col for col in df.columns if col != "disease"]
    if not symptom_columns:
        raise ValueError("No symptom columns found in dataset")

    for col in symptom_columns:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype(int)

    df["disease"] = df["disease"].astype(str).str.strip()
    df = df[df["disease"] != ""]

    if df.empty:
        raise ValueError("Dataset has no usable rows after cleaning")

    return df, symptom_columns


def build_disease_details(known_diseases):
    details = {
        disease: {
            "description": "",
            "diets": [],
            "workouts": [],
            "precautions": [],
            "medications": [],
            "riskFactors": [],
        }
        for disease in known_diseases
    }

    name_to_original = {normalize_disease_name(name): name for name in known_diseases}

    # Description
    if DESCRIPTION_PATH.exists():
        desc_df = read_csv_with_fallback(DESCRIPTION_PATH)
        for _, row in desc_df.iterrows():
            key = normalize_disease_name(row.get("disease"))
            if key in name_to_original:
                original = name_to_original[key]
                details[original]["description"] = str(row.get("description") or "").strip()

    # Diet
    if DIET_PATH.exists():
        diet_df = read_csv_with_fallback(DIET_PATH)
        for _, row in diet_df.iterrows():
            key = normalize_disease_name(row.get("Disease"))
            if key in name_to_original:
                original = name_to_original[key]
                details[original]["diets"] = parse_list_cell(row.get("Diet"))

    # Workout
    if WORKOUT_PATH.exists():
        workout_df = read_csv_with_fallback(WORKOUT_PATH)
        for _, row in workout_df.iterrows():
            key = normalize_disease_name(row.get("Disease"))
            if key in name_to_original:
                original = name_to_original[key]
                details[original]["workouts"] = parse_list_cell(row.get("Workouts"))

    # Precautions
    if PRECAUTION_PATH.exists():
        prec_df = read_csv_with_fallback(PRECAUTION_PATH)
        for _, row in prec_df.iterrows():
            key = normalize_disease_name(row.get("disease"))
            if key in name_to_original:
                original = name_to_original[key]
                values = [
                    str(row.get("precaution_1") or "").strip(),
                    str(row.get("precaution_2") or "").strip(),
                    str(row.get("precaution_3") or "").strip(),
                    str(row.get("precaution_4") or "").strip(),
                ]
                details[original]["precautions"] = [value for value in values if value]

    # Medications
    if MEDICATION_PATH.exists():
        meds_df = read_csv_with_fallback(MEDICATION_PATH)
        for _, row in meds_df.iterrows():
            key = normalize_disease_name(row.get("Disease"))
            if key in name_to_original:
                original = name_to_original[key]
                details[original]["medications"] = parse_list_cell(row.get("Medication"))

    # Risk factors (best-effort match against DNAME)
    if RISK_FACTORS_PATH.exists():
        risks_df = read_csv_with_fallback(RISK_FACTORS_PATH)
        for _, row in risks_df.iterrows():
            key = normalize_disease_name(row.get("DNAME"))
            if key in name_to_original:
                original = name_to_original[key]
                risks_text = str(row.get("RISKFAC") or "").strip()
                details[original]["riskFactors"] = parse_list_cell(risks_text)
                if not details[original]["riskFactors"] and risks_text:
                    details[original]["riskFactors"] = [
                        item.strip() for item in risks_text.split(",") if item.strip()
                    ]

    return details


def train_best_model(X_train, y_train):
    candidates = {
        "random_forest": RandomForestClassifier(
            n_estimators=500,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42,
            n_jobs=-1,
        ),
        "extra_trees": ExtraTreesClassifier(
            n_estimators=600,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42,
            n_jobs=-1,
        ),
        "logistic_regression": Pipeline(
            steps=[
                ("scaler", StandardScaler()),
                (
                    "model",
                    LogisticRegression(
                        max_iter=2500,
                        class_weight="balanced",
                        random_state=42,
                    ),
                ),
            ]
        ),
    }

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

    best_name = None
    best_model = None
    best_cv_score = -1.0

    for name, model in candidates.items():
        scores = cross_val_score(model, X_train, y_train, cv=cv, scoring="f1_weighted", n_jobs=-1)
        mean_score = float(scores.mean())
        if mean_score > best_cv_score:
            best_cv_score = mean_score
            best_name = name
            best_model = model

    best_model.fit(X_train, y_train)
    return best_name, best_model, best_cv_score


def main():
    df, symptom_columns = load_symptom_dataset()

    X = df[symptom_columns]
    y = df["disease"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    best_name, best_model, best_cv_f1 = train_best_model(X_train, y_train)

    y_pred = best_model.predict(X_test)
    test_accuracy = float(accuracy_score(y_test, y_pred))
    test_f1 = float(f1_score(y_test, y_pred, average="weighted"))

    classes = list(best_model.classes_) if hasattr(best_model, "classes_") else sorted(y.unique())
    disease_details = build_disease_details(classes)

    model_payload = {
        "model": best_model,
        "features": symptom_columns,
        "classes": classes,
    }
    joblib.dump(model_payload, MODEL_PATH)

    DETAILS_PATH.write_text(json.dumps(disease_details, indent=2), encoding="utf-8")

    metrics = {
        "selected_model": best_name,
        "records": int(len(df)),
        "features": len(symptom_columns),
        "classes": len(classes),
        "cv_f1_weighted": round(best_cv_f1, 4),
        "test_accuracy": round(test_accuracy, 4),
        "test_f1_weighted": round(test_f1, 4),
        "classification_report": classification_report(y_test, y_pred, output_dict=True),
    }

    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
