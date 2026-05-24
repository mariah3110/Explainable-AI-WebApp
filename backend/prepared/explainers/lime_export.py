import json
from pathlib import Path
from lime.lime_tabular import LimeTabularExplainer


def export_lime(prepared, output_dir):
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    model = prepared["model"]
    X_train = prepared["X_train"]
    X_test = prepared["X_test"]
    sample_ids = prepared["sample_ids"]
    class_names = prepared["class_names"]

    explainer = LimeTabularExplainer(
        training_data=X_train.values,
        feature_names=list(X_train.columns),
        class_names=class_names,
        mode="classification"
    )

    lime_local = []

    for sample_id in sample_ids:
        sample = X_test.iloc[sample_id]

        explanation = explainer.explain_instance(
            data_row=sample.values,
            predict_fn=model.predict_proba,
            num_features=10
        )

        prediction = model.predict(sample.to_frame().T)[0]

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