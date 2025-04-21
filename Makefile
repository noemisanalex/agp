# Makefile - AutogestiónPro docker management

PROJECT_NAME=autogestionpro

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down && docker compose up -d --remove-orphans

rebuild:
	docker compose build --no-cache && docker compose up -d --remove-orphans

logs:
	docker compose logs -f

ps:
	docker compose ps

clean:
	docker system prune -f

stop:
	docker compose stop

start:
	docker compose start