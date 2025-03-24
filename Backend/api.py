from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")

# Load the model
model = joblib.load("icu_deterioration_model.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print(f"Received data: {data}")

    try:
        # Assuming the model is trained with 4 features: los, heart_rate, blood_pressure, oxygen_saturation
        features = np.array([[data['los'], data['heart_rate'], data['blood_pressure'], data['oxygen_saturation']]])

        # Make the prediction
        prediction = model.predict(features)
        probability_of_deterioration = model.predict_proba(features)[0][1]  # Probability for class '1'
        classification = 'Risk' if prediction == 1 else 'No Risk'

        print(f"Prediction: {prediction}")
        print(f"Probability: {probability_of_deterioration}")
        print(f"Classification: {classification}")

        # Convert prediction to regular int
        prediction = int(prediction[0])

        # Calculate the risk score as a percentage
        risk_score = round(probability_of_deterioration * 100, 2)

        # Respond with the prediction and risk score as a percentage
        return jsonify({
            'prediction': classification,
            'risk_score': risk_score
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'An error occurred while processing the data'}), 400


def classify_deterioration(probability):
    if probability >= 0.7:
        return "red"  # High risk
    elif probability >= 0.4 and probability < 0.7:
        return "yellow"  # Medium risk
    else:
        return "green"  # Low risk
if __name__ == "__main__":
    app.run(debug=True)
