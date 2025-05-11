import pandas as pd 
import matplotlib.pyplot as plt
import statsmodels.api as sm
from patsy import dmatrices
import numpy as np
import matplotlib.cm as cm
import matplotlib.colors as mcolors
from statsmodels.stats.outliers_influence import variance_inflation_factor





df = pd.read_csv("./rl-pci-control.csv")
df['log_percapita'] = np.log(df['per capita'])
df["trade_openness"] = (df["exports"] + df["imports"]) / df["gdp"]


test_range = []
for i in  range(23):
   temp = []
   isBreak = False
   for j in range(5):
      j+=1
      temp.append(i+j)
      if i+j == 23:
         isBreak= True
         break
   test_range.append(temp)
   if isBreak:
      break
results = []

index = 0
for r in test_range:
  index+=1
  years = []
  for i in r:
    # if i+2000 == 2023:
    #    print("2020 is not included in test")
    #    continue
    years.append(i+2000)
  
  filtered_df = df[df['year'].isin(years)]
  df_dummies = pd.get_dummies(filtered_df, columns=['year'], prefix='year', drop_first=True)  
  dummy_cols = ' + '.join(df_dummies.columns[df_dummies.columns.str.startswith('year_')])

  filtered_df['year_centered'] = filtered_df['year'] - filtered_df['year'].min()
  print(filtered_df["year_centered"])
  equation = f'log_percapita ~ estimate + trade_openness + year_centered'
  y, X = dmatrices(equation, data=filtered_df, return_type='dataframe')
  model = sm.OLS(y, X).fit(cov_type='HC3')
  coeffs = model.params
  results.append({
        "window": str(years[0]) + "-" + str(years[len(years) -1]),
        "rule_of_law": coeffs["estimate"],
        "year_1": coeffs.get("year_"+ str(years[0]),np.nan),
        "year_2": coeffs.get("year_"+ str(years[1]),np.nan),
        "year_3": coeffs.get("year_"+ str(years[2]),np.nan),
        "year_4": coeffs.get("year_"+ str(years[3]),np.nan),
        "year_5": coeffs.get("year_"+ str(years[4]),np.nan),
    })
  vif_data = pd.DataFrame({
    'variable': X.columns,
    'VIF': [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]
  })
  print(vif_data.sort_values('VIF', ascending=False))
  # Save the summary to a text file
  # fileName= "results-"+ str(index) +".txt"
  # with open(fileName, "w") as f:
  #     f.write(model.summary().as_text())
  # summary_df = pd.DataFrame(model.summary().tables[1].data[1:], columns=model.summary().tables[1].data[0])
 # print(index, "data size: 0.5 ", sm.stats.linear_rainbow(model))


  # dy_col = dummy_cols.split("+")
  # col_names = ["trade_openness"]
  # for x in dy_col:
  #   col_names.append(x.lstrip().rstrip())
  # sm.graphics.plot_partregress('log_percapita', 'estimate', col_names, data=df_dummies, obs_labels=False)
  # plt.savefig("plot-"+ str(index) +".png", dpi=300, bbox_inches='tight')

summary_df = pd.DataFrame(results)
print(summary_df)