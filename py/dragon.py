import urllib2
import os
import serial
import time

arduino = serial.Serial('/dev/ttyACM1', 9600, timeout = 1)
time.sleep(1)
while True:
    mode = urllib2.urlopen("http://192.168.1.13:3000/state").read() #get state
    arduino.write(mode) #send mode to arduino
#    data = arduino.read()
 #   if len(data) > 0:
 #       print data 
    time.sleep(2)

