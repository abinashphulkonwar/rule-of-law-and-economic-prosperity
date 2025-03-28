import pandas as pd 
import matplotlib.pyplot as plt


df = pd.read_csv("./cleaned_wgidataset.csv")

df["year"] = pd.to_numeric(df["year"])

df_sorted = df.sort_values(by=["countryname", "year"], ascending=[True, True])

df_sorted.reset_index(drop=True, inplace=True)
df_sorted= df_sorted[df_sorted["indicator"] == "rl"]
df_sorted.reset_index(drop=True, inplace=True)

df_sorted.to_csv("./rl.csv", index=False)
