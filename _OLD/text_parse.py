import re
import django
import typogrify
import datetime
import hashlib

sourceData = open('gutenberg_html.html')
version = hashlib.sha224( str( datetime.datetime.now() ) ).hexdigest()
title = "The Devil's Dictionary"
author = "Ambrose Bierce"
firstchar = 'a'
lastline = ''

#headmatter
out = 'bookData = [{'
out += '"title":"' + title + '",'
out += '"author":"' + author + '",'
out += '"version":"' + version + '",'
out += '"chapters": ['
out += '{ "name" : "a", "content": ['

#loop
for line in sourceData:
	a = line.partition(',')[0] #term
	
	if firstchar:
		if firstchar.lower() == a[0].lower():
			this = 0
		else:
			firstchar = a[0].lower()
			if a[0] != 'a':			
		 		out += ']}, { "name" : "' + firstchar + '", "content": ['	
			else:
				if ab == a:
		 			out += ',{ "name" : "' + firstchar.lower() + '", "content": ['	
				else:
					out += '{ "name" : "' + firstchar.lower() + '", "content": ['	
	ab = a			
	a = a.replace(' ', '_')
	b = line.partition(',')[2] #def with type, don't use
	c = b.partition(',')[0] #type
	d = b.partition(',')[2] #def to use
	d = d.replace('#####MAKEMEOPENEM#######','<em>')
	d = d.replace('#####MAKEMECLOSEEM#######', '</em>')
	e = d.partition('<')[0]
	f = d.partition('<')[2]
	if f:
		g = '<p>' + e + '</p><' + f
	else:
		g = '<p>' + e + '</p>'
	h = '{ "entry" : "'+ a.lower() + '", "article" : "'+ c +'", "content" : "'+ g +'" }'
	out += h


out += '}]'
print out