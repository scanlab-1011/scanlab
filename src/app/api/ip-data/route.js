import axios from 'axios';

const IPDATA_API_KEYS = [
    'c6d4d04d5f11f2cd0839ee03c47c58621d74e361c945b5c1b4f668f3',
    '16b3dfd707ec2e7141bdda96b4d2ec20ead5deadf8c8a1ffa68beaaf',
    'ca677b284b3bac29eb72f5e496aa9047f26543605efe99ff2ce35c9',
    'be0f755b93290b4c100445d77533d291763a417c75524e95e07819ad'
];

const IPINFO_API_KEYS = [
    '937aae8c510548',
    'd23a0ae9f2f13a',
    '40e1b04cfd6fa8'
    // Add other ipinfo.io API keys here
];

let lastUsedKeyIndex = -1;  // To store the last used ipdata.co key index
let lastUsedIpInfoKeyIndex = -1;  // To store the last used ipinfo.io key index

// Function to get a random API key for ipdata.co, ensuring it's not the same as the last used one
const getRandomApiKey = (apiKeys, lastUsedKeyIndex) => {
    let index = Math.floor(Math.random() * apiKeys.length);
    while (index === lastUsedKeyIndex) {
        index = Math.floor(Math.random() * apiKeys.length);
    }
    return { apiKey: apiKeys[index], newLastUsedIndex: index };
};

// Function to get a random API key for ipinfo.io
const getRandomIpInfoApiKey = () => {
    let index = Math.floor(Math.random() * IPINFO_API_KEYS.length);
    while (index === lastUsedIpInfoKeyIndex) {
        index = Math.floor(Math.random() * IPINFO_API_KEYS.length);
    }
    return { apiKey: IPINFO_API_KEYS[index], newLastUsedIndex: index };
};

const sleep = ms => new Promise(res => setTimeout(res, ms));

export async function POST(req) {
    try {
        const body = await req.json();
        const { ip } = body;

        if (!ip || typeof ip !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid or missing IP address' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get a random API key for ipdata.co and ipinfo.io
        const { apiKey: ipdataApiKey, newLastUsedIndex: newLastUsedIpdataIndex } = getRandomApiKey(IPDATA_API_KEYS, lastUsedKeyIndex);
        lastUsedKeyIndex = newLastUsedIpdataIndex;

        const { apiKey: ipinfoApiKey, newLastUsedIndex: newLastUsedIpInfoIndex } = getRandomIpInfoApiKey();
        lastUsedIpInfoKeyIndex = newLastUsedIpInfoIndex;

        let ipDetails = {};

        // Fetch data from both APIs concurrently
        const ipDataRequests = [
            axios.get(`https://api.ipdata.co/${ip}?api-key=${ipdataApiKey}`).catch(() => null),  // Fallback to null if ipdata.co fails
            axios.get(`https://ipinfo.io/${ip}?token=${ipinfoApiKey}`).catch(() => null)        // Fallback to null if ipinfo.io fails
        ];

        const [ipDataResponse, ipInfoResponse] = await Promise.all(ipDataRequests);

        // Merge the data from both APIs
        if (ipDataResponse) {
            // ipdata.co provides data, so merge it
            ipDetails = {
                ...ipDetails,
                ip: ipDataResponse.data.ip || ipDetails.ip,
                city: ipDataResponse.data.city || ipDetails.city,
                region: ipDataResponse.data.region || ipDetails.region,
                country: ipDataResponse.data.country || ipDetails.country,
                country_code: ipDataResponse.data.country_code || ipDetails.country_code,
                latitude: ipDataResponse.data.latitude || ipDetails.latitude,
                longitude: ipDataResponse.data.longitude || ipDetails.longitude,
                calling_code: ipDataResponse.data.calling_code || ipDetails.calling_code,
                flag: ipDataResponse.data.flag || ipDetails.flag,
                emoji_flag: ipDataResponse.data.emoji_flag || ipDetails.emoji_flag,
                languages: ipDataResponse.data.languages || ipDetails.languages,
                currency: ipDataResponse.data.currency || ipDetails.currency,
                time_zone: ipDataResponse.data.time_zone || ipDetails.time_zone,
                threat: ipDataResponse.data.threat || ipDetails.threat,
                asn: ipDataResponse.data.asn || ipDetails.asn,
            };
        }

        if (ipInfoResponse) {
            // ipinfo.io provides data, so merge it
            ipDetails = {
                ...ipDetails,
                ip: ipInfoResponse.data.ip || ipDetails.ip,
                city: ipInfoResponse.data.city || ipDetails.city,
                region: ipInfoResponse.data.region || ipDetails.region,
                country: ipInfoResponse.data.country || ipDetails.country,
                country_code: ipInfoResponse.data.country_code || ipDetails.country_code,
                latitude: ipInfoResponse.data.latitude || ipDetails.latitude,
                longitude: ipInfoResponse.data.longitude || ipDetails.longitude,
                postal: ipInfoResponse.data.postal || ipDetails.postal,  // Always use postal code from ipinfo.io
                calling_code: ipInfoResponse.data.calling_code || ipDetails.calling_code,
                flag: ipInfoResponse.data.flag || ipDetails.flag,
                emoji_flag: ipInfoResponse.data.emoji_flag || ipDetails.emoji_flag,
                languages: ipInfoResponse.data.languages || ipDetails.languages,
                currency: ipInfoResponse.data.currency || ipDetails.currency,
                time_zone: ipInfoResponse.data.time_zone || ipDetails.time_zone,
                threat: ipInfoResponse.data.threat || ipDetails.threat,
                asn: ipInfoResponse.data.asn || ipDetails.asn,
            };
        }

        // Return the combined results
        return new Response(JSON.stringify({
            ip: ipDetails.ip,
            city: ipDetails.city,
            region: ipDetails.region,
            country: ipDetails.country,
            country_code: ipDetails.country_code,
            latitude: ipDetails.latitude || undefined,
            longitude: ipDetails.longitude || undefined,
            postal: ipDetails.postal || undefined,  // Always include postal from ipinfo.io
            calling_code: ipDetails.calling_code || undefined,
            flag: ipDetails.flag || undefined,
            emoji_flag: ipDetails.emoji_flag || undefined,
            languages: ipDetails.languages || undefined,
            currency: ipDetails.currency || undefined,
            time_zone: ipDetails.time_zone || undefined,
            threat: ipDetails.threat || undefined,
            asn: ipDetails.asn || undefined,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching IP details:', error);
        return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
