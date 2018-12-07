#!/usr/bin/env bash
rm -f action.zip
7z a -r action.zip
wsk action update dbhack-flinkster --kind nodejs:8 action.zip
