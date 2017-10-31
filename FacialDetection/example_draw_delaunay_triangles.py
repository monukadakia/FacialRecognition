#!/usr/bin/python
 
import cv2
import numpy as np
import random
import sys
 



# Check if a point is inside a rectangle
def rect_contains(rect, point) :
    if point[0] < rect[0] :
        return False
    elif point[1] < rect[1] :
        return False
    elif point[0] > rect[2] :
        return False
    elif point[1] > rect[3] :
        return False
    return True
 
# Draw a point
def draw_point(img, p, color ) :
    cv2.circle (img, p, 3, color, 0, cv2.LINE_AA, 0)
 
 
# Draw delaunay triangles
def draw_delaunay(img, subdiv, delaunay_color ) :
 
    triangleList = subdiv.getTriangleList();
    size = img.shape
    r = (0, 0, size[1], size[0])
 
    for t in triangleList :
        pt1 = (t[0], t[1])
        pt2 = (t[2], t[3])
        pt3 = (t[4], t[5])
        if rect_contains(r, pt1) and rect_contains(r, pt2) and rect_contains(r, pt3) :
            cv2.line(img, pt1, pt2, delaunay_color, 1, cv2.LINE_AA, 0)
            cv2.line(img, pt2, pt3, delaunay_color, 1, cv2.LINE_AA, 0)
            cv2.line(img, pt3, pt1, delaunay_color, 1, cv2.LINE_AA, 0)
 
if __name__ == '__main__':
 
    # Define window names
    win_delaunay = "Delaunay Triangulation"
 
    # Turn on animation while drawing triangles
    animate = True
     
    # Define colors for drawing.
    delaunay_color = (255,0,0)
    points_color = (0, 0, 255)
 
    # Read in the image.
    count = sys.argv[1]
    img = cv2.imread("/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/image-%s.png" %count);
     
    # Keep a copy around
    img_orig = img.copy();
     
    # Rectangle to be used with Subdiv2D
    size = img.shape
    rect = (0, 0, size[1], size[0])
     
    # Create an instance of Subdiv2D
    subdiv = cv2.Subdiv2D(rect);
    points = [];
    all_points = sys.argv[2]
    format_points = all_points.split("\n")
    for x in format_points:
        if(len(x) != 0):
            point = x.split(" ")
            point_x = int(point[0])
            point_y = int(point[1])
            points.append((point_x, point_y));




    # Create an array of points.
    
    # points.append((273, 112));
    # points.append((271, 125));
    # points.append((271, 137));
    # points.append((272, 150));
    # points.append((273, 163));
    # points.append((279, 174));
    # points.append((288, 182));
    # points.append((299, 187));
    # points.append((311, 190));
    # points.append((325, 190));
    # points.append((338, 188));
    # points.append((352, 183));
    # points.append((362, 175));
    # points.append((368, 163));
    # points.append((371, 150));
    # points.append((373, 137));
    # points.append((375, 124));
    # points.append((282, 93));
    # points.append((287, 85));
    # points.append((296, 82));
    # points.append((306, 82));
    # points.append((314, 87));
    # points.append((330, 88));
    # points.append((341, 86));
    # points.append((351, 86));
    # points.append((360, 91));
    # points.append((366, 101));
    # points.append((321, 101));
    # points.append((320, 109));
    # points.append((318, 117));
    # points.append((317, 125));
    # points.append((308, 136));
    # points.append((312, 137));
    # points.append((317, 139));
    # points.append((322, 138));
    # points.append((328, 137));
    # points.append((289, 106));
    # points.append((295, 103));
    # points.append((302, 103));
    # points.append((308, 107));
    # points.append((301, 108));
    # points.append((294, 107));
    # points.append((336, 110));
    # points.append((343, 106));
    # points.append((350, 107));
    # points.append((356, 111));
    # points.append((350, 112));
    # points.append((343, 111));
    # points.append((298, 157));
    # points.append((304, 151));
    # points.append((311, 147));
    # points.append((316, 149));
    # points.append((322, 148));
    # points.append((329, 152));
    # points.append((336, 160));
    # points.append((329, 163));
    # points.append((321, 164));
    # points.append((315, 164));
    # points.append((309, 164));
    # points.append((303, 162));
    # points.append((301, 157));
    # points.append((310, 154));
    # points.append((316, 154));
    # points.append((322, 154));
    # points.append((333, 159));
    # points.append((322, 157));
    # points.append((316, 157));
    # points.append((310, 156));
   
 
    # Insert points into subdiv
    for p in points :
        subdiv.insert(p)
         
    # Draw delaunay triangles
    draw_delaunay (img, subdiv, (255, 0, 0));
 
    # Draw points
    for p in points :
        draw_point(img, p, (0,0,255))

    cv2.imwrite("/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/image-%s.png" %count, img);
