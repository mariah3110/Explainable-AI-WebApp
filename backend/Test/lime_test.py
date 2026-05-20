import warnings
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

from lime.lime_tabular import LimeTabularExplainer

warnings.filterwarnings("ignore")



# Titanic Daten laden
df = pd.read_csv(
    "https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
)

df = df[['Survived', 'Pclass', 'Sex', 'Age', 'Fare']]

df['Age'] = df['Age'].fillna(df['Age'].median())
df['Sex'] = df['Sex'].map({'male': 0, 'female': 1})

X = df.drop("Survived", axis=1)
y = df["Survived"]

# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Modell
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

pred = model.predict(X_test)
acc = accuracy_score(y_test, pred)

print(f"\nModel Accuracy: {acc:.2%}")

# LIME
explainer = LimeTabularExplainer(
    training_data=np.array(X_train),
    feature_names=X.columns.tolist(),
    class_names=["Not Survived", "Survived"],
    mode="classification"
)

index = 5

exp = explainer.explain_instance(
    X_test.iloc[index].values,
    model.predict_proba,
    num_features=4
)

# Text schön ausgeben
print("\nLIME Explanation for Passenger:\n")

for feature, weight in exp.as_list():
    direction = "Positive" if weight > 0 else "Negative"
    print(f"{feature:25} {weight:+.3f} ({direction})")


# Eigenes Balkendiagramm
features = [x[0] for x in exp.as_list()]
weights = [x[1] for x in exp.as_list()]

colors = ['green' if w > 0 else 'red' for w in weights]

plt.figure(figsize=(10,5))
bars = plt.barh(features, weights, color=colors)

plt.axvline(0, color='black', linewidth=1)

plt.title("LIME Explanation - Why did model predict survival?")
plt.xlabel("Feature Influence")
plt.ylabel("Features")

plt.tight_layout()
plt.show()