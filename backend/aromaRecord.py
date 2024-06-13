import time
import csv

def record(ser, nomor, kematangan, take=""):
    csv_file_path = f'data aroma/{nomor} {kematangan} {take}.csv'
    with open(csv_file_path, 'w', newline='') as csv_file:
        start_time = int(time.time())
        while (int(time.time()) - start_time) < 30:
            try:
                csv_writer = csv.writer(csv_file)
                # Read a line from the serial port
                line = ser.readline().decode().strip()
                # Print the received data
                print(f'{int(time.time()) - start_time}-{line}')
                # Write the received sensor value to the CSV file
                csv_writer.writerow([line])
            except KeyboardInterrupt:
                break
    with open(csv_file_path, 'r', ) as file:
        supposed_number = 30
        csv_reader = csv.reader(file)
        rows = list(csv_reader)
        count = 0
        for row in csv_reader:
            count += 1
        a = count - supposed_number
    del rows[:a]
    rows.insert(0, ['value'])
    with open(csv_file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(rows)
    print("Done Recording")
    return csv_file_path
