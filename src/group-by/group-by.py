import pandas as pd 
import matplotlib.pyplot as plt


df = pd.read_csv("./cleaned_wgidataset.csv")

df["year"] = pd.to_numeric(df["year"])

df_sorted = df.sort_values(by=["countryname", "year"], ascending=[True, True])

df_sorted.reset_index(drop=True, inplace=True)
