import pandas as pd
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline


def prepare_dataset():
    data = load_wine(as_frame=True)

    X = data.data
    y = pd.Series(data.target)

    class_names = list(data.target_names)

    model = Pipeline([
        ("scaler", StandardScaler()),
        ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model.fit(X_train, y_train)

    X_test_encoded = model.named_steps["scaler"].transform(X_test)

    X_test_encoded_df = pd.DataFrame(
        X_test_encoded,
        columns=X.columns
    )

    return {
        "dataset_id": "wine",
        "name": "Wein",
        "description": "Vorhersage der Weinsorte anhand chemischer Eigenschaften.",
        "icon": "🍷",
        "model": model,
        "classifier": model.named_steps["classifier"],
        "X_train": X_train,
        "X_test": X_test,
        "X_test_encoded": X_test_encoded_df,
        "y_test": y_test.reset_index(drop=True),
        "class_names": class_names,
        "sample_ids": list(range(5))
    }