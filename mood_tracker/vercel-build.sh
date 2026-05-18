#!/bin/bash

# Clone Flutter SDK
git clone https://github.com/flutter/flutter.git --depth 1 -b stable

# Add Flutter to PATH
export PATH="$PATH:`pwd`/flutter/bin"

# Enable web support
flutter config --enable-web

# Move into project
cd mood_tracker

# Install dependencies
flutter pub get

# Build web app
flutter build web