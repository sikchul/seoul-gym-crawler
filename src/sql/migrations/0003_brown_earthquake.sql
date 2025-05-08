CREATE TABLE "educations" (
	"id" bigint PRIMARY KEY NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"url" text DEFAULT '' NOT NULL,
	"subtitle" text DEFAULT '' NOT NULL,
	"title" text DEFAULT '' NOT NULL,
	"topic" text DEFAULT '' NOT NULL,
	"keywords" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
