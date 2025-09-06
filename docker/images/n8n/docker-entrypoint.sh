#!/bin/sh

# Ignore certificates entirely
if [ "$#" -gt 0 ]; then
  exec n8n "$@"
else
  exec n8n
fi
