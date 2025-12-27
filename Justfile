set shell := ["pwsh", "-NoLogo", "-NoProfile", "-Command"]

default: verify

setup:
	pnpm install

lint:
	pnpm --dir frontend lint

type:
	pnpm --dir frontend type-check

build:
	pnpm --dir frontend build

format:
	pnpm --dir frontend format

format-fix:
	pnpm --dir frontend format:fix

verify: lint type build
