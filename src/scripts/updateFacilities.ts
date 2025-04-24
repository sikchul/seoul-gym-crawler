import { createClient } from '@supabase/supabase-js';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

import { API_KEY, OPEN_API_URL, SPORTS_URL, SPORTS_URL_PATH, SUPABASE_ANON_KEY, SUPABASE_URL } from '@/config/constants';

interface FacilityData {
    facilities: {
        list_total_count: number;
        RESULT: {
            CODE: string;
            MESSAGE: string;
        };
        row: Facility[];
    };
}

interface Facility {
    FT_IDX: number;
    AR_CD_NAME: string;
    FT_TITLE: string;
    BK_CD_NAME: string;
    FT_POST: string;
    FT_ADDR: string;
    FT_ADDR_DETAIL: string;
    FT_SIZE: string;
    FT_ORG: string;
    FT_PHONE: string;
    FT_WD_TIME: string;
    FT_WE_TIME: string;
    FT_INFO_TIME: string;
    RT_CD_NAME: string;
    FT_MONEY: string;
    FT_PARK: string;
    FT_HOMEPAGE: string;
    FT_KIND_NAME: string;
    FT_OPERATION_NAME: string;
    FT_SI: string;
    FT_BIGO: string;
}

type LowercaseKeys<T> = T extends Array<unknown>
    ? Array<LowercaseKeys<T[number]>>
    : T extends object
    ? {
        [K in keyof T as K extends string ? Lowercase<K> : K]: LowercaseKeys<T[K]>;
    }
    : T;

interface FacilityWithImages extends LowercaseKeys<Facility> {
    images: string[];
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function toLowerCaseKeys<T>(obj: T): LowercaseKeys<T> {
    if (Array.isArray(obj)) {
        return obj.map(toLowerCaseKeys) as LowercaseKeys<T>;
    } else if (obj !== null && typeof obj === 'object') {
        const result = {} as LowercaseKeys<T>;
        for (const [key, value] of Object.entries(obj)) {
            const lowerKey = key.toLowerCase() as keyof LowercaseKeys<T>;
            result[lowerKey] = toLowerCaseKeys(value);
        }
        return result;
    }
    return obj as LowercaseKeys<T>;
}

async function fetchAllFacilities(): Promise<LowercaseKeys<Facility>[]> {
    const BASE_URL = `${OPEN_API_URL}/${API_KEY}/json/facilities`;
    const firstPageRes = await fetch(`${BASE_URL}/1/1`);
    const firstPageData = await (firstPageRes.json() as Promise<FacilityData>);
    const totalCount = firstPageData.facilities.list_total_count;

    const promises: Promise<FacilityData>[] = [];
    const pageSize = 1000;

    for (let start = 1; start <= totalCount; start += pageSize) {
        const end = Math.min(start + pageSize - 1, totalCount);
        const url = `${BASE_URL}/${start}/${end}`;
        promises.push(fetch(url).then(res => res.json() as Promise<FacilityData>));
    }

    const allData = await Promise.all(promises);
    return allData.flatMap(data => toLowerCaseKeys(data.facilities.row));
}

async function fetchImages(ft_idx: number): Promise<string[]> {
    const url = `${SPORTS_URL}${SPORTS_URL_PATH}?cp=1&ar_cd=&sk_cd=&sv=&ft_idx=${ft_idx}`;
    try {
        const res = await fetch(url);
        const html = await res.text();
        const dom = new JSDOM(html);
        const imgs = dom.window.document.querySelectorAll('.fac-tab-content img');
        return Array.from(imgs).map(img => `${SPORTS_URL}${(img as HTMLImageElement).src}`);
    } catch (error) {
        console.error(`Error fetching images for ft_idx ${ft_idx}:`, error);
        return [];
    }
}

async function upsertFacilities(facilities: FacilityWithImages[]) {
    const { error } = await supabase.from('facilities').upsert(facilities, {
        onConflict: 'ft_idx'
    });
    if (error) {
        console.error('Supabase upsert error:', error);
        throw error;
    }
}

async function main() {
    console.log('Fetching facilities...');
    const rawFacilities = await fetchAllFacilities();
    console.log(`Fetched ${rawFacilities.length} facilities.`);

    const enrichedFacilities: FacilityWithImages[] = [];

    for (const facility of rawFacilities) {
        const images = await fetchImages(facility.ft_idx);
        enrichedFacilities.push({ ...facility, images });
    }

    console.log('Upserting to Supabase...');
    await upsertFacilities(enrichedFacilities);
    console.log('Done.');
}

main().catch(console.error);