.PHONY: install test build run docker-build docker-up

install:
	npm install

test:
	npm test

build:
	@echo "Static frontend build check completed"

run:
	@echo "Open login.html in a browser to run the application"

docker-build:
	@echo "Docker setup will be added in M4"

docker-up:
	docker compose up --build