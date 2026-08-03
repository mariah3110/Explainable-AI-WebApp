from sklearn.datasets import fetch_openml, load_wine

data_penguins = fetch_openml(name="penguins", version=1, as_frame=True)
data_mushrooms = fetch_openml(name="mushroom", version=1, as_frame=True)
data_wine = fetch_openml(name="wine-quality-red", version=1, as_frame=True)

print("Penguins dataset:")
print(data_penguins.frame.head())
print("\nPenguins columns:")
print(data_penguins.frame.columns.tolist())

print("\nMushrooms dataset:")
print(data_mushrooms.frame.head())
print("\nMushrooms columns:")
print(data_mushrooms.frame.columns.tolist())

print("\nWine Quality dataset:")
print(data_wine.frame.head())
print("\nWine Quality columns:")
print(data_wine.frame.columns.tolist())

data_wine_sklearn = load_wine(as_frame=True)
print("\nWine dataset from sklearn:")
print(data_wine_sklearn.frame.head())
print("\nWine dataset columns:")
print(data_wine_sklearn.frame.columns.tolist())
