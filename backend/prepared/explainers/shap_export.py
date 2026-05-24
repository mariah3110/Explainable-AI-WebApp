import json
from pathlib import Path
import shap
import numpy as np


def export_shap(prepared, output_dir):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    classifier = prepared["classifier"]
    X_encoded = prepared["X_test_encoded"]
    sample_ids = prepared["sample_ids"]
    class_names = prepared["class_names"]

    explainer = shap.TreeExplainer(classifier)
    shap_values = explainer(X_encoded)

    global_values = np.abs(shap_values.values).mean(axis=(0, 2))

    shap_global = [
        {
            "feature": feature,
            "importance": float(value)
        }
        for feature, value in zip(X_encoded.columns, global_values)
    ]

    shap_global = sorted(
        shap_global,
        key=lambda item: item["importance"],
        reverse=True
    )

    with open(output_dir / "shap_global.json", "w", encoding="utf-8") as f:
        json.dump(shap_global, f, ensure_ascii=False, indent=2)

    shap_local = []

    for sample_id in sample_ids:
        prediction_index = int(classifier.predict(X_encoded.iloc[[sample_id]])[0])
        prediction_label = class_names[prediction_index]

        values = shap_values.values[sample_id, :, prediction_index]

        features = []

        for feature, feature_value, shap_value in zip(
            X_encoded.columns,
            X_encoded.iloc[sample_id].values,
            values
        ):
            features.append({
                "feature": feature,
                "value": float(feature_value),
                "impact": float(shap_value),
                "absImpact": float(abs(shap_value)),
                "direction": "positive" if shap_value >= 0 else "negative"
            })

        features = sorted(
            features,
            key=lambda item: item["absImpact"],
            reverse=True
        )[:10]

        shap_local.append({
            "sampleId": sample_id,
            "prediction": prediction_label,
            "features": features
        })

    with open(output_dir / "shap_local.json", "w", encoding="utf-8") as f:
        json.dump(shap_local, f, ensure_ascii=False, indent=2)