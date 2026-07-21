# Dataset Documentation

## AI-Powered Network Intrusion Detection and Threat Analysis System Using Data Mining

---

# Document Information

| Item | Details |
|------|---------|
| Project | AI-Powered Network Intrusion Detection and Threat Analysis System Using Data Mining |
| Dataset | CIC-IDS2017 |
| Dataset File | Wednesday-workingHours.pcap_ISCX.csv |
| Source | Canadian Institute for Cybersecurity (CIC) |
| Version | 1.0 |

---

# 1. Introduction

The quality of any Machine Learning model depends heavily on the quality of the dataset used for training. Since the objective of this project is to detect malicious network traffic using Artificial Intelligence and Data Mining, selecting a realistic and well-labeled cybersecurity dataset is essential.

This project utilizes the **CIC-IDS2017** dataset, developed by the Canadian Institute for Cybersecurity (CIC). The dataset is one of the most widely used benchmark datasets for intrusion detection research because it contains realistic network traffic, multiple attack categories, and comprehensive flow-based features.

Unlike older datasets such as KDD99 or NSL-KDD, CIC-IDS2017 represents modern network behavior and includes both benign and malicious traffic generated under realistic conditions.

---

# 2. Dataset Overview

The CIC-IDS2017 dataset consists of network flow records collected over multiple days under different attack scenarios.

Each record represents a network flow and contains multiple statistical features extracted from captured packets.

These features describe characteristics such as:

- Flow Duration
- Packet Counts
- Packet Lengths
- Flow Bytes per Second
- Flow Packets per Second
- TCP Flags
- Inter Arrival Time
- Header Length
- Active Time
- Idle Time

Each record is assigned a label indicating whether the traffic is benign or belongs to a specific attack category.

---

# 3. Dataset Used in This Project

For this project, the following dataset file was selected:

```
Wednesday-workingHours.pcap_ISCX.csv
```

This dataset contains a mixture of normal network traffic and several attack categories, making it suitable for developing and evaluating an intrusion detection model.

---

# 4. Dataset Source

Dataset Name:

**CIC-IDS2017**

Developed By:

**Canadian Institute for Cybersecurity (CIC)**

Purpose:

To provide a realistic benchmark dataset for evaluating intrusion detection systems using modern network traffic.

---

# 5. Dataset Characteristics

| Property | Value |
|-----------|--------|
| Dataset Name | CIC-IDS2017 |
| File Used | Wednesday-workingHours.pcap_ISCX.csv |
| Features | 79 |
| Label Column | Label |
| Data Type | Structured CSV |
| Domain | Cybersecurity |

---

# 6. Data Preprocessing

Before training the machine learning model, several preprocessing steps were performed to improve data quality.

The preprocessing workflow included:

- Removing duplicate records
- Removing missing values
- Handling infinite values
- Cleaning column names
- Verifying data consistency
- Saving the cleaned dataset

These operations ensured that the dataset was suitable for machine learning.

---

# 7. Cleaning Results

After preprocessing, the dataset contained:

| Property | Value |
|-----------|--------|
| Final Rows | 610,492 |
| Final Columns | 79 |
| Missing Values | 0 |
| Duplicate Records | 0 |
| Infinite Values | 0 |

The cleaned dataset was stored for subsequent stages such as Exploratory Data Analysis, Feature Engineering, and Model Training.

---

# 8. Exploratory Data Analysis Summary

Exploratory Data Analysis (EDA) was performed to better understand the dataset.

The analysis included:

- Class Distribution
- Feature Distribution
- Correlation Analysis
- Statistical Summary
- Outlier Detection
- Feature Relationships

The insights obtained during EDA guided feature engineering and model development.

---

# 9. Feature Categories

The dataset contains various categories of network traffic features, including:

### Basic Flow Features

- Flow Duration
- Protocol
- Packet Counts

### Packet Statistics

- Packet Length
- Average Packet Size
- Packet Length Variance

### Time-Based Features

- Flow Inter Arrival Time
- Active Time
- Idle Time

### TCP Features

- SYN Flags
- ACK Flags
- PSH Flags
- URG Flags

### Traffic Rate Features

- Flow Bytes/s
- Flow Packets/s

These features collectively describe network behavior and enable the machine learning model to distinguish between benign and malicious traffic.

---

# 10. Label Information

The Label column represents the target variable used for supervised machine learning.

Typical labels include:

- BENIGN
- DoS
- PortScan
- Heartbleed
- Web Attack
- Bot
- Infiltration

The model learns to classify network traffic based on these labels.

---

# 11. Why CIC-IDS2017?

The CIC-IDS2017 dataset was selected because it offers several advantages:

- Modern network traffic
- Realistic attack scenarios
- Multiple attack categories
- High-quality feature extraction
- Publicly available benchmark dataset
- Widely accepted in cybersecurity research

These characteristics make it an ideal dataset for developing AI-powered intrusion detection systems.

---

# 12. Challenges Encountered

During preprocessing, several challenges were identified:

- Presence of duplicate records
- Infinite values in numerical features
- Missing values
- Large dataset size resulting in longer visualization times during Exploratory Data Analysis

These issues were resolved through appropriate preprocessing techniques before model training.

---

# 13. Dataset Workflow

```
Raw Dataset

↓

Data Understanding

↓

Data Cleaning

↓

EDA

↓

Feature Engineering

↓

Model Training
```

---

# 14. Future Improvements

Future versions of the project may incorporate additional cybersecurity datasets to improve model generalization and evaluate performance across diverse network environments.

Potential datasets include:

- CIC-DDoS2019
- UNSW-NB15
- CSE-CIC-IDS2018
- TON-IoT
- BoT-IoT

---

# 15. Conclusion

The CIC-IDS2017 dataset provides a comprehensive and realistic representation of modern network traffic, making it well suited for intrusion detection research. Through systematic preprocessing, data cleaning, and exploratory analysis, the dataset was transformed into a high-quality foundation for machine learning. The resulting processed dataset enables the AI-NIDS system to learn meaningful traffic patterns and accurately classify malicious network activities.