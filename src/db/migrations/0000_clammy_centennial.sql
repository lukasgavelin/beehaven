CREATE TABLE `hives` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text DEFAULT 'Langstroth' NOT NULL,
	`color_mark` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inspections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hive_id` integer NOT NULL,
	`inspected_at` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`queen_seen` integer DEFAULT 0 NOT NULL,
	`brood_status` text DEFAULT 'good' NOT NULL,
	`honey_stores` text DEFAULT 'adequate' NOT NULL,
	`temper` integer DEFAULT 3 NOT NULL,
	`varroa_count` integer DEFAULT 0 NOT NULL,
	`weather_temp` real,
	`weather_condition` text,
	`weather_humidity` real,
	`created_at` text NOT NULL,
	FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `queens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hive_id` integer NOT NULL,
	`breed` text DEFAULT '' NOT NULL,
	`year` integer DEFAULT 0 NOT NULL,
	`mark_color` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hive_id` integer,
	`title` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`due_at` text NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`notification_id` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`hive_id`) REFERENCES `hives`(`id`) ON UPDATE no action ON DELETE set null
);
