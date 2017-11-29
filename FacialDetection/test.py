import dlib
import numpy as np
from skimage import io
import os
import sys

predictor_path = "/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/shape_predictor_68_face_landmarks.dat"

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

count = sys.argv[1]
img = io.imread("/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/%s.png" %count)

dets = detector(img)

#output face landmark points inside retangle
#shape is points datatype
#http://dlib.net/python/#dlib.point
for k, d in enumerate(dets):
    shape = predictor(img, d)

vec = np.empty([68, 2], dtype = int)
for b in range(68):
    vec[b][0] = shape.part(b).x
    vec[b][1] = shape.part(b).y

for x in vec:
	print "%i %i" % (x[0], x[1])
