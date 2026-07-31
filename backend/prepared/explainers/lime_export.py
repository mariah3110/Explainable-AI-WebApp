import json
from pathlib import Path

from lime.lime_tabular import LimeTabularExplainer


def export_lime(prepared, output_dir):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    classifier = prepared["classifier"]
    X_train = prepared["X_train_encoded"]
    X_test = prepared["X_test_encoded"]
    feature_names = prepared["feature_names_encoded"]

    sample_ids = prepared["sample_ids"]
    class_names = prepared["class_names"]

    explainer = LimeTabularExplainer(
        training_data=X_train,
        feature_names=feature_names,
        class_names=class_names,
        mode="classification",
        discretize_continuous=True
    )

    lime_local = []

    for sample_id in sample_ids:
        sample = X_test[sample_id]

        explanation = explainer.explain_instance(
            data_row=sample,
            predict_fn=classifier.predict_proba,
            num_features=10
        )

        prediction = classifier.predict(sample.reshape(1, -1))[0]

        features = []

        for feature, weight in explanation.as_list():
            features.append({
                "feature": feature,
                "weight": float(weight),
                "absWeight": float(abs(weight)),
                "direction": "positive" if weight >= 0 else "negative"
            })

        lime_local.append({
            "sampleId": sample_id,
            "prediction": str(prediction),
            "features": features
        })

    with open(output_dir / "lime_local.json", "w", encoding="utf-8") as f:
        json.dump(lime_local, f, ensure_ascii=False, indent=2)