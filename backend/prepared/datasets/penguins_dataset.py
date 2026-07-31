from sklearn.compose import ColumnTransformer
from sklearn.datasets import fetch_openml
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


def prepare_dataset():
    data = fetch_openml(name="penguins", version=1, as_frame=True)

    df = data.frame.dropna()

    y = df["species"]
    X = df.drop(columns=["species"])

    class_names = sorted(y.unique())

    categorical_features = X.select_dtypes(include=["category", "object"]).columns
    numeric_features = X.select_dtypes(include=["number"]).columns

    preprocessor = ColumnTransformer([
        ("num", StandardScaler(), numeric_features),
        ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
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
        name.replace("num__", "").replace("cat__", "").replace("_", " = ")
        for name in feature_names
    ]

    return {
        "dataset_id": "penguins",
        "name": "Pinguine",
        "description": "Vorhersage der Pinguinart anhand von Körpermaßen.",
        "icon": "🐧",
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