#  Digit Detector - Handwritten Digit Recognition

 **Live Demo:**  [Click Here to Try](https://madhushreewarke-24.github.io/Digit-Detector/)

---
#  Handwritten Digit Object Detection (Full Stack AI)

A full-stack AI web application that detects and classifies handwritten digits using a CNN-based deep learning model built with TensorFlow. The system also predicts the bounding box of the digit using object detection techniques.

---

##  Features

-  Draw any digit using mouse
-  AI predicts digit + bounding box
-  Shows prediction confidence
-  Keeps prediction history
-  Fast React + Vite frontend
-  Flask backend API
-  CNN model trained on MNIST

---

##  Tech Stack

**Frontend:**
- React + Vite
- HTML5 Canvas
- CSS3

**Backend:**
- Python
- Flask
- TensorFlow / Keras

**Model:**
- CNN for classification
- Bounding box regression

---

##  How To Run Locally

### 1️ Backend

```bash
cd backend
pip install flask tensorflow opencv-python flask-cors numpy
python app.py

Backend will run on:
 http://127.0.0.1:5000

cd frontend
npm install
npm run dev

Frontend will run on:
 http://localhost:5173
```
 ### Screenshots

<img width="1919" height="905" alt="Screenshot 2026-01-11 200448" src="https://github.com/user-attachments/assets/1d3e9812-b615-4de5-807e-3237c5e8d675" />

<img width="1919" height="906" alt="Screenshot 2026-01-11 200400" src="https://github.com/user-attachments/assets/86354633-5c26-499e-b432-35c53c8b65ca" />

### Model Details

Dataset: MNIST

Input size: 75×75

Output:

Digit class (0–9)

Bounding box (x1, y1, x2, y2)

 ### Use Cases

Educational AI demos

Computer Vision learning

AI-based drawing recognition

Resume & portfolio project


