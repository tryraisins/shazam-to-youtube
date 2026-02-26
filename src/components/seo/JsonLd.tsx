import React from 'react';

export default function JsonLd() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://echolist.app';

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'EchoList',
        url: baseUrl,
        description: 'Transform your Shazam discoveries into curated YouTube playlists in seconds.',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
