from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import base64
from aromaRecord import record
from datetime import datetime
from gasloader import classify as gas


def kirim_ke_arduino(perintah):
    ser.write(perintah.encode())


app = Flask(__name__)
CORS(app)


@app.route('/')
def root():
    data = {'message': 'Hello from oke mantap!'}
    return jsonify(data)


@app.route('/api')
def get_data():
    data = {'message': 'Connected!'}
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
    data = request.json
    nomor = data.get('nomor')
    kematangan = data.get('kematangan')
    take = data.get('take')
    # where the function starts!
    record(ser, nomor, kematangan, take)
    return "Done Recording"

# Route untuk mengambil gambar dari frontend dan menyimpan gambar di backend


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
        # Change this path as needed
        image_path = f'captured images/{nomor} {kematangan} {take}.png'
        with open(image_path, 'wb') as f:
            f.write(image_bytes)
        return 'Image uploaded successfully'
    else:
        return 'No image data provided', 400


@app.route('/load-cnn-gas', methods=['POST'])
def cnnGasModel():
    # data = request.json
    # csv_data = data.get("csv")
    prediction = gas()
    print(prediction)
    return prediction


if __name__ == '__main__':
    app.run(port=5000, debug=True)
