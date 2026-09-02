#!/usr/bin/env bash
set -euo pipefail

# 1. 프로젝트 루트 이동
cd /Users/slowracer/agcode/apps/web-app

# 2. 원격 교체
git remote set-url origin https://github.com/fivetown/kinetic-studio.git

# 3. 원격 확인
git remote -v

# 4. 커밋 (변경 사항이 있으면)
git add .
git diff-index --quiet HEAD || git commit -m "Initial commit – kinetic-studio (fivetown org)"

# 5. 푸시 (PAT 필요 시 프롬프트 표시)
git push -u origin main
