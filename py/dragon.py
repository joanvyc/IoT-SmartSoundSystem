import urllib2
import requests
import os
import serial
import time

arduino = serial.Serial('/dev/ttyACM0', 9600, timeout = 1)
time.sleep(1)
while True:
    mode = urllib2.urlopen("http://192.168.1.103:3000/state").read() #get state
    arduino.write(mode) #send mode to arduino
    ldr = arduino.read()
    data = dict(mode=ldr)
    if len(ldr) > 0:
        print ldr 
        r = requests.post("http://192.168.1.103:3000/auto", data=data) #allow_redirects=True)
    time.sleep(2)

