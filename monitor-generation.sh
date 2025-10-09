#!/bin/bash

# Monitor Gamer Grandma Video Generation Progress

LOG_FILE="gamer-grandma-auto-generation.log"

echo "📊 GAMER GRANDMA GENERATION MONITOR"
echo "===================================="
echo ""

if [ ! -f "$LOG_FILE" ]; then
    echo "❌ Log file not found: $LOG_FILE"
    exit 1
fi

# Count completed steps
CHAR_COUNT=$(grep -c "✅ Character .* generated:" "$LOG_FILE" || echo 0)
SCENE_COUNT=$(grep -c "✅ Scene .* image generated:" "$LOG_FILE" || echo 0)
VIDEO_COUNT=$(grep -c "✅ Video .* generated:" "$LOG_FILE" || echo 0)

echo "Progress:"
echo "  Phase 1: Characters   - $CHAR_COUNT/3 completed"
echo "  Phase 2: Scenes       - $SCENE_COUNT/7 completed"
echo "  Phase 3: Videos       - $VIDEO_COUNT/7 completed"
echo ""

# Show current status
LAST_LINE=$(tail -n 5 "$LOG_FILE" | grep -E "🎨|✨|🎬|✅|⏳" | tail -n 1)
if [ -n "$LAST_LINE" ]; then
    echo "Current Status:"
    echo "  $LAST_LINE"
fi

echo ""
echo "Full log: $LOG_FILE"
echo "Run: tail -f $LOG_FILE to watch live progress"
