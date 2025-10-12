<?php
$duplicateFiles = [
    'database/migrations/2025_09_26_094633_create_cancelled_tickets_table.php',
    'database/migrations/2025_09_26_094706_create_duplicate_merges_table.php',
    'database/migrations/2025_09_26_094725_create_duplicate_merge_items_table.php',
    'database/migrations/2025_09_26_094742_create_deleted_tickets_log_table.php',
    'database/migrations/2025_09_26_094801_create_ticket_attachments_table.php',
    'database/migrations/2025_09_26_111310_create_activity_logs_table.php'
];

foreach ($duplicateFiles as $file) {
    if (file_exists($file)) {
        if (unlink($file)) {
            echo "Deleted: $file\n";
        } else {
            echo "Failed to delete: $file\n";
        }
    } else {
        echo "File not found: $file\n";
    }
}

echo "Done cleaning up duplicate migrations!\n";
?>
