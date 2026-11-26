import { html, TemplateResult } from 'lit';
import type { HassEntity, HomeAssistant } from '../types/home-assistant';

const APP_TO_HA_BRAND: Array<[RegExp, string]> = [
  [/spotify/i, 'spotify'],
  [/music\s*assistant|mass/i, 'music_assistant'],
  [/alexa/i, 'alexa_media'],
  [/youtube/i, 'youtube'],
  [/plex/i, 'plex'],
  [/jellyfin/i, 'jellyfin'],
  [/emby/i, 'emby'],
  [/kodi/i, 'kodi'],
  [/sonos/i, 'sonos'],
  [/tidal/i, 'tidal'],
  [/deezer/i, 'deezer'],
  [/soundcloud/i, 'soundcloud'],
  [/tunein/i, 'tunein'],
  [/apple\s*(music|tv)|airplay/i, 'apple_tv'],
  [/chromecast|google\s*cast|cast/i, 'cast'],
  [/heos/i, 'heos'],
  [/denon/i, 'denonavr'],
  [/yamaha|musiccast/i, 'yamaha_musiccast'],
  [/squeezebox|lms/i, 'squeezebox'],
  [/vlc/i, 'vlc_telnet'],
  [/mpd/i, 'mpd'],
  [/webos|lg/i, 'webostv'],
  [/samsung/i, 'samsungtv'],
  [/bravia|sony/i, 'braviatv'],
  [/android\s*tv/i, 'androidtv_remote'],
  [/dlna/i, 'dlna_dmr'],
];

const PLATFORM_ALIASES: Record<string, string> = {
  spotifyplus: 'spotify',
  spotcast: 'spotify',
  alexa_media: 'alexa',
};

/**
 * Resolves the Home Assistant integration/brand domain dynamically from:
 * 1. Active app_name / source (when a cast/multi-source player is streaming a specific app)
 * 2. Home Assistant's entity registry `hass.entities[entity_id].platform` (e.g. spotify, alexa_media, music_assistant, sonos, cast...)
 * 3. Entity icon / entity_id hint (e.g. mdi:spotify or media_player.spotify when platform is absent)
 */
export function resolveMediaBrandDomain(
  hass: HomeAssistant | undefined,
  entity: HassEntity | undefined,
): string | null {
  if (!entity) return null;

  const rawPlatform = hass?.entities?.[entity.entity_id]?.platform?.trim().toLowerCase() || '';
  const platform = PLATFORM_ALIASES[rawPlatform] || rawPlatform;
  const appName = String(entity.attributes.app_name ?? '').trim();
  const source = String(entity.attributes.source ?? '').trim();
  const icon = String(entity.attributes.icon ?? '').trim();

  // Check active app_name first (e.g. Spotify playing on a Cast speaker)
  if (appName) {
    for (const [re, domain] of APP_TO_HA_BRAND) {
      if (re.test(appName)) return domain;
    }
  }

  // If Home Assistant entity registry exposes the integration platform, prefer it!
  if (platform) {
    return platform;
  }

  // Fallback: infer from source, icon, or entity_id
  for (const candidate of [source, icon, entity.entity_id]) {
    if (!candidate) continue;
    for (const [re, domain] of APP_TO_HA_BRAND) {
      if (re.test(candidate)) return domain;
    }
  }

  return null;
}

/**
 * Renders the dynamic Home Assistant integration icon from HA's official Brands CDN
 * (`https://brands.home-assistant.io/_/<domain>/icon.png`), automatically falling back
 * to a clean Material 3 tonal music badge if offline or unavailable.
 */
export function renderMediaBrandBadge(
  hass: HomeAssistant | undefined,
  entity: HassEntity | undefined,
): TemplateResult {
  const brand = resolveMediaBrandDomain(hass, entity);

  if (brand) {
    const iconUrl = `https://brands.home-assistant.io/_/${encodeURIComponent(brand)}/icon.png`;
    return html`
      <span class="app-badge is-brand" title=${brand} aria-label=${brand}>
        <img
          class="brand-icon-img"
          src=${iconUrl}
          alt=${brand}
          loading="lazy"
          @error=${(e: Event) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        <svg viewBox="0 0 24 24" class="brand-fallback-svg" style="display:none" aria-hidden="true">
          <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
        </svg>
      </span>
    `;
  }

  return html`
    <span class="app-badge is-tonal" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
      </svg>
    </span>
  `;
}
