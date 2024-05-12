import csv
supposed_number = 30
with open('10 matang 1.csv', 'r') as file :
 csv_reader = csv.reader(file)
 rows = list(csv_reader)
 print(rows)
 count = 0
 # Iterate through each row in the CSV file
 for row in csv_reader:
  # Increment the count for each row
  count += 1
 a = count - supposed_number
 
del rows[:a]
print(count)
with open('10 matang 1.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(rows)


  