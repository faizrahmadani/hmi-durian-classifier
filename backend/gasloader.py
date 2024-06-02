# only for avoid the tensorflow error log
import os
import numpy as np
import pandas as pd
import tensorflow as tf
import easygui
import joblib


def load_csv_data(file_path):
    csv_data = pd.read_csv(file_path).values.flatten()
    return np.array([csv_data])


def preprocess_data(data, scaler):
    data = scaler.transform(data)
    data = data.reshape((data.shape[0], data.shape[1], 1))
    return data


def classify():
    interpreter = tf.lite.Interpreter(model_path='29052024-192640.tflite')
    interpreter.allocate_tensors()
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    file_path = easygui.fileopenbox(title='Select The File')
    data = load_csv_data(file_path)

    scaler_path = 'scaler.pkl'
    scaler = joblib.load(scaler_path)

    # Melakukan preprocessing pada data input
    data = preprocess_data(data, scaler)

    interpreter.set_tensor(input_details[0]['index'], data.astype(np.float32))
    interpreter.invoke()
    predictions = interpreter.get_tensor(output_details[0]['index'])

    # Melakukan prediksi
    predictions = np.round(predictions).flatten()

    if predictions[0] == 0:
        print('ripe')
        return 'ripe'
    elif predictions[0] == 1:
        print('unripe')
        return 'unripe'
    else:
        print(predictions[0])
