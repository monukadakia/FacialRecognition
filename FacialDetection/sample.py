import sys

all_pt = sys.argv[1]
each_img_pt = all_pt.split("END")
for x in each_img_pt:
    ind_points = x.split("\n")
    print "new image"
    for y in ind_points:
        print y