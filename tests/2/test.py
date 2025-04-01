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



model = sm.OLS(y, X).fit(cov_type='HC3')


# Save the summary to a text file
with open("results.txt", "w") as f:
    f.write(model.summary().as_text())
summary_df = pd.DataFrame(model.summary().tables[1].data[1:], columns=model.summary().tables[1].data[0])
summary_df.to_csv("results.csv", index=False)

# Generate regression line
x_vals = np.linspace(df['estimate'].min(), df['estimate'].max(), 100)
y_vals = model.params[0] + model.params[1] * x_vals

# Normalize year values for colormap
norm = mcolors.Normalize(vmin=df['year'].min(), vmax=df['year'].max())
cmap = cm.viridis
colors = [cmap(norm(year)) for year in df['year']]

# Create scatter plot with color gradient based on year
plt.figure(figsize=(8, 6))
scatter = plt.scatter(df['estimate'], df['log_percapita'], c=df['year'], cmap='viridis', edgecolor='black', alpha=0.7)
plt.plot(x_vals, y_vals, color='red', linewidth=2, label="Regression line")

# Labels and title
plt.xlabel("Rule of Law Estimate")
plt.ylabel("Log of GDP per capita")
plt.title("Scatter Plot with Regression Line and Year Gradient")
plt.legend()
plt.colorbar(scatter, label='Year')
plt.grid(True)
plt.show()
