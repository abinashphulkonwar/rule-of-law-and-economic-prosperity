## Experimental Equation: Rule of Law & Economic Prosperity with Trade Openness as Control Variable by Grouping years

```Math
Groups =  [[2001, 2002, 2003, 2004, 2005, 2006], [2007, 2008, 2009, 2010, 2011, 2012],[2013, 2014, 2015, 2016, 2017, 2018], [2018, 2019, 2020, 2021, 2022, 2023]]
```

`2018` add twice in 3rd and 4th group, to have enough observation for model to find patterns

```Math
trade openness = (exports + imports) / GDP
```

```Math
ln(percapita) = β0 + β1 ⋅ RuleOfLaw + trade openness + β2 ⋅ Group + ε
```

Where:

- `ln(percapita)` = Natural logarithm of GDP per capita (dependent variable).
- `β0` = Intercept term.
- `β1` = Coefficient of **Rule of Law** (independent variable).
- `β2` = Coefficient of **Years** dummy variables
- `ε` = Error term (captures unobserved factors).

### Interpretation:

- If **β1 > 0** → Stronger rule of law is associated with higher economic prosperity.
- If **β1 < 0** → Rule of law negatively impacts economic prosperity.
- If **β1 is insignificant** → No strong evidence of a relationship.

🚀 _Future experiments will incorporate control variables (e.g., inequality, human capital) for deeper analysis._
