#!/bin/bash

# BytePlus Video Generation API - Task Creation Test
# This script tests the task creation API directly using curl

set -e

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check for required environment variables
if [ -z "$BYTEPLUS_API_KEY" ]; then
  echo "Error: BYTEPLUS_API_KEY is not set"
  exit 1
fi

if [ -z "$BYTEPLUS_ENDPOINT" ]; then
  echo "Error: BYTEPLUS_ENDPOINT is not set"
  exit 1
fi

echo "==================================================================="
echo "BytePlus Video Generation API - Task Creation Test"
echo "==================================================================="
echo ""
echo "Endpoint: $BYTEPLUS_ENDPOINT"
echo "Model: seedance-1-0-pro-250528"
echo ""

# Create task
echo "Step 1: Creating video generation task..."
echo "-------------------------------------------------------------------"

RESPONSE=$(curl -s -X POST "$BYTEPLUS_ENDPOINT/contents/generations/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $BYTEPLUS_API_KEY" \
  -d '{
    "model": "seedance-1-0-pro-250528",
    "content": [
        {
            "type": "text",
            "text": "At breakneck speed, drones thread through intricate obstacles or stunning natural wonders, delivering an immersive, heart-pounding flying experience.  --resolution 1080p  --duration 5 --camerafixed false"
        },
        {
            "type": "image_url",
            "image_url": {
                "url": "https://ark-doc.tos-ap-southeast-1.bytepluses.com/seepro_i2v%20.png"
            }
        }
    ]
  }')

echo "$RESPONSE" | jq '.'

# Extract task ID
TASK_ID=$(echo "$RESPONSE" | jq -r '.id')

if [ "$TASK_ID" = "null" ] || [ -z "$TASK_ID" ]; then
  echo ""
  echo "Error: Failed to create task"
  exit 1
fi

echo ""
echo "✅ Task created successfully!"
echo "Task ID: $TASK_ID"
echo ""

# Poll for task status
echo "Step 2: Polling for task completion..."
echo "-------------------------------------------------------------------"

MAX_ATTEMPTS=60
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))

  STATUS_RESPONSE=$(curl -s -X GET "$BYTEPLUS_ENDPOINT/contents/generations/tasks/$TASK_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $BYTEPLUS_API_KEY")

  STATUS=$(echo "$STATUS_RESPONSE" | jq -r '.status')

  echo "[Attempt $ATTEMPT/$MAX_ATTEMPTS] Status: $STATUS"

  if [ "$STATUS" = "succeeded" ]; then
    echo ""
    echo "✅ Video generation succeeded!"
    echo "-------------------------------------------------------------------"
    echo "$STATUS_RESPONSE" | jq '.'

    VIDEO_URL=$(echo "$STATUS_RESPONSE" | jq -r '.content.video_url')
    echo ""
    echo "Video URL: $VIDEO_URL"
    echo ""
    echo "==================================================================="
    echo "✅ Test completed successfully!"
    echo "==================================================================="
    exit 0
  elif [ "$STATUS" = "failed" ]; then
    echo ""
    echo "❌ Video generation failed!"
    echo "-------------------------------------------------------------------"
    echo "$STATUS_RESPONSE" | jq '.'
    exit 1
  fi

  # Wait 1 second before next poll
  sleep 1
done

echo ""
echo "❌ Timeout: Task did not complete within $MAX_ATTEMPTS seconds"
exit 1
