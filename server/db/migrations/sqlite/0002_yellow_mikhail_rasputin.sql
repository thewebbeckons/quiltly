CREATE TABLE `user_preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`onboarding_version` integer DEFAULT 0 NOT NULL,
	`onboarding_completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
