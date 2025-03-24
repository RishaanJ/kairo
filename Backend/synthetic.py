import random
import pandas as pd
import time


def generate_icu_data():
    # Generate synthetic patient data with random vital signs
    heart_rate = random.randint(60, 120)  # Heart rate between 60 and 120 bpm
    blood_pressure_systolic = random.randint(90, 180)  # Systolic BP between 90 and 180 mmHg
    blood_pressure_diastolic = random.randint(60, 120)  # Diastolic BP between 60 and 120 mmHg
    oxygen_saturation = random.randint(85, 100)  # SpO2 between 85% and 100%
    temperature = round(random.uniform(36.0, 39.0), 1)  # Temperature between 36.0 and 39.0 C
    respiratory_rate = random.randint(12, 24)  # Respiration rate between 12 and 24 bpm
    los = random.uniform(1, 10)  # Length of stay in ICU, between 1 and 10 days

    # Simulate deterioration based on random chance (for simplicity)
    deterioration = random.random() > 0.7  # 30% chance of deterioration based on vitals

    return {
        "heart_rate": heart_rate,
        "blood_pressure_systolic": blood_pressure_systolic,
        "blood_pressure_diastolic": blood_pressure_diastolic,
        "oxygen_saturation": oxygen_saturation,
        "temperature": temperature,
        "respiratory_rate": respiratory_rate,
        "los": los,
        "deterioration": deterioration  # Simulated result based on random chance
    }


# Simulate data changes over time (e.g., every 10 seconds)
while True:
    patient_data = generate_icu_data()
    print(pd.DataFrame([patient_data]))
