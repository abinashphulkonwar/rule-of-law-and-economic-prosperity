import pandas as pd 
import matplotlib.pyplot as plt
import statsmodels.api as sm
from patsy import dmatrices
import numpy as np


df = pd.read_csv("./rl-pci.csv")

df['log_percapita'] = np.log(df['percapita'])

df_dummies = pd.get_dummies(df, columns=['year'], prefix='year', drop_first=True)  
dummy_cols = ' + '.join(df_dummies.columns[df_dummies.columns.str.startswith('year_')])



equation = f'log_percapita ~ estimate'


y, X = dmatrices(equation, data=df_dummies, return_type='dataframe')



model = sm.OLS(y, X).fit(cov_type='HC3')


# Save the summary to a text file
with open("results.md", "w") as f:
    f.write(model.summary().as_text())
summary_df = pd.DataFrame(model.summary().tables[1].data[1:], columns=model.summary().tables[1].data[0])
summary_df.to_csv("results.csv", index=False)


