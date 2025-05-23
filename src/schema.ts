import { bigint, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const facilities = pgTable('facilities', {
    ft_idx: bigint({ mode: 'number' }).primaryKey(),
    ar_cd_name: text().notNull().default(''),
    ft_title: text().notNull().default(''),
    bk_cd_name: text().notNull().default(''),
    ft_post: text().notNull().default(''),
    ft_addr: text().notNull().default(''),
    ft_addr_detail: text().notNull().default(''),
    ft_size: text().notNull().default(''),
    ft_org: text().notNull().default(''),
    ft_phone: text().notNull().default(''),
    ft_wd_time: text().notNull().default(''),
    ft_we_time: text().notNull().default(''),
    ft_info_time: text().notNull().default(''),
    rt_cd_name: text().notNull().default(''),
    ft_money: text().notNull().default(''),
    ft_park: text().notNull().default(''),
    ft_homepage: text().notNull().default(''),
    ft_kind_name: text().notNull().default(''),
    ft_operation_name: text().notNull().default(''),
    ft_si: text().notNull().default(''),
    ft_bigo: text().notNull().default(''),
    images: text().array().notNull().default([]),
    stats: jsonb().notNull().default({ comments: 0, likes: 0 }),
});

export const educations = pgTable('educations', {
    id: bigint({ mode: 'number' }).primaryKey().notNull(),
    subject: text().notNull().default(''),
    url: text().notNull().default(''),
    subtitle: text().notNull().default(''),
    title: text().notNull().default(''),
    topic: text().notNull().default(''),
    keywords: text().array().notNull().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  });