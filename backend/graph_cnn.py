from matplotlib import pyplot as plt
import pandas as pd
import os
# import tensorflow as tf
# from tensorflow.keras.preprocessing import image
import numpy as np
import cv2

output_folder = "graph nn"
os.makedirs(output_folder, exist_ok=True)


def graph(file_path):
    df = pd.read_csv(file_path)
    data = df['value'].to_numpy()
    # Create mirrored data with negative values
    mirrored_data = data * -1
    # Create bar chart
    fig, ax = plt.subplots()
    x = np.arange(len(data))

    # Plot the positive values
    bars1 = ax.bar(x, data, width=1, color='blue', label='Positive')
    # Plot the negative values (mirrored)
    bars2 = ax.bar(x, mirrored_data, width=1, color='blue', label='Negative')

    # Setting labels and title
    plt.ylim(-2, 2)
    plt.title('')
    plt.xlabel('')
    plt.ylabel('')
    plt.axis('off')
    file_name = file_path.split('/')[2]
    file_name = file_name.split('.csv')[0]
    output_file = f"graph nn/{file_name}.png"
    plt.savefig(output_file, bbox_inches='tight',
                pad_inches=0, transparent=True)
    print(output_file)
    return output_file


# graph('data aroma/14052024 1704 02.csv')

def normalize(file_path):
    df = pd.read_csv(file_path)
    th = 0.94
    firstValue = df['value'][0]
    file_name = file_path.split('/')[1]
    file_name = file_name.split('.csv')[0]
    if firstValue > th:
        diff = firstValue - th
        normalized_DF = df['value'] - diff
        output_path = f"data aroma/normalized/{file_name}.csv"
        normalized_DF.to_csv(output_path, index=False)
    else:
        output_path = f"data aroma/normalized/{file_name}.csv"
        df.to_csv(output_path, index=False)
    return output_path


def cnnModel(input_path):
    model = tf.keras.models.load_model('15052024-142633.keras')
    img = cv2.imread(str(input_path))
    img = cv2.resize(img, (200, 200))

    X = image.img_to_array(img)
    X = np.expand_dims(X, axis=0)

    val = model.predict(X)
    output_model = ""
    if val[0][0] == 1.0:
        print('unripe')
        output_model = "unripe"
    elif val[0][0] == 0:
        print('ripe')
        output_model = "ripe"
    else:
        print(val[0][0])
        output_model = "Something wrong...."
    print(val[0][0])
    return 'ok'
