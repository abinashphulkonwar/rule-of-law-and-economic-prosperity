import pandas as pd 
import matplotlib.pyplot as plt
import statsmodels.api as sm
from patsy import dmatrices
import numpy as np
import matplotlib.cm as cm
import matplotlib.colors as mcolors


df = pd.read_csv("./rl-pci.csv")

df['log_percapita'] = np.log(df['percapita'])

df_dummies = pd.get_dummies(df, columns=['year'], prefix='year', drop_first=True)  
dummy_cols = ' + '.join(df_dummies.columns[df_dummies.columns.str.startswith('year_')])


equation = f'log_percapita ~ estimate + {dummy_cols}'


y, X = dmatrices(equation, data=df_dummies, return_type='dataframe')
