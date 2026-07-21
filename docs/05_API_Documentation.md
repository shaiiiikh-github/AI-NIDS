# API Documentation

## AI-Powered Network Intrusion Detection and Threat Analysis System Using Data Mining

---

# Document Information

| Item | Details |
|------|---------|
| Project | AI-Powered Network Intrusion Detection and Threat Analysis System Using Data Mining |
| API Framework | FastAPI |
| API Style | RESTful API |
| Data Format | JSON |
| Version | v1.0 |

---

# 1. Introduction

The AI-NIDS backend exposes a RESTful API that enables communication between the React frontend and the Machine Learning prediction engine.

The API is responsible for:

- Receiving prediction requests
- Validating incoming data
- Loading the trained Machine Learning model
- Performing intrusion detection
- Returning prediction results
- Providing system information and model statistics

The API is designed using REST principles to ensure simplicity, scalability, and maintainability.

---

# 2. API Architecture

```
Client (React)

        │

HTTP Request (JSON)

        │

        ▼

FastAPI Backend

        │

Validation Layer

        │

Prediction Service

        │

Machine Learning Model

        │

Prediction Result

        │

JSON Response

        ▼

Client (React)
```

---

# 3. Base URL

During development:

```
http://localhost:8000
```

Future deployment example:

```
https://api.ai-nids.com
```

---

# 4. Content Type

All requests and responses use:

```
Content-Type: application/json
```

---

# 5. API Endpoints

| Method | Endpoint | Description |
|----------|----------------|-----------------------------|
| GET | / | API Health Check |
| GET | /health | Server Status |
| POST | /predict | Predict Network Traffic |
| GET | /model/info | Model Information |
| GET | /statistics | Dataset Statistics |

---

# 6. Endpoint Details

---

## 6.1 Health Check

### Endpoint

```
GET /
```

### Description

Checks whether the backend API is running.

### Response

```json
{
    "message": "AI-NIDS API is running successfully"
}
```

---

## 6.2 Server Health

### Endpoint

```
GET /health
```

### Purpose

Returns backend status.

### Example Response

```json
{
    "status": "Healthy",
    "model_loaded": true,
    "version": "1.0"
}
```

---

## 6.3 Prediction Endpoint

### Endpoint

```
POST /predict
```

### Description

Accepts network traffic features and predicts whether the traffic is benign or malicious.

---

### Request Body

```json
{
    "Flow Duration": 12345,
    "Total Fwd Packets": 20,
    "Total Backward Packets": 15,
    "...": "Additional network features"
}
```

> **Note:** The actual request body will contain all required network flow features used during model training. The exact schema will match the final feature set after feature engineering.

---

### Successful Response

```json
{
    "prediction": "BENIGN",
    "confidence": 0.98,
    "status": "success"
}
```

---

### Example Attack Response

```json
{
    "prediction": "DoS Hulk",
    "confidence": 0.95,
    "status": "success"
}
```

---

## 6.4 Model Information

### Endpoint

```
GET /model/info
```

### Response

```json
{
    "model": "Random Forest",
    "dataset": "CIC-IDS2017",
    "version": "1.0",
    "features": 79
}
```

---

## 6.5 Dataset Statistics

### Endpoint

```
GET /statistics
```

### Response

```json
{
    "total_records": 610492,
    "attack_classes": 15,
    "features": 79
}
```

---

# 7. HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Created |
| 400 | Invalid Request |
| 404 | Endpoint Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

# 8. Request Validation

Before prediction, the backend performs several validation steps:

- Required fields must be present.
- Numeric values must be valid.
- Missing values are rejected.
- Invalid JSON is rejected.
- Unsupported feature names are rejected.

If validation fails, the API returns an appropriate error message.

---

# 9. Error Response Example

```json
{
    "status": "error",
    "message": "Invalid request data"
}
```

---

# 10. API Workflow

```
User

↓

React Dashboard

↓

POST /predict

↓

FastAPI

↓

Input Validation

↓

Feature Preprocessing

↓

Random Forest Model

↓

Prediction

↓

JSON Response

↓

Dashboard
```

---

# 11. Security Considerations

Future versions of the API may include:

- API Key Authentication
- JWT Authentication
- HTTPS Encryption
- Rate Limiting
- Input Sanitization
- Request Logging

---

# 12. API Advantages

The API provides:

- Fast communication between frontend and backend
- Standardized JSON responses
- Easy integration with external applications
- Modular design
- Scalability
- Maintainability

---

# 13. Future Enhancements

Future API improvements may include:

- Batch predictions
- Real-time packet analysis
- WebSocket support
- User authentication
- Prediction history
- Model versioning
- Explainable AI (XAI) responses

---

# 14. Conclusion

The AI-NIDS REST API serves as the communication layer between the user interface and the machine learning prediction engine. By following RESTful design principles and using FastAPI, the API provides a reliable, scalable, and maintainable interface for network intrusion detection and future system expansion.