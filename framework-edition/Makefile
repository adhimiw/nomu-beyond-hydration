.PHONY: help up down build restart logs test test-backend test-frontend seed clean

help:
	@echo "NOMU Framework Edition — Infrastructure as Code Commands:"
	@echo "  make up            - Launch all services (frontend, backend, redis, nginx)"
	@echo "  make down          - Stop and remove all containers"
	@echo "  make build         - Rebuild container images"
	@echo "  make restart       - Restart containers"
	@echo "  make logs          - Tail container logs"
	@echo "  make seed          - Seed the database with botanical products & CMS content"
	@echo "  make test          - Run both frontend and backend test suites"
	@echo "  make clean         - Remove temporary files and cached volumes"

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build --no-cache

restart: down up

logs:
	docker compose logs -f

seed:
	docker compose exec backend php artisan migrate:fresh --seed

test-backend:
	docker compose exec backend php artisan test

test-frontend:
	docker compose exec frontend npm run test

test: test-backend test-frontend

clean:
	docker compose down -v --remove-orphans
