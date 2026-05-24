import pandas as pd
import shap

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Datensatz laden
data = load_wine()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = data.target

print("Datensatz geladen:", X.shape)

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Modell trainieren
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print("Modell trainiert")

# SHAP
explainer = shap.TreeExplainer(model)
shap_values = explainer(X_test)

print("SHAP Werte berechnet")

# Global
shap.plots.beeswarm(shap_values[:, :, 0])

# Lokal (funktioniert zuverlässig!)
index = 0
# shap.plots.waterfall(shap_values[index, :, 0])