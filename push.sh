#!/bin/bash
git add .
read -p "Mensaje del commit: " msg
git commit -m "$msg"
git push