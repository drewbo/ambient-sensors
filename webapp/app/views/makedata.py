import time
import datetime
import random

while True:
    new_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_value = random.randint(12,24)
    row = new_date + ',' + str(new_value) + '\n'
    temp_data = open('data.csv','a')
    temp_data.write(row)
    temp_data.close()
    time.sleep(1)
