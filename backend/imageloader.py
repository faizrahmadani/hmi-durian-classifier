import numpy as np
import tensorflow as tf
import cv2
from PIL import Image
from tensorflow.keras.preprocessing import image  # type: ignore
from rembg import remove


def load_image(path):
    input = Image.open(path)
    img = remove(input)
    img.save(path)
    img = cv2.imread(str(path))
    img = cv2.resize(img, (200, 200))
    # Convert the image to a numpy array
    X = tf.keras.preprocessing.image.img_to_array(img)
    X = np.expand_dims(X, axis=0)
    return X


def classify(input_file):
    interpreter = tf.lite.Interpreter(model_path='model webcam.tflite')
    interpreter.allocate_tensors()
    # Get input and output tensors
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    data = load_image(input_file)
    # Prepare the input tensor
    interpreter.set_tensor(input_details[0]['index'], data)
    # Invoke the interpreter
    interpreter.invoke()
    # Get the output
    val = interpreter.get_tensor(output_details[0]['index'])
    # print(val)
    # Interpret the output
    if val[0][0] >= 0.5:
        print(f'unripe {val[0][0]}')
        return 'unripe'
    else:
        print(f'ripe {val[0][0]}')
        return 'ripe'
