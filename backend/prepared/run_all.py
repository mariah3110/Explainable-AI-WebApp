import json
from pathlib import Path

from datasets.mushroom_dataset import prepare_dataset as prepare_mushroom
from datasets.penguins_dataset import prepare_dataset as prepare_penguins
from datasets.wine_dataset import prepare_dataset as prepare_wine

from explainers.shap_export import export_shap
from explainers.lime_export import export_lime


OUTPUT_ROOT = Path("../../frontend/public/data")


def export_metadata(prepared, output_dir):
    metadata = {
        "id": prepared["dataset_id"],
        "name": prepared["name"],
        "description": prepared["description"],
        "icon": prepared["icon"],
        "classes": prepared["class_names"]
    }

    with open(output_dir / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)


def export_samples(prepared, output_dir):
    X_test = prepared["X_test"].reset_index(drop=True)
    y_test = prepared["y_test"]
    model = prepared["model"]
    sample_ids = prepared["sample_ids"]

    samples = []

    for sample_id in sample_ids:
        sample = X_test.iloc[sample_id]
        prediction = model.predict(sample.to_frame().T)[0]
        probabilities = model.predict_proba(sample.to_frame().T)[0]

        samples.append({
            "sampleId": sample_id,
            "title": f"Beispiel {sample_id + 1}",
            "trueClass": str(y_test.iloc[sample_id]),
            "predictedClass": str(prediction),
            "probability": float(max(probabilities)),
            "features": {
                str(key): str(value)
                for key, value in sample.to_dict().items()
            }
        })

    with open(output_dir / "samples.json", "w", encoding="utf-8") as f:
        json.dump(samples, f, ensure_ascii=False, indent=2)


def run_dataset(prepare_function):
    prepared = prepare_function()

    dataset_id = prepared["dataset_id"]
    output_dir = OUTPUT_ROOT / dataset_id
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Exportiere Datensatz: {dataset_id}")

    export_metadata(prepared, output_dir)
    export_samples(prepared, output_dir)
    export_shap(prepared, output_dir)
    export_lime(prepared, output_dir)

    return {
        "id": prepared["dataset_id"],
        "name": prepared["name"],
        "description": prepared["description"],
        "icon": prepared["icon"]
    }


def main():
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

    datasets = []

    datasets.append(run_dataset(prepare_mushroom))
    datasets.append(run_dataset(prepare_penguins))
    datasets.append(run_dataset(prepare_wine))

    with open(OUTPUT_ROOT / "datasets.json", "w", encoding="utf-8") as f:
        json.dump(datasets, f, ensure_ascii=False, indent=2)

    print("Alle Exporte abgeschlossen.")


if __name__ == "__main__":
    main()