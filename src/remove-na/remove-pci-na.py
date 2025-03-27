import pandas as pd 
import numpy as np
df = pd.read_csv("./pci.csv")
print(df.head())
years = np.arange(1960, 1990)
years = np.append(years, [2024])
for year in years:
    df.drop(str(year), axis=1, inplace=True)

df.dropna(inplace=True)
print(df)
df.to_csv("./pci-clean.csv", index=False)

