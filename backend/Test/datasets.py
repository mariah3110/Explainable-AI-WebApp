from sklearn.datasets import fetch_openml

data = fetch_openml(name="wine", version=1, as_frame=True)
df = data.frame.dropna()
print(df.head())


print(df.count())
print(len(df))