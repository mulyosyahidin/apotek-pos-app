#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
    echo ".env tidak ditemukan." >&2
    exit 1
fi

DOCKER_IMAGE="$(grep -E '^DOCKER_IMAGE=' .env | tail -1 | cut -d= -f2- | tr -d '"' | tr -d "'")"

if [[ -z "${DOCKER_IMAGE}" ]]; then
    echo "DOCKER_IMAGE wajib diisi di .env." >&2
    exit 1
fi

wait_healthy() {
    local count=0
    local container
    container="$(docker compose ps -q app 2>/dev/null | head -1)"

    if [[ -z "${container}" ]]; then
        return 0
    fi

    until [[ "$(docker inspect --format='{{.State.Health.Status}}' "${container}" 2>/dev/null)" == "healthy" ]]; do
        if [[ "${count}" -ge 20 ]]; then
            echo "Health check timeout" >&2
            docker compose down
            exit 1
        fi

        echo "Waiting... ($((count * 5))s)"
        sleep 5
        count=$((count + 1))
    done
}

mode="${1:-}"

case "${mode}" in
    remote)
        ref="${2:-}"
        if [[ -z "${ref}" ]]; then
            echo "Usage: $0 remote <image-ref>" >&2
            exit 1
        fi
        docker pull "${ref}"
        docker tag "${ref}" "${DOCKER_IMAGE}"
        ;;
    local)
        docker build -t "${DOCKER_IMAGE}" .
        ;;
    *)
        echo "Usage: $0 remote <image-ref> | $0 local" >&2
        exit 1
        ;;
esac

docker compose up -d --remove-orphans
wait_healthy
docker image prune -f
echo "Deployment successful"
