export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { genre } = req.body;

  if (!genre) {
    return res.status(400).json({ error: 'Genre is required' });
  }

  try {
    console.log(`🎵 Searching playlists for genre: ${genre}`);

    // TODO: Replace with actual Apify integration
    // const apifyToken = process.env.APIFY_TOKEN;
    // const actorId = process.env.SPOTIFY_SCRAPER_ACTOR_ID;

    // For now, return mock data to test the UI
    const mockPlaylists = generateMockPlaylists(genre);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    res.status(200).json({
      success: true,
      total: mockPlaylists.length,
      playlists: mockPlaylists
    });

  } catch (error) {
    console.error('❌ Playlist scraping error:', error);
    res.status(500).json({
      error: 'Failed to scrape playlists',
      details: error.message
    });
  }
}

// Mock data generator for testing
function generateMockPlaylists(genre) {
  const mockPlaylists = [
    {
      name: `Best ${genre} Hits 2024`,
      curator: "IndieVibes Curator",
      description: `A carefully curated collection of the best ${genre.toLowerCase()} tracks from emerging and established artists. Perfect for discovering your next favorite song.`,
      songCount: 127,
      followers: 15420,
      spotifyUrl: "https://open.spotify.com/playlist/example1",
      contactEmail: "submissions@indievibes.com",
      instagram: "https://instagram.com/indievibes",
      twitter: "https://twitter.com/indievibes",
      website: "https://indievibes.com"
    },
    {
      name: `${genre} Discovery Weekly`,
      curator: "Music Discovery Co",
      description: `Weekly updated playlist featuring the latest ${genre.toLowerCase()} releases. We're always looking for fresh talent to feature.`,
      songCount: 45,
      followers: 8932,
      spotifyUrl: "https://open.spotify.com/playlist/example2",
      contactEmail: "hello@musicdiscovery.co",
      instagram: null,
      twitter: "https://twitter.com/musicdiscoveryco",
      website: "https://musicdiscovery.co"
    },
    {
      name: `Underground ${genre}`,
      curator: "Alex Rodriguez",
      description: `Showcasing underground and emerging ${genre.toLowerCase()} artists. Submit your tracks for consideration.`,
      songCount: 89,
      followers: 3456,
      spotifyUrl: "https://open.spotify.com/playlist/example3",
      contactEmail: "alex.r.music@gmail.com",
      instagram: "https://instagram.com/alexrmusic",
      twitter: null,
      website: null
    },
    {
      name: `${genre} Essentials`,
      curator: "Playlist Central",
      description: `The essential ${genre.toLowerCase()} tracks every fan should know. A mix of classics and modern hits.`,
      songCount: 234,
      followers: 45632,
      spotifyUrl: "https://open.spotify.com/playlist/example4",
      contactEmail: null,
      instagram: "https://instagram.com/playlistcentral",
      twitter: "https://twitter.com/playlistcentral",
      website: "https://playlistcentral.com"
    },
    {
      name: `Chill ${genre} Vibes`,
      curator: "Mellow Sounds",
      description: `Relaxed ${genre.toLowerCase()} tracks perfect for studying, working, or just chilling out. Accepting submissions for mellow vibes.`,
      songCount: 67,
      followers: 12789,
      spotifyUrl: "https://open.spotify.com/playlist/example5",
      contactEmail: "submissions@mellowsounds.net",
      instagram: null,
      twitter: null,
      website: "https://mellowsounds.net"
    },
    {
      name: `Rising ${genre} Stars`,
      curator: "Emma Thompson",
      description: `Featuring up-and-coming ${genre.toLowerCase()} artists who deserve more recognition. Always open to new submissions.`,
      songCount: 156,
      followers: 7821,
      spotifyUrl: "https://open.spotify.com/playlist/example6",
      contactEmail: "emma.music.curator@gmail.com",
      instagram: "https://instagram.com/emmamusiccurator",
      twitter: "https://twitter.com/emmamusiccurator",
      website: null
    }
  ];

  return mockPlaylists;
}

/*
TODO: Implement actual Apify integration

Example Apify implementation:

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { genre } = req.body;

  if (!genre) {
    return res.status(400).json({ error: 'Genre is required' });
  }

  try {
    const apifyToken = process.env.APIFY_TOKEN;
    const actorId = process.env.SPOTIFY_SCRAPER_ACTOR_ID;

    // Start the Apify actor run
    const runResponse = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apifyToken}`
      },
      body: JSON.stringify({
        searchQuery: genre,
        maxResults: 50,
        includeContactInfo: true,
        outputFormat: 'json'
      })
    });

    if (!runResponse.ok) {
      throw new Error('Failed to start Apify actor');
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;

    // Wait for the run to complete and get results
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${apifyToken}`
        }
      });

      const statusData = await statusResponse.json();

      if (statusData.data.status === 'SUCCEEDED') {
        // Get the results
        const resultsResponse = await fetch(`https://api.apify.com/v2/datasets/${statusData.data.defaultDatasetId}/items`, {
          headers: {
            'Authorization': `Bearer ${apifyToken}`
          }
        });

        const results = await resultsResponse.json();

        return res.status(200).json({
          success: true,
          total: results.length,
          playlists: results
        });
      } else if (statusData.data.status === 'FAILED') {
        throw new Error('Apify actor run failed');
      }

      // Wait 10 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 10000));
      attempts++;
    }

    throw new Error('Apify actor run timed out');

  } catch (error) {
    console.error('❌ Playlist scraping error:', error);
    res.status(500).json({
      error: 'Failed to scrape playlists',
      details: error.message
    });
  }
}
*/