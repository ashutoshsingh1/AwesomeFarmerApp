import random

PESTS = [
    {"label": "Aphid", "solution": "नीम का तेल छिड़कें।"},
    {"label": "Caterpillar", "solution": "हाथ से निकालें और जैविक कीटनाशक का उपयोग करें।"},
    {"label": "Fungal Disease", "solution": "फफूंदी रोधी दवा का छिड़काव करें।"},
    {"label": "Healthy", "solution": "पौधा स्वस्थ है।"},
]

def predict(image_path):
    # Dummy: randomly pick a pest/disease
    return random.choice(PESTS)