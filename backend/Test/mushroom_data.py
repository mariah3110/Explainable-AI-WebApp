import pandas as pd
import shap
import matplotlib.pyplot as plt

from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

FEATURE_NAMES_DE = {
    "odor": "Geruch",
    "gill-size": "Lamellengröße",
    "gill-color": "Lamellenfarbe",
    "spore-print-color": "Sporenabdruck-Farbe",
    "stalk-surface-above-ring": "Stieloberfläche über dem Ring",
    "stalk-surface-below-ring": "Stieloberfläche unter dem Ring",
    "ring-type": "Ringtyp",
    "population": "Vorkommen",
    "gill-spacing": "Lamellenabstand",
    "bruises%3F": "Druckstellen",
}

VALUE_NAMES_DE = {
    "odor": {
        "n": "kein Geruch",
        "f": "faulig",
        "p": "scharf",
        "a": "mandelartig",
        "l": "anisartig",
        "c": "creosotartig",
        "y": "fischig",
        "s": "würzig",
        "m": "muffig",
    },
    "gill-size": {
        "n": "schmal",
        "b": "breit",
    },
    "gill-color": {
        "b": "gelbbraun",
        "n": "braun",
        "g": "grau",
        "p": "rosa",
        "w": "weiß",
        "h": "schokoladenbraun",
        "k": "schwarz",
        "u": "violett",
        "e": "rot",
        "y": "gelb",
        "o": "orange",
        "r": "grün",
    },
    "spore-print-color": {
        "h": "schokoladenbraun",
        "w": "weiß",
        "n": "braun",
        "k": "schwarz",
        "r": "grün",
        "u": "violett",
        "o": "orange",
        "y": "gelb",
        "b": "gelbbraun",
    },
    "population": {
        "v": "mehrere dicht zusammen",
        "y": "verstreut",
        "s": "einzeln",
        "n": "zahlreich",
        "a": "vereinzelt",
        "c": "gehäuft",
    },
}

# ------------------------------------------------------------
# 1. Datensatz laden
# ------------------------------------------------------------

# Mushroom-Datensatz von OpenML laden
# Ziel: Klassifikation, ob ein Pilz essbar oder giftig ist
mushroom_data = fetch_openml(name="mushroom", version=1, as_frame=True)

# Features = Eigenschaften der Pilze
features = mushroom_data.data

# Labels = Zielklasse, z. B. edible / poisonous
labels = mushroom_data.target

print("Datensatz geladen:", features.shape)


# ------------------------------------------------------------
# 2. Trainings- und Testdaten erstellen
# ------------------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    features,
    labels,
    test_size=0.2,
    random_state=42,
    stratify=labels
)


# ------------------------------------------------------------
# 3. Kategorische Daten vorbereiten
# ------------------------------------------------------------

# Der Mushroom-Datensatz besteht aus kategorischen Textwerten,
# z. B. odor = f oder cap-color = k.
# Machine-Learning-Modelle brauchen aber Zahlen.
# Deshalb verwenden wir One-Hot-Encoding.
categorical_features = features.columns

preprocessor = ColumnTransformer(
    transformers=[
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore", sparse_output=False),
            categorical_features
        )
    ]
)


# ------------------------------------------------------------
# 4. Modell erstellen und trainieren
# ------------------------------------------------------------

# Pipeline:
# 1. Textwerte in Zahlen umwandeln
# 2. Random-Forest-Modell trainieren
model = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(
        n_estimators=100,
        random_state=42
    ))
])

model.fit(X_train, y_train)

print("Modell trainiert")
print("Testgenauigkeit:", model.score(X_test, y_test))


# ------------------------------------------------------------
# 5. Daten für SHAP vorbereiten
# ------------------------------------------------------------

# Testdaten mit demselben Encoder transformieren
X_test_encoded = model.named_steps["preprocessor"].transform(X_test)

# Feature-Namen nach dem One-Hot-Encoding holen
encoded_feature_names = model.named_steps["preprocessor"].get_feature_names_out()

# Feature-Namen schöner lesbar machen
# Beispiel:
# cat__odor_f  ->  odor = f
def make_readable_feature_name(encoded_name):
    # Beispiel: cat__odor_n -> odor_n
    name = encoded_name.replace("cat__", "")

    # Feature und Wert trennen
    feature, value = name.rsplit("_", 1)

    feature_de = FEATURE_NAMES_DE.get(feature, feature)
    value_de = VALUE_NAMES_DE.get(feature, {}).get(value, value)

    return f"{feature_de}: {value_de}"


clean_feature_names = [
    make_readable_feature_name(name)
    for name in encoded_feature_names
]

# In DataFrame umwandeln, damit SHAP sinnvolle Feature-Namen anzeigen kann
X_test_encoded_df = pd.DataFrame(
    X_test_encoded,
    columns=clean_feature_names
)

# Das eigentliche Random-Forest-Modell aus der Pipeline holen
rf_model = model.named_steps["classifier"]


# ------------------------------------------------------------
# 6. SHAP-Werte berechnen
# ------------------------------------------------------------

explainer = shap.TreeExplainer(rf_model)
shap_values = explainer(X_test_encoded_df)

print("SHAP-Werte berechnet")


# ------------------------------------------------------------
# 7. Globaler SHAP-Plot
# ------------------------------------------------------------

# Zeigt, welche Merkmale insgesamt am wichtigsten für das Modell sind
shap.plots.bar(shap_values[:, :, 0], max_display=15, show=False)
plt.tight_layout()
plt.savefig("global_shap_plot.png", dpi=200, bbox_inches="tight")
plt.close()


# ------------------------------------------------------------
# 8. Lokale Erklärung für einen einzelnen Pilz
# ------------------------------------------------------------

# Index des Pilzes, der erklärt werden soll
index = 0

print("\nAusgewählter Pilz:")
print(X_test.iloc[index])

print("\nEchte Klasse:", y_test.iloc[index])
print("Vorhersage:", model.predict(X_test.iloc[[index]])[0])


# Waterfall-Plot:
# Zeigt, welche Merkmale die Entscheidung für diesen einen Pilz beeinflussen
shap.plots.waterfall(shap_values[index, :, 0], max_display=15, show=False)
plt.tight_layout()
plt.savefig("local_shap_waterfall.png", dpi=200, bbox_inches="tight")
plt.close()


# ------------------------------------------------------------
# 9. Top-Gründe als Tabelle für Webapp
# ------------------------------------------------------------

# Für eine Webapp ist eine Tabelle oft verständlicher als ein SHAP-Plot.
# Hier werden nur aktive One-Hot-Features betrachtet, also Werte mit 1.
single_shap = pd.DataFrame({
    "Feature": clean_feature_names,
    "SHAP-Wert": shap_values.values[index, :, 0],
    "Feature-Wert": X_test_encoded_df.iloc[index].values
})

# Nur Merkmale anzeigen, die beim ausgewählten Pilz tatsächlich aktiv sind
single_shap = single_shap[single_shap["Feature-Wert"] == 1]

# Nach Einfluss sortieren
single_shap["Absoluter SHAP-Wert"] = single_shap["SHAP-Wert"].abs()

top_features = single_shap.sort_values(
    "Absoluter SHAP-Wert",
    ascending=False
).head(10)

print("\nWichtigste Gründe für die Vorhersage:")
print(top_features[["Feature", "SHAP-Wert"]])