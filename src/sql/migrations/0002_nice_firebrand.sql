CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"avatar" text NOT NULL,
	"nickname" text NOT NULL,
	"useremail" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"comment_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"ft_idx" bigint,
	"profile_id" uuid,
	"comment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facility_likes" (
	"ft_idx" bigint,
	"profile_id" uuid,
	CONSTRAINT "facility_likes_ft_idx_profile_id_pk" PRIMARY KEY("ft_idx","profile_id")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_ft_idx_facilities_ft_idx_fk" FOREIGN KEY ("ft_idx") REFERENCES "public"."facilities"("ft_idx") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_likes" ADD CONSTRAINT "facility_likes_ft_idx_facilities_ft_idx_fk" FOREIGN KEY ("ft_idx") REFERENCES "public"."facilities"("ft_idx") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facility_likes" ADD CONSTRAINT "facility_likes_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;