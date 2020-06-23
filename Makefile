
SHELL := $(shell which bash)
OSTYPE := $(shell uname)
DOCKER := $(shell command -v docker)
GID := $(shell id -g)
UID := $(shell id -u)
VERSION ?= $(shell git describe --tags --always)

UNIT_TEST_CMD := ./scripts/check/unit-test.sh
INTEGRATION_TEST_CMD := ./scripts/check/integration-test.sh
CHECK_CMD := ./scripts/check/check.sh

DEV_IMAGE_NAME := rollify/rollify-webapp-dev
PROD_IMAGE_NAME ?=  rollify/rollify-webapp

DOCKER_RUN_CMD := docker run --env ostype=$(OSTYPE) -v ${PWD}:/src --rm -it ${DEV_IMAGE_NAME}
BUILD_DEV_IMAGE_CMD := IMAGE=${DEV_IMAGE_NAME} DOCKER_FILE_PATH=./docker/dev/Dockerfile VERSION=latest ./scripts/build/build-image.sh
BUILD_PROD_IMAGE_CMD := IMAGE=${PROD_IMAGE_NAME} DOCKER_FILE_PATH=./docker/prod/Dockerfile VERSION=${VERSION} ./scripts/build/build-image.sh
PUBLISH_PROD_IMAGE_CMD := IMAGE=${PROD_IMAGE_NAME} VERSION=${VERSION} ./scripts/build/publish-image.sh


help: ## Show this help
	@echo "Help"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[36m%-20s\033[93m %s\n", $$1, $$2}'

.PHONY: default
default: help

.PHONY: build-image
build-image: ## Builds the production docker image.
	@$(BUILD_PROD_IMAGE_CMD)

.PHONY: publish-image
publish-image: ## Publishes the production docker image.
	@$(PUBLISH_PROD_IMAGE_CMD)

.PHONY: build-dev-image
build-dev-image: ## Builds the development docker image.
	@$(BUILD_DEV_IMAGE_CMD)

build: build-image ## Alias for build-image.

.PHONY: test
test: build-dev-image  ## Runs unit test.
	@$(DOCKER_RUN_CMD) /bin/sh -c '$(UNIT_TEST_CMD)'

.PHONY: check
check: build-dev-image  ## Runs checks.
	@$(DOCKER_RUN_CMD) /bin/sh -c '$(CHECK_CMD)'

.PHONY: ci-check
ci-check: ## Runs checks in CI mode.
	@$(CHECK_CMD)
