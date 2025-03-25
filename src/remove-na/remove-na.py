import pandas as pd 

df = pd.read_csv("./../wgidataset.csv")

# Replace ".." with NaN, then drop rows with NaN values
df.replace("..", pd.NA, inplace=True)
df.dropna(inplace=True)

df.reset_index(drop=True, inplace=True)


df.to_csv("./cleaned_wgidataset.csv", index=False)

print(df.head())