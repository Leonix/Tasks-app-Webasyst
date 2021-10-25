<?php

final class tasksOptions
{
    public static function getTasksPerPage(): int
    {
        return (int) tsks()->getOption('tasks_per_page');
    }

    public static function getTasksPriorities(): array
    {
        return tsks()->getOption('priorities');
    }

    public static function getLogsPerPage(): int
    {
        return (int) tsks()->getOption('logs_per_page');
    }

    public static function getTagsCloudCacheTtl(): int
    {
        return (int) tsks()->getOption('tags_cloud_cache_ttl');
    }

    public static function getBulkNotificationLimit(): int
    {
        return (int) tsks()->getOption('bulk_notifications_limit');
    }
}
