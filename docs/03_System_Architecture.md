# System Architecture

## AI-Powered Network Intrusion Detection and Threat Analysis System Using Data Mining

---

# Document Information

| Item | Details |
|------|---------|
| Project | AI-Powered Network Intrusion Detection and Threat Analysis System Using Data Mining |
| Version | 1.0 |
| Architecture Style | Layered Architecture |
| Backend | FastAPI |
| Frontend | React + Vite |
| ML Framework | Scikit-learn |
| Dataset | CIC-IDS2017 |

---

# 1. Introduction

The AI-NIDS architecture is designed using a modular layered approach to ensure scalability, maintainability, and separation of concerns.

Instead of combining machine learning, backend logic, frontend, and data processing into a single application, the system separates each responsibility into an independent layer.

This architecture enables easy maintenance, future expansion, and independent development by multiple team members.

---

# 2. High-Level Architecture

![High Level Architecture](images/high_level_architecture.png)

The complete system consists of five major layers:

- Data Layer
- Machine Learning Layer
- Backend Layer
- Frontend Layer
- User Layer

Each layer communicates only with the adjacent layer through clearly defined interfaces.

---

# 3. Architecture Layers

## 3.1 Data Layer

### Responsibilities

- Store raw dataset
- Store cleaned dataset
- Store processed dataset
- Provide training data
- Provide testing data

### Components

- CIC IDS 2017 Dataset
- Processed Dataset
- Saved CSV Files

---

## 3.2 Data Mining Layer

This layer performs all preprocessing operations.

### Modules

- Data Understanding
- Data Cleaning
- Exploratory Data Analysis
- Feature Engineering
- Feature Selection

Output:

Optimized dataset ready for Machine Learning.

---

## 3.3 Machine Learning Layer

Responsible for training and prediction.

### Components

- Train/Test Split
- Random Forest
- Model Evaluation
- Feature Importance
- Saved Model (.pkl)

Output:

Trained Machine Learning Model

---

## 3.4 Backend Layer

Implemented using FastAPI.

Responsibilities include:

- Request Validation
- Model Loading
- Prediction
- Response Generation
- Error Handling
- Logging

REST APIs expose prediction services to the frontend.

---

## 3.5 Frontend Layer

Developed using React.

Modules include:

- Dashboard
- Prediction
- Statistics
- Analytics
- About
- Settings

The frontend communicates with FastAPI through REST APIs.

---

# 4. Component Interaction

![Component Diagram](images/component_diagram.png)

The communication follows this order:

User

↓

Frontend

↓

FastAPI

↓

Prediction Service

↓

Machine Learning Model

↓

Prediction

↓

Frontend

↓

User

---

# 5. Data Flow

![Data Flow](images/data_flow.png)

Data moves through the following pipeline:

Raw Dataset

↓

Cleaning

↓

EDA

↓

Feature Engineering

↓

Training

↓

Evaluation

↓

Saved Model

↓

Prediction API

↓

Dashboard

---

# 6. Request Processing Flow

When a prediction request is received:

1. User submits data
2. Frontend sends POST request
3. FastAPI validates request
4. Features are preprocessed
5. Model performs prediction
6. Confidence score is generated
7. JSON response returned
8. Dashboard displays results

---

# 7. Folder Structure

![Folder Structure](images/folder_structure.png)

The project follows a modular directory structure separating datasets, notebooks, backend, frontend, reports, and documentation.

---

# 8. Technology Stack

| Layer | Technology |
|---------|------------|
| Dataset | CIC IDS 2017 |
| Data Processing | Pandas |
| Visualization | Matplotlib, Seaborn |
| Machine Learning | Scikit-learn |
| Backend | FastAPI |
| Frontend | React + Vite |
| Version Control | Git |
| Documentation | Markdown |

---

# 9. Architecture Principles

The architecture follows:

- Layered Design
- Modular Development
- Separation of Concerns
- Reusability
- Maintainability
- Scalability
- Low Coupling
- High Cohesion

---

# 10. Advantages

The architecture provides:

- Independent development of frontend and backend
- Easy replacement of ML models
- Faster testing
- Better maintainability
- Cleaner code organization
- Easier deployment
- Future scalability

---

# 11. Future Expansion

The architecture supports future enhancements including:

- Live Packet Capture
- Real-Time Prediction
- Docker Deployment
- Kubernetes
- Cloud Deployment
- Authentication
- Database Integration
- SIEM Integration
- Deep Learning Models
- Threat Intelligence APIs

---

# 12. Conclusion

The proposed architecture provides a scalable and modular foundation for building an intelligent Network Intrusion Detection System. The separation of data processing, machine learning, backend services, and frontend visualization ensures maintainability while enabling future improvements without major architectural changes.