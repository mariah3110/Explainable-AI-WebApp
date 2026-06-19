"""
Berechnet echte SHAP-Werte fuer drei Datensaetze (Pinguine, Pilze, Wein),
trainiert je einen RandomForest und exportiert pro Datensatz:

  public/shap/<name>.png   -> fertiger SHAP-Bar-Plot (globale Feature-Importanz)
  public/shap/<name>.json  -> {"features": [{"feature": str, "importance": float}, ...]}

Einmal ausfuehren (mit Internetzugang fuer die Datensaetze):

  pip install scikit-learn shap pandas numpy matplotlib seaborn
  python generate_shap.py

Danach liegen die Dateien in ./public/shap/ und werden vom Frontend geladen.
"""

import json
import os

import matplotlib
matplotlib.use("Agg")  # kein Display noetig, nur Datei speichern
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import shap
from sklearn.datasets import load_wine, fetch_openml
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OrdinalEncoder

OUT_DIR = os.path.join("frontend", "data", "shap")
os.makedirs(OUT_DIR, exist_ok=True)


# ---------------------------------------------------------------------------
# Datensaetze laden -> (X als DataFrame, y, class_names)
# ---------------------------------------------------------------------------
def load_penguins():
    import seaborn as sns
    df = sns.load_dataset("penguins").dropna()
    y = df["species"].astype("category")
    X = df.drop(columns=["species"]).copy()
    # kategoriale Spalten (island, sex) in Zahlen umwandeln
    for col in X.select_dtypes(include="object").columns:
        X[col] = OrdinalEncoder().fit_transform(X[[col]])
    return X, y.cat.codes, list(y.cat.categories)


def load_mushrooms():
    # OpenML-Datensatz "mushroom" (alle Merkmale kategorial)
    data = fetch_openml("mushroom", version=1, as_frame=True)

    enc = OrdinalEncoder()
    X_encoded = enc.fit_transform(data.data)

    X = pd.DataFrame(
        X_encoded,
        columns=data.data.columns,
        index=data.data.index
    )

    y = data.target.astype("category")
    return X, y.cat.codes, ["essbar" if c == "e" else "giftig" for c in y.cat.categories]


def load_wine_ds():
    data = load_wine(as_frame=True)
    return data.data, data.target, list(data.target_names)


DATASETS = {
    "penguins": load_penguins,
    "mushrooms": load_mushrooms,
    "wine": load_wine_ds,
}


# ---------------------------------------------------------------------------
# SHAP-Werte robust zu "mittlerer Betrag pro Feature" zusammenfassen.
# shap.TreeExplainer liefert je nach Version/Klassenzahl unterschiedliche
# Formen zurueck -> hier alle Faelle abfangen.
# ---------------------------------------------------------------------------
def mean_abs_importance(shap_values):
    if isinstance(shap_values, list):  # Liste pro Klasse: [(n, features), ...]
        per_class = np.stack([np.abs(v).mean(axis=0) for v in shap_values], axis=0)
        return per_class.mean(axis=0)
    arr = np.abs(shap_values)
    if arr.ndim == 3:        # (n_samples, n_features, n_classes)
        return arr.mean(axis=(0, 2))
    return arr.mean(axis=0)  # (n_samples, n_features)


def process(name, loader):
    print(f"-> {name}")
    X, y, class_names = loader()

    # 1) RandomForest trainieren
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # 2) SHAP-Werte berechnen (exakt fuer Baum-Modelle)
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)

    # 3) PNG: klassischer Bar-Plot der globalen Feature-Importanz
    plt.figure()
    shap.summary_plot(
        shap_values, X, plot_type="bar",
        class_names=class_names, show=False,
    )
    plt.tight_layout()
    plt.savefig(os.path.join(OUT_DIR, f"{name}.png"), dpi=150, bbox_inches="tight")
    plt.close()

    # 4) JSON: mittlerer |SHAP| pro Feature, absteigend sortiert
    importance = mean_abs_importance(shap_values)
    rows = sorted(
        ({"feature": str(f), "importance": float(v)} for f, v in zip(X.columns, importance)),
        key=lambda r: r["importance"],
        reverse=True,
    )
    with open(os.path.join(OUT_DIR, f"{name}.json"), "w", encoding="utf-8") as fh:
        json.dump({"dataset": name, "classes": class_names, "features": rows}, fh,
                  ensure_ascii=False, indent=2)


if __name__ == "__main__":
    for name, loader in DATASETS.items():
        process(name, loader)
    print(f"Fertig. Dateien liegen in {OUT_DIR}/")