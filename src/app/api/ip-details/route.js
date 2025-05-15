import axios from 'axios';

// Helper function to convert country code to emoji flag
function countryToEmoji(countryCode) {
  if (!countryCode) return '';
  return String.fromCodePoint(
    ...countryCode.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0))
  );
}

export async function GET(req) {
  const ipAddress = req.nextUrl.searchParams.get('ip');

  if (!ipAddress) {
    return new Response(JSON.stringify({ error: 'Missing IP address' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Fetch data from ipapi.co
    const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
    const data = response.data;

    // Map response to expected format
    const ipDetails = {
      ip: data.ip,
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city || null,
      region: data.region || null,
      region_code: null,
      country_name: data.country_name,
      country_code: data.country_code,
      continent_name: null,
      continent_code: null,
      postal: data.postal || null,
      calling_code: data.country_calling_code?.replace('+', ''),
      flag: null,
      emoji_flag: countryToEmoji(data.country_code),
      emoji_unicode: null,
      languages: [{
        name: data.languages,
        native: data.languages,
        code: ''
      }],
      currency: {
        name: data.currency_name || '',
        code: data.currency || '',
        symbol: '$',
        native: '$',
        plural: ''
      },
      time_zone: {
        name: data.timezone || null,
        abbr: null,
        offset: data.utc_offset || null,
        is_dst: null,
        current_time: null
      },
      threat: {
        is_tor: false,
        is_vpn: false,
        is_icloud_relay: false,
        is_proxy: false,
        is_datacenter: false,
        is_anonymous: false,
        is_known_attacker: false,
        is_known_abuser: false,
        is_threat: false,
        is_bogon: false,
        blocklists: [],
        scores: {
          vpn_score: 0,
          proxy_score: 0,
          threat_score: 0,
          trust_score: 0
        }
      },
      asn: {
        asn: `AS${data.asn || ''}`,
        name: data.org || '',
        domain: '',
        route: '',
        type: 'Unknown'
      },
      company: {
        name: data.org || '',
        domain: '',
        network: '',
        type: ''
      }
    };

    return new Response(JSON.stringify(ipDetails), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching IP details:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch IP details' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
