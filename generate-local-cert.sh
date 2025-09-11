#!/bin/bash
# This script installs mkcert if not present, and generates a local SSL certificate for localhost
set -e

if ! command -v mkcert &> /dev/null; then
  echo "mkcert not found. Installing..."
  brew install mkcert
  brew install nss # for Firefox support
fi

CERT_DIR="$(dirname "$0")/certs"
mkdir -p "$CERT_DIR"

mkcert -install
mkcert -key-file "$CERT_DIR/localhost-key.pem" -cert-file "$CERT_DIR/localhost-cert.pem" localhost

echo "Certificates generated at $CERT_DIR"
