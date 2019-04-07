import urllib2
contents = urllib2.urlopen("http://192.168.1.13:3000/state").read()
print contents
