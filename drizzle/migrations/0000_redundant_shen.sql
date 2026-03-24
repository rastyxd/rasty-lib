CREATE TABLE `analytics` (
	`id` text PRIMARY KEY NOT NULL,
	`link_id` text NOT NULL,
	`user_id` text NOT NULL,
	`clicked_at` integer NOT NULL,
	`referrer` text,
	`user_agent` text,
	`country` text,
	FOREIGN KEY (`link_id`) REFERENCES `links`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `links` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`icon` text,
	`position` integer DEFAULT 0 NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`clicks` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`display_name` text,
	`bio` text,
	`avatar_url` text,
	`theme` text DEFAULT 'default',
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);