#!/bin/bash
cp ./package.json ./copy_package.json
cp ./node_modules/r2admin/package.json ./
npm install --only=dev
mv ./copy_package.json ./package.json
