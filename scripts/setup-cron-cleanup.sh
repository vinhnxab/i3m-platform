#!/bin/bash

# Setup Cron Job for Automatic Cleanup
# Thiết lập cron job để tự động dọn dẹp Docker

echo "⏰ Setting up automatic Docker cleanup..."

# Tạo cron job để chạy cleanup mỗi ngày lúc 2:00 AM
CRON_JOB="0 2 * * * /home/vinhnx/i3m-platform/scripts/scheduled-cleanup.sh >> /home/vinhnx/i3m-platform/logs/cleanup.log 2>&1"

# Thêm vào crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added:"
echo "   - Runs daily at 2:00 AM"
echo "   - Logs to /home/vinhnx/i3m-platform/logs/cleanup.log"
echo ""
echo "📋 Current crontab:"
crontab -l

echo ""
echo "🔧 To remove the cron job later, run:"
echo "   crontab -e"
echo "   # Then delete the line with scheduled-cleanup.sh"
