import json
from pathlib import Path

import numpy as np
import shap


def export_shap(prepared, output_dir):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    classifier = prepared["classifier"]
    X_encoded = prepared["X_test_encoded"]
    feature_names = prepared["feature_names_encoded"]

    sample_ids = prepared["sample_ids"]
    class_names = prepared["class_names"]

    explainer = shap.TreeExplainer(classifier)
    shap_values = explainer(X_encoded)

    # Globale SHAP-Werte
    global_values = np.abs(shap_values.values).mean(axis=(0, 2))

    shap_global = [
        {
            "feature": feature,
            "importance": float(value)
        }
        for feature, value in zip(feature_names, global_values)
    ]

    shap_global.sort(key=lambda x: x["importance"], reverse=True)

    with open(output_dir / "shap_global.json", "w", encoding="utf-8") as f:
        json.dump(shap_global, f, ensure_ascii=False, indent=2)

    # Lokale SHAP-Werte
    shap_local = []

    for sample_id in sample_ids:
        sample = X_encoded[sample_id].reshape(1, -1)

        prediction = classifier.predict(sample)[0]

        prediction_index = list(classifier.classes_).index(prediction)
        prediction_label = class_names[prediction_index]

        values = shap_values.values[sample_id, :, prediction_index]

        features = []

        for feature, feature_value, shap_value in zip(
            feature_names,
            X_encoded[sample_id],
            values
        ):
            features.append({
                "feature": feature,
                "value": float(feature_value),
                "impact": float(shap_value),
                "absImpact": float(abs(shap_value)),
                "direction": "positive" if shap_value >= 0 else "negative"
            })

        features.sort(key=lambda x: x["absImpact"], reverse=True)

        shap_local.append({
            "sampleId": sample_id,
            "prediction": prediction_label,
            "features": features[:10]
        })

    with open(output_dir / "shap_local.json", "w", encoding="utf-8") as f:
        json.dump(shap_local, f, ensure_ascii=False, indent=2)