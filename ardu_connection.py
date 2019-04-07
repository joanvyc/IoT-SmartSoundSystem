import os
import serial
import time
arduino = serial.Serial('/dev/ttyACM1', 9600, timeout = 1)
time.sleep(1)
mode = 0 
while True:
    arduino.write('2') #
    mode = (mode+1)%5
    #print mode
    data = arduino.read()
    if len(data) > 0:
        print data 
    time.sleep(5)
