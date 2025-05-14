import pandas as pd 
import matplotlib.pyplot as plt
import statsmodels.api as sm
from patsy import dmatrices
import numpy as np
import matplotlib.cm as cm
import matplotlib.colors as mcolors




df = pd.read_csv("./rl-pci-control.csv")

df['log_percapita'] = np.log(df['per capita'])
df["trade_openness"] = (df["exports"] + df["imports"]) / df["gdp"]
df["log_fdi"] = np.where(df["Foreign direct investment, net inflows (BoP, current US$)"] == 0, 1,  np.log(df["Foreign direct investment, net inflows (BoP, current US$)"]))
df_dummies_years = pd.get_dummies(df, columns=['year'], prefix='year', drop_first=True)  
df_dummies = pd.get_dummies(df_dummies_years, columns=["code"], prefix="code", drop_first=True)
dummy_cols = ' + '.join(df_dummies.columns[df_dummies.columns.str.startswith('year_')])
country_dummy_cols = ' + '.join(df_dummies.columns[df_dummies.columns.str.startswith('code_')])


equation = f'log_percapita ~ estimate + trade_openness + gross_capital_formation_of_gdp + log_fdi +  {country_dummy_cols}  + {dummy_cols} '


y, X = dmatrices(equation, data=df_dummies, return_type='dataframe')


model = sm.OLS(y, X).fit(cov_type='HC3')


# Save the summary to a text file
with open("results.txt", "w") as f:
    f.write(model.summary().as_text())
summary_df = pd.DataFrame(model.summary().tables[1].data[1:], columns=model.summary().tables[1].data[0])
summary_df.to_csv("results.csv", index=False)


print("data size: 0.5 ", sm.stats.linear_rainbow(model))


dy_col = dummy_cols.split("+")
col_names = ["trade_openness"]
for x in dy_col:
  col_names.append(x.lstrip().rstrip())
sm.graphics.plot_partregress('log_percapita', 'estimate', col_names, data=df_dummies, obs_labels=False)
plt.savefig("figure_1.png", dpi=300, bbox_inches='tight')