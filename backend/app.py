from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import serial
import base64
from aromaRecord import record
from datetime import datetime
from gasloader import classify as gas
from imageloader import classify as impred
import os


def kirim_ke_arduino(perintah):
    ser.write(perintah.encode())


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'upload'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


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
@cross_origin()
def load_cnn_gas():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        original_filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, original_filename)
        file.save(save_path)
        prediction = gas(save_path)
        return prediction


@app.route('/load-cnn-webcam', methods=['POST'])
@cross_origin()
def load_cnn_webcam():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        original_filename = file.filename
        save_path = os.path.join(UPLOAD_FOLDER, original_filename)
        file.save(save_path)
        prediction = impred(save_path)
        return prediction

if __name__ == '__main__':
    app.run(port=5000, debug=True)
