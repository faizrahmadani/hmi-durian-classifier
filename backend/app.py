from flask import Flask, jsonify, request
from flask_cors import CORS
import serial
import csv
import time
import datetime
import base64
import os

# Fungsi untuk mengirim perintah ke Arduino
def kirim_ke_arduino(perintah):
    ser.write(perintah.encode())

# def buka_serial(port, baudrate):
#     try:
#         ser = serial.Serial(port, baudrate)
#         return ser
#     except serial.SerialException as e:
#         print(f"Failed to open serial port: {e}")
#         return None

ser =serial.Serial('COM11', 9600)   

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


# Route untuk menerima permintaan dari situs web
@app.route('/send', methods=['POST'])
def kirim_perintah():
    data = request.get_json()
    perintah = data['perintah']
    kirim_ke_arduino(perintah)
    return jsonify({'status': 'ok'})

# Route untuk mengambil data dari sensor MQ-3
@app.route('/gas-aroma-record', methods=["POST"])
def get_gas_data() :
    data = request.json
    nomor = data.get('nomor')
    kematangan = data.get('kematangan')
    take = data.get('take')
    # Format the date-time string as 'MMDDYYYY-HHMM'
    csv_file_path = f'data aroma/{nomor} {kematangan} {take}.csv'
    with open(csv_file_path, 'w', newline='') as csv_file:
        start_time = int(time.time())
        while (int(time.time()) - start_time) < 30:  
            try:                
                csv_writer = csv.writer(csv_file)
                # Read a line from the serial port
                line = ser.readline().decode().strip()
                print(f'{int(time.time()) - start_time}-{line}')  # Print the received data
                # Write the received sensor value to the CSV file
                csv_writer.writerow([line])
            except KeyboardInterrupt:
                break
    # Close the serial connection
    # ser.close()
    with open(csv_file_path, 'r', ) as file:
        supposed_number = 30
        csv_reader = csv.reader(file)
        rows = list(csv_reader)
        count = 0
        for row in csv_reader :
            count += 1
        a = count - supposed_number
    del rows[:a]

    with open(csv_file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(rows)
    print("Done Recording")
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
        image_path = f'captured images/{nomor} {kematangan} {take}.png'  # Change this path as needed
        # Save the image to the specified path
        with open(image_path, 'wb') as f:
            f.write(image_bytes)
        return 'Image uploaded successfully'
    else:
        return 'No image data provided', 400


if __name__ == '__main__':
    app.run(port=5000, debug=True)
