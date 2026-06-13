.PHONY: frontend

frontend: 
	cd frontend & npm run build 

parse:
	cd backend & cd parsers & python prisonerParse.py 

# only true for linux, use del for windows
# clean: 
# 	cd backend & cd parsers & rm prisoner.json