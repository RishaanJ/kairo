# deterioration.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib

# Step 1: Load the dataset
df = pd.read_csv("icu_deterioration_dataset.csv")

# Step 2: Preprocess the data
# Drop 'subject_id' (which is not needed for model training) and the target column 'deterioration'
X = df.drop(columns=["deterioration", "subject_id"])  # Features
y = df["deterioration"]  # Target (whether deterioration happened or not)

# Step 3: Split the dataset into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Train the Logistic Regression model
model = LogisticRegression(max_iter=1000)  # You can adjust max_iter if needed
model.fit(X_train, y_train)

# Step 5: Save the trained model to a file
joblib.dump(model, "icu_deterioration_model.pkl")

print("Model has been trained and saved as 'icu_deterioration_model.pkl'!")
