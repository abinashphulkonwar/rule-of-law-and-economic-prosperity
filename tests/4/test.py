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


test_range = [[1,2,3,4,5,6], [7,8,9,10,11,12],[13,14,15, 16,17,18], [18,19,20,21,22, 23]]
index = 0
for r in test_range:
  index+=1
  years = []
  for i in r:
    # if i+2000 == 2020:
    #    print("2020 is not included in test")
    #    continue
    years.append(i+2000)
  
  filtered_df = df[df['year'].isin(years)]
  df_dummies = pd.get_dummies(filtered_df, columns=['year'], prefix='year', drop_first=True)  
  dummy_cols = ' + '.join(df_dummies.columns[df_dummies.columns.str.startswith('year_')])


  equation = f'log_percapita ~ estimate + trade_openness + {dummy_cols}'
  y, X = dmatrices(equation, data=df_dummies, return_type='dataframe')
  model = sm.OLS(y, X).fit(cov_type='HC3')

  # Save the summary to a text file
  fileName= "results-"+ str(index) +".txt"
  with open(fileName, "w") as f:
      f.write(model.summary().as_text())
  summary_df = pd.DataFrame(model.summary().tables[1].data[1:], columns=model.summary().tables[1].data[0])
  print("data size: 0.5 ", sm.stats.linear_rainbow(model))


  dy_col = dummy_cols.split("+")
  col_names = ["trade_openness"]
  for x in dy_col:
    col_names.append(x.lstrip().rstrip())
  sm.graphics.plot_partregress('log_percapita', 'estimate', col_names, data=df_dummies, obs_labels=False)
  plt.savefig("plot-"+ str(index) +".png", dpi=300, bbox_inches='tight')