from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import base64
from aromaRecord import record
from datetime import datetime
import graph_cnn as gc


def kirim_ke_arduino(perintah):
    # ser = serial.Serial('COM11', 9600)
    # time.sleep(5)
    ser.write(perintah.encode())


app = Flask(__name__)

CORS(app)


@app.route('/')
def root():
    data = {'message': 'Hello from oke mantap!'}
    return jsonify(data)


@app.route('/api')
def get_data():
    data = {'message': 'DURIAN CLASSIFIER HMI'}
    return jsonify(data)


@app.route('/connect-to-arduino')
def connect():
    global ser
    port = 'COM11'
    # port = '/dev/ttyACM0'
    ser = serial.Serial(port, 9600)
    return 'connected to arduino'


# Route untuk menerima permintaan dari situs web
@app.route('/send', methods=['POST'])
def kirim_perintah():
    data = request.get_json()
    perintah = data['perintah']
    kirim_ke_arduino(perintah)
    return jsonify({'status': 'ok'})

# Route untuk mengambil data dari sensor MQ-3


@app.route('/gas-aroma-record', methods=["POST"])
def get_gas_data():
    # ser = serial.Serial('COM11', 9600)
    # time.sleep(3)
    data = request.json
    nomor = data.get('nomor')
    kematangan = data.get('kematangan')
    take = data.get('take')
    # where the function starts!
    record(ser, nomor, kematangan, take)
    return "Done Recording"


@app.route('/upload-image', methods=['POST'])
def upload_image():
    data = request.json
    nomor = data.get('nomor')
    kematangan = data.get('kematangan')
    take = data.get('take')
    if 'image' in data:
        image_data = data['image']
        # Decode base64 image data
        image_bytes = base64.b64decode(image_data.split(',')[1])
        # Specify the path to save the image
        # Change this path as needed
        image_path = f'captured images/{nomor} {kematangan} {take}.png'
        # Save the image to the specified path
        with open(image_path, 'wb') as f:
            f.write(image_bytes)
        return 'Image uploaded successfully'
    else:
        return 'No image data provided', 400


@app.route('/cnn-gas-model')
def cnnGasModel():
    global recorded_csv_file
    now = datetime.now()
    date_now = now.strftime("%d%m%Y")
    hourAndMinutesecond = now.strftime("%H%M%S")
    recorded_csv_file = record(ser, date_now, hourAndMinutesecond)
    print(recorded_csv_file)
    return recorded_csv_file


@app.route('/gas-classifier')
def gasClassifier():
    # jadikan file csv menjadi grafik dulu
    normalized = gc.normalize(recorded_csv_file)
    current_graph = gc.graph(normalized)
    # prediction = gc.cnnModel(current_graph)
    # print(prediction)
    return 'nice and complete!!'


if __name__ == '__main__':
    app.run(port=5000, debug=True)
