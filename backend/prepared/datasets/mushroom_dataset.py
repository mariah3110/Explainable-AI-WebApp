import pandas as pd
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


def prepare_dataset():
    data = fetch_openml(name="mushroom", version=1, as_frame=True)

    X = data.data
    y = data.target

    class_names = sorted(y.unique())

    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), X.columns)
    ])

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model.fit(X_train, y_train)

    X_train_encoded = model.named_steps["preprocessor"].transform(X_train)
    X_test_encoded = model.named_steps["preprocessor"].transform(X_test)

    feature_names = model.named_steps["preprocessor"].get_feature_names_out()

    clean_feature_names = [
        name.replace("cat__", "").replace("_", " = ")
        for name in feature_names
    ]

    return {
        "dataset_id": "mushroom",
        "name": "Pilze",
        "description": "Vorhersage, ob ein Pilz essbar oder giftig ist.",
        "icon": "🍄",
        "model": model,
        "classifier": model.named_steps["classifier"],
        "X_train": X_train,
        "X_test": X_test,
        "X_train_encoded": X_train_encoded,
        "X_test_encoded": X_test_encoded,
        "feature_names_encoded": clean_feature_names,
        "y_test": y_test.reset_index(drop=True),
        "class_names": class_names,
        "sample_ids": list(range(5))
    }