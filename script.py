import time
import sys
import datetime
from influxdb import InfluxDBClient
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, True)  # Eteind

# Set this variables, influxDB should be localhost on Pi
host = "localhost"
port = 8086
user = "root"
password = "root"

# The database we created
dbname = "mydb"

# Interval de temps entre chaque mesure
interval =3500 


client = InfluxDBClient(host, port, user, password, dbname)


def consultationTemp():

    with open("/sys/bus/w1/devices/28-00000636f828/w1_slave", "r") as fichierTemp:
        searchfile = fichierTemp.readlines()

        for line in searchfile:
            if 't=' in line:
                temperature = round((float(line[29:]) / 1000), 1)
                json_body = [
                    {
                        "measurement": "temperature",

                        "fields": {
                            "valeur": temperature
                        }
                    }
                ]
                # Write JSON to InfluxDB
        client.write_points(json_body)


def regulation():

    state = GPIO.input(11)

    if liste[-1] > 21:

        if state == 1:  # Eteind
            GPIO.setup(11, False)  # state = 0 ; Allume

            print('Temperature au dessus de 22 : Allumage ventilateur')

    if liste[-1] < 21:
        if state == 0:  # Allume
            GPIO.setup(11, True)  # state = 1 ; Eteind

            print('Temperature en dessous de 21 : Extinction ventilateur!')


while True:

    consultationTemp()
    time.sleep(interval)
