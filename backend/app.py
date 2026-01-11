from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import base64

app = Flask(__name__)
CORS(app)

# Load model
model = tf.keras.models.load_model("digit_detector.h5", compile=False)
print("✅ Model loaded successfully")

# Clamp helper
def clamp(v):
    return max(0.0, min(1.0, float(v)))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    image_data = data["image"]

    # Decode base64 image
    image_data = image_data.split(",")[1]
    img_bytes = base64.b64decode(image_data)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # =========================
    # 🔥 SMART PREPROCESSING
    # =========================

    # Convert to grayscale
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Invert colors (white bg, black digit)
    img = cv2.bitwise_not(img)

    # Threshold
    _, img = cv2.threshold(img, 50, 255, cv2.THRESH_BINARY)

    # Find bounding box of digit
    ys, xs = np.where(img > 0)
    if len(xs) == 0 or len(ys) == 0:
        return jsonify({"digit": -1, "bbox": [0, 0, 1, 1]})

    x1, x2 = xs.min(), xs.max()
    y1, y2 = ys.min(), ys.max()

    cropped = img[y1:y2, x1:x2]

    # Make square
    h, w = cropped.shape
    size = max(h, w)
    square = np.zeros((size, size), dtype=np.uint8)
    square[(size-h)//2:(size-h)//2+h, (size-w)//2:(size-w)//2+w] = cropped

    # Resize to 28x28
    img28 = cv2.resize(square, (28, 28))

    # Pad to 75x75 (model input size)
    img75 = cv2.copyMakeBorder(img28, 23, 24, 23, 24, cv2.BORDER_CONSTANT, value=0)

    # Normalize
    img75 = img75 / 255.0
    img75 = img75.reshape(1, 75, 75, 1)

    # =========================
    # 🤖 MODEL PREDICTION
    # =========================

    prediction = model.predict(img75)
    class_probs = prediction[0]
    bbox_pred = prediction[1][0]

    digit = int(np.argmax(class_probs))
    confidence = float(np.max(class_probs)) * 100


    # =========================
    # 📦 FINAL BOUNDING BOX
    # =========================

    # Convert detected crop box to normalized coordinates
    h0, w0 = img.shape

    xmin = clamp(x1 / w0)
    ymin = clamp(y1 / h0)
    xmax = clamp(x2 / w0)
    ymax = clamp(y2 / h0)

    return jsonify({
    "digit": digit,
    "confidence": round(confidence, 2),
    "bbox": [xmin, ymin, xmax, ymax]
})


@app.route("/")
def home():
    return "Digit Detection Backend Running"

if __name__ == "__main__":
    app.run(debug=True)
