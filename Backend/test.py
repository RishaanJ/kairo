# test.py

import joblib
import pandas as pd

# Step 1: Load the saved model
model = joblib.load("icu_deterioration_model.pkl")
print("Model loaded successfully!")

# Step 2: Prepare the test data (remove subject_id)
test_data = {
    "subject_id": [1],  # Sample patient IDs
    "los": [5],  # Length of stay (example values)
    "heart_rate": [115],  # Heart rate (example values)
    "blood_pressure": 85,  # Blood pressure (example values)
    "oxygen_saturation": [92],  # Oxygen saturation (example values)
}

test_df = pd.DataFrame(test_data)

# Drop 'subject_id' since it was not used in model training
X_test_sample = test_df.drop(columns=["subject_id"])

# Step 3: Get predicted probabilities
probabilities = model.predict_proba(X_test_sample)

# Classification based on probability
def classify_deterioration(probability):
    if probability >= 0.7:
        return "red"  # High risk
    elif probability >= 0.4 and probability < 0.7:
        return "yellow"  # Medium risk
    else:
        return "green"  # Low risk

# Step 4: Display predictions, probabilities, and classifications
print("Predictions and Classifications:")
for i, prob in enumerate(probabilities):
    print(f"Patient {test_df['subject_id'][i]} predicted deterioration: {'Yes' if prob[1] > 0.5 else 'No'}")
    print(f"Probability of deterioration: {prob[1]:.2f}")
    risk_class = classify_deterioration(prob[1])  # prob[1] is the probability of deterioration
    print(f"Classification: {risk_class}")
    print("-------------")
